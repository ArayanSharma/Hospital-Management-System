import Department from "./department.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createDepartment = async (data, currentUser, requestMeta) => {
  const { name, code, description } = data;

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
  });

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

export const getAllDepartments = async ({ status }) => {
  const query = {};
  if (status) query.status = status;

  return Department.find(query)
    .populate("headDoctorId", "name specialization")
    .sort({ name: 1 });
};

export const getDepartmentById = async (id) => {
  const department = await Department.findById(id).populate(
    "headDoctorId",
    "name specialization"
  );
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
  const { name, description, headDoctorId, status } = data;

  if (name !== undefined) department.name = name;
  if (description !== undefined) department.description = description;
  if (headDoctorId !== undefined) department.headDoctorId = headDoctorId;
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

  // Soft delete — hospital mein department "delete" karna rare hai,
  // usually deactivate hota hai (historical records ke liye reference chahiye)
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