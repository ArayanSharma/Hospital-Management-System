import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
      uppercase: true,
      // Example: "DOCTOR", "RECEPTIONIST", "SUPER_ADMIN"
    },
    description: {
      type: String,
      trim: true,
    },
    permissionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    isSystemRole: {
      type: Boolean,
      default: false,
      // true = SUPER_ADMIN jaise roles jo UI se delete nahi ho sakte
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;