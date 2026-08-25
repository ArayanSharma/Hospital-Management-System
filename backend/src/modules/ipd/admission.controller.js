import {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  dischargePatient,
} from "./admission.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const admission = await createAdmission(req.body, req.user, meta);
  return successResponse(res, 201, "Patient admitted successfully", admission);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllAdmissions(req.query);
  return successResponse(res, 200, "Admissions fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const admission = await getAdmissionById(req.params.id);
  return successResponse(res, 200, "Admission fetched successfully", admission);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const admission = await updateAdmission(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Admission updated successfully", admission);
});

export const discharge = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const { dischargeSummary } = req.body;
  const admission = await dischargePatient(req.params.id, dischargeSummary, req.user, meta);
  return successResponse(res, 200, "Patient discharged successfully", admission);
});