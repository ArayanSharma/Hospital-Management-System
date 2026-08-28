import Department from "./department.model.js";
import Doctor from "../doctors/doctor.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

// ---------------- CREATE DEPARTMENT ----------------
export const createDepartment = async (data, currentUser, requestMeta) => {
  const { name, code, description, headDoctorId, status } = data;

  const existing = await Department.findOne({
    $or: [{ name }, { code: code.toUpperCase() }],
  });
  if (existing) {
    throw new AppError(
      "Department with this name or code already exists",
      409,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const department = await Department.create({
    name,
    code: code.toUpperCase(),
    description,
    headDoctorId: headDoctorId || null,
    status: status || "active",
  });

  if (headDoctorId) {
    await Doctor.findByIdAndUpdate(headDoctorId, { departmentId: department._id });
  }

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "department",
    resourceId: department._id,
    newValue: department.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return department;
};

// ---------------- GET ALL (100% Pure MongoDB Dynamic Query) ----------------
export const getAllDepartments = async ({ page = 1, limit = 10, status, search, hodDoctorId }) => {
  const query = {};
  if (status && status !== "all") query.status = status;
  if (hodDoctorId && hodDoctorId !== "all") query.headDoctorId = hodDoctorId;

  const safeSearch = search ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
  if (safeSearch) {
    query.$or = [
      { name: { $regex: safeSearch, $options: "i" } },
      { code: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [departments, total, activeCount, inactiveCount, withHodCount] = await Promise.all([
    Department.find(query)
      .populate({
        path: "headDoctorId",
        select: "specialization photoUrl userId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Department.countDocuments(query),
    Department.countDocuments({ status: "active" }),
    Department.countDocuments({ status: "inactive" }),
    Department.countDocuments({ headDoctorId: { $ne: null } }),
  ]);

  return {
    departments,
    stats: {
      totalDepartments: total,
      activeDepartments: activeCount,
      inactiveDepartments: inactiveCount,
      withHodCount,
      activePercentage: total > 0 ? ((activeCount / total) * 100).toFixed(1) : "0.0",
      inactivePercentage: total > 0 ? ((inactiveCount / total) * 100).toFixed(1) : "0.0",
      hodPercentage: total > 0 ? ((withHodCount / total) * 100).toFixed(1) : "0.0",
    },
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((total || 1) / limit),
    },
  };
};

export const getDepartmentById = async (id) => {
  const department = await Department.findById(id).populate({
    path: "headDoctorId",
    populate: { path: "userId", select: "name email" },
  });
  if (!department) {
    throw new AppError("Department not found", 404, ErrorCodes.NOT_FOUND);
  }
  return department;
};

export const updateDepartment = async (id, data, currentUser, requestMeta) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new AppError("Department not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = department.toObject();
  const { name, description, headDoctorId, status, code } = data;

  if (name !== undefined) department.name = name;
  if (code !== undefined) department.code = code.toUpperCase();
  if (description !== undefined) department.description = description;
  if (headDoctorId !== undefined) {
    department.headDoctorId = headDoctorId || null;
    if (headDoctorId) {
      await Doctor.findByIdAndUpdate(headDoctorId, { departmentId: department._id });
    }
  }
  if (status !== undefined) department.status = status;

  await department.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "department",
    resourceId: department._id,
    oldValue,
    newValue: department.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return department;
};

export const deleteDepartment = async (id, currentUser, requestMeta) => {
  const department = await Department.findById(id);
  if (!department) {
    throw new AppError("Department not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = department.toObject();

  department.status = "inactive";
  await department.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    resource: "department",
    resourceId: department._id,
    oldValue,
    newValue: null,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return { message: "Department deactivated successfully" };
};