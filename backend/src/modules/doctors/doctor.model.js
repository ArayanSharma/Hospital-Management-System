import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      // Ek User sirf ek hi Doctor profile rakh sakta hai
    },
    doctorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Human-readable ID, e.g. "DOC-0001"
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
      // Years of experience
    },
    consultationFee: {
      type: Number,
      required: [true, "Consultation fee is required"],
      min: 0,
    },
    availability: [
      {
        day: {
          type: String,
          enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        startTime: String, // "09:00"
        endTime: String, // "17:00"
      },
    ],
    photoUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;