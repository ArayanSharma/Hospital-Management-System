import InventoryItem from "./inventoryItem.model.js";
import Supplier from "../suppliers/supplier.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";

export const createInventoryItem = async (data, currentUser, requestMeta) => {
  const { itemName, category, quantity, unit, minimumStock, supplierId, batchNumber, expiryDate } = data;

  const trimmedItemName = itemName?.trim();
  const trimmedBatch = batchNumber?.trim();

  // Edge Case: Validate non-negative quantity & min stock
  if (quantity !== undefined && Number(quantity) < 0) {
    throw new AppError("Quantity cannot be negative", 400, ErrorCodes.VALIDATION_ERROR);
  }
  if (minimumStock !== undefined && Number(minimumStock) < 0) {
    throw new AppError("Minimum stock threshold cannot be negative", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    throw new AppError("Supplier not found", 404, ErrorCodes.NOT_FOUND);
  }

  const item = await InventoryItem.create({
    itemName: trimmedItemName,
    category: category?.trim(),
    quantity: Math.max(0, Number(quantity || 0)),
    unit: unit?.trim(),
    minimumStock: Math.max(0, Number(minimumStock || 0)),
    supplierId,
    batchNumber: trimmedBatch,
    expiryDate: expiryDate ? new Date(expiryDate) : null,
  });

  // Invalidate Redis Inventory Cache
  await invalidatePattern("hms:inv:*");
  await invalidatePattern("hms:route:inv*");

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
  if (search) query.itemName = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };

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
  const { data: item } = await getOrSetCache(
    `hms:inv:item:${id}`,
    () => InventoryItem.findById(id).populate("supplierId", "name company phone"),
    600
  );

  if (!item) {
    throw new AppError("Inventory item not found", 404, ErrorCodes.NOT_FOUND);
  }
  return item;
};

// ---------------- STOCK IN (purchase se quantity badhana with Redis Lock) ----------------
export const stockIn = async (id, addQuantity, currentUser, requestMeta) => {
  const qty = Number(addQuantity);
  if (qty <= 0) {
    throw new AppError("Quantity to add must be positive", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const lockKey = `hms:lock:inv:${id}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A stock transaction for this item is currently processing", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const item = await InventoryItem.findById(id);
    if (!item) {
      throw new AppError("Inventory item not found", 404, ErrorCodes.NOT_FOUND);
    }

    const oldValue = item.toObject();
    item.quantity += qty;
    await item.save();

    await delCache(`hms:inv:item:${id}`);
    await invalidatePattern("hms:route:inv*");

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
  } finally {
    await releaseLock(lockKey);
  }
};

// ---------------- STOCK OUT (Pharmacy sale / dispensing with EXPIRED GUARD & REDIS LOCK) ----------------
export const stockOut = async (id, removeQuantity, session = null) => {
  const qty = Number(removeQuantity);
  if (qty <= 0) {
    throw new AppError("Quantity to remove must be positive", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const lockKey = `hms:lock:inv:${id}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A stock transaction for this item is currently processing", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const item = await InventoryItem.findById(id).session(session);
    if (!item) {
      throw new AppError("Inventory item not found", 404, ErrorCodes.NOT_FOUND);
    }

    // Edge Case Guard: Block dispensing expired inventory
    if (item.expiryDate && new Date(item.expiryDate) < new Date()) {
      throw new AppError(`Cannot dispense expired inventory item (${item.itemName}). Expired on ${new Date(item.expiryDate).toLocaleDateString()}`, 400, ErrorCodes.VALIDATION_ERROR);
    }

    if (item.quantity < qty) {
      throw new AppError(
        `Insufficient stock for ${item.itemName}. Available: ${item.quantity}, Requested: ${qty}`,
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    item.quantity -= qty;
    await item.save({ session });

    await delCache(`hms:inv:item:${id}`);
    await invalidatePattern("hms:route:inv*");

    return item;
  } finally {
    await releaseLock(lockKey);
  }
};

export const updateInventoryItem = async (id, data, currentUser, requestMeta) => {
  const item = await InventoryItem.findById(id);
  if (!item) {
    throw new AppError("Inventory item not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = item.toObject();
  const { itemName, category, unit, minimumStock, supplierId, batchNumber, expiryDate, status } = data;

  if (minimumStock !== undefined && Number(minimumStock) < 0) {
    throw new AppError("Minimum stock threshold cannot be negative", 400, ErrorCodes.VALIDATION_ERROR);
  }

  if (itemName !== undefined) item.itemName = itemName.trim();
  if (category !== undefined) item.category = category.trim();
  if (unit !== undefined) item.unit = unit.trim();
  if (minimumStock !== undefined) item.minimumStock = Number(minimumStock);
  if (supplierId !== undefined) item.supplierId = supplierId;
  if (batchNumber !== undefined) item.batchNumber = batchNumber.trim();
  if (expiryDate !== undefined) item.expiryDate = expiryDate ? new Date(expiryDate) : null;
  if (status !== undefined) item.status = status;

  await item.save();

  await delCache(`hms:inv:item:${id}`);
  await invalidatePattern("hms:route:inv*");

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