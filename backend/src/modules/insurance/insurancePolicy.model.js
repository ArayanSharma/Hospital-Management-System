import mongoose from "mongoose";

const insurancePolicySchema = new mongoose.Schema(
  {
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
    dateOfBirth: {
      type: String,
      default: "16 Aug 1990",
    },
    mobileNumber: {
      type: String,
      default: "9876543210",
    },
    providerName: {
      type: String,
      required: [true, "Insurance provider name is required"],
      trim: true,
    },
    policyNumber: {
      type: String,
      required: [true, "Policy number is required"],
      unique: true,
      trim: true,
    },
    memberId: {
      type: String,
      trim: true,
      default: "",
    },
    policyType: {
      type: String,
      default: "Family Floater",
    },
    tpaName: {
      type: String,
      default: "Health India TPA Services Pvt. Ltd.",
    },
    coverageAmount: {
      type: Number,
      required: [true, "Coverage amount is required"],
      min: 0,
    },
    sumInsured: {
      type: Number,
      default: 500000,
    },
    currency: {
      type: String,
      default: "INR",
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    renewalDate: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["Active", "Expired", "Inactive", "Suspended"],
      default: "Active",
    },
    employer: {
      type: String,
      default: "",
    },
    relationship: {
      type: String,
      default: "Self",
    },
    notes: {
      type: String,
      default: "",
    },
    documents: {
      policyDoc: { type: String, default: "" },
      cardFront: { type: String, default: "" },
      cardBack: { type: String, default: "" },
      otherDoc: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

insurancePolicySchema.index({ patientId: 1 });
insurancePolicySchema.index({ policyNumber: 1 });
insurancePolicySchema.index({ status: 1 });

const InsurancePolicy = mongoose.model("InsurancePolicy", insurancePolicySchema);

export default InsurancePolicy;