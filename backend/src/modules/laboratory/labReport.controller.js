import {
  createLabReport,
  finalizeLabReport,
  getLabReportByTestId,
  updateLabReport,
} from "./labReport.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const data = { ...req.body };

  if (req.file) {
    data.reportFile = req.file.path; // Cloudinary URL
  }

  const report = await createLabReport(data, req.user, meta);
  return successResponse(res, 201, "Lab report created successfully", report);
});

export const finalize = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const report = await finalizeLabReport(req.params.id, req.user, meta);
  return successResponse(res, 200, "Lab report finalized successfully", report);
});

export const getByTestId = asyncHandler(async (req, res) => {
  const report = await getLabReportByTestId(req.params.labTestId);
  return successResponse(res, 200, "Lab report fetched successfully", report);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const report = await updateLabReport(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Lab report updated successfully", report);
});