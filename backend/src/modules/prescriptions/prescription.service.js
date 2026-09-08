import Prescription from "./prescription.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import OPDVisit from "../opd/opdVisit.model.js";
import Admission from "../ipd/admission.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";
import { notifyPrescriptionEvent } from "../../utils/notificationDispatcher.js";

// ---------------- Helper: visit valid hai ya nahi (polymorphic check) ----------------
const validateVisit = async (visitId, visitType) => {
  if (!visitId || !visitType) return;
  const Model = visitType === "OPDVisit" ? OPDVisit : Admission;
  const visit = await Model.findById(visitId);
  if (!visit) {
    throw new AppError(`${visitType} not found`, 404, ErrorCodes.NOT_FOUND);
  }
  return visit;
};

// ---------------- CREATE (With Redis Mutex Lock) ----------------
export const createPrescription = async (data, currentUser, requestMeta) => {
  const { patientId, doctorId, visitId, visitType, medicines, instructions } = data;

  const lockKey = `hms:lock:prescription:${patientId}:${visitId || doctorId}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A prescription for this patient visit is currently being generated", 409, ErrorCodes.VALIDATION_ERROR);
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

    const prescription = await Prescription.create({
      patientId,
      doctorId,
      visitId: visitId || null,
      visitType: visitType || null,
      medicines: Array.isArray(medicines) ? medicines : [],
      instructions: instructions || "",
      status: "active",
    });

    await invalidatePattern("hms:prescription:*");
    await invalidatePattern("hms:route:prescription*");

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "CREATE",
        resource: "prescription",
        resourceId: prescription._id,
        newValue: prescription.toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }

    if (patient?.userId) {
      await notifyPrescriptionEvent({
        userId: patient.userId,
        prescriptionId: prescription._id,
        doctorName: currentUser?.name || doctor?.name,
      });
    }

    return prescription;
  } finally {
    await releaseLock(lockKey);
  }
};

// ---------------- GET ALL ----------------
export const getAllPrescriptions = async ({ page = 1, limit = 10, patientId, doctorId, status }) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (doctorId) query.doctorId = doctorId;
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [prescriptions, total] = await Promise.all([
    Prescription.find(query)
      .populate("patientId", "name patientId")
      .populate({
        path: "doctorId",
        select: "doctorId specialization",
        populate: { path: "userId", select: "name" },
      })
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Prescription.countDocuments(query),
  ]);

  return {
    prescriptions,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil((total || 1) / Number(limit)) },
  };
};

// ---------------- GET BY ID WITH REDIS CACHE ----------------
export const getPrescriptionById = async (id) => {
  const { data: prescription } = await getOrSetCache(
    `hms:prescription:id:${id}`,
    () =>
      Prescription.findById(id)
        .populate("patientId", "name patientId phone")
        .populate({
          path: "doctorId",
          select: "doctorId specialization",
          populate: { path: "userId", select: "name" },
        }),
    600
  );

  if (!prescription) {
    throw new AppError("Prescription not found", 404, ErrorCodes.NOT_FOUND);
  }

  return prescription;
};

// ---------------- GET BY VISIT WITH REDIS CACHE ----------------
export const getPrescriptionsByVisit = async (visitId) => {
  const { data: prescriptions } = await getOrSetCache(
    `hms:prescription:visit:${visitId}`,
    () =>
      Prescription.find({ visitId })
        .populate("patientId", "name patientId")
        .populate({
          path: "doctorId",
          select: "doctorId specialization",
          populate: { path: "userId", select: "name" },
        })
        .sort({ createdAt: -1 }),
    600
  );

  return prescriptions;
};

// ---------------- UPDATE ----------------
export const updatePrescription = async (id, data, currentUser, requestMeta) => {
  const prescription = await Prescription.findById(id);
  if (!prescription) {
    throw new AppError("Prescription not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (prescription.status !== "active") {
    throw new AppError(
      "Only active prescriptions can be updated",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const oldValue = prescription.toObject();
  const { medicines, instructions, status } = data;

  if (medicines !== undefined) prescription.medicines = medicines;
  if (instructions !== undefined) prescription.instructions = instructions;
  if (status !== undefined) prescription.status = status;

  await prescription.save();

  await delCache(`hms:prescription:id:${id}`);
  if (prescription.visitId) await delCache(`hms:prescription:visit:${prescription.visitId}`);
  await invalidatePattern("hms:prescription:*");
  await invalidatePattern("hms:route:prescription*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "prescription",
      resourceId: prescription._id,
      oldValue,
      newValue: prescription.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return prescription;
};