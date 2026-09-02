import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: false,
    },

    roleName: {
      type: String,
      default: "DOCTOR",
      uppercase: true,
      trim: true,
    },

    department: {
      type: String,
      default: "General",
      trim: true,
    },

    designation: {
      type: String,
      default: "Staff",
      trim: true,
    },

    employeeId: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "+91 98765 43210",
    },

    countryCode: {
      type: String,
      default: "+91",
    },

    dateOfBirth: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "blocked", "deleted"],
      default: "active",
    },

    emailVerified: {
      type: String,
      default: "Unverified",
    },

    loginAccess: {
      type: String,
      default: "Allowed",
    },

    forcePasswordChange: {
      type: Boolean,
      default: true,
    },

    sendWelcomeEmail: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      maxlength: 250,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
      default: Date.now,
    },

    lastLoginFormatted: {
      type: String,
      default: "31 May 2025 \n 10:30 AM",
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ status: 1 });
userSchema.index({ department: 1 });

const User = mongoose.model("User", userSchema);

export default User;
