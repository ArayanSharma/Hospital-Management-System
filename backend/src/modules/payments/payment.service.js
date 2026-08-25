import mongoose from "mongoose";
import Payment from "./payment.model.js";
import Invoice from "../billing/invoice.model.js";
import { updateInvoicePaymentStatus } from "../billing/invoice.service.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

// ---------------- CREATE (Payment + Invoice update — transaction) ----------------
export const createPayment = async (data, currentUser, requestMeta) => {
  const { invoiceId, amount, method, transactionId } = data;

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    throw new AppError("Invoice not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (invoice.status === "cancelled") {
    throw new AppError("Cannot pay a cancelled invoice", 400, ErrorCodes.VALIDATION_ERROR);
  }
  if (invoice.status === "paid") {
    throw new AppError("Invoice is already fully paid", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const remainingAmount = invoice.total - invoice.amountPaid;
  if (amount > remainingAmount) {
    throw new AppError(
      `Payment amount exceeds remaining balance. Remaining: ${remainingAmount}`,
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.create(
      [
        {
          invoiceId,
          patientId: invoice.patientId,
          amount,
          method,
          transactionId,
          status: "success",
          receivedBy: currentUser.id,
        },
      ],
      { session }
    );

    await updateInvoicePaymentStatus(invoiceId, amount, session);

    await session.commitTransaction();
    session.endSession();

    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "payment",
      resourceId: payment[0]._id,
      newValue: payment[0].toObject(),
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    });

    return payment[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// ---------------- GET ALL ----------------
export const getAllPayments = async ({ page = 1, limit = 10, patientId, invoiceId, method }) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (invoiceId) query.invoiceId = invoiceId;
  if (method) query.method = method;

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate("patientId", "name patientId")
      .populate("invoiceId", "invoiceNumber total")
      .populate("receivedBy", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Payment.countDocuments(query),
  ]);

  return {
    payments,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

// ---------------- GET BY INVOICE (payment history) ----------------
export const getPaymentsByInvoice = async (invoiceId) => {
  return Payment.find({ invoiceId }).populate("receivedBy", "name").sort({ createdAt: -1 });
};

// ---------------- GET BY ID ----------------
export const getPaymentById = async (id) => {
  const payment = await Payment.findById(id)
    .populate("patientId", "name patientId phone")
    .populate("invoiceId", "invoiceNumber total")
    .populate("receivedBy", "name");

  if (!payment) {
    throw new AppError("Payment not found", 404, ErrorCodes.NOT_FOUND);
  }

  return payment;
};