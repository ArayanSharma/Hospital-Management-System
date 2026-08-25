import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Example: "PAT-0001"
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    address: {
      type: String,
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null],
      default: null,
    },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relation: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

patientSchema.index({ name: "text", phone: "text" }); // search ke liye

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;