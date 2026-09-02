import User from "./user.model.js";
import Role from "../roles/role.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.refreshToken;
  return userObj;
};

export const ensureSampleUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count > 0) return;

    let defaultRole = await Role.findOne();
    const roleId = defaultRole ? defaultRole._id : null;

    const sampleUsers = [
      {
        name: "Dr. Vikram Patel",
        email: "vikram.patel@citycare.com",
        username: "vikram.patel",
        password: "Password123!",
        roleId,
        roleName: "DOCTOR",
        department: "Cardiology",
        designation: "Senior Cardiologist",
        employeeId: "EMP-1001",
        phone: "+91 98765 43210",
        status: "active",
        lastLoginFormatted: "31 May 2025 \n 10:30 AM",
      },
      {
        name: "Nisha Sharma",
        email: "nisha.sharma@citycare.com",
        username: "nisha.sharma",
        password: "Password123!",
        roleId,
        roleName: "NURSE",
        department: "General Ward",
        designation: "Head Nurse",
        employeeId: "EMP-1002",
        phone: "+91 98765 43211",
        status: "active",
        lastLoginFormatted: "31 May 2025 \n 09:15 AM",
      },
      {
        name: "Ritika Verma",
        email: "ritika.verma@citycare.com",
        username: "ritika.verma",
        password: "Password123!",
        roleId,
        roleName: "RECEPTIONIST",
        department: "Front Office",
        designation: "Front Desk Officer",
        employeeId: "EMP-1003",
        phone: "+91 98765 43212",
        status: "active",
        lastLoginFormatted: "31 May 2025 \n 08:45 AM",
      },
      {
        name: "Amit Kumar",
        email: "amit.kumar@citycare.com",
        username: "amit.kumar",
        password: "Password123!",
        roleId,
        roleName: "PHARMACIST",
        department: "Pharmacy",
        designation: "Senior Pharmacist",
        employeeId: "EMP-1004",
        phone: "+91 98765 43213",
        status: "active",
        lastLoginFormatted: "30 May 2025 \n 06:20 PM",
      },
      {
        name: "Pooja Singh",
        email: "pooja.singh@citycare.com",
        username: "pooja.singh",
        password: "Password123!",
        roleId,
        roleName: "ACCOUNTANT",
        department: "Accounts",
        designation: "Billing Accountant",
        employeeId: "EMP-1005",
        phone: "+91 98765 43214",
        status: "inactive",
        lastLoginFormatted: "28 May 2025 \n 04:10 PM",
      },
      {
        name: "Rohit Mehta",
        email: "rohit.mehta@citycare.com",
        username: "rohit.mehta",
        password: "Password123!",
        roleId,
        roleName: "ADMIN",
        department: "Administration",
        designation: "System Administrator",
        employeeId: "EMP-1006",
        phone: "+91 98765 43215",
        status: "active",
        lastLoginFormatted: "31 May 2025 \n 11:00 AM",
      },
      {
        name: "Sunita Rani",
        email: "sunita.rani@citycare.com",
        username: "sunita.rani",
        password: "Password123!",
        roleId,
        roleName: "NURSE",
        department: "ICU",
        designation: "ICU Specialist Nurse",
        employeeId: "EMP-1007",
        phone: "+91 98765 43216",
        status: "suspended",
        lastLoginFormatted: "15 May 2025 \n 02:30 PM",
      },
      {
        name: "Arjun Sharma",
        email: "arjun.sharma@citycare.com",
        username: "arjun.sharma",
        password: "Password123!",
        roleId,
        roleName: "DOCTOR",
        department: "Orthopedics",
        designation: "Orthopedic Surgeon",
        employeeId: "EMP-1008",
        phone: "+91 98765 43217",
        status: "blocked",
        lastLoginFormatted: "10 May 2025 \n 10:20 AM",
      },
    ];

    for (const u of sampleUsers) {
      await User.create(u);
    }
  } catch (err) {
    console.error("Error seeding sample users:", err);
  }
};

