import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    doctorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
        },
        startTime: String,
        endTime: String,
      },
    ],
    additionalInfo: {
      type: String,
      trim: true,
      default: null,
    },
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

doctorSchema.index({ departmentId: 1, status: 1 });
doctorSchema.index({ specialization: 1, status: 1 });
doctorSchema.index({ status: 1, createdAt: -1 });

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;