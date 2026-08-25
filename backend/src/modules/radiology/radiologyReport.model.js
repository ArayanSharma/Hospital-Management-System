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
    impression: {
      type: String,
      trim: true,
      // Doctor ke liye summary conclusion
    },
    images: {
      type: [String],
      default: [],
      // Cloudinary URLs — multiple images ho sakti hain (X-ray ke multiple angles)
    },
    reportFile: {
      type: String,
      default: null,
      // Final PDF report URL
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