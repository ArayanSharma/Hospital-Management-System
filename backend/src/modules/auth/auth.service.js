import User from "../users/user.model.js";
import Role from "../roles/role.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/generateToken.js";

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.refreshToken;
  return userObj;
};

// ---------------- REGISTER ----------------
export const registerUser = async (data) => {
  const { name, email, password, roleId, phone } = data;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      409,
      ErrorCodes.USER_ALREADY_EXISTS
    );
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    roleId,
    phone,
    status: "active",
  });

  return sanitizeUser(user);
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

  const sanitized = sanitizeUser(user);

  return {
    user: sanitized,
    accessToken,
    refreshToken,
    mustChangePassword: user.forcePasswordChange || false,
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