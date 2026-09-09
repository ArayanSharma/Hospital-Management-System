import Patient from "./patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";

// ---------------- CREATE PATIENT (With Redis Mutex Lock) ----------------
export const createPatient = async (data, currentUser, requestMeta) => {
  const {
    name,
    dateOfBirth,
    gender,
    phone,
    email,
    address,
    bloodGroup,
    maritalStatus,
    occupation,
    nationality,
    notes,
    emergencyContact,
  } = data;

  const sanitizedPhone = phone ? phone.trim() : "";
  const lockKey = `hms:lock:patient:${sanitizedPhone}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A patient registration with this phone number is currently in progress", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    if (sanitizedPhone) {
      const existingPatient = await Patient.findOne({ phone: sanitizedPhone, isDeleted: { $ne: true } });
      if (existingPatient) {
        throw new AppError("A patient with this phone number already exists", 409, ErrorCodes.VALIDATION_ERROR);
      }
    }

    const patientId = await generateSequentialId(Patient, "PAT", "patientId");

    const patient = await Patient.create({
      patientId,
      name,
      dateOfBirth,
      gender: gender ? gender.toLowerCase() : "other",
      phone: sanitizedPhone,
      email: email ? email.toLowerCase() : null,
      address,
      bloodGroup,
      maritalStatus: maritalStatus ? maritalStatus.toLowerCase() : "single",
      occupation,
      nationality,
      notes,
      emergencyContact,
    });

    await invalidatePattern("hms:patient:*");
    await invalidatePattern("hms:route:patient*");

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "CREATE",
        resource: "patient",
        resourceId: patient._id,
        newValue: patient.toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }

    return patient;
  } finally {
    await releaseLock(lockKey);
  }
};

// ---------------- GET ALL ----------------
export const getAllPatients = async ({ page = 1, limit = 10, search, status, gender, bloodGroup }) => {
  const query = { isDeleted: { $ne: true } };
  if (status && status !== "all") query.status = status;
  if (gender && gender !== "all") query.gender = new RegExp(`^${gender}$`, "i");
  if (bloodGroup && bloodGroup !== "all") query.bloodGroup = bloodGroup;

  const safeSearch = search ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
  if (safeSearch) {
    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { phone: { $regex: safeSearch, $options: "i" } },
      { patientId: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [patients, total, activeCount, inactiveCount, newThisMonthCount] = await Promise.all([
    Patient.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    Patient.countDocuments(query),
    Patient.countDocuments({ status: "active", isDeleted: { $ne: true } }),
    Patient.countDocuments({ status: "inactive", isDeleted: { $ne: true } }),
    Patient.countDocuments({ createdAt: { $gte: firstDayOfMonth }, isDeleted: { $ne: true } }),
  ]);

  return {
    patients,
    stats: {
      totalPatients: total,
      activePatients: activeCount,
      inactivePatients: inactiveCount,
      newThisMonth: newThisMonthCount,
      activePercentage: total > 0 ? ((activeCount / total) * 100).toFixed(2) : "0.00",
      inactivePercentage: total > 0 ? ((inactiveCount / total) * 100).toFixed(2) : "0.00",
    },
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((total || 1) / Number(limit)),
    },
  };
};

// ---------------- GET BY ID WITH REDIS CACHE ----------------
export const getPatientById = async (id) => {
  const { data: patient } = await getOrSetCache(
    `hms:patient:profile:${id}`,
    () => Patient.findById(id),
    600
  );

  if (!patient || patient.isDeleted) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }
  return patient;
};

// ---------------- UPDATE ----------------
export const updatePatient = async (id, data, currentUser, requestMeta) => {
  const patient = await Patient.findById(id);
  if (!patient || patient.isDeleted) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (patient.gender && typeof patient.gender === "string") {
    patient.gender = patient.gender.toLowerCase();
  }

  const oldValue = patient.toObject();
  const {
    name,
    phone,
    email,
    address,
    bloodGroup,
    maritalStatus,
    occupation,
    nationality,
    notes,
    emergencyContact,
    status,
  } = data;

  if (name !== undefined) patient.name = name;
  if (phone !== undefined) patient.phone = phone;
  if (email !== undefined) patient.email = email ? email.toLowerCase() : null;
  if (address !== undefined) patient.address = address;
  if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
  if (maritalStatus !== undefined && maritalStatus !== null) {
    patient.maritalStatus = maritalStatus.toLowerCase();
  }
  if (occupation !== undefined) patient.occupation = occupation;
  if (nationality !== undefined) patient.nationality = nationality;
  if (notes !== undefined) patient.notes = notes;
  if (emergencyContact !== undefined) {
    patient.emergencyContact = {
      ...patient.emergencyContact,
      ...emergencyContact,
    };
  }
  if (status !== undefined) patient.status = status;

  await patient.save();

  await delCache(`hms:patient:profile:${id}`);
  await invalidatePattern("hms:patient:*");
  await invalidatePattern("hms:route:patient*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "patient",
      resourceId: patient._id,
      oldValue,
      newValue: patient.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return patient;
};

// ---------------- DELETE (Soft Delete) ----------------
export const deletePatient = async (id, currentUser, requestMeta) => {
  const patient = await Patient.findById(id);
  if (!patient || patient.isDeleted) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (patient.gender && typeof patient.gender === "string") {
    patient.gender = patient.gender.toLowerCase();
  }

  const oldValue = patient.toObject();

  patient.status = "inactive";
  patient.isDeleted = true;
  patient.deletedAt = new Date();
  await patient.save();

  await delCache(`hms:patient:profile:${id}`);
  await invalidatePattern("hms:patient:*");
  await invalidatePattern("hms:route:patient*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "DELETE",
      resource: "patient",
      resourceId: patient._id,
      oldValue,
      newValue: patient.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return { message: "Patient soft deleted successfully" };
};

// ---------------- EXPORT CSV (Backend Controlled) ----------------
export const exportPatientsService = async (params = {}) => {
  const { status, gender, bloodGroup, search } = params;
  const query = { isDeleted: { $ne: true } };

  if (status) query.status = status;
  if (gender) query.gender = new RegExp(`^${gender}$`, "i");
  if (bloodGroup) query.bloodGroup = bloodGroup;

  const safeSearch = search ? search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
  if (safeSearch) {
    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { phone: { $regex: safeSearch, $options: "i" } },
      { patientId: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const patients = await Patient.find(query).sort({ createdAt: -1 });

  const headers = ["Patient ID", "Name", "Gender", "DOB", "Phone", "Blood Group", "Address", "Status", "Created At"];
  const rows = patients.map((p) => [
    p.patientId || p._id,
    `"${(p.name || "").replace(/"/g, '""')}"`,
    p.gender || "",
    p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split("T")[0] : "",
    `"${(p.phone || "").replace(/"/g, '""')}"`,
    p.bloodGroup || "",
    `"${(p.address || "").replace(/"/g, '""')}"`,
    p.status || "",
    p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : "",
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
};