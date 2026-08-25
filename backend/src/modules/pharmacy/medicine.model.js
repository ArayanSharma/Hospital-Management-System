import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    genericName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      // Example: "Antibiotic", "Painkiller"
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
      // Example: "tablet", "syrup bottle", "injection"
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
      // Per-unit selling price
    },
    reorderLevel: {
      type: Number,
      default: 10,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;