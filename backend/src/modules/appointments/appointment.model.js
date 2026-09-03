import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
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
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "checked_in", "in_consultation", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    notes: {
      type: String,
      trim: true,
    },
    cancelledReason: {
      type: String,
      trim: true,
      default: null,
    },
    sendNotification: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;