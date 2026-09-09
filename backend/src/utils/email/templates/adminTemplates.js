import { baseEmailLayout } from "./baseLayout.js";

export const renderDoctorOnboardingEmail = ({ doctorName = "Doctor", doctorId = "DOC-001", specialization = "General Practice", department = "General Medicine", consultationFee = 500 } = {}) => {
  const bodyHtml = `
    <span class="badge" style="background:#dbeafe; color:#1d4ed8;">Doctor Onboarding</span>
    <h2>Welcome to CityCare Medical Staff 🩺</h2>
    <p>Dear Dr. <strong>${doctorName}</strong>, your practitioner profile has been activated in the hospital portal.</p>
    <div class="card">
      <div class="card-row"><span>Doctor ID:</span> <strong>${doctorId}</strong></div>
      <div class="card-row"><span>Specialization:</span> <strong>${specialization}</strong></div>
      <div class="card-row"><span>Department:</span> <strong>${department}</strong></div>
      <div class="card-row"><span>OPD Consultation Fee:</span> <strong style="color:#2563eb;">₹${consultationFee}</strong></div>
    </div>
    <p>You can now manage OPD appointment slots, digital prescriptions, and patient records online.</p>
    <a href="http://localhost:5173/doctors" class="btn">Access Doctor Desk →</a>
  `;
  return baseEmailLayout({ title: `Welcome Dr. ${doctorName} - CityCare Medical Staff`, bodyHtml });
};

export const renderMedicalRecordSharedEmail = ({ patientName = "Valued Patient", recordId = "REC-001", recordType = "Clinical EHR Summary", doctorName = "Attending Physician", date } = {}) => {
  const bodyHtml = `
    <span class="badge" style="background:#e0e7ff; color:#4338ca;">Medical Record Access</span>
    <h2>Electronic Health Record Notice 📋</h2>
    <p>Dear <strong>${patientName}</strong>, an Electronic Health Record (EHR) entry has been updated in your medical chart.</p>
    <div class="card">
      <div class="card-row"><span>Record Reference:</span> <strong>${recordId}</strong></div>
      <div class="card-row"><span>Category / Type:</span> <strong>${recordType}</strong></div>
      <div class="card-row"><span>Attending Practitioner:</span> <strong>${doctorName}</strong></div>
      <div class="card-row"><span>Date Created:</span> <strong>${date || new Date().toLocaleDateString()}</strong></div>
    </div>
    <p>Your record is securely stored in compliance with NABH / ABDM digital health privacy guidelines.</p>
    <a href="http://localhost:5173/medical-records" class="btn">View Health Record →</a>
  `;
  return baseEmailLayout({ title: `Electronic Health Record Update: ${recordId}`, bodyHtml });
};

export const renderPrescriptionIssuedEmail = ({ patientName = "Valued Patient", doctorName = "Physician", prescriptionNo = "RX-001", medicines = [], date } = {}) => {
  const medicineRows = Array.isArray(medicines) && medicines.length > 0
    ? medicines.map((m) => `• <strong>${m.name || m.medicineName}</strong> (${m.dosage || "1-0-1"}, ${m.duration || "5 days"})`).join("<br/>")
    : "Standard Prescribed Medication Details attached.";

  const bodyHtml = `
    <span class="badge" style="background:#dcfce7; color:#15803d;">Digital Prescription</span>
    <h2>Digital Prescription Issued 💊</h2>
    <p>Dear <strong>${patientName}</strong>, Dr. <strong>${doctorName}</strong> has generated your official digital prescription.</p>
    <div class="card">
      <div class="card-row"><span>Prescription No:</span> <strong>${prescriptionNo}</strong></div>
      <div class="card-row"><span>Prescribing Doctor:</span> <strong>Dr. ${doctorName}</strong></div>
      <div class="card-row"><span>Issue Timestamp:</span> <strong>${date || new Date().toLocaleString()}</strong></div>
    </div>
    <div style="background:#f8fafc; border-left:4px solid #16a34a; padding:14px; margin:16px 0; border-radius:8px;">
      <p style="margin:0 0 6px 0; font-weight:700; color:#15803d;">Prescribed Medicines:</p>
      <p style="margin:0; font-size:13px; line-height:1.5;">${medicineRows}</p>
    </div>
    <a href="http://localhost:5173/prescriptions" class="btn" style="background:#16a34a;">View Digital Prescription →</a>
  `;
  return baseEmailLayout({ title: `Digital Prescription #${prescriptionNo} - CityCare`, bodyHtml });
};

