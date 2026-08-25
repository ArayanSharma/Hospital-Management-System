import MedicalRecord from "./medicalRecord.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import OPDVisit from "../opd/opdVisit.model.js";
import Admission from "../ipd/admission.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

const validateVisit = async (visitId, visitType) => {
  if (!visitId || !visitType) return; // dono optional hain, agar nahi diye to skip

  const Model = visitType === "OPDVisit" ? OPDVisit : Admission;
  const visit = await Model.findById(visitId);
  if (!visit) {
    throw new AppError(`${visitType} not found`, 404, ErrorCodes.NOT_FOUND);
  }
};

// ---------------- CREATE ----------------
export const createMedicalRecord = async (data, currentUser, requestMeta) => {
  const {
    patientId,
    doctorId,
    visitId,
    visitType,
    diagnosis,
    treatment,
    allergies,
    chronicConditions,
    notes,
  } = data;

  const [patient, doctor] = await Promise.all([
    Patient.findById(patientId),
    Doctor.findById(doctorId),
  ]);

  if (!patient || patient.status === "inactive") {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }
  if (!doctor || doctor.status === "inactive") {
    throw new AppError("Doctor not found or inactive", 404, ErrorCodes.NOT_FOUND);
  }

  await validateVisit(visitId, visitType);

  const record = await MedicalRecord.create({
    patientId,
    doctorId,
    visitId: visitId || null,
    visitType: visitType || null,
    diagnosis,
    treatment,
    allergies,
    chronicConditions,
    notes,
  });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "medical_record",
    resourceId: record._id,
    newValue: record.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return record;
};

// ---------------- GET ALL BY PATIENT (poori history — sabse common use case) ----------------
export const getPatientMedicalHistory = async (patientId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    MedicalRecord.find({ patientId })
      .populate({
        path: "doctorId",
        select: "doctorId specialization",
        populate: { path: "userId", select: "name" },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    MedicalRecord.countDocuments({ patientId }),
  ]);

  return {
    records,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

// ---------------- GET SUMMARY (quick view — allergies + chronic conditions consolidated) ----------------
export const getPatientMedicalSummary = async (patientId) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  const records = await MedicalRecord.find({ patientId }).sort({ createdAt: -1 });

  // Saari records se unique allergies aur chronic conditions nikalo
  const allergiesSet = new Set();
  const chronicConditionsSet = new Set();

  records.forEach((record) => {
    record.allergies.forEach((a) => allergiesSet.add(a));
    record.chronicConditions.forEach((c) => chronicConditionsSet.add(c));
  });

  return {
    patientId,
    patientName: patient.name,
    allergies: Array.from(allergiesSet),
    chronicConditions: Array.from(chronicConditionsSet),
    totalRecords: records.length,
    lastVisit: records[0]?.createdAt || null,
  };
};

// ---------------- GET BY ID ----------------
export const getMedicalRecordById = async (id) => {
  const record = await MedicalRecord.findById(id)
    .populate("patientId", "name patientId phone dateOfBirth gender")
    .populate({
      path: "doctorId",
      select: "doctorId specialization",
      populate: { path: "userId", select: "name" },
    });

  if (!record) {
    throw new AppError("Medical record not found", 404, ErrorCodes.NOT_FOUND);
  }

  return record;
};

// ---------------- UPDATE ----------------
export const updateMedicalRecord = async (id, data, currentUser, requestMeta) => {
  const record = await MedicalRecord.findById(id);
  if (!record) {
    throw new AppError("Medical record not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = record.toObject();
  const { diagnosis, treatment, allergies, chronicConditions, notes } = data;

  if (diagnosis !== undefined) record.diagnosis = diagnosis;
  if (treatment !== undefined) record.treatment = treatment;
  if (allergies !== undefined) record.allergies = allergies;
  if (chronicConditions !== undefined) record.chronicConditions = chronicConditions;
  if (notes !== undefined) record.notes = notes;

  await record.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "medical_record",
    resourceId: record._id,
    oldValue,
    newValue: record.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return record;
};