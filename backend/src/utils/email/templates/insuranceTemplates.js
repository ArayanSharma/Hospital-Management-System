import { baseEmailLayout } from "./baseLayout.js";

export const renderInsuranceClaimSubmittedEmail = ({ patientName = "Valued Patient", claimId = "CLM-001", policyNo, tpaName, claimAmount = 0, submittedDate } = {}) => {
  const bodyHtml = `
    <span class="badge" style="background:#fef3c7; color:#d97706;">TPA Claim Submitted</span>
    <h2>Insurance Claim Submission Receipt 🛡️</h2>
    <p>Dear <strong>${patientName}</strong>, your TPA / Health Insurance claim has been successfully submitted for processing.</p>
    <div class="card">
      <div class="card-row"><span>Claim Reference ID:</span> <strong>${claimId}</strong></div>
      <div class="card-row"><span>Policy Number:</span> <strong>${policyNo || "POL-2026-889"}</strong></div>
      <div class="card-row"><span>TPA / Insurance Provider:</span> <strong>${tpaName || "Star Health TPA"}</strong></div>
      <div class="card-row"><span>Claim Amount Submitted:</span> <strong style="color:#2563eb;">₹${claimAmount}</strong></div>
      <div class="card-row"><span>Submission Timestamp:</span> <strong>${submittedDate || new Date().toLocaleString()}</strong></div>
    </div>
    <p>Our TPA desk is tracking your claim with the insurance provider. You will be notified automatically upon claim verification or approval decision.</p>
    <a href="http://localhost:5173/insurance" class="btn">Track Insurance Claim Status →</a>
  `;
  return baseEmailLayout({ title: `Insurance Claim Submission Receipt #${claimId}`, bodyHtml });
};

export const renderInsuranceClaimStatusEmail = ({ patientName = "Valued Patient", claimId = "CLM-001", policyNo, tpaName, status = "Approved", approvedAmount = 0, rejectionReason, decisionDate } = {}) => {
  const isApproved = status?.toLowerCase() === "approved";
  const badgeBg = isApproved ? "#dcfce7" : "#fee2e2";
  const badgeColor = isApproved ? "#15803d" : "#dc2626";

  const bodyHtml = `
    <span class="badge" style="background:${badgeBg}; color:${badgeColor};">
      ${isApproved ? "Claim Approved" : "Claim Decision Update"}
    </span>
    <h2 style="color:${isApproved ? "#16a34a" : "#dc2626"};">Insurance Claim ${isApproved ? "Approved ✅" : "Updated ⚠️"}</h2>
    <p>Dear <strong>${patientName}</strong>, your insurance provider <strong>${tpaName || "TPA"}</strong> has finalized a decision for claim <strong>${claimId}</strong>.</p>
    <div class="card" style="border:1px solid ${isApproved ? "#bbf7d0" : "#fca5a5"};">
      <div class="card-row"><span>Claim ID:</span> <strong>${claimId}</strong></div>
      <div class="card-row"><span>Policy Number:</span> <strong>${policyNo || "POL-2026"}</strong></div>
      <div class="card-row"><span>Decision Status:</span> <strong style="color:${badgeColor}; text-transform:uppercase;">${status}</strong></div>
      ${isApproved ? `<div class="card-row"><span>Approved Settlement Amount:</span> <strong style="color:#16a34a; font-size:16px;">₹${approvedAmount}</strong></div>` : ""}
      ${!isApproved && rejectionReason ? `<div class="card-row"><span>Rejection / Inquiry Reason:</span> <span style="color:#dc2626; font-weight:600;">${rejectionReason}</span></div>` : ""}
      <div class="card-row"><span>Decision Timestamp:</span> <strong>${decisionDate || new Date().toLocaleString()}</strong></div>
    </div>
    <p>Please contact our Hospital TPA Desk or log in to view complete settlement documentation.</p>
    <a href="http://localhost:5173/insurance" class="btn" style="background:${isApproved ? "#16a34a" : "#dc2626"};">View Full Claim Settlement →</a>
  `;
  return baseEmailLayout({ title: `Insurance Claim Status Update: ${claimId} (${status})`, bodyHtml });
};

export const renderSecurityAuditBreachEmail = ({ superAdminName = "Security Officer", breachType = "Security Event", eventDetails, userIp, timestamp, recommendedAction } = {}) => {
  const bodyHtml = `
    <span class="badge" style="background:#dc2626; color:#ffffff; font-weight:800;">🚨 EMERGENCY SECURITY BREACH</span>
    <h2 style="color:#dc2626;">SECURITY AUDIT BREACH ALERT ⚠️</h2>
    <p>Attention Super Admin <strong>${superAdminName || "Security Officer"}</strong>, a high-severity security alert or unauthorized activity was flagged in the system audit logs.</p>
    <div class="card" style="border:2px solid #dc2626; background:#fff5f5;">
      <div class="card-row"><span>Breach Category:</span> <strong style="color:#991b1b; font-size:15px;">${breachType || "Unauthorized Access Attempt"}</strong></div>
      <div class="card-row"><span>Event Description:</span> <strong>${eventDetails || "Suspicious data export / Privilege escalation attempt."}</strong></div>
      <div class="card-row"><span>Source IP Address:</span> <strong>${userIp || "127.0.0.1"}</strong></div>
      <div class="card-row"><span>Flagged Timestamp:</span> <strong>${timestamp || new Date().toLocaleString()}</strong></div>
    </div>
    <div style="background:#fee2e2; border-left:4px solid #dc2626; padding:14px; margin:16px 0; border-radius:8px; font-size:12px;">
      <p style="margin:0 0 4px 0; font-weight:800; color:#991b1b;">Immediate Security Protocol:</p>
      <p style="margin:0; color:#7f1d1d; line-height:1.5;">
        ${recommendedAction || "• Review Audit Log Trail in Super Admin Panel.<br/>• Revoke compromised user sessions or force password reset immediately."}
      </p>
    </div>
    <a href="http://localhost:5173/super-admin/audit-logs" class="btn" style="background:#dc2626;">Open Super Admin Security Desk →</a>
  `;
  return baseEmailLayout({ title: `🚨 EMERGENCY BREACH ALERT: ${breachType || "Security Event"}`, bodyHtml, footerSubtext: "System Security & Compliance Alert System" });
};
