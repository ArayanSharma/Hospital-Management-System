import Medicine from "./medicine.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createMedicine = async (data, currentUser, requestMeta) => {
  const { name, genericName, category, manufacturer, unit, price, reorderLevel } = data;

  const medicine = await Medicine.create({
    name,
    genericName,
    category,
    manufacturer,
    unit,
    price,
    reorderLevel,
  });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "medicine",
    resourceId: medicine._id,
    newValue: medicine.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return medicine;
};

export const getAllMedicines = async ({ search, category, status }) => {
  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { genericName: { $regex: search, $options: "i" } },
    ];
  }
  return Medicine.find(query).sort({ name: 1 });
};

export const getMedicineById = async (id) => {
  const medicine = await Medicine.findById(id);
  if (!medicine) {
    throw new AppError("Medicine not found", 404, ErrorCodes.NOT_FOUND);
  }
  return medicine;
};

export const updateMedicine = async (id, data, currentUser, requestMeta) => {
  const medicine = await Medicine.findById(id);
  if (!medicine) {
    throw new AppError("Medicine not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = medicine.toObject();
  const { name, genericName, category, manufacturer, unit, price, reorderLevel, status } = data;

  if (name !== undefined) medicine.name = name;
  if (genericName !== undefined) medicine.genericName = genericName;
  if (category !== undefined) medicine.category = category;
  if (manufacturer !== undefined) medicine.manufacturer = manufacturer;
  if (unit !== undefined) medicine.unit = unit;
  if (price !== undefined) medicine.price = price;
  if (reorderLevel !== undefined) medicine.reorderLevel = reorderLevel;
  if (status !== undefined) medicine.status = status;

  await medicine.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "medicine",
    resourceId: medicine._id,
    oldValue,
    newValue: medicine.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return medicine;
};