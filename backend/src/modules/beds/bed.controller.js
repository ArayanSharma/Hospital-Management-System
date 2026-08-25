import {
  createBed,
  getAllBeds,
  getAvailableBeds,
  getBedById,
  updateBedStatus,
} from "./bed.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const bed = await createBed(req.body, req.user, meta);
  return successResponse(res, 201, "Bed created successfully", bed);
});

export const getAll = asyncHandler(async (req, res) => {
  const beds = await getAllBeds(req.query);
  return successResponse(res, 200, "Beds fetched successfully", beds);
});

export const getAvailable = asyncHandler(async (req, res) => {
  const beds = await getAvailableBeds(req.query.wardId);
  return successResponse(res, 200, "Available beds fetched successfully", beds);
});

export const getById = asyncHandler(async (req, res) => {
  const bed = await getBedById(req.params.id);
  return successResponse(res, 200, "Bed fetched successfully", bed);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const { status, maintenanceReason } = req.body;
  const bed = await updateBedStatus(req.params.id, status, maintenanceReason, req.user, meta);
  return successResponse(res, 200, "Bed status updated successfully", bed);
});