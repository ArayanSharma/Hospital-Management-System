import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      trim: true,
    },
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
      enum: ["OPD Visit", "IPD Admission", "OPDVisit", "Admission", null],
      default: "OPD Visit",
    },
    testName: {
      type: String,
      required: [true, "Test name is required"],
      trim: true,
    },
    sampleType: {
      type: String,
      required: [true, "Sample type is required"],
      trim: true,
      default: "Blood",
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
    additionalTests: {
      type: [String],
      default: [],
    },
    clinicalNotes: {
      type: String,
      trim: true,
      default: "",
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
    parameters: {
      type: [String],
      default: [],
    },
    checkedBy: {
      type: String,
      trim: true,
      default: "",
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
labTestSchema.index({ orderId: 1 });

const LabTest = mongoose.model("LabTest", labTestSchema);

export default LabTest;