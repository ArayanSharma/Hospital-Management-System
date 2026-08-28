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

// ---------------- GET ALL (100% Dynamic MongoDB Query) ----------------
export const getAllPatients = async ({ page = 1, limit = 10, search, status, gender, bloodGroup }) => {
  const query = {};
  if (status && status !== "all") query.status = status;
  if (gender && gender !== "all") query.gender = gender;
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
    Patient.countDocuments({ status: "active" }),
    Patient.countDocuments({ status: "inactive" }),
    Patient.countDocuments({ createdAt: { $gte: firstDayOfMonth } }),
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
  if (!patient || patient.status === "inactive") {
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
  if (maritalStatus !== undefined) patient.maritalStatus = maritalStatus;
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

// ---------------- DELETE (soft) ----------------
export const deletePatient = async (id, currentUser, requestMeta) => {
  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = patient.toObject();

  patient.status = "inactive";
  await patient.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    resource: "patient",
    resourceId: patient._id,
    oldValue,
    newValue: null,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return { message: "Patient deactivated successfully" };
};