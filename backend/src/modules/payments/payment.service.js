import mongoose from "mongoose";
import Payment from "./payment.model.js";
import Invoice from "../billing/invoice.model.js";
import { updateInvoicePaymentStatus } from "../billing/invoice.service.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

// ---------------- CREATE PAYMENT (Payment + Invoice update transaction) ----------------
export const createPayment = async (data, currentUser, requestMeta) => {
  const { invoiceId, amount, method, transactionId, notes, paymentDate } = data;

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new AppError("Payment amount must be a positive number", 400, ErrorCodes.VALIDATION_ERROR);
  }

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

  const currentDue = invoice.total - (invoice.amountPaid || 0);
  if (numericAmount > currentDue + 0.01) {
    throw new AppError(
      `Payment amount exceeds remaining balance. Remaining due: ₹${currentDue.toFixed(2)}`,
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const receiptNumber = await generateSequentialId(Payment, `RCP-2025`, "receiptNumber");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const payment = await Payment.create(
      [
        {
          receiptNumber,
          invoiceId,
          patientId: invoice.patientId,
          amount: numericAmount,
          method: method ? method.toLowerCase() : "cash",
          transactionId: transactionId || null,
          notes: notes || "",
          status: "success",
          receivedBy: currentUser.id,
          paidAt: paymentDate ? new Date(paymentDate) : new Date(),
        },
      ],
      { session }
    );

    await updateInvoicePaymentStatus(invoiceId, numericAmount, session);

    await session.commitTransaction();
    session.endSession();

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "CREATE",
        resource: "payment",
        resourceId: payment[0]._id,
        newValue: payment[0].toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }

    const populatedPayment = await Payment.findById(payment[0]._id)
      .populate("patientId", "name patientId phone dateOfBirth gender")
      .populate("invoiceId", "invoiceNumber total amountPaid dueAmount items departments")
      .populate("receivedBy", "name");

    return populatedPayment;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// ---------------- GET ALL PAYMENTS ----------------
export const getAllPayments = async ({ page = 1, limit = 10, patientId, invoiceId, method }) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (invoiceId) query.invoiceId = invoiceId;
  if (method) query.method = method;

  const skip = (Number(page) - 1) * Number(limit);

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate("patientId", "name patientId phone")
      .populate("invoiceId", "invoiceNumber total amountPaid status")
      .populate("receivedBy", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Payment.countDocuments(query),
  ]);

  return {
    payments,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  };
};

// ---------------- GET BY INVOICE ----------------
export const getPaymentsByInvoice = async (invoiceId) => {
  return Payment.find({ invoiceId })
    .populate("patientId", "name patientId phone")
    .populate("invoiceId", "invoiceNumber total amountPaid dueAmount")
    .populate("receivedBy", "name")
    .sort({ createdAt: -1 });
};

// ---------------- GET BY ID ----------------
export const getPaymentById = async (id) => {
  const payment = await Payment.findById(id)
    .populate("patientId", "name patientId phone dateOfBirth gender")
    .populate("invoiceId", "invoiceNumber total amountPaid dueAmount items departments")
    .populate("receivedBy", "name");

  if (!payment) {
    throw new AppError("Payment not found", 404, ErrorCodes.NOT_FOUND);
  }

  return payment;
};