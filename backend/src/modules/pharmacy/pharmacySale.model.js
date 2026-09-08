import mongoose from "mongoose";

const saleMedicineItemSchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
    },
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    batchNo: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      default: "Strip",
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const pharmacySaleSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    customerType: {
      type: String,
      enum: ["Walk-in Customer", "OPD Patient", "IPD Patient"],
      default: "Walk-in Customer",
    },
    customerName: {
      type: String,
      default: "Walk-in Customer",
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    prescriptionNo: {
      type: String,
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },
    medicines: {
      type: [saleMedicineItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one medicine is required",
      },
    },
    totalItems: {
      type: Number,
      default: 1,
    },
    totalQuantity: {
      type: Number,
      default: 1,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    gstAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Credit"],
      default: "Cash",
    },
    amountReceived: {
      type: Number,
      default: 0,
    },
    changeAmount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "paid",
    },
    printInvoice: {
      type: Boolean,
      default: true,
    },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

pharmacySaleSchema.index({ invoiceNo: 1, createdAt: -1 });

const PharmacySale = mongoose.model("PharmacySale", pharmacySaleSchema);

export default PharmacySale;