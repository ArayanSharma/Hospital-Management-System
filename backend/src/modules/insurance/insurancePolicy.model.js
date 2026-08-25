import mongoose from "mongoose";

const insurancePolicySchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
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
    coverageAmount: {
      type: Number,
      required: [true, "Coverage amount is required"],
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

insurancePolicySchema.index({ patientId: 1 });

const InsurancePolicy = mongoose.model("InsurancePolicy", insurancePolicySchema);

export default InsurancePolicy;