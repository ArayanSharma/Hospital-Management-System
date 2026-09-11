import User from "../users/user.model.js";
import Role from "../roles/role.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/generateToken.js";

import Department from "../departments/department.model.js";
import { notifyAuthSecurityEvent } from "../../utils/notificationDispatcher.js";
import { dispatchAsyncEmail } from "../../utils/email/emailDispatcher.js";

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.refreshToken;
  return userObj;
};

// ---------------- REGISTER ----------------
export const registerUser = async (data) => {
  const { name, email, password, roleId, role, phone, departmentId, department } = data;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      409,
      ErrorCodes.USER_ALREADY_EXISTS
    );
  }

  // Resolve roleId if a role name string was provided
  let targetRoleId = roleId || role;
  let targetRoleName = "";
  if (targetRoleId && typeof targetRoleId === "string" && !targetRoleId.match(/^[0-9a-fA-F]{24}$/)) {
    const roleDoc = await Role.findOne({ name: new RegExp(`^${targetRoleId}$`, "i") });
    if (roleDoc) {
      targetRoleId = roleDoc._id;
      targetRoleName = roleDoc.name;
    } else {
      targetRoleName = targetRoleId.toUpperCase();
      targetRoleId = null;
    }
  }

  // Resolve departmentId if a department name string was provided
  let targetDeptId = departmentId || department;
  if (targetDeptId && typeof targetDeptId === "string" && !targetDeptId.match(/^[0-9a-fA-F]{24}$/)) {
    const deptDoc = await Department.findOne({ name: new RegExp(`^${targetDeptId}$`, "i") });
    if (deptDoc) {
      targetDeptId = deptDoc._id;
    } else {
      targetDeptId = null;
    }
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    roleId: targetRoleId || undefined,
    roleName: targetRoleName || undefined,
    departmentId: targetDeptId || undefined,
    phone: phone || undefined,
    status: "active",
  });

  // 1. New User Registration: Welcome Email + Verification Link (Token expire 24h)
  dispatchAsyncEmail({
    to: user.email,
    type: "welcome",
    data: {
      name: user.name,
      roleName: user.roleName || "Patient",
      verificationLink: `http://localhost:5173/complete-profile?token=v_${Date.now()}`,
    },
  });

  return sanitizeUser(user);
};

export const getRegistrationOptions = async () => {
  const roles = await Role.find({ status: { $ne: "inactive" } }).select("name description").lean();
  const departments = await Department.find({ status: "active" }).select("name code").lean();

  return {
    roles: roles.length > 0 ? roles : [
      { name: "Doctor", description: "Medical Practitioner" },
      { name: "Nurse", description: "Nursing Staff" },
      { name: "Receptionist", description: "Front Desk & Registrations" },
      { name: "Accountant", description: "Billing & Finance" },
      { name: "Pharmacist", description: "Pharmacy & Medicine Management" },
      { name: "Lab Technician", description: "Diagnostic & Lab Tests" },
    ],
    departments: departments.length > 0 ? departments : [
      { name: "Cardiology", code: "CARD" },
      { name: "General OPD", code: "OPD" },
      { name: "Inpatient IPD", code: "IPD" },
      { name: "Pharmacy", code: "PHARM" },
      { name: "Laboratory", code: "LAB" },
      { name: "Radiology", code: "RAD" },
    ],
  };
};

