import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: "",
    },
    sourceReference: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      default: "Other",
    },
    sourceType: {
      type: String,
      enum: ["consultation", "lab_test", "radiology_test", "pharmacy", "room_charge", "other"],
      default: "other",
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
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
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxPercent: {
      type: Number,
      default: 12,
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
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientName: {
      type: String,
      trim: true,
    },
    patientPhone: {
      type: String,
      trim: true,
    },
    uhid: {
      type: String,
      trim: true,
    },
    visitEncounter: {
      type: String,
      trim: true,
      default: "VIS-2026-04568",
    },
    visitType: {
      type: String,
      trim: true,
      default: "OPD",
    },
    referredBy: {
      type: String,
      trim: true,
      default: "Dr. Vikram Patel",
    },
    paymentTerms: {
      type: String,
      enum: ["Immediate", "7 Days", "15 Days", "30 Days", "Custom"],
      default: "Immediate",
    },
    departments: {
      type: [String],
      default: ["OPD"],
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
    taxableAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    gstAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    roundOff: {
      type: Number,
      default: 0,
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
    },
    dueAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["unpaid", "partially-paid", "paid", "cancelled"],
      default: "unpaid",
    },
    paymentHistory: [
      {
        amount: Number,
        mode: String,
        transactionId: String,
        receivedBy: String,
        date: { type: Date, default: Date.now },
      },
    ],
    refundHistory: [
      {
        refundAmount: Number,
        refundReason: String,
        refundMethod: String,
        processedBy: String,
        date: { type: Date, default: Date.now },
      },
    ],
    cancellationInfo: {
      reason: String,
      cancelledBy: String,
      authCode: String,
      cancelledAt: { type: Date, default: Date.now },
    },
    notes: {
      type: String,
      trim: true,
      default: "",
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
invoiceSchema.index({ invoiceNumber: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;