import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    roleCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    roleType: {
      type: String,
      enum: ["System", "Custom"],
      default: "Custom",
    },
    userCount: {
      type: Number,
      default: 0,
    },
    maxUsers: {
      type: Number,
      default: null,
    },
    parentRole: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    permissionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    modulePermissions: {
      type: Map,
      of: String,
      default: {},
    },
    actionPermissions: {
      type: Map,
      of: Object, // e.g. { "Patient Management": { create: true, read: true, update: true, delete: false, manage: false } }
      default: {},
    },
    isSystemRole: {
      type: Boolean,
      default: false,
    },
    isProtected: {
      type: Boolean,
      default: false,
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