import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
      index: true,
    },
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    batchNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    transactionType: {
      type: String,
      enum: ["STOCK_IN", "DISPENSED_SALE", "AUDIT_ADJUSTMENT", "TRANSFER", "QUARANTINE", "EXPIRED", "ARCHIVE", "RESTORE"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      default: 0,
    },
    newStock: {
      type: Number,
      default: 0,
    },
    unitPrice: {
      type: Number,
      default: 0,
    },
    referenceNo: {
      type: String,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    performedBy: {
      type: String,
      default: "Pharmacist Admin",
    },
  },
  { timestamps: true }
);

const InventoryTransaction = mongoose.model("InventoryTransaction", inventoryTransactionSchema);

export default InventoryTransaction;
