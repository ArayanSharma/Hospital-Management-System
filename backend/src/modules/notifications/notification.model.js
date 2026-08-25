import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["appointment", "billing", "lab_result", "admission", "system", "other"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    channel: {
      type: String,
      enum: ["in-app", "email", "sms"],
      default: "in-app",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      // Optional — related resourceId, link, etc.
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;