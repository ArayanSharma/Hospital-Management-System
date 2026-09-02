import mongoose from "mongoose";

const radiologyReportSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RadiologyTest",
      required: true,
      unique: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    radiologistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    findings: {
      type: String,
      required: [true, "Findings are required"],
      trim: true,
    },
    technique: {
      type: String,
      trim: true,
      default: "",
    },
    impression: {
      type: String,
      trim: true,
      default: "",
    },
    recommendations: {
      type: String,
      trim: true,
      default: "",
    },
    additionalNotes: {
      type: String,
      trim: true,
      default: "",
    },
    technicianName: {
      type: String,
      trim: true,
      default: "Rakesh Kumar",
    },
    checkedByName: {
      type: String,
      trim: true,
      default: "",
    },
    studyReviewed: {
      type: Boolean,
      default: false,
    },
    clinicalIndication: {
      type: String,
      trim: true,
      default: "",
    },
    relevantHistory: {
      type: String,
      trim: true,
      default: "",
    },
    examinationTechnique: {
      type: String,
      trim: true,
      default: "",
    },
    bodyPart: {
      type: String,
      trim: true,
      default: "",
    },
    views: {
      type: String,
      trim: true,
      default: "",
    },
    contrast: {
      type: String,
      trim: true,
      default: "Not Used",
    },
    imageQuality: {
      type: String,
      trim: true,
      default: "Diagnostic",
    },
    images: {
      type: [String],
      default: [],
    },
    reportFile: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "finalized"],
      default: "draft",
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const RadiologyReport = mongoose.model("RadiologyReport", radiologyReportSchema);

export default RadiologyReport;