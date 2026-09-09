import mongoose from "mongoose";
import Invoice from "./invoice.model.js";
import Patient from "../patients/patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";
import { getOrSetCache, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";
import { notifyInvoiceEvent } from "../../utils/notificationDispatcher.js";
import { dispatchAsyncEmail } from "../../utils/email/emailDispatcher.js";

// ---------------- GET NEXT INVOICE NUMBER ----------------
export const getNextInvoiceNumberService = async () => {
  const count = await Invoice.countDocuments();
  const nextSeq = (count + 1).toString().padStart(6, "0");
  return `INV-2026-${nextSeq}`;
};

// ---------------- GET PATIENT ENCOUNTERS ----------------
export const getPatientEncountersService = async (patientId) => {
  let patient = null;
  if (patientId && mongoose.Types.ObjectId.isValid(patientId)) {
    patient = await Patient.findById(patientId);
  }
  if (!patient) {
    patient = await Patient.findOne({ status: "active" });
  }

  return {
    patientId: patient ? patient._id : null,
    patientName: patient ? patient.name : "",
    uhid: patient ? (patient.patientId || patient.uhid || "") : "",
    encounters: patient ? [
      {
        id: `VIS-${patient.patientId || "2026"}-01`,
        label: `VIS-${patient.patientId || "2026"}-01 (OPD Visit)`,
        visitType: "OPD",
        department: "Radiology",
        referredBy: "Dr. Vikram Patel",
      },
    ] : [],
  };
};

// ---------------- GET BILLABLE CATALOG WITH REDIS CACHE ----------------
export const getBillableCatalogService = async (category = "Radiology & Imaging") => {
  const cacheKey = `hms:billing:catalog:${category}`;

  const { data: items } = await getOrSetCache(
    cacheKey,
    async () => {
      const catalogData = {
        "Radiology & Imaging": [
          { description: "X-Ray Chest PA View", code: "RAD-2026-0012", sourceReference: "RAD-2026-0012", department: "Radiology", quantity: 1, unitPrice: 600, discount: 0, taxPercent: 12 },
          { description: "Ultrasound Whole Abdomen", code: "RAD-2026-0013", sourceReference: "RAD-2026-0013", department: "Radiology", quantity: 1, unitPrice: 1200, discount: 0, taxPercent: 12 },
          { description: "MRI Knee Joint", code: "RAD-2026-0014", sourceReference: "RAD-2026-0014", department: "Radiology", quantity: 1, unitPrice: 4000, discount: 200, taxPercent: 12 },
        ],
        "Lab Tests": [
          { description: "Complete Blood Count (CBC)", code: "LAB-2026-0101", sourceReference: "LAB-2026-0101", department: "Lab", quantity: 1, unitPrice: 450, discount: 0, taxPercent: 5 },
          { description: "Thyroid Profile (T3, T4, TSH)", code: "LAB-2026-0102", sourceReference: "LAB-2026-0102", department: "Lab", quantity: 1, unitPrice: 850, discount: 50, taxPercent: 5 },
        ],
        "Pharmacy & Medicines": [
          { description: "Paracetamol 650mg (Strip of 15)", code: "MED-2026-0501", sourceReference: "MED-2026-0501", department: "Pharmacy", quantity: 1, unitPrice: 45, discount: 0, taxPercent: 12 },
          { description: "Amoxicillin 500mg (Strip of 10)", code: "MED-2026-0502", sourceReference: "MED-2026-0502", department: "Pharmacy", quantity: 1, unitPrice: 120, discount: 10, taxPercent: 12 },
        ],
        "Consultation": [
          { description: "OPD Specialist Doctor Consultation", code: "CON-2026-001", sourceReference: "CON-2026-001", department: "OPD", quantity: 1, unitPrice: 800, discount: 0, taxPercent: 0 },
        ],
        "Room & Bed": [
          { description: "General Ward Bed Charge (Per Day)", code: "BED-2026-101", sourceReference: "BED-2026-101", department: "Room Stay", quantity: 1, unitPrice: 1500, discount: 0, taxPercent: 5 },
        ],
        "Surgeries & Others": [
          { description: "Laparoscopic Appendectomy Surgery", code: "SURG-2026-301", sourceReference: "SURG-2026-301", department: "Surgery", quantity: 1, unitPrice: 45000, discount: 2000, taxPercent: 12 },
        ],
      };

      return catalogData[category] || catalogData["Radiology & Imaging"];
    },
    86400 // 24 Hours TTL
  );

  return items || [];
};

// ---------------- CREATE INVOICE ----------------
export const createInvoice = async (data, currentUser, requestMeta) => {
  const {
    patientId,
    patientName,
    uhid,
    items,
    discount = 0,
    roundOff = 0,
    paymentTerms = "Immediate",
    dueDate,
    notes,
    departments,
    visitEncounter,
    visitType,
    referredBy,
  } = data;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError("Add at least one billable item.", 400, ErrorCodes.VALIDATION_ERROR);
  }

  let patient = null;
  if (patientId && mongoose.Types.ObjectId.isValid(patientId)) {
    patient = await Patient.findById(patientId);
  }
  if (!patient && patientName) {
    patient = await Patient.findOne({ name: new RegExp(patientName.split(" ")[0], "i") });
  }
  if (!patient) {
    patient = await Patient.findOne({ status: "active" });
  }
  if (!patient) {
    patient = await Patient.create({
      name: patientName || "Priya Verma",
      patientId: uhid || "UHID12346",
      phone: "9123456780",
      gender: "Female",
      dateOfBirth: new Date("1996-08-20"),
    });
  }

  const processedItems = items.map((item) => {
    const qty = Number(item.quantity || 1);
    const price = Number(item.unitPrice || 0);
    const itemDisc = Number(item.discount || 0);
    const taxPct = Number(item.taxPercent !== undefined ? item.taxPercent : 12);

    if (qty <= 0 || price < 0 || itemDisc < 0) {
      throw new AppError("Quantity must be greater than 0, and price/discount cannot be negative.", 400, ErrorCodes.VALIDATION_ERROR);
    }

    const baseAmount = (price * qty) - itemDisc;
    const calcTax = (baseAmount * taxPct) / 100;
    const finalItemAmount = baseAmount + calcTax;

    return {
      description: item.description,
      code: item.code || "",
      sourceReference: item.sourceReference || item.code || "",
      department: item.department || "Radiology",
      quantity: qty,
      unitPrice: price,
      discount: itemDisc,
      taxPercent: taxPct,
      amount: Math.max(0, finalItemAmount),
    };
  });

  const rawSubtotal = processedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalItemDiscount = processedItems.reduce((sum, item) => sum + item.discount, 0) + Number(discount || 0);

  if (totalItemDiscount > rawSubtotal) {
    throw new AppError(`Discount (₹${totalItemDiscount.toFixed(2)}) cannot exceed subtotal (₹${rawSubtotal.toFixed(2)}).`, 400, ErrorCodes.VALIDATION_ERROR);
  }

  const taxableAmount = Math.max(0, rawSubtotal - totalItemDiscount);

  const gstAmount = processedItems.reduce((sum, item) => {
    const base = (item.unitPrice * item.quantity) - item.discount;
    return sum + Math.max(0, (base * item.taxPercent) / 100);
  }, 0);

  const calculatedTotal = taxableAmount + gstAmount + Number(roundOff || 0);

  if (calculatedTotal <= 0) {
    throw new AppError("Invoice grand total must be greater than 0.", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const invoiceNumber = await generateSequentialId(Invoice, "INV-2026", "invoiceNumber");

  const deptList = Array.isArray(departments) && departments.length > 0
    ? departments
    : Array.from(new Set(processedItems.map((i) => i.department || "Radiology")));

  const initialStatus = "unpaid";
  const initialPaid = 0;
  const initialDue = calculatedTotal;

  const invoice = await Invoice.create({
    invoiceNumber,
    patientId: patient._id,
    patientName: patientName || patient.name,
    patientPhone: patient.phone || "9123456780",
    uhid: uhid || patient.patientId,
    visitEncounter: visitEncounter || "VIS-2026-04568",
    visitType: visitType || "OPD",
    referredBy: referredBy || "Dr. Vikram Patel",
    paymentTerms: paymentTerms || "Immediate",
    departments: deptList,
    items: processedItems,
    subtotal: rawSubtotal,
    discount: totalItemDiscount,
    taxableAmount,
    gstAmount,
    roundOff: Number(roundOff || 0),
    tax: gstAmount,
    total: calculatedTotal,
    amountPaid: initialPaid,
    dueAmount: initialDue,
    status: initialStatus,
    notes: notes || "",
    dueDate: dueDate ? new Date(dueDate) : new Date(),
  });

  await delCache("hms:stats:billing:summary");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "invoice",
      resourceId: invoice._id,
      newValue: invoice.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  if (patient) {
    await notifyInvoiceEvent({
      userId: patient.userId || patient._id,
      invoiceNo: invoice.invoiceNumber,
      grandTotal: invoice.total,
      status: "generated",
    });

    if (patient.email) {
      dispatchAsyncEmail({
        to: patient.email,
        type: "invoice_generated",
        data: {
          invoiceNo: invoice.invoiceNumber,
          patientName: patient.name,
          items: invoice.items,
          subtotal: invoice.subtotal,
          taxAmount: invoice.gstAmount || invoice.tax,
          grandTotal: invoice.total,
          dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB"),
          paymentTerms: invoice.paymentTerms,
        },
      });
    }
  }

  return invoice;
};


// ---------------- GET ALL INVOICES ----------------
export const getAllInvoices = async ({
  page = 1,
  limit = 10,
  patientId,
  status,
  department,
  search,
  fromDate,
  toDate,
}) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (status && status !== "all") query.status = status;
  if (department && department !== "all") {
    query.departments = { $in: [department] };
  }

  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      query.createdAt.$gte = start;
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  const safeSearch = search ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";

  if (safeSearch) {
    const searchRegex = new RegExp(safeSearch, "i");
    query.$or = [
      { invoiceNumber: searchRegex },
      { patientName: searchRegex },
      { patientPhone: searchRegex },
      { uhid: searchRegex },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [invoices, totalCount] = await Promise.all([
    Invoice.find(query)
      .populate("patientId", "name patientId phone gender dateOfBirth")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Invoice.countDocuments(query),
  ]);

  // High-performance Redis cached stats calculation (eliminates full DB table scans)
  const { data: cachedStats } = await getOrSetCache(
    "hms:stats:billing:summary",
    async () => {
      const summaryStats = await Invoice.aggregate([
        {
          $group: {
            _id: null,
            totalInvoices: { $sum: 1 },
            totalBilledAmount: {
              $sum: { $cond: [{ $ne: ["$status", "cancelled"] }, "$total", 0] },
            },
            totalPaidAmount: {
              $sum: { $cond: [{ $ne: ["$status", "cancelled"] }, "$amountPaid", 0] },
            },
            totalOutstandingAmount: {
              $sum: { $cond: [{ $ne: ["$status", "cancelled"] }, "$dueAmount", 0] },
            },
            paidCount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
            partiallyPaidCount: { $sum: { $cond: [{ $eq: ["$status", "partially-paid"] }, 1, 0] } },
            unpaidCount: { $sum: { $cond: [{ $eq: ["$status", "unpaid"] }, 1, 0] } },
            cancelledCount: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
          },
        },
      ]);

      const s = summaryStats[0] || {
        totalInvoices: 0,
        totalBilledAmount: 0,
        totalPaidAmount: 0,
        totalOutstandingAmount: 0,
        paidCount: 0,
        partiallyPaidCount: 0,
        unpaidCount: 0,
        cancelledCount: 0,
      };

      const totalAll = s.totalInvoices || 1;

      return {
        stats: {
          totalInvoices: s.totalInvoices,
          totalBilledAmount: s.totalBilledAmount,
          totalPaidAmount: s.totalPaidAmount,
          totalOutstandingAmount: s.totalOutstandingAmount,
        },
        statusSummary: {
          paid: { count: s.paidCount, percentage: Number(((s.paidCount / totalAll) * 100).toFixed(1)) },
          partiallyPaid: { count: s.partiallyPaidCount, percentage: Number(((s.partiallyPaidCount / totalAll) * 100).toFixed(1)) },
          unpaid: { count: s.unpaidCount, percentage: Number(((s.unpaidCount / totalAll) * 100).toFixed(1)) },
          cancelled: { count: s.cancelledCount, percentage: Number(((s.cancelledCount / totalAll) * 100).toFixed(1)) },
        },
      };
    },
    900 // 15 mins TTL
  );

  return {
    invoices,
    stats: cachedStats?.stats || {
      totalInvoices: totalCount,
      totalBilledAmount: 0,
      totalPaidAmount: 0,
      totalOutstandingAmount: 0,
    },
    statusSummary: cachedStats?.statusSummary || {
      paid: { count: 0, percentage: 0 },
      partiallyPaid: { count: 0, percentage: 0 },
      unpaid: { count: 0, percentage: 0 },
      cancelled: { count: 0, percentage: 0 },
    },
    pagination: {
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / Number(limit)) || 1,
    },
  };
};


// ---------------- GET BY ID ----------------
export const getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id).populate("patientId", "name patientId phone address dateOfBirth gender");
  if (!invoice) {
    throw new AppError("Invoice not found", 404, ErrorCodes.NOT_FOUND);
  }
  return invoice;
};

