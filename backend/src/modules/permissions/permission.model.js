import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Example: "patient:create", "billing:read"
    },
    resource: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["create", "read", "update", "delete", "manage"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;