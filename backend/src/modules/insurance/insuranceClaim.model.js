import mongoose from "mongoose";

const insuranceClaimSchema = new mongoose.Schema(
  {
    claimNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: false,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    uhid: {
      type: String,
      required: true,
      trim: true,
    },
    policyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsurancePolicy",
      required: false,
    },
    policyNumber: {
      type: String,
      required: true,
      trim: true,
    },
    providerName: {
      type: String,
      default: "Star Health & Allied Insurance Co. Ltd.",
    },
    tpaName: {
      type: String,
      default: "Health India TPA Services Pvt. Ltd.",
    },
    policyValidity: {
      type: String,
      default: "01 Apr 2025 to 31 Mar 2026",
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: false,
    },
    invoiceNumber: {
      type: String,
      default: "INV-2026-0001",
      trim: true,
    },
    admissionType: {
      type: String,
      default: "Outpatient (OPD)",
    },
    treatmentDate: {
      type: String,
      default: "29 May 2025",
    },
    claimType: {
      type: String,
      default: "Cashless",
    },
    claimAmount: {
      type: Number,
      required: [true, "Claim amount is required"],
      min: 0,
    },
    approvedAmount: {
      type: Number,
      default: 0,
    },
    settledAmount: {
      type: Number,
      default: 0,
    },
    patientPayable: {
      type: Number,
      default: 0,
    },
    preAuthNumber: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "Draft", "Submitted", "Under Review", "Approved", "Partially Approved", "Rejected", "Settled", "Withdrawn", "Cancelled",
        "draft", "submitted", "under review", "approved", "partially approved", "rejected", "settled", "withdrawn", "cancelled"
      ],
      default: "Submitted",
    },
    submittedDate: {
      type: String,
      default: () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    },
    expectedReviewDate: {
      type: String,
      default: "07 Jun 2025",
    },
    remarks: {
      type: String,
      default: "",
    },
    diagnosis: {
      type: String,
      default: "",
    },
    treatmentSummary: {
      type: String,
      default: "",
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
    settlementDetails: {
      utrNumber: { type: String, default: "" },
      bankName: { type: String, default: "" },
      settlementDate: { type: String, default: "" },
      settledAmount: { type: Number, default: 0 },
      paymentMode: { type: String, default: "NEFT/RTGS" },
    },
    internalNotes: [
      {
        noteText: String,
        author: { type: String, default: "System Admin" },
        date: { type: Date, default: Date.now },
      },
    ],
    documentsList: [
      {
        name: String,
        category: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    lastUpdatedDate: {
      type: String,
      default: () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

insuranceClaimSchema.index({ claimNumber: 1 });
insuranceClaimSchema.index({ patientId: 1 });
insuranceClaimSchema.index({ status: 1 });

const InsuranceClaim = mongoose.model("InsuranceClaim", insuranceClaimSchema);

export default InsuranceClaim;