export const renderDepartmentUpdateEmail = ({ departmentName = "Department", headDoctorName = "Senior Consultant", date } = {}) => {
  const bodyHtml = `
    <span class="badge" style="background:#dbeafe; color:#1d4ed8;">Department Update</span>
    <h2>Hospital Department Notification 🏢</h2>
    <p>CityCare Hospital has updated administrative details for the <strong>${departmentName}</strong> department.</p>
    <div class="card">
      <div class="card-row"><span>Department Name:</span> <strong>${departmentName}</strong></div>
      <div class="card-row"><span>Department Head:</span> <strong>Dr. ${headDoctorName}</strong></div>
      <div class="card-row"><span>Update Date:</span> <strong>${date || new Date().toLocaleDateString()}</strong></div>
    </div>
    <a href="http://localhost:5173/departments" class="btn">View Department Overview →</a>
  `;
  return baseEmailLayout({ title: `Department Notice: ${departmentName}`, bodyHtml });
};

export const renderSystemBackupAlertEmail = ({ adminName = "System Admin", backupId = "BKP-001", backupSize = "450 MB", timestamp } = {}) => {
  const bodyHtml = `
    <span class="badge" style="background:#dcfce7; color:#15803d;">System Maintenance</span>
    <h2>Database Automated Backup Completed 💾</h2>
    <p>Hello <strong>${adminName}</strong>, the automated hospital system database backup completed successfully.</p>
    <div class="card">
      <div class="card-row"><span>Backup ID:</span> <strong>${backupId}</strong></div>
      <div class="card-row"><span>Archive Size:</span> <strong>${backupSize}</strong></div>
      <div class="card-row"><span>Completion Timestamp:</span> <strong>${timestamp || new Date().toLocaleString()}</strong></div>
    </div>
    <a href="http://localhost:5173/settings" class="btn" style="background:#16a34a;">System Settings & Backups →</a>
  `;
  return baseEmailLayout({ title: `Database Backup Completed: ${backupId}`, bodyHtml });
};

export const renderExecutiveReportEmail = ({ adminName = "Executive Admin", reportType = "Monthly Clinical & Financial Report", generatedDate, summaryStats } = {}) => {
  const bodyHtml = `
    <span class="badge" style="background:#e0e7ff; color:#4338ca;">Executive Report</span>
    <h2>Hospital Analytics & Financial Statement 📊</h2>
    <p>Dear <strong>${adminName}</strong>, the <strong>${reportType}</strong> statement is generated and available for review.</p>
    <div class="card">
      <div class="card-row"><span>Report Title:</span> <strong>${reportType}</strong></div>
      <div class="card-row"><span>Generated Date:</span> <strong>${generatedDate || new Date().toLocaleDateString()}</strong></div>
      ${summaryStats ? `<div class="card-row"><span>Summary Highlights:</span> <span>${summaryStats}</span></div>` : ""}
    </div>
    <a href="http://localhost:5173/reports" class="btn">Open Analytics Dashboard →</a>
  `;
  return baseEmailLayout({ title: `Executive Report Ready: ${reportType}`, bodyHtml });
};

export const renderRoleUpdatedEmail = ({ adminName = "Security Officer", roleName = "Staff Role", modifiedPermissions = "Updated Access Control", timestamp } = {}) => {
  const bodyHtml = `
    <span class="badge" style="background:#fef3c7; color:#d97706;">Role Permissions Modified</span>
    <h2>Role & Permission Update Alert 🔐</h2>
    <p>Attention Admin <strong>${adminName}</strong>, RBAC access control permissions were modified for role <strong>${roleName}</strong>.</p>
    <div class="card">
      <div class="card-row"><span>Role Name:</span> <strong>${roleName}</strong></div>
      <div class="card-row"><span>Permissions Modified:</span> <strong>${modifiedPermissions}</strong></div>
      <div class="card-row"><span>Modification Time:</span> <strong>${timestamp || new Date().toLocaleString()}</strong></div>
    </div>
    <a href="http://localhost:5173/roles" class="btn" style="background:#d97706;">Manage Roles & Permissions →</a>
  `;
  return baseEmailLayout({ title: `Security Notice: Role ${roleName} Permissions Updated`, bodyHtml });
};
