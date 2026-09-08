import Medicine from "./medicine.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";

export const createMedicine = async (data, currentUser, requestMeta) => {
  const medicineName = data.name || (data.genericName && data.strength ? `${data.genericName} ${data.strength}` : data.genericName || "Unnamed Medicine");

  const sanitizedCode = data.code ? data.code.trim().toUpperCase() : "";
  const lockKey = `hms:lock:medicine:${sanitizedCode || medicineName.replace(/\s+/g, "_")}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A medicine with this code/name is currently being created", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    if (sanitizedCode) {
      const existing = await Medicine.findOne({ code: sanitizedCode });
      if (existing) {
        throw new AppError("Medicine with this code already exists", 409, ErrorCodes.VALIDATION_ERROR);
      }
    }

    const medicine = await Medicine.create({
      code: sanitizedCode || `MED-${Date.now()}`,
      name: medicineName,
      brandName: data.brandName,
      genericName: data.genericName,
      category: data.category,
      therapeuticCategory: data.therapeuticCategory,
      manufacturer: data.manufacturer,
      supplier: data.supplier,
      countryOfOrigin: data.countryOfOrigin,
      dosageForm: data.dosageForm,
      strength: data.strength,
      packSize: data.packSize,
      unit: data.unit || "Strip",
      price: Number(data.unitPrice || data.price || data.sellingPrice || 0),
      mrp: Number(data.mrp || 0),
      gstRate: Number(data.gstRate || 12),
      purchasePrice: Number(data.purchasePrice || 0),
      margin: Number(data.margin || 0),
      sellingPrice: Number(data.sellingPrice || data.unitPrice || data.price || 0),
      minStockLevel: Number(data.minStockLevel || 50),
      reorderLevel: Number(data.reorderLevel || 10),
      prescriptionRequired: data.prescriptionRequired === "Yes" || data.prescriptionRequired === true,
      controlledMedicine: data.controlledMedicine === "Yes" || data.controlledMedicine === true,
      shelfLifeValue: Number(data.shelfLifeValue || 24),
      shelfLifeUnit: data.shelfLifeUnit || "Months",
      description: data.description,
      status: data.status ? data.status.toLowerCase() : "active",
    });

    await invalidatePattern("hms:medicine:*");
    await invalidatePattern("hms:route:medicine*");

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "CREATE",
        resource: "medicine",
        resourceId: medicine._id,
        newValue: medicine.toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }

    return medicine;
  } finally {
    await releaseLock(lockKey);
  }
};

export const getAllMedicines = async ({ search, category, manufacturer, status, page = 1, limit = 10, sortBy = "name", sortOrder = "asc" }) => {
  const query = {};
  if (status && status !== "all") {
    query.status = status.toLowerCase() === "active" ? "active" : status.toLowerCase() === "inactive" ? "inactive" : status;
  }
  if (category && category !== "all") query.category = category;
  if (manufacturer && manufacturer !== "all") query.manufacturer = manufacturer;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brandName: { $regex: search, $options: "i" } },
      { genericName: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
      { manufacturer: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  const [items, total] = await Promise.all([
    Medicine.find(query).sort(sort).skip(skip).limit(limitNum),
    Medicine.countDocuments(query),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

export const getMedicineById = async (id) => {
  const { data: medicine } = await getOrSetCache(
    `hms:medicine:detail:${id}`,
    () => Medicine.findById(id),
    600
  );

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
  const fields = [
    "code",
    "name",
    "brandName",
    "genericName",
    "category",
    "therapeuticCategory",
    "manufacturer",
    "supplier",
    "countryOfOrigin",
    "dosageForm",
    "strength",
    "packSize",
    "unit",
    "price",
    "mrp",
    "gstRate",
    "purchasePrice",
    "margin",
    "sellingPrice",
    "minStockLevel",
    "reorderLevel",
    "prescriptionRequired",
    "controlledMedicine",
    "shelfLifeValue",
    "shelfLifeUnit",
    "description",
    "status",
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined) {
      if (field === "prescriptionRequired" || field === "controlledMedicine") {
        medicine[field] = data[field] === "Yes" || data[field] === true;
      } else {
        medicine[field] = data[field];
      }
    }
  });

  await medicine.save();

  await delCache(`hms:medicine:detail:${id}`);
  await invalidatePattern("hms:medicine:*");
  await invalidatePattern("hms:route:medicine*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "medicine",
      resourceId: medicine._id,
      oldValue,
      newValue: medicine.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return medicine;
};

export const getMedicineStats = async () => {
  const { data: stats } = await getOrSetCache(
    "hms:medicine:stats",
    async () => {
      const [
        totalMedicines,
        activeMedicines,
        inactiveMedicines,
        categories,
        manufacturers,
        therapeuticAgg,
        manufacturerAgg,
        gstAgg,
      ] = await Promise.all([
        Medicine.countDocuments(),
        Medicine.countDocuments({ status: "active" }),
        Medicine.countDocuments({ status: "inactive" }),
        Medicine.distinct("category"),
        Medicine.distinct("manufacturer"),
        Medicine.aggregate([
          { $group: { _id: "$therapeuticCategory", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),
        Medicine.aggregate([
          { $group: { _id: "$manufacturer", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ]),
        Medicine.aggregate([
          { $group: { _id: "$gstRate", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ]);

      const total = totalMedicines || 1;

      const therapeuticCategories = therapeuticAgg.map((item, idx) => ({
        name: item._id || "General",
        count: item.count,
        percentage: ((item.count / total) * 100).toFixed(1) + "%",
        color: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"][idx % 5],
      }));

      const topManufacturers = manufacturerAgg.map((item, idx) => ({
        rank: idx + 1,
        name: item._id || "Vendor",
        productCount: `${item.count} Medicines`,
      }));

      const gstDistribution = gstAgg.map((item) => ({
        rate: `${item._id || 12}%`,
        count: item.count,
        percentage: ((item.count / total) * 100).toFixed(1) + "%",
      }));

      return {
        totalMedicines,
        activeMedicines,
        inactiveMedicines,
        totalCategories: categories.length,
        totalManufacturers: manufacturers.length,
        activePercentage: totalMedicines > 0 ? ((activeMedicines / totalMedicines) * 100).toFixed(1) + "%" : "0%",
        inactivePercentage: totalMedicines > 0 ? ((inactiveMedicines / totalMedicines) * 100).toFixed(1) + "%" : "0%",
        countsByTab: {
          all: totalMedicines,
          active: activeMedicines,
          inactive: inactiveMedicines,
        },
        categories: categories.filter(Boolean),
        manufacturers: manufacturers.filter(Boolean),
        therapeuticCategories,
        topManufacturers,
        gstDistribution,
      };
    },
    600
  );

  return stats;
};


