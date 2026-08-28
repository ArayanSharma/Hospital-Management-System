import Ward from "./ward.model.js";
import Bed from "../beds/bed.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createWard = async (data, currentUser, requestMeta) => {
  const { name, type, floor, capacity } = data;

  const existing = await Ward.findOne({ name });
  if (existing) {
    throw new AppError("Ward with this name already exists", 409, ErrorCodes.VALIDATION_ERROR);
  }

  const ward = await Ward.create({ name, type, floor, capacity });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "ward",
    resourceId: ward._id,
    newValue: ward.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return ward;
};

export const getAllWards = async ({ status, type }) => {
  const query = {};
  if (status) query.status = status;
  if (type) query.type = type;

  const wards = await Ward.find(query).sort({ name: 1 });

  const wardsWithBeds = await Promise.all(
    wards.map(async (ward) => {
      const beds = await Bed.find({ wardId: ward._id })
        .populate("currentPatientId", "name patientId")
        .sort({ bedNumber: 1 });

      const available = beds.filter((b) => b.status === "available").length;
      const occupied = beds.filter((b) => b.status === "occupied").length;
      const maintenance = beds.filter((b) => b.status === "maintenance").length;

      return {
        ...ward.toObject(),
        beds,
        total: beds.length || ward.capacity || 10,
        available,
        occupied,
        maintenance,
      };
    })
  );

  return wardsWithBeds;
};

export const getWardById = async (id) => {
  const ward = await Ward.findById(id);
  if (!ward) {
    throw new AppError("Ward not found", 404, ErrorCodes.NOT_FOUND);
  }

  const beds = await Bed.find({ wardId: id })
    .populate("currentPatientId", "name patientId")
    .sort({ bedNumber: 1 });

  return { ...ward.toObject(), beds };
};

export const updateWard = async (id, data, currentUser, requestMeta) => {
  const ward = await Ward.findById(id);
  if (!ward) {
    throw new AppError("Ward not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = ward.toObject();
  const { name, type, floor, capacity, status } = data;

  if (name !== undefined) ward.name = name;
  if (type !== undefined) ward.type = type;
  if (floor !== undefined) ward.floor = floor;
  if (capacity !== undefined) ward.capacity = capacity;
  if (status !== undefined) ward.status = status;

  await ward.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "ward",
    resourceId: ward._id,
    oldValue,
    newValue: ward.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return ward;
};

export const deleteWard = async (id, currentUser, requestMeta) => {
  const ward = await Ward.findById(id);
  if (!ward) {
    throw new AppError("Ward not found", 404, ErrorCodes.NOT_FOUND);
  }

  const occupiedBeds = await Bed.countDocuments({ wardId: id, status: "occupied" });
  if (occupiedBeds > 0) {
    throw new AppError(
      "Cannot deactivate ward with occupied beds",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const oldValue = ward.toObject();
  ward.status = "inactive";
  await ward.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    resource: "ward",
    resourceId: ward._id,
    oldValue,
    newValue: null,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return { message: "Ward deactivated successfully" };
};