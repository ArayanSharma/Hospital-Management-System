import User from "../users/user.model.js";
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

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      409,
      ErrorCodes.USER_ALREADY_EXISTS
    );
  }

  // NOTE: password yahan plain jaa raha hai — pre-save hook isse hash karega
  const user = await User.create({
    name,
    email,
    password,
    roleId,
    phone,
    status: "active",
  });

  return sanitizeUser(user);
};

// ---------------- LOGIN ----------------
export const loginUser = async (email, password) => {
  const cleanEmail = email?.trim().toLowerCase();
  const cleanPassword = password?.trim();

  const user = await User.findOne({ email: cleanEmail })
    .select("+password")
    .populate("roleId", "name permissionIds");

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
      ErrorCodes.AUTH_INVALID_CREDENTIALS
    );
  }

  if (user.status?.toLowerCase() !== "active") {
    throw new AppError(
      "Account is inactive. Contact admin.",
      403,
      ErrorCodes.AUTH_ACCOUNT_INACTIVE
    );
  }

  // Model ka instance method use ho raha hai — manual bcrypt.compare nahi
  const isMatch = await user.isPasswordMatch(cleanPassword);
  if (!isMatch) {
    throw new AppError(
      "Invalid email or password",
      401,
      ErrorCodes.AUTH_INVALID_CREDENTIALS
    );
  }

  const payload = { id: user._id, roleId: user.roleId?._id };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
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
  const user = await User.findById(userId).populate(
    "roleId",
    "name permissionIds"
  );

  if (!user) {
    throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
  }

  return sanitizeUser(user);
};