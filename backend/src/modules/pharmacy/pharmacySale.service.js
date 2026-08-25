import mongoose from "mongoose";
import PharmacySale from "./pharmacySale.model.js";
import Medicine from "./medicine.model.js";
import InventoryItem from "../inventory/inventoryItem.model.js";
import { stockOut } from "../inventory/inventoryItem.service.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createPharmacySale = async (data, currentUser, requestMeta) => {
  const { patientId, prescriptionId, medicines } = data;

  // 1. Har medicine item ke liye validate karo aur subtotal calculate karo
  const saleItems = [];
  let totalAmount = 0;

  for (const item of medicines) {
    const { medicineId, inventoryItemId, quantity } = item;

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      throw new AppError(`Medicine not found: ${medicineId}`, 404, ErrorCodes.NOT_FOUND);
    }

    const inventoryItem = await InventoryItem.findById(inventoryItemId);
    if (!inventoryItem) {
      throw new AppError(`Inventory item not found: ${inventoryItemId}`, 404, ErrorCodes.NOT_FOUND);
    }

    if (inventoryItem.quantity < quantity) {
      throw new AppError(
        `Insufficient stock for ${medicine.name}. Available: ${inventoryItem.quantity}`,
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const subtotal = medicine.price * quantity;
    totalAmount += subtotal;

    saleItems.push({
      medicineId,
      inventoryItemId,
      quantity,
      unitPrice: medicine.price,
      subtotal,
    });
  }

  // 2. Transaction: Sale create + Stock deduct — ek saath ya kuch bhi nahi
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sale = await PharmacySale.create(
      [
        {
          patientId: patientId || null,
          prescriptionId: prescriptionId || null,
          medicines: saleItems,
          totalAmount,
          paymentStatus: "pending",
          soldBy: currentUser.id,
        },
      ],
      { session }
    );

    // Har medicine ke liye stock deduct karo
    for (const item of saleItems) {
      await stockOut(item.inventoryItemId, item.quantity, session);
    }

    await session.commitTransaction();
    session.endSession();

    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "pharmacy_sale",
      resourceId: sale[0]._id,
      newValue: sale[0].toObject(),
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    });

    return sale[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const getAllPharmacySales = async ({ page = 1, limit = 10, patientId, paymentStatus }) => {
  const query = {};
  if (patientId) query.patientId = patientId;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const skip = (page - 1) * limit;

  const [sales, total] = await Promise.all([
    PharmacySale.find(query)
      .populate("patientId", "name patientId")
      .populate("soldBy", "name")
      .populate("medicines.medicineId", "name unit")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    PharmacySale.countDocuments(query),
  ]);

  return {
    sales,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
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