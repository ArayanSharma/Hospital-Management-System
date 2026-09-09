import LabTest from "./labTest.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";
import { dispatchAsyncEmail } from "../../utils/email/emailDispatcher.js";

const TEST_PARAM_MAP = {
  "Lipid Profile": ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "VLDL Cholesterol", "Triglycerides"],
  "Complete Blood Count (CBC)": ["Hemoglobin", "WBC Count", "RBC Count", "Platelets", "PCV"],
  "Thyroid Profile (T3, T4, TSH)": ["Total T3", "Total T4", "TSH Ultra-sensitive"],
  "Urine Routine Examination": ["Color", "pH", "Specific Gravity", "Protein", "Glucose"],
  "Blood Sugar Fasting & PP": ["Fasting Plasma Glucose", "Post Prandial Glucose", "HbA1c"],
  "Kidney Function Test (KFT)": ["Serum Creatinine", "Blood Urea Nitrogen", "Uric Acid", "Serum Sodium", "Serum Potassium"],
  "Liver Function Test (LFT)": ["SGOT / AST", "SGPT / ALT", "Total Bilirubin", "Direct Bilirubin", "Serum Albumin"],
};

// ---------------- CREATE (Doctor/Admin order karta hai) ----------------
export const createLabTest = async (data, currentUser, requestMeta) => {
  const {
    patientId,
    doctorId,
    visitId,
    visitType,
    testName,
    sampleType,
    priority,
    clinicalNotes,
    parameters,
    additionalTests,
    requestedAt,
    attachmentUrl,
  } = data;

  const lockKey = `hms:lock:labtest:${patientId}:${testName}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A lab test request for this patient is currently being processed", 409, ErrorCodes.VALIDATION_ERROR);
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

    const year = new Date().getFullYear();
    const orderId = await generateSequentialId(LabTest, `LT-${year}`, "orderId");

    const resolvedParameters = Array.isArray(parameters) && parameters.length > 0
      ? parameters
      : TEST_PARAM_MAP[testName] || ["Diagnostic Parameter 1", "Diagnostic Parameter 2"];

    const labTest = await LabTest.create({
      orderId,
      patientId,
      doctorId,
      visitId: visitId || null,
      visitType: visitType || "OPD Visit",
      testName,
      sampleType: sampleType || "Blood",
      priority: priority || "routine",
      clinicalNotes: clinicalNotes || "",
      additionalTests: Array.isArray(additionalTests) ? additionalTests : [],
      attachmentUrl: attachmentUrl || null,
      requestedAt: requestedAt ? new Date(requestedAt) : new Date(),
      parameters: resolvedParameters,
      status: "pending",
    });

    await invalidatePattern("hms:lab:*");
    await invalidatePattern("hms:route:lab*");

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "CREATE",
        resource: "lab_test",
        resourceId: labTest._id,
        newValue: labTest.toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }

    return labTest;
  } finally {
    await releaseLock(lockKey);
  }
};

// ---------------- GET ALL (Dynamic Query + Redis Pattern Cache) ----------------
export const getAllLabTests = async ({
  page = 1,
  limit = 10,
  patientId,
  status,
  priority,
  search,
  fromDate,
  toDate,
}) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (status && status !== "all" && status !== "") query.status = status;
  if (priority && priority !== "all" && priority !== "") query.priority = priority;

  if (fromDate || toDate) {
    const dateQuery = {};
    if (fromDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      dateQuery.$gte = start;
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      dateQuery.$lte = end;
    }
    query.$or = [{ requestedAt: dateQuery }, { createdAt: dateQuery }];
  }

  const safeSearch = search ? search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const [
      labTests,
      total,
      pendingCount,
      sampleCollectedCount,
      completedCount,
      cancelledCount,
      grandTotal,
    ] = await Promise.all([
      LabTest.find(query)
        .populate("patientId", "name patientId phone dateOfBirth gender photoUrl")
        .populate({
          path: "doctorId",
          select: "doctorId specialization photoUrl userId",
          populate: { path: "userId", select: "name" },
        })
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      LabTest.countDocuments(query),
      LabTest.countDocuments({ status: "pending" }),
      LabTest.countDocuments({ status: "sample-collected" }),
      LabTest.countDocuments({ status: "completed" }),
      LabTest.countDocuments({ status: "cancelled" }),
      LabTest.countDocuments(),
    ]);

    const filteredTests = safeSearch
      ? labTests.filter(
          (t) =>
            t.orderId?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.testName?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.patientId?.name?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.patientId?.patientId?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.doctorId?.userId?.name?.toLowerCase().includes(safeSearch.toLowerCase())
        )
      : labTests;

    const pPct = grandTotal > 0 ? ((pendingCount / grandTotal) * 100).toFixed(2) : "0.00";
    const sPct = grandTotal > 0 ? ((sampleCollectedCount / grandTotal) * 100).toFixed(2) : "0.00";
    const cPct = grandTotal > 0 ? ((completedCount / grandTotal) * 100).toFixed(2) : "0.00";
    const xPct = grandTotal > 0 ? ((cancelledCount / grandTotal) * 100).toFixed(2) : "0.00";

    return {
      tests: filteredTests,
      stats: {
        totalOrders: grandTotal,
        pendingOrders: pendingCount,
        pendingPercentage: `${pPct}%`,
        sampleCollectedOrders: sampleCollectedCount,
        sampleCollectedPercentage: `${sPct}%`,
        completedOrders: completedCount,
        completedPercentage: `${cPct}%`,
        cancelledOrders: cancelledCount,
        cancelledPercentage: `${xPct}%`,
      },
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil((total || 1) / Number(limit)),
      },
    };
  } catch (err) {
    console.error("Error in getAllLabTests:", err);
    return {
      tests: [],
      stats: {
        totalOrders: 0,
        pendingOrders: 0,
        pendingPercentage: "0.00%",
        sampleCollectedOrders: 0,
        sampleCollectedPercentage: "0.00%",
        completedOrders: 0,
        completedPercentage: "0.00%",
        cancelledOrders: 0,
        cancelledPercentage: "0.00%",
      },
      pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

// ---------------- GET BY ID WITH REDIS CACHE ----------------
export const getLabTestById = async (id) => {
  const { data: test } = await getOrSetCache(
    `hms:lab:test:${id}`,
    () =>
      LabTest.findById(id)
        .populate("patientId", "name patientId phone dateOfBirth gender photoUrl bloodGroup")
        .populate({
          path: "doctorId",
          select: "doctorId specialization photoUrl userId",
          populate: { path: "userId", select: "name" },
        }),
    600
  );

  if (!test) {
    throw new AppError("Lab test not found", 404, ErrorCodes.NOT_FOUND);
  }

  return test;
};

// ---------------- UPDATE LAB TEST DETAILS & STATUS ----------------
export const updateLabTestStatus = async (id, payload, currentUser, requestMeta) => {
  const test = await LabTest.findById(id);
  if (!test) {
    throw new AppError("Lab test not found", 404, ErrorCodes.NOT_FOUND);
  }

  // Handle both simple status string or full payload object
  const updateData = typeof payload === "string" ? { status: payload } : payload || {};

  if (test.status === "completed" && updateData.status && updateData.status !== "completed") {
    throw new AppError("Cannot change status of a completed lab test", 400, ErrorCodes.VALIDATION_ERROR);
  }
  if (test.status === "cancelled" && updateData.status && updateData.status !== "cancelled") {
    throw new AppError("Cannot change status of a cancelled lab test", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = test.toObject();

  // Dynamically update fields if provided
  if (updateData.status) test.status = updateData.status;
  if (updateData.testName) test.testName = updateData.testName;
  if (updateData.doctorId) test.doctorId = updateData.doctorId;
  if (updateData.priority) test.priority = updateData.priority;
  if (updateData.sampleType) test.sampleType = updateData.sampleType;
  if (updateData.visitType) test.visitType = updateData.visitType;
  if (updateData.clinicalNotes !== undefined) test.clinicalNotes = updateData.clinicalNotes;
  if (updateData.attachmentUrl !== undefined) test.attachmentUrl = updateData.attachmentUrl;
  if (updateData.cancellationReason !== undefined) test.cancellationReason = updateData.cancellationReason;

  await test.save();

  await delCache(`hms:lab:test:${id}`);
  await invalidatePattern("hms:lab:*");
  await invalidatePattern("hms:route:lab*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "lab_test",
      resourceId: test._id,
      oldValue,
      newValue: test.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  // Dispatch Lab Sample Collected Email when status becomes sample-collected
  if (updateData.status === "sample-collected") {
    try {
      const patient = await Patient.findById(test.patientId);
      if (patient?.email) {
        dispatchAsyncEmail({
          to: patient.email,
          type: "lab_sample_collected",
          data: {
            orderId: test.orderId,
            patientName: patient.name,
            testName: test.testName,
            sampleType: test.sampleType,
            collectedAt: new Date().toLocaleString("en-GB"),
          },
        });
      }
    } catch (sampleErr) {
      console.error("Lab sample collected email trigger error:", sampleErr);
    }
  }

  return test;
};