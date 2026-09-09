import {
  renderWelcomeEmail,
  renderProfileCompleteEmail,
  renderAppointmentEmail,
  renderAppointmentReminderEmail,
  renderAppointmentRescheduledEmail,
  renderAppointmentCancelEmail,
  renderOpdPrescriptionEmail,
  renderLabReportEmail,
  renderInvoiceEmail,
  renderPasswordResetEmail,
  renderSecurityAlertEmail,
  renderIpdAdmissionEmail,
  renderBedTransferEmail,
  renderDischargeSummaryEmail,
  renderLabSampleCollectedEmail,
  renderLabReportReadyEmail,
  renderCriticalResultAlertEmail,
  renderInvoiceGeneratedEmail,
  renderPaymentReceiptSuccessEmail,
  renderPaymentOverdueNoticeEmail,
  renderPharmacySaleReceiptEmail,
  renderLowStockAlertEmail,
  renderSupplierPurchaseOrderEmail,
  renderInsuranceClaimSubmittedEmail,
  renderInsuranceClaimStatusEmail,
  renderSecurityAuditBreachEmail,
  renderDoctorOnboardingEmail,
  renderMedicalRecordSharedEmail,
  renderPrescriptionIssuedEmail,
  renderDepartmentUpdateEmail,
  renderSystemBackupAlertEmail,
  renderExecutiveReportEmail,
  renderRoleUpdatedEmail,
  generateIcsInvite,
} from "./emailTemplates.js";
import { sendEmailRaw } from "./emailTransporter.js";

/**
 * Non-blocking Async Email Dispatcher
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient Email Address or Array of Emails
 * @param {string} options.type - Template Type
 * @param {Object} options.data - Template Payload Data
 */
