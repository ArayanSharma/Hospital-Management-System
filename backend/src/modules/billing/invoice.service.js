import Invoice from "./invoice.model.js";
import Patient from "../patients/patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

// ---------------- CREATE ----------------
export const createInvoice = async (data, currentUser, requestMeta) => {
  const { patientId, items, discount = 0, tax = 0, dueDate } = data;

  const patient = await Patient.findById(patientId);
  if (!patient || patient.status === "inactive") {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  // Har item ka amount calculate karo, subtotal nikalo
  const processedItems = items.map((item) => ({
    ...item,
    amount: item.unitPrice * (item.quantity || 1),
  }));

  const subtotal = processedItems.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal - discount + tax;

  if (total < 0) {
    throw new AppError("Total amount cannot be negative", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const invoiceNumber = await generateSequentialId(Invoice, "INV", "invoiceNumber");

  const invoice = await Invoice.create({
    invoiceNumber,
    patientId,
    items: processedItems,
    subtotal,
    discount,
    tax,
    total,
    amountPaid: 0,
    status: "unpaid",
    dueDate,
  });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "invoice",
    resourceId: invoice._id,
    newValue: invoice.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return invoice;
};

// ---------------- GET ALL ----------------
export const getAllInvoices = async ({ page = 1, limit = 10, patientId, status }) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .populate("patientId", "name patientId phone")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Invoice.countDocuments(query),
  ]);

  return {
    invoices,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

// ---------------- GET BY ID ----------------
export const getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id).populate("patientId", "name patientId phone address");
  if (!invoice) {
    throw new AppError("Invoice not found", 404, ErrorCodes.NOT_FOUND);
  }
  return invoice;
};

// ---------------- INTERNAL: amountPaid update karna (Payment module se call hoga) ----------------
export const updateInvoicePaymentStatus = async (invoiceId, paidAmount, session = null) => {
  const invoice = await Invoice.findById(invoiceId).session(session);
  if (!invoice) {
    throw new AppError("Invoice not found", 404, ErrorCodes.NOT_FOUND);
  }

  invoice.amountPaid += paidAmount;

  if (invoice.amountPaid >= invoice.total) {
    invoice.status = "paid";
  } else if (invoice.amountPaid > 0) {
    invoice.status = "partially-paid";
  }

  await invoice.save({ session });
  return invoice;
};

// ---------------- CANCEL ----------------
export const cancelInvoice = async (id, currentUser, requestMeta) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw new AppError("Invoice not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (invoice.amountPaid > 0) {
    throw new AppError(
      "Cannot cancel an invoice with payments already made",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const oldValue = invoice.toObject();
  invoice.status = "cancelled";
  await invoice.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "invoice",
    resourceId: invoice._id,
    oldValue,
    newValue: invoice.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return { message: "Invoice cancelled successfully" };
};