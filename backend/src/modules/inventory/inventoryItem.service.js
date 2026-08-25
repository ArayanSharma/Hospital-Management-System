import InventoryItem from "./inventoryItem.model.js";
import Supplier from "../suppliers/supplier.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createInventoryItem = async (data, currentUser, requestMeta) => {
  const { itemName, category, quantity, unit, minimumStock, supplierId, batchNumber, expiryDate } = data;

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    throw new AppError("Supplier not found", 404, ErrorCodes.NOT_FOUND);
  }

  const item = await InventoryItem.create({
    itemName,
    category,
    quantity: quantity || 0,
    unit,
    minimumStock,
    supplierId,
    batchNumber,
    expiryDate,
  });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "inventory",
    resourceId: item._id,
    newValue: item.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return item;
};

export const getAllInventoryItems = async ({ page = 1, limit = 20, category, lowStock, search }) => {
  const query = { status: "active" };
  if (category) query.category = category;
  if (search) query.itemName = { $regex: search, $options: "i" };

  const skip = (page - 1) * limit;

  let items = await InventoryItem.find(query)
    .populate("supplierId", "name company")
    .skip(skip)
    .limit(limit)
    .sort({ itemName: 1 });

  // Low stock filter — Mongoose query mein field-to-field compare mushkil hai, isliye post-filter
  if (lowStock === "true") {
    items = items.filter((item) => item.quantity <= item.minimumStock);
  }

  const total = await InventoryItem.countDocuments(query);

  return {
    items,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

export const getInventoryItemById = async (id) => {
  const item = await InventoryItem.findById(id).populate("supplierId", "name company phone");
  if (!item) {
    throw new AppError("Inventory item not found", 404, ErrorCodes.NOT_FOUND);
  }
  return item;
};

// ---------------- STOCK IN (purchase se quantity badhana) ----------------
export const stockIn = async (id, addQuantity, currentUser, requestMeta) => {
  const item = await InventoryItem.findById(id);
  if (!item) {
    throw new AppError("Inventory item not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (addQuantity <= 0) {
    throw new AppError("Quantity to add must be positive", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const oldValue = item.toObject();
  item.quantity += addQuantity;
  await item.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "inventory",
    resourceId: item._id,
    oldValue,
    newValue: item.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return item;
};

// ---------------- STOCK OUT (internal use — Pharmacy sale se call hoga) ----------------
export const stockOut = async (id, removeQuantity, session = null) => {
  const item = await InventoryItem.findById(id).session(session);
  if (!item) {
    throw new AppError("Inventory item not found", 404, ErrorCodes.NOT_FOUND);
  }

  if (item.quantity < removeQuantity) {
    throw new AppError(
      `Insufficient stock for ${item.itemName}. Available: ${item.quantity}`,
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  item.quantity -= removeQuantity;
  await item.save({ session });

  return item;
};

export const updateInventoryItem = async (id, data, currentUser, requestMeta) => {
  const item = await InventoryItem.findById(id);
  if (!item) {
    throw new AppError("Inventory item not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = item.toObject();
  const { itemName, category, unit, minimumStock, supplierId, batchNumber, expiryDate, status } = data;

  if (itemName !== undefined) item.itemName = itemName;
  if (category !== undefined) item.category = category;
  if (unit !== undefined) item.unit = unit;
  if (minimumStock !== undefined) item.minimumStock = minimumStock;
  if (supplierId !== undefined) item.supplierId = supplierId;
  if (batchNumber !== undefined) item.batchNumber = batchNumber;
  if (expiryDate !== undefined) item.expiryDate = expiryDate;
  if (status !== undefined) item.status = status;

  await item.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "inventory",
    resourceId: item._id,
    oldValue,
    newValue: item.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return item;
};