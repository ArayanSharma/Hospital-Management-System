import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
      // Format: "09:00" (24hr)
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
      enum: ["scheduled", "completed", "cancelled", "no-show"],
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
  },
  { timestamps: true }
);

// Query performance — doctor ki schedule check karna sabse common operation hoga
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;