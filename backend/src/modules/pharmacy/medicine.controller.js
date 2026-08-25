import { createMedicine, getAllMedicines, getMedicineById, updateMedicine } from "./medicine.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const medicine = await createMedicine(req.body, req.user, meta);
  return successResponse(res, 201, "Medicine created successfully", medicine);
});

export const getAll = asyncHandler(async (req, res) => {
  const medicines = await getAllMedicines(req.query);
  return successResponse(res, 200, "Medicines fetched successfully", medicines);
});

export const getById = asyncHandler(async (req, res) => {
  const medicine = await getMedicineById(req.params.id);
  return successResponse(res, 200, "Medicine fetched successfully", medicine);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const medicine = await updateMedicine(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Medicine updated successfully", medicine);
});