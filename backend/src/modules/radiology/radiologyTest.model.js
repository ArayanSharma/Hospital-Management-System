import mongoose from "mongoose";

const radiologyTestSchema = new mongoose.Schema(
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
    modality: {
      type: String,
      required: [true, "Modality is required"],
      trim: true,
      // Example: "X-Ray", "MRI Scan", "CT Scan", "Ultrasound (USG)", "Mammography", "PET Scan", "ECG"
    },
    bodyRegion: {
      type: String,
      required: [true, "Body region is required"],
      trim: true,
      // Example: "Chest", "Brain", "Abdomen", "Pelvis", "Breast", "Whole Body", "Heart", "Spine"
    },
    testType: {
      type: String,
      trim: true,
    },
    bodyPart: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["routine", "urgent", "emergency"],
      default: "routine",
    },
    status: {
      type: String,
      enum: ["pending", "scheduled", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    clinicalInstructions: {
      type: String,
      trim: true,
      default: "",
    },
    additionalTests: {
      type: [String],
      default: [],
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    locationRoom: {
      type: String,
      trim: true,
      default: "Radiology Room 1",
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

radiologyTestSchema.index({ patientId: 1, createdAt: -1 });
radiologyTestSchema.index({ status: 1 });
radiologyTestSchema.index({ orderId: 1 });

const RadiologyTest = mongoose.model("RadiologyTest", radiologyTestSchema);

export default RadiologyTest;