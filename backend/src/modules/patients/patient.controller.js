import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "./patient.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const patient = await createPatient(req.body, req.user, meta);
  return successResponse(res, 201, "Patient registered successfully", patient);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllPatients(req.query);
  return successResponse(res, 200, "Patients fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const patient = await getPatientById(req.params.id);
  return successResponse(res, 200, "Patient fetched successfully", patient);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const patient = await updatePatient(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Patient updated successfully", patient);
});

export const remove = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const result = await deletePatient(req.params.id, req.user, meta);
  return successResponse(res, 200, result.message);
});