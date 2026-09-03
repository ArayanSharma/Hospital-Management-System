import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    brandName: {
      type: String,
      trim: true,
    },
    genericName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    therapeuticCategory: {
      type: String,
      trim: true,
    },
    dosageForm: {
      type: String,
      trim: true,
    },
    strength: {
      type: String,
      trim: true,
    },
    packSize: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
    },
    supplier: {
      type: String,
      trim: true,
    },
    countryOfOrigin: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    mrp: {
      type: Number,
      default: 0,
      min: 0,
    },
    gstRate: {
      type: Number,
      default: 12,
    },
    purchasePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    margin: {
      type: Number,
      default: 0,
    },
    sellingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableStock: {
      type: Number,
      default: 100,
    },
    batchNo: {
      type: String,
      default: "PCM650/01",
    },
    expiryDate: {
      type: String,
      default: "2026-12-30",
    },
    minStockLevel: {
      type: Number,
      default: 50,
    },
    maxStockLevel: {
      type: Number,
      default: 500,
    },
    reorderLevel: {
      type: Number,
      default: 10,
      min: 0,
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    controlledMedicine: {
      type: Boolean,
      default: false,
    },
    shelfLifeValue: {
      type: Number,
      default: 24,
    },
    shelfLifeUnit: {
      type: String,
      default: "Months",
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "archived", "quarantined", "expired", "Active", "Inactive", "Archived", "Quarantined", "Expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;