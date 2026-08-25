import mongoose from "mongoose";

const insuranceClaimSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    policyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsurancePolicy",
      required: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    claimAmount: {
      type: Number,
      required: [true, "Claim amount is required"],
      min: 0,
    },
    approvedAmount: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["submitted", "under-review", "approved", "rejected", "settled"],
      default: "submitted",
    },
    documents: {
      type: [String],
      default: [],
      // Cloudinary URLs — supporting documents
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

insuranceClaimSchema.index({ patientId: 1, createdAt: -1 });
insuranceClaimSchema.index({ status: 1 });

const InsuranceClaim = mongoose.model("InsuranceClaim", insuranceClaimSchema);

export default InsuranceClaim;