// ---------------- UPDATE PAYMENT STATUS WITH REDIS LOCK ----------------
export const updateInvoicePaymentStatus = async (invoiceId, paidAmount, session = null) => {
  const lockKey = `hms:lock:invoice:${invoiceId}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A payment transaction for this invoice is currently processing", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const invoice = await Invoice.findById(invoiceId).session(session);
    if (!invoice) {
      throw new AppError("Invoice not found", 404, ErrorCodes.NOT_FOUND);
    }

    if (invoice.status === "cancelled") {
      throw new AppError("Invoice cancelled — editing and payment collection disabled.", 400, ErrorCodes.VALIDATION_ERROR);
    }

    if (invoice.status === "paid") {
      throw new AppError("Invoice is already fully paid.", 400, ErrorCodes.VALIDATION_ERROR);
    }

    const currentOutstanding = invoice.total - (invoice.amountPaid || 0);

    if (paidAmount > currentOutstanding + 0.01) {
      throw new AppError(`Payment (₹${paidAmount.toFixed(2)}) cannot exceed outstanding balance (₹${currentOutstanding.toFixed(2)}).`, 400, ErrorCodes.VALIDATION_ERROR);
    }

    invoice.amountPaid = (invoice.amountPaid || 0) + Number(paidAmount);
    invoice.dueAmount = Math.max(0, invoice.total - invoice.amountPaid);

    if (invoice.amountPaid >= invoice.total - 0.01) {
      invoice.status = "paid";
      invoice.dueAmount = 0;
    } else if (invoice.amountPaid > 0) {
      invoice.status = "partially-paid";
    }

    await invoice.save({ session });
    await delCache("hms:stats:billing:summary");

    if (invoice.patientId) {
      await notifyInvoiceEvent({
        userId: invoice.patientId,
        invoiceNo: invoice.invoiceNumber,
        grandTotal: invoice.total,
        status: invoice.status,
      });
    }

    return invoice;
  } finally {
    await releaseLock(lockKey);
  }
};

// ---------------- CANCEL INVOICE ----------------
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
  await delCache("hms:stats:billing:summary");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser?.id,
      action: "UPDATE",
      resource: "invoice",
      resourceId: invoice._id,
      oldValue,
      newValue: invoice.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return { message: "Invoice cancelled successfully", invoice };
};

// ---------------- VOID / CANCEL INVOICE WITH AUDIT ----------------
export const voidInvoiceService = async (id, voidReason, authCode, currentUser, requestMeta) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw new AppError("Invoice not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = invoice.toObject();
  invoice.status = "cancelled";
  invoice.cancellationInfo = {
    reason: voidReason || "Admin Void Request",
    cancelledBy: currentUser?.name || "Billing Supervisor (Admin)",
    authCode: authCode || "AUTH-VOID",
    cancelledAt: new Date(),
  };

  await invoice.save();
  await delCache("hms:stats:billing:summary");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser?.id,
      action: "VOID_INVOICE",
      resource: "invoice",
      resourceId: invoice._id,
      oldValue,
      newValue: invoice.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return { message: `Invoice ${invoice.invoiceNumber} voided successfully`, invoice };
};

// ---------------- REFUND INVOICE ----------------
export const refundInvoiceService = async (id, refundAmount, refundReason, refundMethod, currentUser, requestMeta) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw new AppError("Invoice not found", 404, ErrorCodes.NOT_FOUND);
  }

  const refAmt = Number(refundAmount || 0);
  if (refAmt <= 0) {
    throw new AppError("Refund amount must be greater than 0", 400, ErrorCodes.VALIDATION_ERROR);
  }

  if (refAmt > (invoice.amountPaid || 0)) {
    throw new AppError(`Refund amount (₹${refAmt}) cannot exceed paid amount (₹${invoice.amountPaid})`, 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = invoice.toObject();
  invoice.amountPaid = Math.max(0, (invoice.amountPaid || 0) - refAmt);
  invoice.dueAmount = Math.max(0, invoice.total - invoice.amountPaid);

  if (invoice.amountPaid <= 0) {
    invoice.status = "unpaid";
  } else if (invoice.amountPaid < invoice.total) {
    invoice.status = "partially-paid";
  }

  invoice.refundHistory = invoice.refundHistory || [];
  invoice.refundHistory.push({
    refundAmount: refAmt,
    refundReason: refundReason || "Patient Request",
    refundMethod: refundMethod || "Cash",
    processedBy: currentUser?.name || "Billing Admin",
    date: new Date(),
  });

  await invoice.save();
  await delCache("hms:stats:billing:summary");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser?.id,
      action: "REFUND_INVOICE",
      resource: "invoice",
      resourceId: invoice._id,
      oldValue,
      newValue: invoice.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return { message: `Refund of ₹${refAmt} processed successfully for ${invoice.invoiceNumber}`, invoice };
};