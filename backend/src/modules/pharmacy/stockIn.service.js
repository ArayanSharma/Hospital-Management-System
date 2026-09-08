import StockIn from "./stockIn.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createStockInTransaction = async (data, currentUser, requestMeta) => {
  const {
    supplier,
    invoiceNo,
    invoiceDate,
    purchaseType,
    referenceChallanNo,
    paymentTerms,
    expectedDeliveryDate,
    notes,
    items,
    subTotal,
    totalGst,
    grandTotal,
    receivedBy,
    checkedBy,
    storeLocation,
    remarks,
    printGrn,
  } = data;

  // Process items formatting
  const formattedItems = (items || []).map((item) => ({
    name: item.name || item.medicineName,
    dosageForm: item.dosageForm || "Tablet",
    batchNo: item.batchNo,
    expiryDate: new Date(item.expiryDate),
    purchasePrice: Number(item.purchasePrice || 0),
    qtyReceived: Number(item.qtyReceived || 0),
    unit: item.unit || "Strip",
    gstRate: Number(item.gstRate || 12),
    amount: Number(item.amount || (item.purchasePrice * item.qtyReceived * (1 + (item.gstRate || 12) / 100))),
  }));

  const calcSubTotal = formattedItems.reduce((sum, item) => sum + item.purchasePrice * item.qtyReceived, 0);
  const calcGst = formattedItems.reduce((sum, item) => sum + item.purchasePrice * item.qtyReceived * (item.gstRate / 100), 0);
  const calcGrandTotal = calcSubTotal + calcGst;

  const stockInRecord = await StockIn.create({
    supplier,
    invoiceNo,
    invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
    purchaseType: purchaseType || "Cash Purchase",
    referenceChallanNo,
    paymentTerms,
    expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
    notes,
    items: formattedItems,
    subTotal: Number(subTotal || calcSubTotal),
    totalGst: Number(totalGst || calcGst),
    grandTotal: Number(grandTotal || calcGrandTotal),
    receivedBy: receivedBy || (currentUser ? currentUser.name : "Dr. Admin"),
    checkedBy,
    storeLocation: storeLocation || "Main Pharmacy Store",
    remarks,
    printGrn: Boolean(printGrn),
    status: "completed",
  });

  if (currentUser) {
    await createAuditLog({
      userId: currentUser.id,
      action: "CREATE",
      resource: "stockIn",
      resourceId: stockInRecord._id,
      newValue: stockInRecord.toObject(),
      ipAddress: requestMeta?.ipAddress || "",
      userAgent: requestMeta?.userAgent || "",
    });
  }

  return stockInRecord;
};

export const getAllStockInTransactions = async ({ search, supplier, page = 1, limit = 10 }) => {
  const query = {};
  if (supplier) query.supplier = supplier;
  if (search) {
    query.$or = [
      { invoiceNo: { $regex: search, $options: "i" } },
      { supplier: { $regex: search, $options: "i" } },
      { "items.batchNo": { $regex: search, $options: "i" } },
      { "items.name": { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    StockIn.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    StockIn.countDocuments(query),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
};

export const getStockInById = async (id) => {
  const record = await StockIn.findById(id);
  if (!record) {
    throw new AppError("Stock In transaction not found", 404, ErrorCodes.NOT_FOUND);
  }
  return record;
};
