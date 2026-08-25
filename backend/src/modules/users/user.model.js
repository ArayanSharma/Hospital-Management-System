import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { USER_STATUS } from "./user.constants.js";

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

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Default DB queries mein password hash expose nahi hoga
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Role is required"],
    },

    phone: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false, // JWT Auth refresh token flow ke liye
    },
  },
  {
    timestamps: true,
  }
);

// ---------------- PRE-SAVE HOOK ----------------
// Password sirf tabhi hash ho jab naya bane ya modify hua ho
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// ---------------- INSTANCE METHOD ----------------
// Login time par password verify karne ke liye clean method
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
