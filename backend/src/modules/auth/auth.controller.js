import {
  registerUser,
  loginUser,
  googleLoginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  getRegistrationOptions,
  updateCompleteProfile,
  requestPasswordReset,
} from "./auth.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";
import { setCache, getOrSetCache, delCache } from "../../utils/redisCache.js";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const getOptions = asyncHandler(async (req, res) => {
  const { data: options } = await getOrSetCache("hms:auth:reg_options", getRegistrationOptions, 86400);
  return successResponse(res, 200, "Registration options retrieved", options);
});

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  
  const meta = getRequestMeta(req);
  await createAuditLog({
    userId: user._id,
    action: "REGISTER",
    resource: "user",
    resourceId: user._id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return successResponse(res, 201, "User registered successfully", user);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  const meta = getRequestMeta(req);
  await createAuditLog({
    userId: user._id,
    action: "LOGIN",
    resource: "user",
    resourceId: user._id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return successResponse(res, 200, "Login successful", { user, accessToken });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken, email, name, photoUrl, firebaseUid } = req.body;
  const { user, accessToken, refreshToken } = await googleLoginUser({ email, name, photoUrl, firebaseUid });

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  const meta = getRequestMeta(req);
  await createAuditLog({
    userId: user._id,
    action: "GOOGLE_LOGIN",
    resource: "user",
    resourceId: user._id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return successResponse(res, 200, "Google login successful", { user, accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken, refreshToken } = await refreshAccessToken(token);

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  return successResponse(res, 200, "Token refreshed", { accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user.id);
  res.clearCookie("refreshToken");

  // SECURITY: Add current Access Token to Redis Blacklist (Default 15 mins = 900s)
  if (req.token) {
    await setCache(`hms:token:blacklist:${req.token}`, "REVOKED", 900);
  }
  // Clear user profile session cache
  await delCache(`hms:user:profile:${req.user.id}`);

  const meta = getRequestMeta(req);
  await createAuditLog({
    userId: req.user.id,
    action: "LOGOUT",
    resource: "user",
    resourceId: req.user.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return successResponse(res, 200, "Logged out successfully");
});

export const me = asyncHandler(async (req, res) => {
  // Use Redis cache for user session profile lookup (15 mins TTL)
  const { data: user } = await getOrSetCache(
    `hms:user:profile:${req.user.id}`,
    () => getCurrentUser(req.user.id),
    900
  );
  return successResponse(res, 200, "Current user fetched", user);
});

export const completeProfile = asyncHandler(async (req, res) => {
  const updatedUser = await updateCompleteProfile(req.user.id, req.body);
  await delCache(`hms:user:profile:${req.user.id}`);
  await delCache(`hms:user:detail:${req.user.id}`);

  const meta = getRequestMeta(req);
  await createAuditLog({
    userId: req.user.id,
    action: "UPDATE_PROFILE",
    resource: "user",
    resourceId: req.user.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return successResponse(res, 200, "Profile completed successfully", updatedUser);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await requestPasswordReset(req.body.email);
  return successResponse(res, 200, result.message);
});