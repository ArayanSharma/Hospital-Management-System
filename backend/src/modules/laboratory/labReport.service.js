import LabReport from "./labReport.model.js";
import LabTest from "./labTest.model.js";
import Patient from "../patients/patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { notifyLabResultEvent } from "../../utils/notificationDispatcher.js";
import Doctor from "../doctors/doctor.model.js";
import { invalidatePattern, delCache } from "../../utils/redisCache.js";
import { dispatchAsyncEmail } from "../../utils/email/emailDispatcher.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

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

    await invalidatePattern("hms:lab:*");
    await invalidatePattern("hms:route:lab*");

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

  await invalidatePattern("hms:lab:*");
  await invalidatePattern("hms:route:lab*");

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

  await delCache(`hms:lab:test:${report.labTestId}`);
  await invalidatePattern("hms:lab:*");
  await invalidatePattern("hms:route:lab*");

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

  // NOTIFICATION & EMAIL DISPATCH: Inform Doctor & Patient
  if (labTest) {
    try {
      const [patient, doctor] = await Promise.all([
        Patient.findById(labTest.patientId),
        Doctor.findById(labTest.doctorId).populate("userId", "name email"),
      ]);

      const testName = labTest.testName || "Diagnostic Test";
      const resultsText = JSON.stringify(report.results || {});
      const interpText = report.interpretation || "";
      const isCritical =
        labTest.priority === "emergency" ||
        testName.toLowerCase().includes("troponin") ||
        resultsText.toLowerCase().includes("high") ||
        interpText.toLowerCase().includes("critical") ||
        interpText.toLowerCase().includes("abnormal");

      // 1. Dual Dispatch: Report Ready Email to Patient & Ordering Doctor
      const recipients = [];
      if (patient?.email) recipients.push(patient.email);
      if (doctor?.userId?.email) recipients.push(doctor.userId.email);

      if (recipients.length > 0) {
        dispatchAsyncEmail({
          to: recipients,
          type: "lab_report_ready",
          data: {
            orderId: labTest.orderId || `LT-${report._id.toString().slice(-4)}`,
            patientName: patient?.name || "Patient",
            doctorName: doctor?.userId?.name || doctor?.name || "Attending Doctor",
            testName,
            verificationDate: new Date().toLocaleString("en-GB"),
            interpretation: report.interpretation || "Lab test verified.",
            isCritical,
          },
        });
      }

      // 2. Emergency Panic Alert: Dispatch Critical Alert to Consulting Doctor if abnormal/critical
      if (isCritical && doctor?.userId?.email) {
        dispatchAsyncEmail({
          to: doctor.userId.email,
          type: "critical_lab_alert",
          data: {
            doctorName: doctor.userId.name || doctor.name || "Doctor",
            patientName: patient?.name || "Patient",
            patientUhid: patient?.patientId || "PAT-001",
            testName,
            criticalValueDetails: report.interpretation || `Dangerously abnormal findings flagged in ${testName}`,
            alertTimestamp: new Date().toLocaleString("en-GB"),
          },
        });
      }

      if (doctor?.userId) {
        await notifyLabResultEvent({
          userId: doctor.userId,
          reportId: report._id,
          testName,
        });
      }
    } catch (err) {
      console.error("Error sending lab report notification / email:", err);
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

  await invalidatePattern("hms:lab:*");
  await invalidatePattern("hms:route:lab*");

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