// ---------------- CREATE ----------------
export const createUser = async (data) => {
  await ensureSampleUsers();
  const {
    name,
    email,
    username,
    password,
    roleId,
    roleName,
    department,
    designation,
    employeeId,
    phone,
    countryCode,
    dateOfBirth,
    gender,
    avatar,
    status,
    emailVerified,
    loginAccess,
    forcePasswordChange,
    sendWelcomeEmail,
    notes,
  } = data;

  // 1. Full Name Validation
  if (!name || name.trim().length < 2) {
    throw new AppError("Full Name must be at least 2 characters long", 400, ErrorCodes.BAD_REQUEST);
  }
  if (!/^[a-zA-Z\s.-]+$/.test(name.trim())) {
    throw new AppError("Full Name cannot contain numbers or special characters", 400, ErrorCodes.BAD_REQUEST);
  }

  // 2. Email Validation & Duplicate Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    throw new AppError("Please enter a valid email address", 400, ErrorCodes.BAD_REQUEST);
  }
  const existingUserByEmail = await User.findOne({ email: email.trim().toLowerCase() });
  if (existingUserByEmail) {
    throw new AppError("User with this email address already exists", 409, ErrorCodes.USER_ALREADY_EXISTS);
  }

  // 3. Username Duplicate Check
  const generatedUsername = (username || email.split("@")[0]).trim().toLowerCase();
  const existingUserByUsername = await User.findOne({ username: generatedUsername });
  if (existingUserByUsername) {
    throw new AppError("Username is already taken by another account", 409, ErrorCodes.USER_ALREADY_EXISTS);
  }

  // 4. Role Validation
  if (!roleName || roleName.trim() === "" || roleName === "Select role") {
    throw new AppError("Role is required", 400, ErrorCodes.BAD_REQUEST);
  }

  // 5. Department Validation for Doctor Role
  const isDoctorRole = (roleName || "").toUpperCase() === "DOCTOR";
  if (isDoctorRole && (!department || department.trim() === "" || department === "Select department")) {
    throw new AppError("Department is required for Doctor role", 400, ErrorCodes.BAD_REQUEST);
  }

  // 6. Date of Birth Future Check
  if (dateOfBirth && new Date(dateOfBirth) > new Date()) {
    throw new AppError("Date of Birth cannot be a future date", 400, ErrorCodes.BAD_REQUEST);
  }

  let finalRoleId = roleId;
  if (!finalRoleId) {
    const foundRole = await Role.findOne({ name: new RegExp(roleName || "DOCTOR", "i") });
    if (foundRole) finalRoleId = foundRole._id;
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    username: generatedUsername,
    password: password || "Password123!",
    roleId: finalRoleId,
    roleName: (roleName || "DOCTOR").toUpperCase(),
    department: department || "General",
    designation: designation || "Staff",
    employeeId: employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    phone: phone || "+91 98765 43210",
    countryCode: countryCode || "+91",
    dateOfBirth: dateOfBirth || "",
    gender: gender || "",
    avatar: avatar || "",
    status: (status || "active").toLowerCase(),
    emailVerified: emailVerified || "Unverified",
    loginAccess: loginAccess || "Allowed",
    forcePasswordChange: forcePasswordChange !== undefined ? forcePasswordChange : true,
    sendWelcomeEmail: sendWelcomeEmail !== undefined ? sendWelcomeEmail : false,
    notes: notes || "",
    lastLoginFormatted:
      new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
      " \n " +
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

// ---------------- GET ALL (paginated + dynamic filters & aggregations) ----------------
export const getUsers = async ({ page = 1, limit = 10, status, role, department, search }) => {
  await ensureSampleUsers();
  const query = { status: { $ne: "deleted" } };

  const sClean = status ? status.trim().toLowerCase() : "";
  if (sClean && sClean !== "all" && sClean !== "all status") {
    query.status = new RegExp(`^${status.trim()}$`, "i");
  }

  const rClean = role ? role.trim().toLowerCase() : "";
  if (rClean && rClean !== "all" && rClean !== "all roles") {
    query.$or = [
      { roleName: new RegExp(`^${role.trim()}$`, "i") },
      { role: new RegExp(`^${role.trim()}$`, "i") },
    ];
  }

  const dClean = department ? department.trim().toLowerCase() : "";
  if (dClean && dClean !== "all" && dClean !== "all departments") {
    query.department = new RegExp(department.trim(), "i");
  }

  if (search) {
    const reg = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const searchConditions = [
      { name: reg },
      { email: reg },
      { username: reg },
      { phone: reg },
      { department: reg },
      { roleName: reg },
    ];
    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: searchConditions }];
      delete query.$or;
    } else {
      query.$or = searchConditions;
    }
  }

  const skip = (page - 1) * limit;

  const [users, total, allUsersList, roleAgg] = await Promise.all([
    User.find(query).populate("roleId", "name").skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(query),
    User.find({ status: { $ne: "deleted" } }),
    User.aggregate([
      { $match: { status: { $ne: "deleted" } } },
      { $group: { _id: "$roleName", count: { $sum: 1 } } },
    ]),
  ]);

  const totalCount = allUsersList.length;
  const activeCount = allUsersList.filter((u) => u.status === "active").length;
  const inactiveCount = allUsersList.filter((u) => u.status === "inactive").length;
  const suspendedCount = allUsersList.filter((u) => u.status === "suspended").length;
  const blockedCount = allUsersList.filter((u) => u.status === "blocked").length;

  // Build dynamic role distribution array with exact percentages
  const roleDistribution = roleAgg.map((r) => {
    const rName = r._id || "OTHER";
    const cnt = r.count;
    const pct = totalCount > 0 ? ((cnt / totalCount) * 100).toFixed(1) : "0.0";
    return {
      role: rName,
      count: cnt,
      percent: `${pct}%`,
    };
  });

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    },
    counts: {
      total: totalCount,
      active: activeCount,
      inactive: inactiveCount,
      suspended: suspendedCount,
      blocked: blockedCount,
    },
    roleDistribution,
  };
};

