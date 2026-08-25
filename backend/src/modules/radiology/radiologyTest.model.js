import mongoose from "mongoose";

const radiologyTestSchema = new mongoose.Schema(
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
    testType: {
      type: String,
      required: [true, "Test type is required"],
      trim: true,
      // Example: "X-Ray", "MRI", "CT Scan", "Ultrasound"
    },
    bodyPart: {
      type: String,
      trim: true,
      // Example: "Chest", "Left Knee"
    },
    priority: {
      type: String,
      enum: ["routine", "urgent", "emergency"],
      default: "routine",
    },
    status: {
      type: String,
      enum: ["pending", "scheduled", "completed", "cancelled"],
      default: "pending",
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

radiologyTestSchema.index({ patientId: 1, createdAt: -1 });
radiologyTestSchema.index({ status: 1 });

const RadiologyTest = mongoose.model("RadiologyTest", radiologyTestSchema);

export default RadiologyTest;