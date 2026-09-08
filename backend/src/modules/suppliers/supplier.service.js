import Supplier from "./supplier.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";

// ---------------- CREATE SUPPLIER (With Redis Mutex Lock) ----------------
export const createSupplier = async (data, currentUser, requestMeta) => {
  const supplierName = data.name || data.supplierName || "";
  const sanitizedGst = data.gstNumber ? data.gstNumber.trim().toUpperCase() : "";

  const lockKey = `hms:lock:supplier:${sanitizedGst || supplierName.replace(/\s+/g, "_")}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A supplier entry with this GST/name is currently being created", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    if (sanitizedGst) {
      const existing = await Supplier.findOne({ gstNumber: sanitizedGst });
      if (existing) {
        throw new AppError("Supplier with this GST number already exists", 409, ErrorCodes.VALIDATION_ERROR);
      }
    }

    const supplier = await Supplier.create({
      name: supplierName,
      companyType: data.companyType,
      gstNumber: sanitizedGst,
      contactPerson: data.contactPerson,
      designation: data.designation,
      phone: data.phone || data.phoneNumber,
      email: data.email ? data.email.toLowerCase().trim() : null,
      alternatePhone: data.alternatePhone,
      website: data.website,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      pinCode: data.pinCode,
      country: data.country || "India",
      category: data.category || data.supplierCategory || "Pharmaceuticals",
      paymentTerms: data.paymentTerms,
      creditLimit: Number(data.creditLimit || 0),
      outstandingBalance: Number(data.outstandingBalance || 0),
      preferredSupplier: data.preferredSupplier === "Yes" || data.preferredSupplier === true,
      panNumber: data.panNumber,
      notes: data.notes,
      status: data.status ? data.status.toLowerCase() : "active",
    });

    await invalidatePattern("hms:supplier:*");
    await invalidatePattern("hms:route:supplier*");

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "CREATE",
        resource: "supplier",
        resourceId: supplier._id,
        newValue: supplier.toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }

    return supplier;
  } finally {
    await releaseLock(lockKey);
  }
};

export const getAllSuppliers = async ({ status, search, category, page = 1, limit = 10 }) => {
  const query = {};
  if (status && status !== "all") query.status = status;
  if (category && category !== "all") query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { contactPerson: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { gstNumber: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [suppliers, total] = await Promise.all([
    Supplier.find(query).sort({ name: 1 }).skip(skip).limit(limitNum),
    Supplier.countDocuments(query),
  ]);

  return {
    suppliers,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

export const getSupplierById = async (id) => {
  const { data: supplier } = await getOrSetCache(
    `hms:supplier:detail:${id}`,
    () => Supplier.findById(id),
    600
  );

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
  const fields = [
    "name",
    "companyType",
    "gstNumber",
    "contactPerson",
    "designation",
    "phone",
    "email",
    "alternatePhone",
    "website",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "pinCode",
    "country",
    "category",
    "paymentTerms",
    "creditLimit",
    "outstandingBalance",
    "preferredSupplier",
    "panNumber",
    "notes",
    "status",
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined) {
      if (field === "preferredSupplier") {
        supplier[field] = data[field] === "Yes" || data[field] === true;
      } else {
        supplier[field] = data[field];
      }
    }
  });

  await supplier.save();

  await delCache(`hms:supplier:detail:${id}`);
  await invalidatePattern("hms:supplier:*");
  await invalidatePattern("hms:route:supplier*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "supplier",
      resourceId: supplier._id,
      oldValue,
      newValue: supplier.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

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

  await delCache(`hms:supplier:detail:${id}`);
  await invalidatePattern("hms:supplier:*");
  await invalidatePattern("hms:route:supplier*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "DELETE",
      resource: "supplier",
      resourceId: supplier._id,
      oldValue,
      newValue: null,
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return { message: "Supplier deactivated successfully" };
};

export const paySupplierOutstandingService = async (id, payAmount, paymentMode, notes, currentUser, requestMeta) => {
  const lockKey = `hms:lock:supplier:pay:${id}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("A payment disbursement for this supplier is currently processing", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      throw new AppError("Supplier not found", 404, ErrorCodes.NOT_FOUND);
    }

    const amt = Number(payAmount || 0);
    if (amt <= 0) {
      throw new AppError("Payment amount must be greater than 0", 400, ErrorCodes.VALIDATION_ERROR);
    }

    const oldValue = supplier.toObject();
    supplier.outstandingBalance = Math.max(0, (supplier.outstandingBalance || 0) - amt);
    supplier.paymentHistory = supplier.paymentHistory || [];
    supplier.paymentHistory.push({
      payAmount: amt,
      paymentMode: paymentMode || "Bank Transfer",
      notes: notes || "Vendor Outstanding Disbursed",
      date: new Date(),
      processedBy: currentUser?.name || "Finance Admin",
    });

    await supplier.save();

    await delCache(`hms:supplier:detail:${id}`);
    await invalidatePattern("hms:supplier:*");
    await invalidatePattern("hms:route:supplier*");

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "PAY_SUPPLIER",
        resource: "supplier",
        resourceId: supplier._id,
        oldValue,
        newValue: supplier.toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }

    return { message: `Payment of ₹${amt} disbursed successfully to ${supplier.name}`, supplier };
  } finally {
    await releaseLock(lockKey);
  }
};

export const toggleSupplierStatusService = async (id, currentUser, requestMeta) => {
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    throw new AppError("Supplier not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = supplier.toObject();
  supplier.status = supplier.status === "active" ? "inactive" : "active";
  await supplier.save();

  await delCache(`hms:supplier:detail:${id}`);
  await invalidatePattern("hms:supplier:*");
  await invalidatePattern("hms:route:supplier*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "UPDATE",
      resource: "supplier",
      resourceId: supplier._id,
      oldValue,
      newValue: supplier.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return { message: `Supplier status updated to ${supplier.status}`, supplier };
};

export const toggleSupplierArchiveService = async (id, currentUser, requestMeta) => {
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    throw new AppError("Supplier not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = supplier.toObject();
  supplier.status = supplier.status === "archived" ? "active" : "archived";
  await supplier.save();

  await delCache(`hms:supplier:detail:${id}`);
  await invalidatePattern("hms:supplier:*");
  await invalidatePattern("hms:route:supplier*");

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "ARCHIVE_SUPPLIER",
      resource: "supplier",
      resourceId: supplier._id,
      oldValue,
      newValue: supplier.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return { message: `Supplier ${supplier.status === "archived" ? "archived" : "restored"} successfully`, supplier };
};