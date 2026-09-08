import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  paySupplierOutstandingService,
  toggleSupplierStatusService,
  toggleSupplierArchiveService,
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
  const result = await getAllSuppliers(req.query);
  return successResponse(res, 200, "Suppliers fetched successfully", result);
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

export const payOutstandingController = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const { payAmount, paymentMode, notes } = req.body;
  const result = await paySupplierOutstandingService(req.params.id, payAmount, paymentMode, notes, req.user, meta);
  return successResponse(res, 200, result.message, result.supplier);
});

export const toggleStatusController = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const result = await toggleSupplierStatusService(req.params.id, req.user, meta);
  return successResponse(res, 200, result.message, result.supplier);
});

export const toggleArchiveController = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const result = await toggleSupplierArchiveService(req.params.id, req.user, meta);
  return successResponse(res, 200, result.message, result.supplier);
});