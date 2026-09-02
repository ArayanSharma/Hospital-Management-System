import mongoose from "mongoose";
import PharmacySale from "./pharmacySale.model.js";
import Medicine from "./medicine.model.js";
import InventoryItem from "../inventory/inventoryItem.model.js";
import { stockOut } from "../inventory/inventoryItem.service.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createPharmacySale = async (data, currentUser, requestMeta) => {
  const {
    invoiceNo,
    customerType,
    customerName,
    mobileNumber,
    prescriptionNo,
    patientId,
    medicines,
    totalItems,
    totalQuantity,
    subTotal,
    discountAmount,
    gstAmount,
    totalAmount,
    grandTotal,
    paymentMethod,
    amountReceived,
    changeAmount,
    notes,
    paymentStatus,
    printInvoice,
  } = data;

  const invNo = invoiceNo || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const saleItems = (medicines || []).map((m) => ({
    medicineId: m.medicineId || m.id,
    medicineName: m.name || m.medicineName || m.medicine,
    batchNo: m.batchNo || m.batch,
    expiryDate: m.expiryDate || m.expiry,
    quantity: Number(m.quantity || m.qty || 1),
    unit: m.unit || "Strip",
    unitPrice: Number(m.unitPrice || m.price || 0),
    amount: Number(m.amount || m.subtotal || (m.unitPrice || m.price || 0) * (m.quantity || m.qty || 1)),
  }));

  const calcSubTotal = saleItems.reduce((sum, item) => sum + item.amount, 0);
  const calcGst = calcSubTotal * 0.12;
  const calcGrandTotal = calcSubTotal + calcGst - Number(discountAmount || 0);

  const saleRecord = await PharmacySale.create({
    invoiceNo: invNo,
    customerType: customerType || "Walk-in Customer",
    customerName: customerName || "Walk-in Customer",
    mobileNumber,
    prescriptionNo,
    patientId: patientId || null,
    medicines: saleItems,
    totalItems: totalItems || saleItems.length,
    totalQuantity: totalQuantity || saleItems.reduce((acc, it) => acc + it.quantity, 0),
    subTotal: Number(subTotal || calcSubTotal),
    discountAmount: Number(discountAmount || 0),
    gstAmount: Number(gstAmount || calcGst),
    totalAmount: Number(totalAmount || grandTotal || calcGrandTotal),
    grandTotal: Number(grandTotal || calcGrandTotal),
    paymentMethod: paymentMethod || "Cash",
    amountReceived: Number(amountReceived || 0),
    changeAmount: Number(changeAmount || 0),
    notes,
    paymentStatus: paymentStatus || "paid",
    printInvoice: Boolean(printInvoice),
    soldBy: currentUser?.id,
  });

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "pharmacy_sale",
      resourceId: saleRecord._id,
      newValue: saleRecord.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return saleRecord;
};

export const getAllPharmacySales = async ({ page = 1, limit = 10, patientId, paymentStatus }) => {
  const count = await PharmacySale.countDocuments();
  if (count === 0) {
    await PharmacySale.insertMany([
      {
        invoiceNo: "INV-2026-0001",
        customerType: "Walk-in Customer",
        customerName: "Rahul Sharma",
        mobileNumber: "9876543210",
        medicines: [
          { medicineName: "Paracetamol 650mg", batchNo: "PCM650", expiryDate: "2027-05-31", quantity: 2, unit: "Strip", unitPrice: 30, amount: 60 },
          { medicineName: "Amoxicillin 500mg", batchNo: "AMX500", expiryDate: "2026-11-30", quantity: 1, unit: "Strip", unitPrice: 120, amount: 120 },
        ],
        totalItems: 2,
        totalQuantity: 3,
        subTotal: 180,
        gstAmount: 21.6,
        totalAmount: 201.6,
        grandTotal: 201.6,
        paymentMethod: "UPI",
        paymentStatus: "paid",
      },
      {
        invoiceNo: "INV-2026-0002",
        customerType: "OPD Patient",
        customerName: "Anjali Mehta",
        mobileNumber: "9823456789",
        medicines: [
          { medicineName: "Pantoprazole 40mg", batchNo: "PAN400", expiryDate: "2027-08-31", quantity: 3, unit: "Strip", unitPrice: 85, amount: 255 },
        ],
        totalItems: 1,
        totalQuantity: 3,
        subTotal: 255,
        gstAmount: 30.6,
        totalAmount: 285.6,
        grandTotal: 285.6,
        paymentMethod: "Cash",
        paymentStatus: "paid",
      },
      {
        invoiceNo: "INV-2026-0003",
        customerType: "IPD Patient",
        customerName: "Sanjay Kumar",
        mobileNumber: "9811223344",
        medicines: [
          { medicineName: "Cetirizine 10mg", batchNo: "CET100", expiryDate: "2026-09-30", quantity: 5, unit: "Strip", unitPrice: 40, amount: 200 },
        ],
        totalItems: 1,
        totalQuantity: 5,
        subTotal: 200,
        gstAmount: 24,
        totalAmount: 224,
        grandTotal: 224,
        paymentMethod: "Credit",
        paymentStatus: "pending",
      },
    ]);
  }

  const query = {};
  if (patientId) query.patientId = patientId;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [sales, total] = await Promise.all([
    PharmacySale.find(query)
      .populate("patientId", "name patientId")
      .populate("soldBy", "name")
      .populate("medicines.medicineId", "name unit")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }),
    PharmacySale.countDocuments(query),
  ]);

  return {
    sales,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) || 1 },
  };
};

export const getPharmacySaleById = async (id) => {
  const sale = await PharmacySale.findById(id)
    .populate("patientId", "name patientId phone")
    .populate("soldBy", "name")
    .populate("medicines.medicineId", "name unit");

  if (!sale) {
    throw new AppError("Pharmacy sale not found", 404, ErrorCodes.NOT_FOUND);
  }

  return sale;
};

export const markSaleAsPaid = async (id, currentUser, requestMeta) => {
  const sale = await PharmacySale.findById(id);
  if (!sale) {
    throw new AppError("Pharmacy sale not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (sale.paymentStatus === "paid") {
    throw new AppError("Sale is already marked as paid", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = sale.toObject();
  sale.paymentStatus = "paid";
  await sale.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "pharmacy_sale",
    resourceId: sale._id,
    oldValue,
    newValue: sale.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return sale;
};