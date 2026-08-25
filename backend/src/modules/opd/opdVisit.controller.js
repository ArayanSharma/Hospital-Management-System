import {
  createOPDVisit,
  getAllOPDVisits,
  getOPDVisitById,
  updateOPDVisit,
} from "./opdVisit.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const visit = await createOPDVisit(req.body, req.user, meta);
  return successResponse(res, 201, "OPD visit created successfully", visit);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllOPDVisits(req.query);
  return successResponse(res, 200, "OPD visits fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const visit = await getOPDVisitById(req.params.id);
  return successResponse(res, 200, "OPD visit fetched successfully", visit);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const visit = await updateOPDVisit(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "OPD visit updated successfully", visit);
});