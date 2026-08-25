import Patient from "./patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

// ---------------- CREATE ----------------
export const createPatient = async (data, currentUser, requestMeta) => {
  const {
    name,
    dateOfBirth,
    gender,
    phone,
    email,
    address,
    bloodGroup,
    emergencyContact,
  } = data;

  const patientId = await generateSequentialId(Patient, "PAT", "patientId");

  const patient = await Patient.create({
    patientId,
    name,
    dateOfBirth,
    gender,
    phone,
    email,
    address,
    bloodGroup,
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

// ---------------- GET ALL (pagination + search) ----------------
export const getAllPatients = async ({ page = 1, limit = 10, search, status, gender }) => {
  const query = {};
  if (status) query.status = status;
  if (gender) query.gender = gender;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { patientId: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [patients, total] = await Promise.all([
    Patient.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Patient.countDocuments(query),
  ]);

  return {
    patients,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
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
    emergencyContact,
    status,
  } = data;

  if (name !== undefined) patient.name = name;
  if (phone !== undefined) patient.phone = phone;
  if (email !== undefined) patient.email = email;
  if (address !== undefined) patient.address = address;
  if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup;
  if (emergencyContact !== undefined) patient.emergencyContact = emergencyContact;
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

  // Hard delete NAHI — healthcare records legally retain karne padte hain
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