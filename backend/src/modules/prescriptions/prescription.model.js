import mongoose from "mongoose";

const medicineItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true }, // "500mg"
    frequency: { type: String, required: true, trim: true }, // "1-0-1" (morning-afternoon-night)
    duration: { type: String, required: true, trim: true }, // "5 days"
    instructions: { type: String, trim: true }, // "After food"
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
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
      required: true,
      // OPDVisit ya Admission ka _id
    },
    visitType: {
      type: String,
      required: true,
      enum: ["OPDVisit", "Admission"],
    },
    medicines: {
      type: [medicineItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one medicine is required",
      },
    },
    instructions: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

prescriptionSchema.index({ patientId: 1, createdAt: -1 });
prescriptionSchema.index({ visitId: 1 });

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;