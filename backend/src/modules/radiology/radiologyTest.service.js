import RadiologyTest from "./radiologyTest.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

// ---------------- CREATE RADIOLOGY TEST ----------------
export const createRadiologyTest = async (data, currentUser, requestMeta) => {
  const {
    patientId,
    doctorId,
    visitId,
    visitType,
    modality,
    bodyRegion,
    testType,
    bodyPart,
    priority,
    clinicalInstructions,
    additionalTests,
    scheduledAt,
    locationRoom,
    attachmentUrl,
    requestedAt,
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

  const year = new Date().getFullYear();
  const orderId = await generateSequentialId(RadiologyTest, `RO-${year}`, "orderId");

  const resolvedModality = modality || testType || "X-Ray";
  const resolvedBodyRegion = bodyRegion || bodyPart || "Chest";

  const test = await RadiologyTest.create({
    orderId,
    patientId,
    doctorId,
    visitId: visitId || null,
    visitType: visitType || "OPD Visit",
    modality: resolvedModality,
    bodyRegion: resolvedBodyRegion,
    testType: resolvedModality,
    bodyPart: resolvedBodyRegion,
    priority: priority || "routine",
    status: scheduledAt ? "scheduled" : "pending",
    clinicalInstructions: clinicalInstructions || "",
    additionalTests: Array.isArray(additionalTests) ? additionalTests : [],
    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    locationRoom: locationRoom || "Radiology Room 1",
    attachmentUrl: attachmentUrl || null,
    requestedAt: requestedAt ? new Date(requestedAt) : new Date(),
  });

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "radiology_test",
      resourceId: test._id,
      newValue: test.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return test;
};

// ---------------- GET ALL RADIOLOGY TESTS ----------------
export const getAllRadiologyTests = async ({
  page = 1,
  limit = 10,
  patientId,
  status,
  priority,
  modality,
  search,
  fromDate,
  toDate,
}) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (status && status !== "all") query.status = status;
  if (priority && priority !== "all") query.priority = priority;
  if (modality && modality !== "all") {
    query.modality = new RegExp(modality, "i");
  }

  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      query.createdAt.$gte = start;
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  const safeSearch = search ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const [tests, total, pendingCount, scheduledCount, inProgressCount, completedCount, cancelledCount] =
      await Promise.all([
        RadiologyTest.find(query)
          .populate("patientId", "name patientId phone dateOfBirth gender photoUrl")
          .populate({
            path: "doctorId",
            select: "doctorId specialization photoUrl userId",
            populate: { path: "userId", select: "name" },
          })
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        RadiologyTest.countDocuments(query),
        RadiologyTest.countDocuments({ status: "pending" }),
        RadiologyTest.countDocuments({ status: "scheduled" }),
        RadiologyTest.countDocuments({ status: "in-progress" }),
        RadiologyTest.countDocuments({ status: "completed" }),
        RadiologyTest.countDocuments({ status: "cancelled" }),
      ]);

    const filteredTests = safeSearch
      ? tests.filter(
          (t) =>
            t.orderId?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.modality?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.bodyRegion?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.patientId?.name?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.patientId?.patientId?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.doctorId?.userId?.name?.toLowerCase().includes(safeSearch.toLowerCase())
        )
      : tests;

    return {
      tests: filteredTests,
      stats: {
        totalOrders: pendingCount + scheduledCount + inProgressCount + completedCount + cancelledCount,
        pendingOrders: pendingCount,
        scheduledOrders: scheduledCount,
        inProgressOrders: inProgressCount,
        completedOrders: completedCount,
        cancelledOrders: cancelledCount,
      },
      pagination: {
        total: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil((total || 1) / Number(limit)),
      },
    };
  } catch (err) {
    console.error("Error in getAllRadiologyTests:", err);
    return {
      tests: [],
      stats: {
        totalOrders: 0,
        pendingOrders: 0,
        scheduledOrders: 0,
        inProgressOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
      },
      pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

// ---------------- GET BY ID ----------------
export const getRadiologyTestById = async (id) => {
  const test = await RadiologyTest.findById(id)
    .populate("patientId", "name patientId phone dateOfBirth gender photoUrl bloodGroup")
    .populate({
      path: "doctorId",
      select: "doctorId specialization photoUrl userId",
      populate: { path: "userId", select: "name" },
    });

  if (!test) {
    throw new AppError("Radiology test not found", 404, ErrorCodes.NOT_FOUND);
  }

  return test;
};

// ---------------- UPDATE RADIOLOGY TEST DETAILS & STATUS ----------------
export const updateRadiologyTestStatus = async (id, payload, currentUser, requestMeta) => {
  const test = await RadiologyTest.findById(id);
  if (!test) {
    throw new AppError("Radiology test not found", 404, ErrorCodes.NOT_FOUND);
  }

  const updateData = typeof payload === "string" ? { status: payload } : payload || {};
  const oldValue = test.toObject();

  if (updateData.status) test.status = updateData.status;
  if (updateData.modality) {
    test.modality = updateData.modality;
    test.testType = updateData.modality;
  }
  if (updateData.bodyRegion) {
    test.bodyRegion = updateData.bodyRegion;
    test.bodyPart = updateData.bodyRegion;
  }
  if (updateData.priority) test.priority = updateData.priority;
  if (updateData.scheduledAt) test.scheduledAt = new Date(updateData.scheduledAt);
  if (updateData.clinicalHistory !== undefined) test.clinicalHistory = updateData.clinicalHistory;
  if (updateData.cancellationReason !== undefined) test.cancellationReason = updateData.cancellationReason;
  if (Array.isArray(updateData.imageUrls)) test.imageUrls = updateData.imageUrls;
  if (updateData.findings !== undefined) test.findings = updateData.findings;
  if (updateData.impression !== undefined) test.impression = updateData.impression;
  if (updateData.notes !== undefined) test.notes = updateData.notes;

  await test.save();

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "radiology_test",
      resourceId: test._id,
      oldValue,
      newValue: test.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return test;
};

// ---------------- DELETE RADIOLOGY TEST ----------------
export const deleteRadiologyTest = async (id, currentUser, requestMeta) => {
  const test = await RadiologyTest.findById(id);
  if (!test) {
    throw new AppError("Radiology test not found", 404, ErrorCodes.NOT_FOUND);
  }

  await RadiologyTest.findByIdAndDelete(id);

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "DELETE",
      resource: "radiology_test",
      resourceId: id,
      oldValue: test.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return true;
};