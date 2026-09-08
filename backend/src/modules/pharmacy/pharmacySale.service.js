import mongoose from "mongoose";
import PharmacySale from "./pharmacySale.model.js";
import Medicine from "./medicine.model.js";
import InventoryItem from "../inventory/inventoryItem.model.js";
import { stockOut } from "../inventory/inventoryItem.service.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";
import { notifyPharmacySaleEvent } from "../../utils/notificationDispatcher.js";

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

  const lockKey = `hms:lock:pharmsale:${invNo}`;
  const hasLock = await acquireLock(lockKey, 10);
  if (!hasLock) {
    throw new AppError("A pharmacy POS sale with this invoice number is currently being processed", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
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

    await invalidatePattern("hms:pharmacy:*");
    await invalidatePattern("hms:route:pharmacy*");

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

    if (patientId) {
      await notifyPharmacySaleEvent({
        userId: patientId,
        saleId: saleRecord._id,
        invoiceNo: invNo,
        totalAmount: saleRecord.grandTotal,
      });
    }

    return saleRecord;
  } finally {
    await releaseLock(lockKey);
  }
};

export const getAllPharmacySales = async ({ page = 1, limit = 10, patientId, paymentStatus }) => {
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
  const { data: sale } = await getOrSetCache(
    `hms:pharmacy:sale:${id}`,
    () =>
      PharmacySale.findById(id)
        .populate("patientId", "name patientId phone")
        .populate("soldBy", "name")
        .populate("medicines.medicineId", "name unit"),
    600
  );

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

  await delCache(`hms:pharmacy:sale:${id}`);
  await invalidatePattern("hms:pharmacy:*");
  await invalidatePattern("hms:route:pharmacy*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "pharmacy_sale",
      resourceId: sale._id,
      oldValue,
      newValue: sale.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return sale;
};