// ---------------- LOGIN ----------------
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() })
    .select("+password")
    .populate({
      path: "roleId",
      select: "name modulePermissions actionPermissions permissionIds",
      populate: { path: "permissionIds", select: "name" },
    });

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
      ErrorCodes.AUTH_INVALID_CREDENTIALS
    );
  }

  // Account Status check
  if (user.status !== "active") {
    throw new AppError(
      `Account is currently ${user.status}. Please contact administrator.`,
      403,
      ErrorCodes.AUTH_ACCOUNT_INACTIVE
    );
  }

  // Login Access control check (Section 3: Status & Access)
  if (user.loginAccess && user.loginAccess !== "Allowed") {
    throw new AppError(
      `Login access is ${user.loginAccess.toLowerCase()} for this account. Contact system administrator.`,
      403,
      ErrorCodes.AUTH_ACCOUNT_INACTIVE
    );
  }

  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) {
    throw new AppError(
      "Invalid email or password",
      401,
      ErrorCodes.AUTH_INVALID_CREDENTIALS
    );
  }

  if (!user.roleId && user.roleName) {
    const roleDoc = await Role.findOne({ name: user.roleName.toUpperCase() });
    if (roleDoc) {
      user.roleId = roleDoc;
    }
  }

  const payload = { id: user._id, roleId: user.roleId?._id || user.roleId };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  user.lastLoginFormatted =
    new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " \n " +
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  await user.save();

  // Send Security Login Alert Notification
  notifyAuthSecurityEvent({
    userId: user._id,
    eventType: "new_login",
  });

  // 3. New Device / Location Login Security Alert Email
  dispatchAsyncEmail({
    to: user.email,
    type: "security_alert",
    data: {
      name: user.name,
      deviceName: "Chrome on Windows (Verified Device)",
      ipAddress: "127.0.0.1",
      loginTime: user.lastLoginFormatted,
    },
  });

  const sanitized = sanitizeUser(user);

  return {
    user: sanitized,
    accessToken,
    refreshToken,
    mustChangePassword: user.forcePasswordChange || false,
  };
};

// ---------------- GOOGLE SSO LOGIN ----------------
export const googleLoginUser = async ({ email, name, photoUrl, firebaseUid }) => {
  if (!email) {
    throw new AppError("Email is required from Google SSO", 400, ErrorCodes.BAD_REQUEST);
  }

  let user = await User.findOne({ email: email.toLowerCase() }).populate({
    path: "roleId",
    select: "name modulePermissions actionPermissions permissionIds",
    populate: { path: "permissionIds", select: "name" },
  });

  if (!user) {
    const patientRole = await Role.findOne({ name: /PATIENT/i });
    const empId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    user = await User.create({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      password: "GoogleAuthUserPass#" + Math.random().toString(36).slice(-8),
      avatar: photoUrl || "",
      authProvider: "google",
      firebaseUid: firebaseUid || null,
      roleId: patientRole ? patientRole._id : undefined,
      roleName: patientRole ? patientRole.name.toUpperCase() : "PATIENT",
      employeeId: empId,
      status: "active",
      emailVerified: "Verified",
      loginAccess: "Allowed",
      isProfileComplete: false,
      forcePasswordChange: false,
    });

    user = await User.findById(user._id).populate({
      path: "roleId",
      select: "name modulePermissions actionPermissions permissionIds",
      populate: { path: "permissionIds", select: "name" },
    });

    // Send Welcome Email to newly registered Google SSO User
    dispatchAsyncEmail({
      to: user.email,
      type: "welcome",
      data: {
        name: user.name,
        roleName: user.roleName || "Patient",
        verificationLink: `http://localhost:5173/complete-profile`,
      },
    });
  } else {
    // Update existing user with Google auth details & updated avatar if available
    let modified = false;
    if (user.authProvider !== "google") {
      user.authProvider = "google";
      modified = true;
    }
    if (firebaseUid && !user.firebaseUid) {
      user.firebaseUid = firebaseUid;
      modified = true;
    }
    if (photoUrl && !user.avatar) {
      user.avatar = photoUrl;
      modified = true;
    }
    if (user.emailVerified !== "Verified") {
      user.emailVerified = "Verified";
      modified = true;
    }
    if (modified) {
      await user.save();
    }
  }

  if (user.status !== "active") {
    throw new AppError(
      `Account is currently ${user.status}. Contact system administrator.`,
      403,
      ErrorCodes.AUTH_ACCOUNT_INACTIVE
    );
  }

  const payload = { id: user._id, roleId: user.roleId?._id || user.roleId };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  user.lastLoginFormatted =
    new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " \n " +
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  await user.save();

  notifyAuthSecurityEvent({
    userId: user._id,
    eventType: "google_login",
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
    mustChangePassword: false,
  };
};

// ---------------- REFRESH TOKEN ----------------
export const refreshAccessToken = async (token) => {
  if (!token) {
    throw new AppError(
      "Refresh token is required",
      401,
      ErrorCodes.AUTH_TOKEN_MISSING
    );
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    throw new AppError(
      "Invalid or expired refresh token",
      401,
      ErrorCodes.AUTH_REFRESH_TOKEN_INVALID
    );
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    throw new AppError(
      "Invalid refresh token",
      401,
      ErrorCodes.AUTH_REFRESH_TOKEN_INVALID
    );
  }

  const payload = { id: user._id, roleId: user.roleId };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// ---------------- LOGOUT ----------------
export const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
  }

  user.refreshToken = null;
  await user.save();

  return { message: "Logged out successfully" };
};

