import Supplier from "./supplier.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createSupplier = async (data, currentUser, requestMeta) => {
  const { name, company, phone, email, address } = data;

  const supplier = await Supplier.create({ name, company, phone, email, address });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "supplier",
    resourceId: supplier._id,
    newValue: supplier.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return supplier;
};

export const getAllSuppliers = async ({ status, search }) => {
  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }
  return Supplier.find(query).sort({ name: 1 });
};

export const getSupplierById = async (id) => {
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    throw new AppError("Supplier not found", 404, ErrorCodes.NOT_FOUND);
  }
  return supplier;
};

export const updateSupplier = async (id, data, currentUser, requestMeta) => {
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    throw new AppError("Supplier not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = supplier.toObject();
  const { name, company, phone, email, address, status } = data;

  if (name !== undefined) supplier.name = name;
  if (company !== undefined) supplier.company = company;
  if (phone !== undefined) supplier.phone = phone;
  if (email !== undefined) supplier.email = email;
  if (address !== undefined) supplier.address = address;
  if (status !== undefined) supplier.status = status;

  await supplier.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "supplier",
    resourceId: supplier._id,
    oldValue,
    newValue: supplier.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return supplier;
};

export const deleteSupplier = async (id, currentUser, requestMeta) => {
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    throw new AppError("Supplier not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = supplier.toObject();
  supplier.status = "inactive";
  await supplier.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    resource: "supplier",
    resourceId: supplier._id,
    oldValue,
    newValue: null,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return { message: "Supplier deactivated successfully" };
};