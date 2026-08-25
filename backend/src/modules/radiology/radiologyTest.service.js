import RadiologyTest from "./radiologyTest.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createRadiologyTest = async (data, currentUser, requestMeta) => {
  const { patientId, doctorId, visitId, visitType, testType, bodyPart, priority } = data;

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

  const test = await RadiologyTest.create({
    patientId,
    doctorId,
    visitId: visitId || null,
    visitType: visitType || null,
    testType,
    bodyPart,
    priority: priority || "routine",
    status: "pending",
  });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "radiology_test",
    resourceId: test._id,
    newValue: test.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return test;
};

export const getAllRadiologyTests = async ({ page = 1, limit = 10, patientId, status, priority }) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const skip = (page - 1) * limit;

  const [tests, total] = await Promise.all([
    RadiologyTest.find(query)
      .populate("patientId", "name patientId")
      .populate({
        path: "doctorId",
        select: "doctorId",
        populate: { path: "userId", select: "name" },
      })
      .skip(skip)
      .limit(limit)
      .sort({ priority: 1, createdAt: -1 }),
    RadiologyTest.countDocuments(query),
  ]);

  return {
    tests,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

export const getRadiologyTestById = async (id) => {
  const test = await RadiologyTest.findById(id)
    .populate("patientId", "name patientId phone")
    .populate({
      path: "doctorId",
      select: "doctorId specialization",
      populate: { path: "userId", select: "name" },
    });

  if (!test) {
    throw new AppError("Radiology test not found", 404, ErrorCodes.NOT_FOUND);
  }

  return test;
};

export const updateRadiologyTestStatus = async (id, status, scheduledAt, currentUser, requestMeta) => {
  const test = await RadiologyTest.findById(id);
  if (!test) {
    throw new AppError("Radiology test not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (test.status === "completed" || test.status === "cancelled") {
    throw new AppError(
      `Cannot update a ${test.status} radiology test`,
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const oldValue = test.toObject();
  test.status = status;
  if (status === "scheduled" && scheduledAt) {
    test.scheduledAt = scheduledAt;
  }
  await test.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "radiology_test",
    resourceId: test._id,
    oldValue,
    newValue: test.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return test;
};