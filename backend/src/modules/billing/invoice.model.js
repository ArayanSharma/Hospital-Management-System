import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      // Example: "Consultation Fee - Dr. Sharma", "CBC Test", "Paracetamol x10"
    },
    sourceType: {
      type: String,
      enum: ["consultation", "lab_test", "radiology_test", "pharmacy", "room_charge", "other"],
      default: "other",
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      // Reference to Appointment/LabTest/PharmacySale/Admission etc.
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Example: "INV-0001"
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    items: {
      type: [invoiceItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one item is required",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
      // Payments module se update hota hai
    },
    status: {
      type: String,
      enum: ["unpaid", "partially-paid", "paid", "cancelled"],
      default: "unpaid",
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ patientId: 1, createdAt: -1 });
invoiceSchema.index({ status: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;