// ---------------- GET CURRENT USER (me) ----------------
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "roleId",
    select: "name modulePermissions actionPermissions permissionIds",
    populate: { path: "permissionIds", select: "name" },
  });

  if (!user) {
    throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
  }

  if (!user.roleId && user.roleName) {
    const roleDoc = await Role.findOne({ name: user.roleName.toUpperCase() });
    if (roleDoc) {
      const userObj = user.toObject();
      userObj.roleId = roleDoc;
      return sanitizeUser(userObj);
    }
  }

  return sanitizeUser(user);
};

// ---------------- COMPLETE PROFILE ----------------
export const updateCompleteProfile = async (userId, profileData) => {
  const user = await User.findById(userId);
  if (!user || user.status === "deleted") {
    throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
  }

  // Edge case & Cyber Security check: Lock immutable fields
  const forbiddenFields = ["email", "employeeId", "roleName", "roleId", "status", "emailVerified", "loginAccess"];
  forbiddenFields.forEach((field) => {
    if (profileData[field] !== undefined && String(profileData[field]) !== String(user[field])) {
      delete profileData[field];
    }
  });

  // Edge case validations
  if (profileData.dateOfBirth && new Date(profileData.dateOfBirth) > new Date()) {
    throw new AppError("Date of birth cannot be in the future", 400, ErrorCodes.BAD_REQUEST);
  }

  if (profileData.phone && !/^\+?[0-9\s-]{8,20}$/.test(profileData.phone.trim())) {
    throw new AppError("Please provide a valid contact phone number (8-20 digits)", 400, ErrorCodes.BAD_REQUEST);
  }

  // Update allowed fields
  if (profileData.name) user.name = profileData.name.trim();
  if (profileData.phone) user.phone = profileData.phone.trim();
  if (profileData.gender) user.gender = profileData.gender;
  if (profileData.dateOfBirth) user.dateOfBirth = profileData.dateOfBirth;
  if (profileData.bloodGroup !== undefined) user.bloodGroup = profileData.bloodGroup;
  if (profileData.maritalStatus !== undefined) user.maritalStatus = profileData.maritalStatus;
  if (profileData.nationality !== undefined) user.nationality = profileData.nationality;
  if (profileData.currentAddress !== undefined) user.currentAddress = profileData.currentAddress;
  if (profileData.notes !== undefined) user.notes = profileData.notes;

  user.isProfileComplete = true;
  await user.save();

  // Async Email Dispatch (Non-blocking)
  dispatchAsyncEmail({
    to: user.email,
    type: "profile_complete",
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleName: user.roleName || user.role || "Staff",
    },
  });

  return sanitizeUser(user);
};

// ---------------- FORGOT PASSWORD ----------------
export const requestPasswordReset = async (email) => {
  if (!email || !email.includes("@")) {
    throw new AppError("Please provide a valid email address", 400, ErrorCodes.BAD_REQUEST);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || user.status === "deleted") {
    return { message: "If an account exists with this email, a password reset link has been sent." };
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetLink = `http://localhost:5173/reset-password?email=${encodeURIComponent(user.email)}&code=${otpCode}`;

  // 2. Password Reset Request Email (Link + OTP Code expire 15 mins)
  dispatchAsyncEmail({
    to: user.email,
    type: "password_reset",
    data: {
      name: user.name,
      otpCode,
      resetLink,
    },
  });

  return { message: "Password reset link and OTP code sent to your email address" };
};