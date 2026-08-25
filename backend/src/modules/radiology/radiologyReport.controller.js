import {
  createRadiologyReport,
  finalizeRadiologyReport,
  getRadiologyReportByTestId,
  updateRadiologyReport,
} from "./radiologyReport.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const report = await createRadiologyReport(req.body, req.user, meta);
  return successResponse(res, 201, "Radiology report created successfully", report);
});

export const finalize = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const report = await finalizeRadiologyReport(req.params.id, req.user, meta);
  return successResponse(res, 200, "Radiology report finalized successfully", report);
});

export const getByTestId = asyncHandler(async (req, res) => {
  const report = await getRadiologyReportByTestId(req.params.testId);
  return successResponse(res, 200, "Radiology report fetched successfully", report);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const report = await updateRadiologyReport(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Radiology report updated successfully", report);
});