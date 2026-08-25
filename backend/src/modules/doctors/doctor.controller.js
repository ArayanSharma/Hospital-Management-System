import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "./doctor.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import Doctor from "./doctor.model.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const doctor = await createDoctor(req.body, req.user, meta);
  return successResponse(res, 201, "Doctor created successfully", doctor);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllDoctors(req.query);
  return successResponse(res, 200, "Doctors fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const doctor = await getDoctorById(req.params.id);
  return successResponse(res, 200, "Doctor fetched successfully", doctor);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const doctor = await updateDoctor(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Doctor updated successfully", doctor);
});

export const remove = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const result = await deleteDoctor(req.params.id, req.user, meta);
  return successResponse(res, 200, result.message);
});

export const updatePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("No file uploaded", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { photoUrl: req.file.path },
    { new: true }
  );

  return successResponse(res, 200, "Photo updated successfully", doctor);
});