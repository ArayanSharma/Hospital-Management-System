import Bed from "./bed.model.js";
import Ward from "../wards/ward.model.js";
import Admission from "../ipd/admission.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { getOrSetCache, invalidatePattern, acquireLock, releaseLock } from "../../utils/redisCache.js";

export const createBed = async (data, currentUser, requestMeta) => {
  const { wardId, bedNumber } = data;

  const ward = await Ward.findById(wardId);
  if (!ward) {
    throw new AppError("Ward not found", 404, ErrorCodes.NOT_FOUND);
  }

  const existingBedCount = await Bed.countDocuments({ wardId });
  if (existingBedCount >= ward.capacity) {
    throw new AppError(
      "Ward capacity reached. Cannot add more beds.",
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const existing = await Bed.findOne({ wardId, bedNumber: bedNumber?.toString().trim() });
  if (existing) {
    throw new AppError(
      "Bed with this number already exists in this ward",
      409,
      ErrorCodes.VALIDATION_ERROR
    );
  }

  const bed = await Bed.create({ wardId, bedNumber: bedNumber?.toString().trim(), status: "available" });

  // Invalidate Redis bed cache
  await invalidatePattern("hms:beds:*");

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "bed",
    resourceId: bed._id,
    newValue: bed.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return bed;
};

export const getAllBeds = async ({ wardId, status }) => {
  const query = {};
  if (wardId) query.wardId = wardId;
  if (status) query.status = status;

  return Bed.find(query)
    .populate("wardId", "name type floor")
    .populate("currentPatientId", "name patientId phone gender")
    .sort({ bedNumber: 1 });
};

export const getAvailableBeds = async (wardId) => {
  const cacheKey = `hms:beds:available:${wardId || "all"}`;
  
  const { data: beds } = await getOrSetCache(
    cacheKey,
    () => {
      const query = { status: "available" };
      if (wardId) query.wardId = wardId;
      return Bed.find(query).populate("wardId", "name type floor");
    },
    300 // 5 mins cache
  );

  return beds || [];
};

export const getBedById = async (id) => {
  const bed = await Bed.findById(id)
    .populate("wardId", "name type floor")
    .populate("currentPatientId", "name patientId phone gender");

  if (!bed) {
    throw new AppError("Bed not found", 404, ErrorCodes.NOT_FOUND);
  }

  let activeAdmission = null;
  if (bed.status === "occupied") {
    activeAdmission = await Admission.findOne({ bedId: id, status: "admitted" })
      .populate("patientId", "name patientId phone gender")
      .populate({
        path: "doctorId",
        select: "doctorId specialization",
        populate: { path: "userId", select: "name" },
      });
  }

  return { ...bed.toObject(), activeAdmission };
};

export const updateBedStatus = async (id, status, maintenanceReason, currentUser, requestMeta) => {
  const validStatuses = ["available", "occupied", "maintenance", "cleaning"];
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid bed status value", 400, ErrorCodes.VALIDATION_ERROR);
  }

  // Edge Case: Maintenance reason required if status is maintenance
  if (status === "maintenance" && (!maintenanceReason || !maintenanceReason.trim())) {
    throw new AppError("Maintenance reason is required when setting bed status to maintenance", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const lockKey = `hms:lock:bed:${id}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("Bed status is currently being updated by another user", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const bed = await Bed.findById(id);
    if (!bed) {
      throw new AppError("Bed not found", 404, ErrorCodes.NOT_FOUND);
    }

    if (bed.status === "occupied" && status !== "occupied") {
      throw new AppError(
        "Cannot change status of an occupied bed directly. Discharge patient first via IPD module.",
        400,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const oldValue = bed.toObject();

    bed.status = status;
    bed.maintenanceReason = status === "maintenance" ? maintenanceReason.trim() : null;

    await bed.save();

    // Invalidate bed caches
    await invalidatePattern("hms:beds:*");

    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "bed",
      resourceId: bed._id,
      oldValue,
      newValue: bed.toObject(),
      ipAddress: requestMeta.ipAddress,
      userAgent: requestMeta.userAgent,
    });

    return bed;
  } finally {
    await releaseLock(lockKey);
  }
};