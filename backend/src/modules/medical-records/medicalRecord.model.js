import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
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
      // Optional — OPDVisit ya Admission se link ho sakta hai, ya standalone entry bhi ho sakti hai
    },
    visitType: {
      type: String,
      enum: ["OPDVisit", "Admission", null],
      default: null,
    },
    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
      trim: true,
    },
    treatment: {
      type: String,
      trim: true,
    },
    allergies: {
      type: [String],
      default: [],
      // Example: ["Penicillin", "Peanuts"]
    },
    chronicConditions: {
      type: [String],
      default: [],
      // Example: ["Diabetes Type 2", "Hypertension"]
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

medicalRecordSchema.index({ patientId: 1, createdAt: -1 });

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

export default MedicalRecord;