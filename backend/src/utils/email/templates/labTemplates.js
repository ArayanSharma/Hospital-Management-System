import { baseEmailLayout } from "./baseLayout.js";

export const renderLabReportEmail = ({ patientName, testName, reportId, status }) => {
  const bodyHtml = `
    <span class="badge">Diagnostic Report Ready</span>
    <h2>Your Lab Test Results are Available 🧪</h2>
    <p>Dear <strong>${patientName}</strong>, the results for your diagnostic lab test are now published.</p>
    <div class="card">
      <div class="card-row"><span>Test Name:</span> <strong>${testName}</strong></div>
      <div class="card-row"><span>Report Reference:</span> <strong>${reportId}</strong></div>
      <div class="card-row"><span>Status:</span> <strong>${status || "Verified"}</strong></div>
    </div>
    <p>You can view and download your diagnostic PDF report directly from the hospital portal.</p>
    <a href="http://localhost:5173/laboratory" class="btn">View Diagnostic Report →</a>
  `;
  return baseEmailLayout({ title: "Lab Report Ready - CityCare", bodyHtml });
};

export const renderLabSampleCollectedEmail = ({ patientName, orderId, testName, sampleType, collectedAt }) => {
  const bodyHtml = `
    <span class="badge" style="background:#e0e7ff; color:#4338ca;">Sample Received</span>
    <h2>Lab Specimen Collection Confirmation 🧪</h2>
    <p>Dear <strong>${patientName}</strong>, your diagnostic specimen sample has been collected and received by our central lab team.</p>
    <div class="card">
      <div class="card-row"><span>Order ID:</span> <strong>${orderId}</strong></div>
      <div class="card-row"><span>Test Ordered:</span> <strong>${testName}</strong></div>
      <div class="card-row"><span>Sample Type:</span> <strong>${sampleType || "Blood"}</strong></div>
      <div class="card-row"><span>Collected At:</span> <strong>${collectedAt || new Date().toLocaleString()}</strong></div>
      <div class="card-row"><span>Processing Status:</span> <strong style="color:#2563eb;">In Analysis</strong></div>
    </div>
    <p>You will receive an automated notification as soon as your verified lab report is ready for viewing.</p>
    <a href="http://localhost:5173/laboratory" class="btn">Track Order Status →</a>
  `;
  return baseEmailLayout({ title: "Lab Sample Received - CityCare Hospital", bodyHtml });
};

export const renderLabReportReadyEmail = ({ patientName, doctorName, orderId, testName, verificationDate, interpretation, isCritical }) => {
  const bodyHtml = `
    <span class="badge" style="background:${isCritical ? "#fee2e2" : "#dcfce7"}; color:${isCritical ? "#dc2626" : "#15803d"};">
      ${isCritical ? "Report Verified (Critical Value)" : "Report Finalized & Verified"}
    </span>
    <h2>Diagnostic Lab Report Available 📄</h2>
    <p>Dear <strong>${patientName}</strong>, the diagnostic report for your order <strong>${orderId}</strong> is verified.</p>
    <div class="card">
      <div class="card-row"><span>Order Reference:</span> <strong>${orderId}</strong></div>
      <div class="card-row"><span>Diagnostic Test:</span> <strong>${testName}</strong></div>
      <div class="card-row"><span>Ordering Physician:</span> <strong>${doctorName}</strong></div>
      <div class="card-row"><span>Verified Timestamp:</span> <strong>${verificationDate || new Date().toLocaleString()}</strong></div>
      <div class="card-row"><span>Clinical Interpretation:</span> <span>${interpretation || "Normal diagnostic findings."}</span></div>
    </div>
    <p>Your official high-resolution PDF lab report is attached / available in your portal.</p>
    <a href="http://localhost:5173/laboratory" class="btn" style="background:#2563eb;">View & Download PDF Report →</a>
  `;
  return baseEmailLayout({ title: `Diagnostic Report Ready: ${testName}`, bodyHtml });
};

export const renderCriticalResultAlertEmail = ({ doctorName, patientName, patientUhid, testName, criticalValueDetails, alertTimestamp }) => {
  const bodyHtml = `
    <span class="badge" style="background:#dc2626; color:#ffffff; font-weight:800;">🚨 EMERGENCY PANIC ALERT</span>
    <h2 style="color:#dc2626;">CRITICAL LAB VALUE ALERT ⚠️</h2>
    <p>Attention Dr. <strong>${doctorName}</strong>, a dangerously abnormal critical panic value was flagged in lab testing.</p>
    <div class="card" style="border:2px solid #ef4444; background:#fff5f5;">
      <div class="card-row"><span>Patient Name:</span> <strong style="font-size:15px; color:#991b1b;">${patientName} (${patientUhid})</strong></div>
      <div class="card-row"><span>Diagnostic Test:</span> <strong>${testName}</strong></div>
      <div class="card-row"><span>Flagged Panic Finding:</span> <strong style="color:#dc2626; font-size:16px;">${criticalValueDetails || "Troponin I Elevated (> 5.0 ng/mL)"}</strong></div>
      <div class="card-row"><span>Flagged Timestamp:</span> <strong>${alertTimestamp || new Date().toLocaleString()}</strong></div>
    </div>
    <div style="background:#fee2e2; border-left:4px solid #dc2626; padding:14px; margin:16px 0; border-radius:8px; font-size:12px;">
      <p style="margin:0 0 4px 0; font-weight:800; color:#991b1b;">Immediate Action Required:</p>
      <p style="margin:0; color:#7f1d1d; line-height:1.5;">
        • Please review patient chart and initiate clinical intervention immediately.<br/>
        • Emergency ICU / Nursing desk notified.
      </p>
    </div>
    <a href="http://localhost:5173/laboratory" class="btn" style="background:#dc2626;">Open Patient Chart Immediately →</a>
  `;
  return baseEmailLayout({ title: `🚨 EMERGENCY CRITICAL ALERT: ${patientName} (${testName})`, bodyHtml, footerSubtext: "Urgent Medical Alert: Direct physician intervention required." });
};
