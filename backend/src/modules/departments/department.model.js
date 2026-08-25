import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
      // Example: "Cardiology", "ENT", "ICU"
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      // Example: "CARD", "ENT", "ICU"
    },
    description: {
      type: String,
      trim: true,
    },
    headDoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
      // NOTE: Doctor model abhi nahi bana — isliye yeh field abhi khaali rahega,
      // Doctor module banne ke baad update kar sakte ho
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;