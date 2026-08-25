import {
  createMedicalRecord,
  getPatientMedicalHistory,
  getPatientMedicalSummary,
  getMedicalRecordById,
  updateMedicalRecord,
} from "./medicalRecord.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const record = await createMedicalRecord(req.body, req.user, meta);
  return successResponse(res, 201, "Medical record created successfully", record);
});

export const getHistory = asyncHandler(async (req, res) => {
  const result = await getPatientMedicalHistory(req.params.patientId, req.query);
  return successResponse(res, 200, "Medical history fetched successfully", result);
});

export const getSummary = asyncHandler(async (req, res) => {
  const summary = await getPatientMedicalSummary(req.params.patientId);
  return successResponse(res, 200, "Medical summary fetched successfully", summary);
});

export const getById = asyncHandler(async (req, res) => {
  const record = await getMedicalRecordById(req.params.id);
  return successResponse(res, 200, "Medical record fetched successfully", record);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const record = await updateMedicalRecord(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Medical record updated successfully", record);
});