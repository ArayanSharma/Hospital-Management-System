import mongoose from "mongoose";
import Invoice from "./invoice.model.js";
import Patient from "../patients/patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { generateSequentialId } from "../../utils/generateId.js";

// Helper to seed initial DB records if database count is 0
export const ensureSampleInvoices = async () => {
  try {
    const count = await Invoice.countDocuments();
    if (count > 0) return;

    let patient = await Patient.findOne({ status: "active" });
    if (!patient) {
      patient = await Patient.create({
        name: "Priya Verma",
        patientId: "UHID12346",
        phone: "9123456780",
        gender: "Female",
        dateOfBirth: new Date("1996-08-20"),
      });
    }

    const sampleInvoices = [
      {
        invoiceNumber: "INV-2026-000567",
        patientId: patient._id,
        patientName: "Rahul Sharma",
        patientPhone: "9876543210",
        uhid: "UHID12345",
        visitEncounter: "VIS-2026-04568",
        visitType: "OPD",
        referredBy: "Dr. Vikram Patel",
        paymentTerms: "Immediate",
        departments: ["OPD", "Lab", "Pharmacy"],
        items: [{ description: "OPD Consultation & Lab", code: "OPD-001", sourceReference: "VIS-2026-001", unitPrice: 2450, discount: 0, taxPercent: 0, amount: 2450, quantity: 1 }],
        subtotal: 2450,
        discount: 0,
        taxableAmount: 2450,
        gstAmount: 0,
        roundOff: 0,
        tax: 0,
        total: 2450,
        amountPaid: 2450,
        dueAmount: 0,
        status: "paid",
        createdAt: new Date("2026-08-31T10:00:00"),
      },
      {
        invoiceNumber: "INV-2026-000566",
        patientId: patient._id,
        patientName: "Priya Verma",
        patientPhone: "9123456780",
        uhid: "UHID12346",
        visitEncounter: "VIS-2026-04568",
        visitType: "OPD",
        referredBy: "Dr. Vikram Patel",
        paymentTerms: "Immediate",
        departments: ["Radiology", "Lab"],
        items: [
          { description: "X-Ray Chest PA View", code: "RAD-2026-0012", sourceReference: "RAD-2026-0012", unitPrice: 600, discount: 0, taxPercent: 12, amount: 672, quantity: 1 },
          { description: "Ultrasound Whole Abdomen", code: "RAD-2026-0013", sourceReference: "RAD-2026-0013", unitPrice: 1200, discount: 0, taxPercent: 12, amount: 1344, quantity: 1 },
          { description: "MRI Knee Joint", code: "RAD-2026-0014", sourceReference: "RAD-2026-0014", unitPrice: 4000, discount: 200, taxPercent: 12, amount: 4256, quantity: 1 },
        ],
        subtotal: 5800,
        discount: 200,
        taxableAmount: 5600,
        gstAmount: 672,
        roundOff: 0,
        tax: 672,
        total: 6272,
        amountPaid: 2000,
        dueAmount: 4272,
        status: "partially-paid",
        createdAt: new Date("2026-08-31T11:15:00"),
      },
    ];

    await Invoice.insertMany(sampleInvoices);
  } catch (err) {
    console.error("Error seeding sample invoices:", err);
  }
};

// ---------------- GET NEXT INVOICE NUMBER ----------------
export const getNextInvoiceNumberService = async () => {
  await ensureSampleInvoices();
  const count = await Invoice.countDocuments();
  const nextSeq = (count + 567).toString().padStart(6, "0");
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

// ---------------- GET BILLABLE CATALOG ----------------
export const getBillableCatalogService = async (category = "Radiology & Imaging") => {
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
  await ensureSampleInvoices();

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

  const [invoices, totalCount, allInvoices] = await Promise.all([
    Invoice.find(query)
      .populate("patientId", "name patientId phone gender dateOfBirth")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Invoice.countDocuments(query),
    Invoice.find({}),
  ]);

  let totalBilled = 0;
  let totalPaid = 0;
  let totalOutstanding = 0;
  let paidCount = 0;
  let partiallyPaidCount = 0;
  let unpaidCount = 0;
  let cancelledCount = 0;

  allInvoices.forEach((inv) => {
    if (inv.status !== "cancelled") {
      totalBilled += inv.total || 0;
      totalPaid += inv.amountPaid || 0;
      totalOutstanding += (inv.total - (inv.amountPaid || 0));
    }
    if (inv.status === "paid") paidCount++;
    else if (inv.status === "partially-paid") partiallyPaidCount++;
    else if (inv.status === "unpaid") unpaidCount++;
    else if (inv.status === "cancelled") cancelledCount++;
  });

  const totalAll = allInvoices.length || 1;

  return {
    invoices,
    stats: {
      totalInvoices: allInvoices.length,
      totalBilledAmount: totalBilled,
      totalPaidAmount: totalPaid,
      totalOutstandingAmount: totalOutstanding,
    },
    statusSummary: {
      paid: { count: paidCount, percentage: Number(((paidCount / totalAll) * 100).toFixed(1)) },
      partiallyPaid: { count: partiallyPaidCount, percentage: Number(((partiallyPaidCount / totalAll) * 100).toFixed(1)) },
      unpaid: { count: unpaidCount, percentage: Number(((unpaidCount / totalAll) * 100).toFixed(1)) },
      cancelled: { count: cancelledCount, percentage: Number(((cancelledCount / totalAll) * 100).toFixed(1)) },
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

// ---------------- UPDATE PAYMENT STATUS ----------------
export const updateInvoicePaymentStatus = async (invoiceId, paidAmount, session = null) => {
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
  return invoice;
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