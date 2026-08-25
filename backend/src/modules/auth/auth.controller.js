import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
} from "./auth.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

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

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken, refreshToken } = await refreshAccessToken(token);

  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  return successResponse(res, 200, "Token refreshed", { accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req.user.id);
  res.clearCookie("refreshToken");

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
  const user = await getCurrentUser(req.user.id);
  return successResponse(res, 200, "Current user fetched", user);
});