import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema(
  {
    labTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabTest",
      required: true,
      unique: true,
      // Ek test ki sirf ek hi final report honi chahiye
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // Jisne report upload ki
    },
    results: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Results are required"],
      // Flexible structure — har test ke parameters alag hote hain
      // Example: { "Hemoglobin": "13.5 g/dL", "WBC Count": "7500/uL" }
    },
    interpretation: {
      type: String,
      trim: true,
      // Normal / Abnormal / doctor ke liye note
    },
    reportFile: {
      type: String,
      default: null,
      // File URL (Cloudinary) — agar scanned report upload ki ho
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

const LabReport = mongoose.model("LabReport", labReportSchema);

export default LabReport;