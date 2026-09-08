import MedicalRecord from "./medicalRecord.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import OPDVisit from "../opd/opdVisit.model.js";
import Admission from "../ipd/admission.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";

const validateVisit = async (visitId, visitType) => {
  if (!visitId || !visitType) return; // dono optional hain, agar nahi दिए to skip

  const Model = visitType === "OPDVisit" ? OPDVisit : Admission;
  const visit = await Model.findById(visitId);
  if (!visit) {
    throw new AppError(`${visitType} not found`, 404, ErrorCodes.NOT_FOUND);
  }
};

// ---------------- CREATE (With Redis Mutex Lock) ----------------
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

  const lockKey = `hms:lock:medrec:${patientId}:${doctorId}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A medical record is currently being created for this patient", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const [patient, doctor] = await Promise.all([
      Patient.findById(patientId),
      Doctor.findById(doctorId),
    ]);

    if (!patient || patient.status === "inactive") {
      throw new AppError("Patient not found or inactive", 404, ErrorCodes.NOT_FOUND);
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
      allergies: Array.isArray(allergies) ? allergies : [],
      chronicConditions: Array.isArray(chronicConditions) ? chronicConditions : [],
      notes: notes || "",
    });

    await invalidatePattern(`hms:medrec:${patientId}:*`);
    await invalidatePattern("hms:route:medrec*");

    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "medical_record",
      resourceId: record._id,
      newValue: record.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });

    return record;
  } finally {
    await releaseLock(lockKey);
  }
};

// ---------------- GET ALL BY PATIENT ----------------
export const getPatientMedicalHistory = async (patientId, { page = 1, limit = 20 }) => {
  const skip = (Number(page) - 1) * Number(limit);

  const [records, total] = await Promise.all([
    MedicalRecord.find({ patientId })
      .populate({
        path: "doctorId",
        select: "doctorId specialization",
        populate: { path: "userId", select: "name" },
      })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    MedicalRecord.countDocuments({ patientId }),
  ]);

  return {
    records,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil((total || 1) / Number(limit)) },
  };
};

// ---------------- GET SUMMARY (With Redis Cache) ----------------
export const getPatientMedicalSummary = async (patientId) => {
  const { data: summary } = await getOrSetCache(
    `hms:medrec:${patientId}:summary`,
    async () => {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
      }

      const records = await MedicalRecord.find({ patientId }).sort({ createdAt: -1 });

      const allergiesSet = new Set();
      const chronicConditionsSet = new Set();

      records.forEach((record) => {
        if (Array.isArray(record.allergies)) record.allergies.forEach((a) => allergiesSet.add(a));
        if (Array.isArray(record.chronicConditions)) record.chronicConditions.forEach((c) => chronicConditionsSet.add(c));
      });

      return {
        patientId,
        patientName: patient.name,
        allergies: Array.from(allergiesSet),
        chronicConditions: Array.from(chronicConditionsSet),
        totalRecords: records.length,
        lastVisit: records[0]?.createdAt || null,
      };
    },
    600
  );

  return summary;
};

// ---------------- GET BY ID WITH REDIS CACHE ----------------
export const getMedicalRecordById = async (id) => {
  const { data: record } = await getOrSetCache(
    `hms:medrec:id:${id}`,
    () =>
      MedicalRecord.findById(id)
        .populate("patientId", "name patientId phone dateOfBirth gender")
        .populate({
          path: "doctorId",
          select: "doctorId specialization",
          populate: { path: "userId", select: "name" },
        }),
    600
  );

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

  await delCache(`hms:medrec:id:${id}`);
  await invalidatePattern(`hms:medrec:${record.patientId}:*`);
  await invalidatePattern("hms:route:medrec*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "medical_record",
      resourceId: record._id,
      oldValue,
      newValue: record.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return record;
};