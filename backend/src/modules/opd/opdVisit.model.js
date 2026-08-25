import mongoose from "mongoose";

const opdVisitSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
      // Optional — walk-in patients ke liye null ho sakta hai
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
      temperature: { type: Number, default: null },
      bloodPressure: { type: String, default: null }, // "120/80"
      pulse: { type: Number, default: null },
      weight: { type: Number, default: null },
      height: { type: Number, default: null },
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

opdVisitSchema.index({ patientId: 1, visitDate: -1 });
opdVisitSchema.index({ doctorId: 1, visitDate: -1 });

const OPDVisit = mongoose.model("OPDVisit", opdVisitSchema);

export default OPDVisit;