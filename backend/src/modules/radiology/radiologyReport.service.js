import RadiologyReport from "./radiologyReport.model.js";
import RadiologyTest from "./radiologyTest.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { createNotification } from "../notifications/notification.service.js";
import Doctor from "../doctors/doctor.model.js";

export const createRadiologyReport = async (data, currentUser, requestMeta) => {
  const { testId, findings, impression, images, reportFile } = data;

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
    impression,
    images,
    reportFile,
    status: "draft",
  });

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

  if (report.status === "finalized") {
    throw new AppError("Report is already finalized", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = report.toObject();
  report.status = "finalized";
  await report.save();

  const test = await RadiologyTest.findByIdAndUpdate(
    report.testId,
    { status: "completed" },
    { new: true }
  );

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
  const doctor = await Doctor.findById(test.doctorId);
  if (doctor) {
    await createNotification({
      userId: doctor.userId,
      type: "lab_result",
      title: "Radiology Report Ready",
      message: `Radiology report for "${test.testType}" is now available`,
      metadata: { testId: test._id, reportId: report._id },
    });
  }

  return report;
};

export const getRadiologyReportByTestId = async (testId) => {
  const report = await RadiologyReport.findOne({ testId })
    .populate("patientId", "name patientId")
    .populate("radiologistId", "name");

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
  const { findings, impression, images, reportFile } = data;

  if (findings !== undefined) report.findings = findings;
  if (impression !== undefined) report.impression = impression;
  if (images !== undefined) report.images = images;
  if (reportFile !== undefined) report.reportFile = reportFile;

  await report.save();

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

  return report;
};