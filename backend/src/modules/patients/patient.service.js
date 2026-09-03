import Patient from "./patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

// ---------------- CREATE PATIENT ----------------
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

  const patientId = await generateSequentialId(Patient, "PAT", "patientId");

  const patient = await Patient.create({
    patientId,
    name,
    dateOfBirth,
    gender,
    phone,
    email: email ? email.toLowerCase() : null,
    address,
    bloodGroup,
    maritalStatus,
    occupation,
    nationality,
    notes,
    emergencyContact,
  });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "patient",
    resourceId: patient._id,
    newValue: patient.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return patient;
};

export const ensureSamplePatients = async () => {
  try {
    // Sanitize any existing capitalized gender fields in DB to match enum
    await Patient.updateMany({ gender: "Male" }, { $set: { gender: "male" } });
    await Patient.updateMany({ gender: "Female" }, { $set: { gender: "female" } });
    await Patient.updateMany({ gender: "Other" }, { $set: { gender: "other" } });

    const count = await Patient.countDocuments();
    if (count > 0) return;

    const samplePatients = [
      {
        patientId: "PAT-1001",
        name: "Rajesh Kumar",
        dateOfBirth: "1985-04-12",
        gender: "male",
        phone: "+91 98765 11111",
        email: "rajesh.kumar@example.com",
        bloodGroup: "O+",
        maritalStatus: "married",
        status: "active",
        emergencyContact: { name: "Sunita Kumar", relationship: "Spouse", phone: "+91 98765 11112" },
      },
      {
        patientId: "PAT-1002",
        name: "Priya Sharma",
        dateOfBirth: "1992-08-25",
        gender: "female",
        phone: "+91 98765 22222",
        email: "priya.sharma@example.com",
        bloodGroup: "A+",
        maritalStatus: "single",
        status: "active",
        emergencyContact: { name: "Ramesh Sharma", relationship: "Father", phone: "+91 98765 22223" },
      },
      {
        patientId: "PAT-1003",
        name: "Aarav Singh",
        dateOfBirth: "2010-01-15",
        gender: "male",
        phone: "+91 98765 33333",
        email: "aarav.singh@example.com",
        bloodGroup: "B+",
        maritalStatus: "single",
        status: "active",
        emergencyContact: { name: "Vikram Singh", relationship: "Father", phone: "+91 98765 33334" },
      },
      {
        patientId: "PAT-1004",
        name: "Ananya Gupta",
        dateOfBirth: "1978-11-05",
        gender: "female",
        phone: "+91 98765 44444",
        email: "ananya.gupta@example.com",
        bloodGroup: "AB+",
        maritalStatus: "married",
        status: "active",
        emergencyContact: { name: "Alok Gupta", relationship: "Spouse", phone: "+91 98765 44445" },
      },
      {
        patientId: "PAT-1005",
        name: "Suresh Verma",
        dateOfBirth: "1965-06-30",
        gender: "male",
        phone: "+91 98765 55555",
        email: "suresh.verma@example.com",
        bloodGroup: "O-",
        maritalStatus: "married",
        status: "active",
        emergencyContact: { name: "Kavita Verma", relationship: "Daughter", phone: "+91 98765 55556" },
      },
    ];

    for (const p of samplePatients) {
      await Patient.create(p);
    }
  } catch (err) {
    console.error("Error seeding sample patients:", err);
  }
};

// ---------------- GET ALL (100% Dynamic MongoDB Query) ----------------
export const getAllPatients = async ({ page = 1, limit = 10, search, status, gender, bloodGroup }) => {
  await ensureSamplePatients();
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

  const skip = (page - 1) * limit;

  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [patients, total, activeCount, inactiveCount, newThisMonthCount] = await Promise.all([
    Patient.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
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
      totalPages: Math.ceil((total || 1) / limit),
    },
  };
};

// ---------------- GET BY ID ----------------
export const getPatientById = async (id) => {
  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }
  return patient;
};

// ---------------- UPDATE ----------------
export const updatePatient = async (id, data, currentUser, requestMeta) => {
  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  // Ensure stored gender matches lowercase schema enum
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

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "patient",
    resourceId: patient._id,
    oldValue,
    newValue: patient.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return patient;
};

// ---------------- DELETE (Soft Delete) ----------------
export const deletePatient = async (id, currentUser, requestMeta) => {
  const patient = await Patient.findById(id);
  if (!patient) {
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

  await createAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    resource: "patient",
    resourceId: patient._id,
    oldValue,
    newValue: patient.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return { message: "Patient soft deleted successfully" };
};

// ---------------- EXPORT CSV (Backend Controlled) ----------------
export const exportPatientsService = async (params = {}) => {
  await ensureSamplePatients();
  const { status, gender, bloodGroup, search } = params;
  const query = {};

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