import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    visitType: {
      type: String,
      enum: ["OPDVisit", "Admission", null],
      default: null,
    },
    testName: {
      type: String,
      required: [true, "Test name is required"],
      trim: true,
      // Example: "Complete Blood Count", "Lipid Profile"
    },
    sampleType: {
      type: String,
      required: [true, "Sample type is required"],
      trim: true,
      // Example: "Blood", "Urine", "Stool"
    },
    priority: {
      type: String,
      enum: ["routine", "urgent", "emergency"],
      default: "routine",
    },
    status: {
      type: String,
      enum: ["pending", "sample-collected", "completed", "cancelled"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

labTestSchema.index({ patientId: 1, createdAt: -1 });
labTestSchema.index({ status: 1 });

const LabTest = mongoose.model("LabTest", labTestSchema);

export default LabTest;