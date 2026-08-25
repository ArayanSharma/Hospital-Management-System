import mongoose from "mongoose";

const bedSchema = new mongoose.Schema(
  {
    wardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: true,
    },
    bedNumber: {
      type: String,
      required: [true, "Bed number is required"],
      trim: true,
      // Example: "A-101"
    },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    currentPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      default: null,
    },
    maintenanceReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

// Ek ward ke andar bed number unique hona chahiye
bedSchema.index({ wardId: 1, bedNumber: 1 }, { unique: true });

const Bed = mongoose.model("Bed", bedSchema);

export default Bed;