import {
  createInsurancePolicy,
  getPolicies,
  getPoliciesByPatient,
  getPolicyById,
  updateInsurancePolicy,
} from "./insurancePolicy.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const policy = await createInsurancePolicy(req.body, req.user, meta);
  return successResponse(res, 201, "Insurance policy created successfully", policy);
});

export const getAll = asyncHandler(async (req, res) => {
  const policies = await getPolicies(req.query);
  return successResponse(res, 200, "Insurance policies fetched successfully", policies);
});

export const getByPatient = asyncHandler(async (req, res) => {
  const policies = await getPoliciesByPatient(req.params.patientId);
  return successResponse(res, 200, "Insurance policies fetched successfully", policies);
});

export const getById = asyncHandler(async (req, res) => {
  const policy = await getPolicyById(req.params.id);
  return successResponse(res, 200, "Insurance policy fetched successfully", policy);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const policy = await updateInsurancePolicy(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Insurance policy updated successfully", policy);
});