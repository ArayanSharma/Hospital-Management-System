import User from "./user.model.js";
import Role from "../roles/role.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";

// Helper: sensitive fields hamesha response se strip honi chahiye
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.refreshToken;
  return userObj;
};

// ---------------- CREATE ----------------
export const createUser = async (data) => {
  const { name, email, password, roleId, phone, status } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(
      "User with this email already exists",
      409,
      ErrorCodes.USER_ALREADY_EXISTS
    );
  }

  if (roleId) {
    const roleExists = await Role.findById(roleId);
    if (!roleExists) {
      throw new AppError("Invalid roleId provided", 400, ErrorCodes.USER_INVALID_ROLE);
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    roleId,
    phone,
    status: status || "active",
  });

  return sanitizeUser(user);
};

// ---------------- GET BY ID ----------------
export const getUserById = async (id) => {
  const user = await User.findById(id).populate("roleId", "name permissionIds");

  if (!user || user.status === "deleted") {
    throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
  }

  return sanitizeUser(user);
};

// ---------------- GET ALL (paginated + filter) ----------------
export const getUsers = async ({ page = 1, limit = 10, status, roleId, search }) => {
  const query = { status: { $ne: "deleted" } };

  if (status) query.status = status;
  if (roleId) query.roleId = roleId;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .populate("roleId", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ---------------- UPDATE ----------------
export const updateUser = async (id, data) => {
  const { name, phone, roleId, status } = data;

  const user = await User.findById(id);
  if (!user || user.status === "deleted") {
    throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
  }

  if (roleId) {
    const roleExists = await Role.findById(roleId);
    if (!roleExists) {
      throw new AppError("Invalid roleId provided", 400, ErrorCodes.USER_INVALID_ROLE);
    }
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (roleId !== undefined) user.roleId = roleId;
  if (status !== undefined) user.status = status;

  await user.save();
  await user.populate("roleId", "name");

  return sanitizeUser(user);
};

// ---------------- CHANGE PASSWORD ----------------
export const changePassword = async (id, oldPassword, newPassword) => {
  if (oldPassword === newPassword) {
    throw new AppError("New password cannot be the same as old password", 400);
  }

  const user = await User.findById(id).select("+password");
  if (!user || user.status === "deleted") {
    throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
  }

  const isMatch = await user.isPasswordMatch(oldPassword);
  if (!isMatch) {
    throw new AppError(
      "Old password is incorrect",
      401,
      ErrorCodes.AUTH_INVALID_CREDENTIALS
    );
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
};

// ---------------- SOFT DELETE ----------------
export const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user || user.status === "deleted") {
    throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
  }

  user.status = "deleted";
  user.email = `deleted_${Date.now()}_${user.email}`;
  await user.save();

  return { message: "User deleted successfully" };
};
