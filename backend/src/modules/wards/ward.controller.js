import { createWard, getAllWards, getWardById, updateWard, deleteWard } from "./ward.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const ward = await createWard(req.body, req.user, meta);
  return successResponse(res, 201, "Ward created successfully", ward);
});

export const getAll = asyncHandler(async (req, res) => {
  const wards = await getAllWards(req.query);
  return successResponse(res, 200, "Wards fetched successfully", wards);
});

export const getById = asyncHandler(async (req, res) => {
  const ward = await getWardById(req.params.id);
  return successResponse(res, 200, "Ward fetched successfully", ward);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const ward = await updateWard(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Ward updated successfully", ward);
});

export const remove = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const result = await deleteWard(req.params.id, req.user, meta);
  return successResponse(res, 200, result.message);
});