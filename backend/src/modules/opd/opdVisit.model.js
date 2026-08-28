import mongoose from "mongoose";

const opdVisitSchema = new mongoose.Schema(
  {
    visitId: {
      type: String,
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    visitType: {
      type: String,
      enum: ["appointment", "walk-in"],
      default: "appointment",
    },
    symptoms: {
      type: String,
      trim: true,
    },
    diagnosis: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    vitals: {
      temperature: { type: Number, default: 98.6 },
      bloodPressure: { type: String, default: "120/80" },
      pulse: { type: Number, default: 78 },
      weight: { type: Number, default: 65.2 },
      height: { type: Number, default: 165 },
      spO2: { type: Number, default: 98 },
    },
    clinicalNotes: {
      examinationFindings: { type: String, default: "" },
      clinicalAssessment: { type: String, default: "" },
      additionalNotes: { type: String, default: "" },
    },
    prescription: [
      {
        medicineName: { type: String },
        dosage: { type: String },
        frequency: { type: String },
        duration: { type: String },
        instructions: { type: String },
      },
    ],
    visitDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "walk-in", "cancelled"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

opdVisitSchema.index({ patientId: 1, visitDate: -1 });
opdVisitSchema.index({ doctorId: 1, visitDate: -1 });

const OPDVisit = mongoose.model("OPDVisit", opdVisitSchema);

export default OPDVisit;