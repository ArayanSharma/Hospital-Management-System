import {
  createRadiologyTest,
  getAllRadiologyTests,
  getRadiologyTestById,
  updateRadiologyTestStatus,
  deleteRadiologyTest,
} from "./radiologyTest.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const test = await createRadiologyTest(req.body, req.user, meta);
  return successResponse(res, 201, "Radiology test ordered successfully", test);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllRadiologyTests(req.query);
  return successResponse(res, 200, "Radiology tests fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const test = await getRadiologyTestById(req.params.id);
  return successResponse(res, 200, "Radiology test fetched successfully", test);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const { status, scheduledAt } = req.body;
  const test = await updateRadiologyTestStatus(req.params.id, status, scheduledAt, req.user, meta);
  return successResponse(res, 200, "Radiology test status updated successfully", test);
});

export const remove = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  await deleteRadiologyTest(req.params.id, req.user, meta);
  return successResponse(res, 200, "Radiology test deleted successfully", null);
});