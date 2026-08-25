import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "./supplier.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const supplier = await createSupplier(req.body, req.user, meta);
  return successResponse(res, 201, "Supplier created successfully", supplier);
});

export const getAll = asyncHandler(async (req, res) => {
  const suppliers = await getAllSuppliers(req.query);
  return successResponse(res, 200, "Suppliers fetched successfully", suppliers);
});

export const getById = asyncHandler(async (req, res) => {
  const supplier = await getSupplierById(req.params.id);
  return successResponse(res, 200, "Supplier fetched successfully", supplier);
});

export const update = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const supplier = await updateSupplier(req.params.id, req.body, req.user, meta);
  return successResponse(res, 200, "Supplier updated successfully", supplier);
});

export const remove = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const result = await deleteSupplier(req.params.id, req.user, meta);
  return successResponse(res, 200, result.message);
});