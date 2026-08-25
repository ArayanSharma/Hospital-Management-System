import mongoose from "mongoose";

const saleMedicineItemSchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    inventoryItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
      // Kis batch se stock kata
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const pharmacySaleSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
      // Optional — walk-in customer bhi ho sakta hai bina registered patient ke
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      default: null,
    },
    medicines: {
      type: [saleMedicineItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one medicine is required",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

pharmacySaleSchema.index({ patientId: 1, createdAt: -1 });

const PharmacySale = mongoose.model("PharmacySale", pharmacySaleSchema);

export default PharmacySale;