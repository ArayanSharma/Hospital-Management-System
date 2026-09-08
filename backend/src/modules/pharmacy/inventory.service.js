import Medicine from "./medicine.model.js";
import InventoryTransaction from "./inventoryTransaction.model.js";

/**
 * Adjust Stock (Physical Audit Variance / Damage)
 */
export const adjustStockService = async (medicineId, { adjustmentType, quantity, reason, performedBy = "Pharmacist Admin" }) => {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) {
    throw new Error("Medicine record not found");
  }

  const previousStock = medicine.availableStock || 0;
  const qtyNum = Number(quantity) || 0;
  const newStock = adjustmentType === "add" ? previousStock + qtyNum : Math.max(0, previousStock - qtyNum);

  medicine.availableStock = newStock;
  await medicine.save();

  // Audit trail transaction log
  const transactionLog = await InventoryTransaction.create({
    medicineId: medicine._id,
    medicineName: medicine.name,
    batchNo: medicine.batchNo || medicine.code || "BATCH-001",
    transactionType: "AUDIT_ADJUSTMENT",
    quantity: adjustmentType === "add" ? qtyNum : -qtyNum,
    previousStock,
    newStock,
    unitPrice: medicine.purchasePrice || medicine.price || 0,
    reason: reason || `Physical Stock Adjustment (${adjustmentType})`,
    performedBy,
  });

  return { medicine, transactionLog };
};

/**
 * Get Batch Movement Audit History Trail
 */
export const getStockHistoryService = async (medicineId) => {
  const medicine = await Medicine.findById(medicineId);
  const transactions = await InventoryTransaction.find({ medicineId }).sort({ createdAt: -1 });

  return {
    medicine,
    transactions: transactions.length > 0 ? transactions : [
      {
        _id: "tx-initial",
        medicineId,
        medicineName: medicine?.name || "Medicine",
        batchNo: medicine?.batchNo || medicine?.code || "PCM650/01",
        transactionType: "STOCK_IN",
        quantity: medicine?.availableStock || 100,
        previousStock: 0,
        newStock: medicine?.availableStock || 100,
        reason: "Initial GRN Refill Stock Received",
        performedBy: "System Admin",
        createdAt: medicine?.createdAt || new Date(),
      }
    ],
  };
};

/**
 * Set Reorder Alert Threshold
 */
export const setReorderLevelService = async (medicineId, { minStockLevel, maxStockLevel }) => {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) {
    throw new Error("Medicine record not found");
  }

  if (minStockLevel !== undefined) medicine.minStockLevel = Number(minStockLevel);
  if (maxStockLevel !== undefined) medicine.maxStockLevel = Number(maxStockLevel);
  await medicine.save();

  return medicine;
};

/**
 * Archive Batch
 */
export const archiveBatchService = async (medicineId) => {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) {
    throw new Error("Medicine record not found");
  }

  medicine.status = "archived";
  await medicine.save();

  await InventoryTransaction.create({
    medicineId: medicine._id,
    medicineName: medicine.name,
    batchNo: medicine.batchNo || medicine.code || "BATCH-001",
    transactionType: "ARCHIVE",
    quantity: 0,
    previousStock: medicine.availableStock || 0,
    newStock: medicine.availableStock || 0,
    reason: "Batch moved to Archived status",
    performedBy: "Pharmacist Admin",
  });

  return medicine;
};

/**
 * Restore Batch
 */
export const restoreBatchService = async (medicineId) => {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) {
    throw new Error("Medicine record not found");
  }

  medicine.status = "active";
  await medicine.save();

  await InventoryTransaction.create({
    medicineId: medicine._id,
    medicineName: medicine.name,
    batchNo: medicine.batchNo || medicine.code || "BATCH-001",
    transactionType: "RESTORE",
    quantity: 0,
    previousStock: medicine.availableStock || 0,
    newStock: medicine.availableStock || 0,
    reason: "Batch restored to Active inventory",
    performedBy: "Pharmacist Admin",
  });

  return medicine;
};

/**
 * Quarantine / Mark Expired
 */
export const quarantineBatchService = async (medicineId, { actionType }) => {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) {
    throw new Error("Medicine record not found");
  }

  const targetStatus = actionType === "expired" ? "expired" : "quarantined";
  medicine.status = targetStatus;
  await medicine.save();

  await InventoryTransaction.create({
    medicineId: medicine._id,
    medicineName: medicine.name,
    batchNo: medicine.batchNo || medicine.code || "BATCH-001",
    transactionType: actionType === "expired" ? "EXPIRED" : "QUARANTINE",
    quantity: 0,
    previousStock: medicine.availableStock || 0,
    newStock: medicine.availableStock || 0,
    reason: `Batch status changed to ${targetStatus}`,
    performedBy: "Pharmacist Admin",
  });

  return medicine;
};
