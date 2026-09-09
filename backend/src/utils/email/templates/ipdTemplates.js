import { baseEmailLayout } from "./baseLayout.js";

export const renderIpdAdmissionEmail = ({ patientName, admissionId, wardName, bedNumber, doctorName, admissionDate, dailyRent }) => {
  const bodyHtml = `
    <span class="badge" style="background:#dbeafe; color:#1d4ed8;">IPD Admission Confirmed</span>
    <h2>Hospital IPD Admission Receipt 🛏️</h2>
    <p>Dear <strong>${patientName}</strong> / Family, you have been successfully admitted to CityCare Hospital IPD Ward.</p>
    <div class="card">
      <div class="card-row"><span>Admission ID:</span> <strong>${admissionId}</strong></div>
      <div class="card-row"><span>Assigned Ward / Room:</span> <strong style="color:#2563eb;">${wardName || "General Ward"}</strong></div>
      <div class="card-row"><span>Bed Number:</span> <strong style="color:#2563eb;">${bedNumber || "N/A"}</strong></div>
      <div class="card-row"><span>Attending Physician:</span> <strong>${doctorName}</strong></div>
      <div class="card-row"><span>Admission Timestamp:</span> <strong>${admissionDate || new Date().toLocaleString()}</strong></div>
      <div class="card-row"><span>Room Category Rent:</span> <strong>₹${dailyRent || 1500} / day</strong></div>
    </div>
    <div style="background:#fef3c7; border-left:4px solid #d97706; padding:14px; margin:16px 0; border-radius:8px; font-size:12px;">
      <p style="margin:0 0 6px 0; font-weight:700; color:#b45309;">Emergency & Visiting Instructions:</p>
      <p style="margin:0; color:#78350f; line-height:1.5;">
        • Visiting Hours: 10:00 AM – 12:00 PM & 05:00 PM – 07:00 PM.<br/>
        • 1 Attendant Pass is issued for 24-hour bedside care.<br/>
        • 24/7 Nursing Helpline Desk: Ext 402 / Emergency Hotline +91 98765 43210.
      </p>
    </div>
    <a href="http://localhost:5173/ipd" class="btn">View Admission Details →</a>
  `;
  return baseEmailLayout({ title: "IPD Admission Receipt - CityCare Hospital", bodyHtml });
};

export const renderBedTransferEmail = ({ patientName, admissionId, fromWardBed, toWardBed, transferReason, transferDate }) => {
  const bodyHtml = `
    <span class="badge" style="background:#f3e8ff; color:#6b21a8;">Bed Transfer Notice</span>
    <h2>Patient Bed / Ward Relocation Alert 🔄</h2>
    <p>Dear Staff / Nurse / Doctor, a patient bed relocation request has been executed.</p>
    <div class="card">
      <div class="card-row"><span>Patient Name:</span> <strong>${patientName}</strong></div>
      <div class="card-row"><span>Admission ID:</span> <strong>${admissionId}</strong></div>
      <div class="card-row"><span>Transferred From:</span> <span style="text-decoration:line-through; color:#94a3b8;">${fromWardBed || "Previous Bed"}</span></div>
      <div class="card-row"><span>Transferred To:</span> <strong style="color:#9333ea;">${toWardBed || "Target Bed"}</strong></div>
      <div class="card-row"><span>Transfer Reason:</span> <strong>${transferReason || "Clinical requirement / Patient request"}</strong></div>
      <div class="card-row"><span>Execution Time:</span> <strong>${transferDate || new Date().toLocaleString()}</strong></div>
    </div>
    <p>Please ensure patient chart, IV drips, and bedside monitoring equipment are calibrated in the new ward.</p>
    <a href="http://localhost:5173/ipd" class="btn" style="background:#9333ea;">View Live Bed Map →</a>
  `;
  return baseEmailLayout({ title: "Patient Bed Transfer Notification", bodyHtml });
};

export const renderDischargeSummaryEmail = ({ patientName, admissionId, doctorName, admissionDate, dischargeDate, dischargeSummary, postCareGuidelines }) => {
  const bodyHtml = `
    <span class="badge" style="background:#dcfce7; color:#15803d;">Patient Discharged</span>
    <h2>Final Discharge Summary & Medical Clearance 📋</h2>
    <p>Dear <strong>${patientName}</strong>, your hospital discharge process has been finalized. We wish you a speedy recovery!</p>
    <div class="card">
      <div class="card-row"><span>Admission ID:</span> <strong>${admissionId}</strong></div>
      <div class="card-row"><span>Primary Doctor:</span> <strong>${doctorName}</strong></div>
      <div class="card-row"><span>Admission Date:</span> <strong>${admissionDate}</strong></div>
      <div class="card-row"><span>Discharge Date:</span> <strong>${dischargeDate || new Date().toLocaleDateString()}</strong></div>
      <div class="card-row"><span>Discharge Status:</span> <strong style="color:#16a34a;">Stable & Cleared</strong></div>
    </div>
    <div style="background:#f8fafc; border-left:4px solid #16a34a; padding:16px; margin:16px 0; border-radius:8px;">
      <p style="margin:0 0 8px 0; font-weight:700; color:#15803d;">Discharge Clinical Summary:</p>
      <p style="margin:0 0 12px 0; font-size:13px; color:#334155; line-height:1.5;">${dischargeSummary || "Patient treated and discharged in stable condition."}</p>
      <p style="margin:0 0 4px 0; font-weight:700; color:#15803d;">Post-Care & Follow-Up Guidelines:</p>
      <p style="margin:0; font-size:12px; color:#475569; line-height:1.5;">${postCareGuidelines || "• Continue prescribed medications for 5 days.<br/>• Follow-up consultation scheduled in 7 days.<br/>• Contact hospital emergency if fever or acute symptoms develop."}</p>
    </div>
    <a href="http://localhost:5173/ipd" class="btn" style="background:#16a34a;">Download Discharge PDF Statement →</a>
  `;
  return baseEmailLayout({ title: "Hospital Discharge Summary - CityCare", bodyHtml });
};
