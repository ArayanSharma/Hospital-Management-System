import RadiologyReport from "./radiologyReport.model.js";
import RadiologyTest from "./radiologyTest.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { notifyRadiologyEvent } from "../../utils/notificationDispatcher.js";
import Doctor from "../doctors/doctor.model.js";
import { invalidatePattern, delCache, getOrSetCache } from "../../utils/redisCache.js";

export const createRadiologyReport = async (data, currentUser, requestMeta) => {
  const {
    testId,
    findings,
    technique,
    impression,
    recommendations,
    additionalNotes,
    technicianName,
    checkedByName,
    studyReviewed,
    clinicalIndication,
    relevantHistory,
    examinationTechnique,
    bodyPart,
    views,
    contrast,
    imageQuality,
    images,
    reportFile,
    status = "draft",
  } = data;

  const test = await RadiologyTest.findById(testId);
  if (!test) {
    throw new AppError("Radiology test not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (test.status === "completed") {
    throw new AppError(
      "Report already exists for this test",
      409,
      ErrorCodes.VALIDATION_ERROR
    );
  }
  if (test.status === "cancelled") {
    throw new AppError(
      "Cannot create report for a cancelled test",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const existingReport = await RadiologyReport.findOne({ testId });
  if (existingReport) {
    throw new AppError("Report already exists for this test", 409, ErrorCodes.VALIDATION_ERROR);
  }

  const report = await RadiologyReport.create({
    testId,
    patientId: test.patientId,
    radiologistId: currentUser.id,
    findings,
    technique,
    impression,
    recommendations,
    additionalNotes,
    technicianName,
    checkedByName,
    studyReviewed,
    clinicalIndication,
    relevantHistory,
    examinationTechnique,
    bodyPart,
    views,
    contrast,
    imageQuality,
    images,
    reportFile,
    status,
  });

  // If created directly in finalized status, mark RadiologyTest as completed & send notification
  if (status === "finalized") {
    await RadiologyTest.findByIdAndUpdate(test._id, { status: "completed" });
    if (doctor?.userId) {
      await notifyRadiologyEvent({
        userId: doctor.userId,
        reportId: report._id,
        scanType: test.testType,
      });
    }
  }

  await delCache(`hms:radiology:test:${testId}`);
  await invalidatePattern("hms:radiology:*");
  await invalidatePattern("hms:route:radiology*");

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "radiology_report",
    resourceId: report._id,
    newValue: report.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return report;
};

export const finalizeRadiologyReport = async (id, currentUser, requestMeta) => {
  const report = await RadiologyReport.findById(id);
  if (!report) {
    throw new AppError("Radiology report not found", 404, ErrorCodes.NOT_FOUND);
  }

  // Idempotent check: if already finalized, return report gracefully
  if (report.status === "finalized") {
    return report;
  }

  const oldValue = report.toObject();
  report.status = "finalized";
  await report.save();

  const test = await RadiologyTest.findByIdAndUpdate(
    report.testId,
    { status: "completed" },
    { new: true }
  );

  await delCache(`hms:radiology:test:${report.testId}`);
  await invalidatePattern("hms:radiology:*");
  await invalidatePattern("hms:route:radiology*");

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "radiology_report",
    resourceId: report._id,
    oldValue,
    newValue: report.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  // ---------------- NOTIFICATION ----------------
  if (test) {
    const doctor = await Doctor.findById(test.doctorId);
    if (doctor?.userId) {
      await notifyRadiologyEvent({
        userId: doctor.userId,
        reportId: report._id,
        scanType: test.testType,
      });
    }
  }

  return report;
};

export const getRadiologyReportByTestId = async (testId) => {
  const { data: report } = await getOrSetCache(
    `hms:radiology:report:test:${testId}`,
    () =>
      RadiologyReport.findOne({ testId })
        .populate("patientId", "name patientId")
        .populate("radiologistId", "name"),
    600
  );

  if (!report) {
    throw new AppError("Radiology report not found", 404, ErrorCodes.NOT_FOUND);
  }

  return report;
};

export const updateRadiologyReport = async (id, data, currentUser, requestMeta) => {
  const report = await RadiologyReport.findById(id);
  if (!report) {
    throw new AppError("Radiology report not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (report.status === "finalized") {
    throw new AppError("Cannot edit a finalized report", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = report.toObject();
  const allowedFields = [
    "findings",
    "technique",
    "impression",
    "recommendations",
    "additionalNotes",
    "technicianName",
    "checkedByName",
    "studyReviewed",
    "clinicalIndication",
    "relevantHistory",
    "examinationTechnique",
    "bodyPart",
    "views",
    "contrast",
    "imageQuality",
    "images",
    "reportFile",
    "status",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      report[field] = data[field];
    }
  });

  await report.save();

  await delCache(`hms:radiology:report:test:${report.testId}`);
  await invalidatePattern("hms:radiology:*");
  await invalidatePattern("hms:route:radiology*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "radiology_report",
      resourceId: report._id,
      oldValue,
      newValue: report.toObject(),
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    });
  }

  return report;
};