import LabTest from "./labTest.model.js";
import Patient from "../patients/patient.model.js";
import Doctor from "../doctors/doctor.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

const TEST_PARAM_MAP = {
  "Lipid Profile": ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "VLDL Cholesterol", "Triglycerides"],
  "Complete Blood Count (CBC)": ["Hemoglobin", "WBC Count", "RBC Count", "Platelets", "PCV"],
  "Thyroid Profile (T3, T4, TSH)": ["Total T3", "Total T4", "TSH Ultra-sensitive"],
  "Urine Routine Examination": ["Color", "pH", "Specific Gravity", "Protein", "Glucose"],
  "Blood Sugar Fasting & PP": ["Fasting Plasma Glucose", "Post Prandial Glucose", "HbA1c"],
  "Kidney Function Test (KFT)": ["Serum Creatinine", "Blood Urea Nitrogen", "Uric Acid", "Serum Sodium", "Serum Potassium"],
  "Liver Function Test (LFT)": ["SGOT / AST", "SGPT / ALT", "Total Bilirubin", "Direct Bilirubin", "Serum Albumin"],
};

// Helper to seed initial sample lab tests if database has none
const ensureSampleLabTests = async () => {
  try {
    const count = await LabTest.countDocuments();
    if (count > 0) return;

    const [patients, doctors] = await Promise.all([
      Patient.find({ status: "active" }).limit(6),
      Doctor.find({ status: "active" }).limit(6),
    ]);

    if (patients.length === 0 || doctors.length === 0) return;

    const sampleOrders = [
      {
        orderId: "LT-2026-0001",
        patientId: patients[0]._id,
        doctorId: doctors[0]._id,
        testName: "Complete Blood Count (CBC)",
        sampleType: "Blood",
        priority: "routine",
        status: "pending",
        clinicalNotes: "",
        parameters: TEST_PARAM_MAP["Complete Blood Count (CBC)"],
      },
      {
        orderId: "LT-2026-0002",
        patientId: patients[1]?._id || patients[0]._id,
        doctorId: doctors[1]?._id || doctors[0]._id,
        testName: "Lipid Profile",
        sampleType: "Blood",
        priority: "urgent",
        status: "sample-collected",
        clinicalNotes: "",
        parameters: TEST_PARAM_MAP["Lipid Profile"],
      },
      {
        orderId: "LT-2026-0003",
        patientId: patients[2]?._id || patients[0]._id,
        doctorId: doctors[2]?._id || doctors[0]._id,
        testName: "Thyroid Profile (T3, T4, TSH)",
        sampleType: "Blood",
        priority: "routine",
        status: "completed",
        clinicalNotes: "",
        parameters: TEST_PARAM_MAP["Thyroid Profile (T3, T4, TSH)"],
      },
    ];

    await LabTest.insertMany(sampleOrders);
  } catch (err) {
    console.error("Error seeding sample lab tests:", err);
  }
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
};

// ---------------- GET ALL (100% Dynamic MongoDB Query & Stats) ----------------
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
  await ensureSampleLabTests();

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

  try {
    const allTests = await LabTest.find(query)
      .populate("patientId", "name patientId phone dateOfBirth gender photoUrl")
      .populate({
        path: "doctorId",
        select: "doctorId specialization photoUrl userId",
        populate: { path: "userId", select: "name" },
      })
      .sort({ createdAt: -1 });

    const filteredTests = safeSearch
      ? allTests.filter(
          (t) =>
            t.orderId?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.testName?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.patientId?.name?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.patientId?.patientId?.toLowerCase().includes(safeSearch.toLowerCase()) ||
            t.doctorId?.userId?.name?.toLowerCase().includes(safeSearch.toLowerCase())
        )
      : allTests;

    const [pendingCount, sampleCollectedCount, completedCount, cancelledCount] =
      await Promise.all([
        LabTest.countDocuments({ status: "pending" }),
        LabTest.countDocuments({ status: "sample-collected" }),
        LabTest.countDocuments({ status: "completed" }),
        LabTest.countDocuments({ status: "cancelled" }),
      ]);

    const total = filteredTests.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginatedTests = filteredTests.slice(startIndex, startIndex + Number(limit));

    const grandTotal = await LabTest.countDocuments();
    const pPct = grandTotal > 0 ? ((pendingCount / grandTotal) * 100).toFixed(2) : "0.00";
    const sPct = grandTotal > 0 ? ((sampleCollectedCount / grandTotal) * 100).toFixed(2) : "0.00";
    const cPct = grandTotal > 0 ? ((completedCount / grandTotal) * 100).toFixed(2) : "0.00";
    const xPct = grandTotal > 0 ? ((cancelledCount / grandTotal) * 100).toFixed(2) : "0.00";

    return {
      tests: paginatedTests,
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
        total: total,
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

// ---------------- GET BY ID ----------------
export const getLabTestById = async (id) => {
  const test = await LabTest.findById(id)
    .populate("patientId", "name patientId phone dateOfBirth gender photoUrl bloodGroup")
    .populate({
      path: "doctorId",
      select: "doctorId specialization photoUrl userId",
      populate: { path: "userId", select: "name" },
    });

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

  return test;
};