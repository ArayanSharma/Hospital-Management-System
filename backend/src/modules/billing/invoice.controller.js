import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  cancelInvoice,
} from "./invoice.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const invoice = await createInvoice(req.body, req.user, meta);
  return successResponse(res, 201, "Invoice created successfully", invoice);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllInvoices(req.query);
  return successResponse(res, 200, "Invoices fetched successfully", result);
});

export const getById = asyncHandler(async (req, res) => {
  const invoice = await getInvoiceById(req.params.id);
  return successResponse(res, 200, "Invoice fetched successfully", invoice);
});

export const cancel = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const result = await cancelInvoice(req.params.id, req.user, meta);
  return successResponse(res, 200, result.message);
});