export const dispatchAsyncEmail = ({ to, type, data = {} }) => {
  let recipients = (Array.isArray(to) ? to : [to])
    .filter((e) => e && typeof e === "string" && e.trim().includes("@"))
    .map((e) => e.trim().toLowerCase());

  // Edge Case Guard 1: Fallback recipient if target user/patient has no email registered
  if (recipients.length === 0) {
    const fallbackEmail = process.env.ADMIN_EMAIL || "arayan.sharma.dev@gmail.com";
    console.warn(`[Email Dispatcher Warning] No valid email provided for type "${type}". Using fallback: ${fallbackEmail}`);
    recipients = [fallbackEmail];
  }

  // Edge Case Guard 2: Guarantee non-blocking background execution
  setImmediate(async () => {
    try {
      const payloadData = data || {};
      let subject = "CityCare Hospital Notification";
      let html = "";
      let attachments = [];

      switch (type) {
        case "welcome":
          subject = "Welcome to CityCare Hospital";
          html = renderWelcomeEmail(data);
          break;

        case "password_reset":
          subject = "Password Reset Request - CityCare Security";
          html = renderPasswordResetEmail(data);
          break;

        case "security_alert":
          subject = "Security Alert: New Sign-In Detected";
          html = renderSecurityAlertEmail(data);
          break;

        case "profile_complete":
          subject = "Profile Verified & Completed - CityCare Hospital";
          html = renderProfileCompleteEmail(data);
          break;

        case "appointment":
        case "appointment_booked": {
          subject = `Appointment Confirmation & Calendar Invite - Dr. ${data.doctorName || "Specialist"}`;
          html = renderAppointmentEmail(data);

          // Generate iCalendar (.ics) invite file attachment
          const icsContent = generateIcsInvite({
            summary: `Doctor Consultation - Dr. ${data.doctorName || "Specialist"}`,
            description: `Scheduled OPD Appointment for ${data.patientName || "Patient"}. Department: ${data.department || "General OPD"}.`,
            location: "CityCare Hospital - Main OPD Building",
            startDateStr: data.rawDateStr || new Date().toISOString().slice(0, 10),
            startTimeStr: data.startTime || "10:00",
            endTimeStr: data.endTime || "10:30",
          });

          attachments.push({
            filename: `invite_${data.appointmentId || "appointment"}.ics`,
            content: icsContent,
            contentType: "text/calendar; charset=UTF-8; method=REQUEST",
          });
          break;
        }

        case "appointment_reminder":
          subject = `${data.reminderType || "Upcoming"} Appointment Reminder - Dr. ${data.doctorName || "Specialist"}`;
          html = renderAppointmentReminderEmail(data);
          break;

        case "appointment_rescheduled": {
          subject = `Appointment Rescheduled - Dr. ${data.doctorName || "Specialist"}`;
          html = renderAppointmentRescheduledEmail(data);

          const icsContent = generateIcsInvite({
            summary: `Rescheduled Doctor Consultation - Dr. ${data.doctorName || "Specialist"}`,
            description: `Updated OPD Appointment for ${data.patientName || "Patient"}.`,
            location: "CityCare Hospital - Main OPD Building",
            startDateStr: data.rawDateStr || new Date().toISOString().slice(0, 10),
            startTimeStr: data.startTime || "10:00",
            endTimeStr: data.endTime || "10:30",
          });

          attachments.push({
            filename: `invite_updated_${data.appointmentId || "appointment"}.ics`,
            content: icsContent,
            contentType: "text/calendar; charset=UTF-8; method=REQUEST",
          });
          break;
        }

        case "appointment_cancel":
          subject = `Appointment Cancelled - Dr. ${data.doctorName || "Specialist"}`;
          html = renderAppointmentCancelEmail(data);
          break;

        case "opd_prescription":
          subject = `OPD Consultation Summary & Prescription (${data.visitId || "Visit"})`;
          html = renderOpdPrescriptionEmail(data);
          break;

        case "lab_report":
          subject = `Diagnostic Test Report Ready: ${data.testName || "Lab Report"}`;
          html = renderLabReportEmail(data);
          break;

        case "invoice":
          subject = `Medical Invoice Receipt ${data.invoiceNo ? "#" + data.invoiceNo : ""}`;
          html = renderInvoiceEmail(data);
          break;

        case "ipd_admission":
          subject = `Hospital IPD Admission Receipt (${data.admissionId || "ADM-001"})`;
          html = renderIpdAdmissionEmail(data);
          break;

        case "bed_transfer":
          subject = `Bed Transfer Notification: Patient ${data.patientName || "Admitted"}`;
          html = renderBedTransferEmail(data);
          break;

        case "ipd_discharge":
          subject = `Hospital Discharge Summary & Post-Care Clearance (${data.admissionId || "Discharge"})`;
          html = renderDischargeSummaryEmail(data);
          break;

        case "lab_sample_collected":
          subject = `Lab Specimen Sample Received (${data.orderId || "Lab Order"})`;
          html = renderLabSampleCollectedEmail(data);
          break;

        case "lab_report_ready":
          subject = `${data.isCritical ? "⚠️ CRITICAL: " : ""}Diagnostic Report Ready: ${data.testName || "Lab Test"}`;
          html = renderLabReportReadyEmail(data);
          break;

        case "critical_lab_alert":
          subject = `🚨 EMERGENCY CRITICAL PANIC ALERT: ${data.patientName || "Patient"} - ${data.testName || "Lab Test"}`;
          html = renderCriticalResultAlertEmail(data);
          break;

        case "invoice_generated":
          subject = `Medical Invoice Statement ${data.invoiceNo ? "#" + data.invoiceNo : ""}`;
          html = renderInvoiceGeneratedEmail(data);
          break;

        case "payment_receipt":
          subject = `Official Payment Receipt ${data.receiptNo ? "#" + data.receiptNo : ""}`;
          html = renderPaymentReceiptSuccessEmail(data);
          break;

        case "payment_overdue":
          subject = `Payment Due Reminder: Invoice ${data.invoiceNo ? "#" + data.invoiceNo : ""}`;
          html = renderPaymentOverdueNoticeEmail(data);
          break;

        case "pharmacy_purchase_receipt":
          subject = `Pharmacy Purchase Digital Receipt ${data.saleInvoiceNo ? "#" + data.saleInvoiceNo : ""}`;
          html = renderPharmacySaleReceiptEmail(data);
          break;

        case "low_stock_alert":
          subject = `🚨 LOW STOCK ALERT: ${data.medicineName || "Pharmacy Item"} (${data.currentStock || 0} left)`;
          html = renderLowStockAlertEmail(data);
          break;

        case "supplier_purchase_order":
          subject = `Official Purchase Order ${data.poNumber ? "#" + data.poNumber : ""} - CityCare Central Pharmacy`;
          html = renderSupplierPurchaseOrderEmail(data);
          break;

        case "insurance_claim_submitted":
          subject = `TPA Insurance Claim Submission Receipt ${data.claimId ? "#" + data.claimId : ""}`;
          html = renderInsuranceClaimSubmittedEmail(data);
          break;

        case "insurance_claim_status":
          subject = `Insurance Claim Status Decision: ${data.claimId ? "#" + data.claimId : ""} (${data.status || "Updated"})`;
          html = renderInsuranceClaimStatusEmail(data);
          break;

        case "security_audit_breach":
          subject = `🚨 EMERGENCY SECURITY BREACH ALERT: ${data.breachType || "System Audit Incident"}`;
          html = renderSecurityAuditBreachEmail(data);
          break;

        case "doctor_onboarding":
          subject = `Welcome Dr. ${data.doctorName || "Doctor"} - CityCare Medical Staff`;
          html = renderDoctorOnboardingEmail(data);
          break;

        case "medical_record_shared":
          subject = `Electronic Health Record Update: ${data.recordId ? "#" + data.recordId : ""}`;
          html = renderMedicalRecordSharedEmail(data);
          break;

        case "prescription_issued":
          subject = `Digital Prescription ${data.prescriptionNo ? "#" + data.prescriptionNo : ""} - CityCare`;
          html = renderPrescriptionIssuedEmail(data);
          break;

        case "department_update":
          subject = `Department Notice: ${data.departmentName || "General Department"}`;
          html = renderDepartmentUpdateEmail(data);
          break;

        case "system_backup_alert":
          subject = `Database Backup Completed: ${data.backupId || "Archive"}`;
          html = renderSystemBackupAlertEmail(data);
          break;

        case "executive_report":
          subject = `Executive Report Statement: ${data.reportType || "Hospital Analytics"}`;
          html = renderExecutiveReportEmail(data);
          break;

        case "role_updated":
          subject = `Security Notice: Role ${data.roleName || "Staff"} Permissions Modified`;
          html = renderRoleUpdatedEmail(data);
          break;

        default:
          console.warn(`[Email Dispatcher] Unknown email template type: "${type}"`);
          return;
      }

      for (const recipient of recipients) {
        await sendEmailRaw({ to: recipient, subject, html, attachments });
      }
    } catch (err) {
      console.error(`[Email Dispatcher Failed] Could not dispatch ${type} email:`, err.message);
    }
  });
};
