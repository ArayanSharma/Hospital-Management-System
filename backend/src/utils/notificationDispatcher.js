import { createNotification, createBulkNotifications } from "../modules/notifications/notification.service.js";

/**
 * 🏥 Centralized Notification Dispatcher
 * Allows any module service to emit structured realtime notifications in 1 clean line.
 */

// 1. Appointments
export const notifyAppointmentEvent = async ({ userId, appointmentId, doctorName, date, status, link = "/appointments" }) => {
  if (!userId) return null;
  const statusLabels = {
    scheduled: `Appointment confirmed with Dr. ${doctorName || "Doctor"} on ${date || "scheduled date"}.`,
    completed: `Your appointment with Dr. ${doctorName || "Doctor"} has been marked completed.`,
    cancelled: `Your appointment with Dr. ${doctorName || "Doctor"} was cancelled.`,
    rescheduled: `Your appointment with Dr. ${doctorName || "Doctor"} has been rescheduled.`,
  };

  return createNotification({
    userId,
    type: "appointment",
    title: `Appointment ${status ? status.toUpperCase() : "Notification"}`,
    message: statusLabels[status] || `Appointment status update: ${status}.`,
    metadata: { appointmentId, link },
  });
};

// 2. Laboratory Results
export const notifyLabResultEvent = async ({ userId, reportId, testName, isCritical = false, link = "/lab-tests" }) => {
  if (!userId) return null;
  return createNotification({
    userId,
    type: isCritical ? "critical" : "lab_result",
    title: isCritical ? "🚨 CRITICAL Lab Result Alert" : "Lab Test Report Ready",
    message: isCritical
      ? `CRITICAL FINDINGS in ${testName || "Lab Test"}. Immediate clinical review required.`
      : `Your lab test report for ${testName || "test"} is completed and ready for viewing.`,
    metadata: { reportId, isCritical, link },
  });
};

// 3. Radiology & Scans
export const notifyRadiologyEvent = async ({ userId, reportId, scanType, status = "completed", link = "/radiology" }) => {
  if (!userId) return null;
  return createNotification({
    userId,
    type: "radiology",
    title: `Radiology Scan ${status.toUpperCase()}`,
    message: `The ${scanType || "Radiology Scan"} imaging report has been finalized.`,
    metadata: { reportId, scanType, link },
  });
};

// 4. IPD / Admissions & Ward Transfers
export const notifyAdmissionEvent = async ({ userId, admissionId, bedNumber, wardName, action = "admitted", link = "/ipd" }) => {
  if (!userId) return null;
  const msgs = {
    admitted: `Patient admitted to Bed ${bedNumber || "N/A"} (${wardName || "Ward"}).`,
    transferred: `Patient transferred to Bed ${bedNumber || "N/A"} (${wardName || "Ward"}).`,
    discharged: `IPD Admission discharge summary finalized. Bed ${bedNumber || "N/A"} released.`,
  };

  return createNotification({
    userId,
    type: "admission",
    title: `IPD ${action.toUpperCase()}`,
    message: msgs[action] || `Admission status updated: ${action}.`,
    metadata: { admissionId, bedNumber, wardName, link },
  });
};

// 5. Prescriptions
export const notifyPrescriptionEvent = async ({ userId, prescriptionId, doctorName, link = "/prescriptions" }) => {
  if (!userId) return null;
  return createNotification({
    userId,
    type: "prescription",
    title: "New E-Prescription Issued",
    message: `Dr. ${doctorName || "Doctor"} generated a new prescription for your consultation.`,
    metadata: { prescriptionId, link },
  });
};

// 6. Pharmacy Counter Sales
export const notifyPharmacySaleEvent = async ({ userId, saleId, invoiceNo, totalAmount, link = "/pharmacy/sales" }) => {
  if (!userId) return null;
  return createNotification({
    userId,
    type: "pharmacy",
    title: "Pharmacy Order Completed",
    message: `Pharmacy invoice #${invoiceNo || "N/A"} for ₹${totalAmount || 0} processed successfully.`,
    metadata: { saleId, invoiceNo, totalAmount, link },
  });
};

// 7. Medicine Stock Alerts (Bulk notify store admins / pharmacists)
export const notifyStockAlertEvent = async (adminUserIds = [], { medicineName, currentStock, reorderLevel, link = "/pharmacy/inventory" }) => {
  if (!adminUserIds || adminUserIds.length === 0) return [];
  return createBulkNotifications(adminUserIds, {
    type: "inventory",
    title: "⚠️ Low Medicine Stock Warning",
    message: `Stock for "${medicineName}" dropped to ${currentStock} (Reorder threshold: ${reorderLevel}).`,
    metadata: { medicineName, currentStock, reorderLevel, link },
  });
};

// 8. Billing & Invoices
export const notifyInvoiceEvent = async ({ userId, invoiceNo, grandTotal, status = "generated", link = "/billing/invoices" }) => {
  if (!userId) return null;
  const msgs = {
    generated: `Invoice #${invoiceNo || "N/A"} generated for ₹${grandTotal || 0}.`,
    paid: `Payment received for Invoice #${invoiceNo || "N/A"}. Bill status: PAID.`,
    cancelled: `Invoice #${invoiceNo || "N/A"} has been cancelled.`,
  };

  return createNotification({
    userId,
    type: "billing",
    title: `Billing ${status.toUpperCase()}`,
    message: msgs[status] || `Invoice #${invoiceNo} update: ${status}.`,
    metadata: { invoiceNo, grandTotal, status, link },
  });
};

// 9. Insurance & TPA Claims
export const notifyInsuranceClaimEvent = async ({ userId, claimId, claimNumber, status, claimAmount, link = "/insurance/claims" }) => {
  if (!userId) return null;
  const msgs = {
    submitted: `Insurance claim #${claimNumber || "N/A"} for ₹${claimAmount || 0} submitted to TPA provider.`,
    approved: `🎉 Insurance claim #${claimNumber || "N/A"} APPROVED for ₹${claimAmount || 0}.`,
    rejected: `Insurance claim #${claimNumber || "N/A"} was rejected by TPA provider.`,
  };

  return createNotification({
    userId,
    type: "insurance",
    title: `Insurance Claim ${status ? status.toUpperCase() : "Update"}`,
    message: msgs[status] || `Claim #${claimNumber} status: ${status}.`,
    metadata: { claimId, claimNumber, status, link },
  });
};

// 10. Security & Auth Alerts
export const notifyAuthSecurityEvent = async ({ userId, eventType = "password_changed", ipAddress, link = "/settings" }) => {
  if (!userId) return null;
  const msgs = {
    password_changed: "Your account password was changed successfully.",
    new_login: `New login detected from IP ${ipAddress || "unknown"}.`,
    mfa_enabled: "Multi-Factor Authentication has been enabled on your account.",
  };

  return createNotification({
    userId,
    type: "auth_security",
    title: "🔒 Security Alert",
    message: msgs[eventType] || "Security configuration updated.",
    metadata: { eventType, ipAddress, link },
  });
};

// 11. Payments
export const notifyPaymentEvent = async ({ userId, paymentId, amount, paymentMethod = "Online", link = "/payments" }) => {
  if (!userId) return null;
  return createNotification({
    userId,
    type: "billing",
    title: "Payment Received",
    message: `Received payment of ₹${amount || 0} via ${paymentMethod}.`,
    metadata: { paymentId, amount, paymentMethod, link },
  });
};
