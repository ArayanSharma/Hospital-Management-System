import mongoose from "mongoose";

const wardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ward name is required"],
      unique: true,
      trim: true,
      // Example: "General Ward A", "ICU-1"
    },
    type: {
      type: String,
      required: [true, "Ward type is required"],
      enum: ["general", "icu", "private", "semi-private", "emergency"],
    },
    floor: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: 1,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Ward = mongoose.model("Ward", wardSchema);

export default Ward;
