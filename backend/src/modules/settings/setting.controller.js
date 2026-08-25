import { getSettings, updateSettings } from "./setting.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";

export const get = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  return successResponse(res, 200, "Settings fetched successfully", settings);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const settings = await updateSettings(req.body, req.user, meta);
  return successResponse(res, 200, "Settings updated successfully", settings);
});

export const updateLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("No file uploaded", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const meta = getRequestMeta(req);
  const settings = await updateSettings({ logo: req.file.path }, req.user, meta);
  return successResponse(res, 200, "Hospital logo updated successfully", settings);
});