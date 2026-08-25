import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  getPrescriptionsByVisit,
  updatePrescription,
} from "./prescription.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const prescription = await createPrescription(req.body, req.user, meta);
  return successResponse(res, 201, "Prescription created successfully", prescription);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllPrescriptions(req.query);
  return successResponse(res, 200, "Prescriptions fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const prescription = await getPrescriptionById(req.params.id);
  return successResponse(res, 200, "Prescription fetched successfully", prescription);
});

export const getByVisit = asyncHandler(async (req, res) => {
  const prescriptions = await getPrescriptionsByVisit(req.params.visitId);
  return successResponse(res, 200, "Prescriptions fetched successfully", prescriptions);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const prescription = await updatePrescription(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Prescription updated successfully", prescription);
});