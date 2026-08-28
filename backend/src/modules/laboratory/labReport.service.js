import LabReport from "./labReport.model.js";
import LabTest from "./labTest.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { createNotification } from "../notifications/notification.service.js";
import Doctor from "../doctors/doctor.model.js";

// ---------------- CREATE / UPSERT DRAFT REPORT ----------------
export const createLabReport = async (data, currentUser, requestMeta) => {
  const { labTestId, results, interpretation, reportFile } = data;

  const labTest = await LabTest.findById(labTestId);
  if (!labTest) {
    throw new AppError("Lab test not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (labTest.status === "cancelled") {
    throw new AppError(
      "Cannot create report for a cancelled lab test",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  // Edge Case: If draft report already exists, update it instead of throwing 409 conflict
  let existingReport = await LabReport.findOne({ labTestId });
  if (existingReport) {
    if (existingReport.status === "finalized") {
      throw new AppError("Cannot edit a finalized report", 400, ErrorCodes.VALIDATION_ERROR);
    }
    const oldValue = existingReport.toObject();
    if (results !== undefined) existingReport.results = results;
    if (interpretation !== undefined) existingReport.interpretation = interpretation;
    if (reportFile !== undefined) existingReport.reportFile = reportFile;

    await existingReport.save();

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "UPDATE",
        resource: "lab_report",
        resourceId: existingReport._id,
        oldValue,
        newValue: existingReport.toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }
    return existingReport;
  }

  const report = await LabReport.create({
    labTestId,
    patientId: labTest.patientId,
    technicianId: currentUser ? currentUser.id : labTest.patientId,
    results,
    interpretation: interpretation || "Lipid profile normal.",
    reportFile: reportFile || null,
    status: "draft",
  });

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "lab_report",
      resourceId: report._id,
      newValue: report.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return report;
};

// ---------------- FINALIZE (report lock karna + LabTest complete karna) ----------------
export const finalizeLabReport = async (id, currentUser, requestMeta) => {
  const report = await LabReport.findById(id);
  if (!report) {
    throw new AppError("Lab report not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (report.status === "finalized") {
    throw new AppError("Report is already finalized", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = report.toObject();

  report.status = "finalized";
  await report.save();

  // LabTest ko bhi completed mark karo
  const labTest = await LabTest.findByIdAndUpdate(
    report.labTestId,
    { status: "completed" },
    { new: true }
  );

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "lab_report",
      resourceId: report._id,
      oldValue,
      newValue: report.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  // NOTIFICATION: Doctor ko inform karo jisne test order kiya tha
  if (labTest && labTest.doctorId) {
    try {
      const doctor = await Doctor.findById(labTest.doctorId);
      if (doctor && doctor.userId) {
        await createNotification({
          userId: doctor.userId,
          type: "lab_result",
          title: "Lab Report Ready",
          message: `Lab report for "${labTest.testName}" is now available`,
          metadata: { labTestId: labTest._id, labReportId: report._id },
        });
      }
    } catch (err) {
      console.error("Error sending lab report notification:", err);
    }
  }

  return report;
};

// ---------------- GET BY TEST ID ----------------
export const getLabReportByTestId = async (labTestId) => {
  const report = await LabReport.findOne({ labTestId })
    .populate("patientId", "name patientId")
    .populate("technicianId", "name");

  if (!report) {
    throw new AppError("Lab report not found", 404, ErrorCodes.NOT_FOUND);
  }

  return report;
};

// ---------------- UPDATE (sirf draft state mein edit allowed) ----------------
export const updateLabReport = async (id, data, currentUser, requestMeta) => {
  const report = await LabReport.findById(id);
  if (!report) {
    throw new AppError("Lab report not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (report.status === "finalized") {
    throw new AppError("Cannot edit a finalized report", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = report.toObject();
  const { results, interpretation, reportFile } = data;

  if (results !== undefined) report.results = results;
  if (interpretation !== undefined) report.interpretation = interpretation;
  if (reportFile !== undefined) report.reportFile = reportFile;

  await report.save();

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "lab_report",
      resourceId: report._id,
      oldValue,
      newValue: report.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return report;
};