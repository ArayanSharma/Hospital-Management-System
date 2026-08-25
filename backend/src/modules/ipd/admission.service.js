import mongoose from "mongoose";
import Admission from "./admission.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import Bed from "../beds/bed.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { createNotification } from "../notifications/notification.service.js";

// ---------------- CREATE (Admission + Bed occupy — transaction) ----------------
export const createAdmission = async (data, currentUser, requestMeta) => {
  const { patientId, doctorId, wardId, bedId, reason, diagnosis } = data;

  const [patient, doctor, bed] = await Promise.all([
    Patient.findById(patientId),
    Doctor.findById(doctorId),
    Bed.findById(bedId),
  ]);

  if (!patient || patient.status === "inactive") {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }
  if (!doctor || doctor.status === "inactive") {
    throw new AppError("Doctor not found or inactive", 404, ErrorCodes.NOT_FOUND);
  }
  if (!bed) {
    throw new AppError("Bed not found", 404, ErrorCodes.NOT_FOUND);
  }
  if (bed.status !== "available") {
    throw new AppError(
      `Bed is currently ${bed.status} and not available for admission`,
      409,
      ErrorCodes.VALIDATION_ERROR
    );
  }
  if (bed.wardId.toString() !== wardId) {
    throw new AppError(
      "Bed does not belong to the specified ward",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  // Check: patient already admitted to na ho (ek saath do beds pe nahi ho sakta)
  const existingAdmission = await Admission.findOne({
    patientId,
    status: "admitted",
  });
  if (existingAdmission) {
    throw new AppError(
      "Patient is already admitted. Discharge first before new admission.",
      409,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const admission = await Admission.create(
      [
        {
          patientId,
          doctorId,
          wardId,
          bedId,
          reason,
          diagnosis,
          status: "admitted",
        },
      ],
      { session }
    );

    await Bed.findByIdAndUpdate(
      bedId,
      { status: "occupied", currentPatientId: patientId },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "admission",
      resourceId: admission[0]._id,
      newValue: admission[0].toObject(),
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    });

    // ---------------- NOTIFICATION: Doctor ko inform karo ----------------
    await createNotification({
      userId: doctor.userId,
      type: "admission",
      title: "New Patient Admission",
      message: `Patient ${patient.name} has been admitted under your care. Bed: ${bed.bedNumber}`,
      metadata: { admissionId: admission[0]._id },
    });

    return admission[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// ---------------- GET ALL ----------------
export const getAllAdmissions = async ({ page = 1, limit = 10, status, patientId, wardId }) => {
  const query = {};
  if (status) query.status = status;
  if (patientId) query.patientId = patientId;
  if (wardId) query.wardId = wardId;

  const skip = (page - 1) * limit;

  const [admissions, total] = await Promise.all([
    Admission.find(query)
      .populate("patientId", "name patientId phone")
      .populate({
        path: "doctorId",
        select: "doctorId specialization",
        populate: { path: "userId", select: "name" },
      })
      .populate("wardId", "name type")
      .populate("bedId", "bedNumber")
      .skip(skip)
      .limit(limit)
      .sort({ admissionDate: -1 }),
    Admission.countDocuments(query),
  ]);

  return {
    admissions,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

// ---------------- GET BY ID ----------------
export const getAdmissionById = async (id) => {
  const admission = await Admission.findById(id)
    .populate("patientId", "name patientId phone dateOfBirth gender")
    .populate({
      path: "doctorId",
      select: "doctorId specialization",
      populate: { path: "userId", select: "name" },
    })
    .populate("wardId", "name type")
    .populate("bedId", "bedNumber");

  if (!admission) {
    throw new AppError("Admission not found", 404, ErrorCodes.NOT_FOUND);
  }

  return admission;
};

// ---------------- UPDATE (reason/diagnosis edit — bed/ward change nahi) ----------------
export const updateAdmission = async (id, data, currentUser, requestMeta) => {
  const admission = await Admission.findById(id);
  if (!admission) {
    throw new AppError("Admission not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (admission.status === "discharged") {
    throw new AppError(
      "Cannot update a discharged admission",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const oldValue = admission.toObject();
  const { reason, diagnosis } = data;

  if (reason !== undefined) admission.reason = reason;
  if (diagnosis !== undefined) admission.diagnosis = diagnosis;

  await admission.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "admission",
    resourceId: admission._id,
    oldValue,
    newValue: admission.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return admission;
};

// ---------------- DISCHARGE (Admission close + Bed free — transaction) ----------------
export const dischargePatient = async (id, dischargeSummary, currentUser, requestMeta) => {
  const admission = await Admission.findById(id);
  if (!admission) {
    throw new AppError("Admission not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (admission.status === "discharged") {
    throw new AppError("Patient is already discharged", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = admission.toObject();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    admission.status = "discharged";
    admission.dischargeDate = new Date();
    admission.dischargeSummary = dischargeSummary;
    await admission.save({ session });

    await Bed.findByIdAndUpdate(
      admission.bedId,
      { status: "available", currentPatientId: null },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "admission",
      resourceId: admission._id,
      oldValue,
      newValue: admission.toObject(),
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    });

    // ---------------- NOTIFICATION ----------------
    const doctor = await Doctor.findById(admission.doctorId);
    if (doctor) {
      await createNotification({
        userId: doctor.userId,
        type: "admission",
        title: "Patient Discharged",
        message: `Patient has been discharged. Discharge summary recorded.`,
        metadata: { admissionId: admission._id },
      });
    }

    return admission;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};