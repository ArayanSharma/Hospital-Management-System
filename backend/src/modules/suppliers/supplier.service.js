import Supplier from "./supplier.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createSupplier = async (data, currentUser, requestMeta) => {
  const supplier = await Supplier.create({
    name: data.name || data.supplierName,
    companyType: data.companyType,
    gstNumber: data.gstNumber,
    contactPerson: data.contactPerson,
    designation: data.designation,
    phone: data.phone || data.phoneNumber,
    email: data.email,
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
    outstandingBalance: Number(data.outstandingBalance || 45000),
    preferredSupplier: data.preferredSupplier === "Yes" || data.preferredSupplier === true,
    panNumber: data.panNumber,
    notes: data.notes,
    status: data.status ? data.status.toLowerCase() : "active",
  });

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
};

export const getAllSuppliers = async ({ status, search, category, page = 1, limit = 10 }) => {
  // Auto-seed initial suppliers if collection is empty
  const count = await Supplier.countDocuments();
  if (count === 0) {
    await Supplier.insertMany([
      { name: "Medilife Pharma Pvt. Ltd.", companyType: "Private Limited", gstNumber: "27AAACM1234A1Z5", contactPerson: "Rajesh Kumar", designation: "Manager", phone: "9876543210", email: "rajesh@medilife.com", city: "Mumbai", state: "Maharashtra", country: "India", category: "Pharmaceuticals", paymentTerms: "Net 30", creditLimit: 500000, outstandingBalance: 45000, preferredSupplier: true, status: "active" },
      { name: "HealthCare Distributors", companyType: "Partnership", gstNumber: "24AABCH5678B1Z2", contactPerson: "Sanjay Verma", designation: "Sales Head", phone: "9823456789", email: "sanjay@healthcare.com", city: "Ahmedabad", state: "Gujarat", country: "India", category: "Pharmaceuticals", paymentTerms: "Net 15", creditLimit: 300000, outstandingBalance: 18500, preferredSupplier: true, status: "active" },
      { name: "MediSupplies India", companyType: "Sole Proprietorship", gstNumber: "07AAAFM9012C1Z8", contactPerson: "Anita Sharma", designation: "Proprietor", phone: "9811223344", email: "anita@medisupplies.in", city: "Delhi", state: "Delhi", country: "India", category: "Surgical", paymentTerms: "Immediate", creditLimit: 200000, outstandingBalance: 0, preferredSupplier: false, status: "active" },
      { name: "LifeCare Enterprises", companyType: "LLP", gstNumber: "29AAACL3456D1Z4", contactPerson: "Vikram Singh", designation: "Manager", phone: "9845098765", email: "vikram@lifecare.com", city: "Bengaluru", state: "Karnataka", country: "India", category: "Equipment", paymentTerms: "Net 60", creditLimit: 800000, outstandingBalance: 120000, preferredSupplier: true, status: "active" },
    ]);
  }

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
};

export const toggleSupplierStatusService = async (id, currentUser, requestMeta) => {
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    throw new AppError("Supplier not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = supplier.toObject();
  supplier.status = supplier.status === "active" ? "inactive" : "active";
  await supplier.save();

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