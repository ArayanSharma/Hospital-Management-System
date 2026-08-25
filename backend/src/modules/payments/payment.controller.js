import { createPayment, getAllPayments, getPaymentsByInvoice, getPaymentById } from "./payment.service.js";
import { successResponse } from "../../core/responses/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";

export const create = asyncHandler(async (req, res) => {
  const meta = getRequestMeta(req);
  const payment = await createPayment(req.body, req.user, meta);
  return successResponse(res, 201, "Payment recorded successfully", payment);
});

export const getAll = asyncHandler(async (req, res) => {
  const result = await getAllPayments(req.query);
  return successResponse(res, 200, "Payments fetched successfully", result);
});

export const getByInvoice = asyncHandler(async (req, res) => {
  const payments = await getPaymentsByInvoice(req.params.invoiceId);
  return successResponse(res, 200, "Payments fetched successfully", payments);
});

export const getById = asyncHandler(async (req, res) => {
  const payment = await getPaymentById(req.params.id);
  return successResponse(res, 200, "Payment fetched successfully", payment);
});