// ---------------- UPDATE ----------------
export const updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user || user.status === "deleted") {
    throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
  }

  if (data.name !== undefined) user.name = data.name;
  if (data.username !== undefined) user.username = data.username;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.countryCode !== undefined) user.countryCode = data.countryCode;
  if (data.dateOfBirth !== undefined) user.dateOfBirth = data.dateOfBirth;
  if (data.gender !== undefined) user.gender = data.gender;
  if (data.department !== undefined) user.department = data.department;
  if (data.roleName !== undefined) user.roleName = data.roleName.toUpperCase();
  if (data.designation !== undefined) user.designation = data.designation;
  if (data.status !== undefined) user.status = data.status.toLowerCase();
  if (data.emailVerified !== undefined) user.emailVerified = data.emailVerified;
  if (data.loginAccess !== undefined) user.loginAccess = data.loginAccess;
  if (data.forcePasswordChange !== undefined) user.forcePasswordChange = data.forcePasswordChange;
  if (data.sendWelcomeEmail !== undefined) user.sendWelcomeEmail = data.sendWelcomeEmail;
  if (data.notes !== undefined) user.notes = data.notes;

  await user.save();
  return sanitizeUser(user);
};

// ---------------- CHANGE PASSWORD ----------------
export const changePassword = async (id, oldPassword, newPassword) => {
  const user = await User.findById(id).select("+password");
  if (!user || user.status === "deleted") {
    throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
  }
  const isMatch = await user.isPasswordMatch(oldPassword);
  if (!isMatch) {
    throw new AppError("Old password is incorrect", 401, ErrorCodes.AUTH_INVALID_CREDENTIALS);
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
