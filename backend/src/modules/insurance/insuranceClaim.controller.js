import {
  createInsuranceClaim,
  getAllClaims,
  getClaimById,
  updateClaimStatus,
} from "./insuranceClaim.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const data = { ...req.body };

  if (req.files && req.files.length > 0) {
    data.documents = req.files.map((file) => file.path); // array of Cloudinary URLs
  }

  const claim = await createInsuranceClaim(data, req.user, meta);
  return successResponse(res, 201, "Insurance claim submitted successfully", claim);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllClaims(req.query);
  return successResponse(res, 200, "Insurance claims fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const claim = await getClaimById(req.params.id);
  return successResponse(res, 200, "Insurance claim fetched successfully", claim);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const claim = await updateClaimStatus(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Claim status updated successfully", claim);
});