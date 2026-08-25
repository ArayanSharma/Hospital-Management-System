import {
  createLabTest,
  getAllLabTests,
  getLabTestById,
  updateLabTestStatus,
} from "./labTest.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const test = await createLabTest(req.body, req.user, meta);
  return successResponse(res, 201, "Lab test ordered successfully", test);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllLabTests(req.query);
  return successResponse(res, 200, "Lab tests fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const test = await getLabTestById(req.params.id);
  return successResponse(res, 200, "Lab test fetched successfully", test);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const test = await updateLabTestStatus(req.params.id, req.body.status, req.user, meta);
  return successResponse(res, 200, "Lab test status updated successfully", test);
});