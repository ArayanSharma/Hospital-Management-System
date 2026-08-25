import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      // Example: "Medicine", "Surgical Equipment", "Consumables"
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
      // Example: "box", "piece", "strip"
    },
    minimumStock: {
      type: Number,
      required: [true, "Minimum stock threshold is required"],
      min: 0,
      // Isse kam ho jaye to "low stock" alert
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

inventoryItemSchema.index({ itemName: 1 });
inventoryItemSchema.index({ expiryDate: 1 });

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

export default InventoryItem;