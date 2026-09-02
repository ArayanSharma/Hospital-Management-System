import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: 0.01,
    },
    method: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["cash", "card", "upi", "net-banking", "cheque", "bank-transfer", "insurance", "other"],
    },
    transactionId: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["success", "failed", "refunded"],
      default: "success",
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ invoiceId: 1 });
paymentSchema.index({ patientId: 1, createdAt: -1 });
paymentSchema.index({ receiptNumber: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;