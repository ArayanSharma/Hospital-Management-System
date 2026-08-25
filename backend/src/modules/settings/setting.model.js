import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    currency: {
      type: String,
      default: "INR",
    },
    invoiceSettings: {
      taxPercentage: { type: Number, default: 0 },
      invoicePrefix: { type: String, default: "INV" },
    },
    notificationSettings: {
      emailEnabled: { type: Boolean, default: true },
      smsEnabled: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;