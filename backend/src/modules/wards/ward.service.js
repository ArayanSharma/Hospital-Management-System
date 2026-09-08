import Ward from "./ward.model.js";
import Bed from "../beds/bed.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { acquireLock, releaseLock, getOrSetCache, delCache, invalidatePattern } from "../../utils/redisCache.js";

export const createWard = async (data, currentUser, requestMeta) => {
  const { name, type, floor, capacity } = data;

  const lockKey = `hms:lock:ward:${(name || "").trim().replace(/\s+/g, "_")}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A ward with this name is currently being created", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const existing = await Ward.findOne({ name: (name || "").trim() });
    if (existing) {
      throw new AppError("Ward with this name already exists", 409, ErrorCodes.VALIDATION_ERROR);
    }

    const ward = await Ward.create({
      name: (name || "").trim(),
      type: type || "General",
      floor: floor || "Floor 1",
      capacity: Number(capacity || 10),
    });

    await invalidatePattern("hms:ward:*");
    await invalidatePattern("hms:route:ward*");

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "CREATE",
        resource: "ward",
        resourceId: ward._id,
        newValue: ward.toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }

    return ward;
  } finally {
    await releaseLock(lockKey);
  }
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
  const { data: result } = await getOrSetCache(
    `hms:ward:detail:${id}`,
    async () => {
      const ward = await Ward.findById(id);
      if (!ward) return null;

      const beds = await Bed.find({ wardId: id })
        .populate("currentPatientId", "name patientId")
        .sort({ bedNumber: 1 });

      return { ...ward.toObject(), beds };
    },
    300
  );

  if (!result) {
    throw new AppError("Ward not found", 404, ErrorCodes.NOT_FOUND);
  }

  return result;
};

export const updateWard = async (id, data, currentUser, requestMeta) => {
  const ward = await Ward.findById(id);
  if (!ward) {
    throw new AppError("Ward not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = ward.toObject();
  const { name, type, floor, capacity, status } = data;

  // Uniqueness check for name update
  if (name && name.trim() !== ward.name) {
    const existingName = await Ward.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existingName) {
      throw new AppError("Another ward with this name already exists", 409, ErrorCodes.VALIDATION_ERROR);
    }
    ward.name = name.trim();
  }

  // Capacity vs Bed count check
  if (capacity !== undefined && Number(capacity) < ward.capacity) {
    const existingBedsCount = await Bed.countDocuments({ wardId: id });
    if (Number(capacity) < existingBedsCount) {
      throw new AppError(
        `Cannot reduce ward capacity to ${capacity}. There are currently ${existingBedsCount} beds configured.`,
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }
    ward.capacity = Number(capacity);
  }

  if (type !== undefined) ward.type = type;
  if (floor !== undefined) ward.floor = floor;
  if (status !== undefined) ward.status = status;

  await ward.save();

  await delCache(`hms:ward:detail:${id}`);
  await invalidatePattern("hms:ward:*");
  await invalidatePattern("hms:route:ward*");
  await invalidatePattern("hms:beds:*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "ward",
      resourceId: ward._id,
      oldValue,
      newValue: ward.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

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
      "Cannot deactivate ward with occupied beds. Please reassign or discharge patients first.",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const oldValue = ward.toObject();
  ward.status = "inactive";
  await ward.save();

  await delCache(`hms:ward:detail:${id}`);
  await invalidatePattern("hms:ward:*");
  await invalidatePattern("hms:route:ward*");
  await invalidatePattern("hms:beds:*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "DELETE",
      resource: "ward",
      resourceId: ward._id,
      oldValue,
      newValue: null,
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return { message: "Ward deactivated successfully" };
};