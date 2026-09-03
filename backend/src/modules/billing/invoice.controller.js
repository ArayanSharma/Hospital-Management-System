import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  cancelInvoice,
  voidInvoiceService,
  refundInvoiceService,
  getNextInvoiceNumberService,
  getPatientEncountersService,
  getBillableCatalogService,
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

export const getNextNumber = asyncHandler(async (req, res) => {
  const nextInvoiceNumber = await getNextInvoiceNumberService();
  return successResponse(res, 200, "Next invoice number fetched successfully", { nextInvoiceNumber });
});

export const getPatientEncounters = asyncHandler(async (req, res) => {
  const encounters = await getPatientEncountersService(req.params.patientId);
  return successResponse(res, 200, "Patient encounters fetched successfully", encounters);
});

export const getCatalog = asyncHandler(async (req, res) => {
  const catalog = await getBillableCatalogService(req.query.category);
  return successResponse(res, 200, "Billable catalog items fetched successfully", catalog);
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

export const voidInvoiceController = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const { voidReason, authCode } = req.body;
  const result = await voidInvoiceService(req.params.id, voidReason, authCode, req.user, meta);
  return successResponse(res, 200, result.message, result.invoice);
});

export const refundInvoiceController = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const { refundAmount, refundReason, refundMethod } = req.body;
  const result = await refundInvoiceService(req.params.id, refundAmount, refundReason, refundMethod, req.user, meta);
  return successResponse(res, 200, result.message, result.invoice);
});