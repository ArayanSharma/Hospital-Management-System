import { baseEmailLayout } from "./baseLayout.js";

export const renderWelcomeEmail = ({ name = "Valued User", roleName, verificationLink } = {}) => {
  const bodyHtml = `
    <span class="badge">Welcome to CityCare</span>
    <h2>Welcome, ${name}! 👋</h2>
    <p>Your account has been successfully created in the <strong>CityCare Hospital Management System</strong>.</p>
    <div class="card">
      <div class="card-row"><span>Account Status:</span> <strong>Active</strong></div>
      <div class="card-row"><span>Assigned Role:</span> <strong>${roleName || "Patient"}</strong></div>
      <div class="card-row"><span>Verification Link:</span> <strong>Expires in 24 Hours</strong></div>
    </div>
    <p>Please verify your email and complete your profile information to access all portal features.</p>
    <a href="${verificationLink || "http://localhost:5173/complete-profile"}" class="btn">Verify & Complete Profile →</a>
  `;
  return baseEmailLayout({ title: "Welcome to CityCare Hospital", bodyHtml });
};

export const renderPasswordResetEmail = ({ name = "User", resetLink, otpCode } = {}) => {
  const bodyHtml = `
    <span class="badge" style="background:#fee2e2; color:#dc2626;">Security Request</span>
    <h2>Password Reset Request 🔐</h2>
    <p>Hello <strong>${name || "User"}</strong>, we received a request to reset your password for CityCare Hospital Portal.</p>
    <div class="card">
      <div class="card-row"><span>Verification OTP Code:</span> <strong style="font-size:18px; letter-spacing:2px; color:#2563eb;">${otpCode || "482910"}</strong></div>
      <div class="card-row"><span>Validity:</span> <strong>15 Minutes (Strict Security Expiry)</strong></div>
    </div>
    <p>Click the link below or enter the 6-digit OTP code on the password reset screen.</p>
    <a href="${resetLink || "http://localhost:5173/reset-password"}" class="btn" style="background:#dc2626;">Reset Password Now →</a>
    <p style="font-size:11px; color:#94a3b8; margin-top:16px;">If you did not request a password reset, please ignore this email or contact security administrator immediately.</p>
  `;
  return baseEmailLayout({ title: "Password Reset Request", bodyHtml, footerSubtext: "Security Alert: Never share your OTP with anyone." });
};

export const renderSecurityAlertEmail = ({ name = "User", deviceName, ipAddress, loginTime } = {}) => {
  const bodyHtml = `
    <span class="badge" style="background:#fef3c7; color:#d97706;">New Login Detected</span>
    <h2>Security Alert: New Sign-In ⚠️</h2>
    <p>Hello <strong>${name || "User"}</strong>, a new sign-in was detected on your account.</p>
    <div class="card">
      <div class="card-row"><span>Device / Browser:</span> <strong>${deviceName || "Chrome on Windows"}</strong></div>
      <div class="card-row"><span>IP Address:</span> <strong>${ipAddress || "127.0.0.1"}</strong></div>
      <div class="card-row"><span>Sign-in Time:</span> <strong>${loginTime || new Date().toLocaleString()}</strong></div>
    </div>
    <p>If this was you, no action is needed. If you do not recognize this activity, please reset your password immediately.</p>
    <a href="http://localhost:5173/settings" class="btn">Review Account Security →</a>
  `;
  return baseEmailLayout({ title: "Security Alert - New Sign-In", bodyHtml });
};

export const renderProfileCompleteEmail = ({ name = "User", email = "N/A", phone, roleName = "Member" } = {}) => {
  const bodyHtml = `
    <span class="badge">Profile Verified</span>
    <h2>Profile Completed Successfully! 🎉</h2>
    <p>Dear <strong>${name}</strong>, your account profile has been fully completed and verified in our database.</p>
    <div class="card">
      <div class="card-row"><span>Full Name:</span> <strong>${name}</strong></div>
      <div class="card-row"><span>Email Address:</span> <strong>${email}</strong></div>
      <div class="card-row"><span>Phone Number:</span> <strong>${phone || "N/A"}</strong></div>
      <div class="card-row"><span>Designation:</span> <strong>${roleName}</strong></div>
    </div>
    <p>You now have full access to your personalized dashboard.</p>
    <a href="http://localhost:5173/dashboard" class="btn">Go to Dashboard →</a>
  `;
  return baseEmailLayout({ title: "Profile Completed - CityCare Hospital", bodyHtml });
};
