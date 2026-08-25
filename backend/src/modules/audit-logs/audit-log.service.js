import AuditLog from "./audit-log.model.js";

// ---------------- CREATE (internal use — dusre modules yeh call karenge) ----------------
export const createAuditLog = async ({
  userId,
  action,
  resource,
  resourceId = null,
  oldValue = null,
  newValue = null,
  ipAddress = null,
  userAgent = null,
}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      resource,
      resourceId,
      oldValue,
      newValue,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    // IMPORTANT: audit logging kabhi bhi main business logic ko fail nahi karni chahiye
    // Agar log save na ho paye, sirf console mein error print karo, throw mat karo
    console.error("Audit log creation failed:", err.message);
  }
};

// ---------------- READ (audit-logs API ke liye) ----------------
export const getAuditLogs = async ({
  page = 1,
  limit = 20,
  userId,
  resource,
  action,
  resourceId,
  startDate,
  endDate,
}) => {
  const query = {};

  if (userId) query.userId = userId;
  if (resource) query.resource = resource.toLowerCase();
  if (action) query.action = action.toUpperCase();
  if (resourceId) query.resourceId = resourceId;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AuditLog.countDocuments(query),
  ]);

  return {
    logs,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAuditLogsByResourceId = async (resourceId) => {
  return AuditLog.find({ resourceId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
};