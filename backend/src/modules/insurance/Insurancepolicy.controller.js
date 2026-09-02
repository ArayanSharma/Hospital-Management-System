import {
  createPolicyService,
  getAllPoliciesService,
  getPolicyByIdService,
  updatePolicyService,
  deletePolicyService,
} from "./insurancePolicy.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const policy = await createPolicyService(req.body, req.user, meta);
  return successResponse(res, 201, "Insurance policy created successfully", policy);
});

export const getAll = asyncHandler(async (req, res) => {
  const policies = await getAllPoliciesService(req.query);
  return successResponse(res, 200, "Insurance policies fetched successfully", policies);
});

export const getByPatient = asyncHandler(async (req, res) => {
  const policies = await getAllPoliciesService({ search: req.params.patientId });
  return successResponse(res, 200, "Insurance policies fetched successfully", policies);
});

export const getById = asyncHandler(async (req, res) => {
  const policy = await getPolicyByIdService(req.params.id);
  return successResponse(res, 200, "Insurance policy fetched successfully", policy);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const policy = await updatePolicyService(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Insurance policy updated successfully", policy);
});

export const remove = asyncHandler(async (req, res) => {
  const result = await deletePolicyService(req.params.id);
  return successResponse(res, 200, result.message);
});