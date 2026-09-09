import AuditLog from "./audit-log.model.js";
import { getOrSetCache, delCache } from "../../utils/redisCache.js";
import { dispatchAsyncEmail } from "../../utils/email/emailDispatcher.js";

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
    const newLog = await AuditLog.create({
      userId,
      action,
      resource,
      resourceId,
      oldValue,
      newValue,
      ipAddress,
      userAgent,
    });

    // Invalidate cached audit logs for this specific resource
    if (resourceId) {
      delCache(`hms:audit:res:${resourceId}`).catch((err) =>
        console.warn("⚠️ [Audit Cache Invalidate Warning]:", err.message)
      );
    }

    // Security Breach Detection & Super Admin Alert
    const actUpper = String(action || "").toUpperCase();
    const resUpper = String(resource || "").toUpperCase();
    if (
      actUpper.includes("BREACH") ||
      actUpper.includes("UNAUTHORIZED") ||
      actUpper.includes("SECURITY") ||
      resUpper.includes("SECURITY") ||
      actUpper.includes("SUSPICIOUS")
    ) {
      dispatchAsyncEmail({
        to: "arayan.sharma.dev@gmail.com",
        type: "security_audit_breach",
        data: {
          superAdminName: "Super Admin Officer",
          breachType: `Flagged Action: ${action}`,
          eventDetails: `Suspicious audit activity on resource "${resource}". Target ID: ${resourceId || "N/A"}.`,
          userIp: ipAddress || "127.0.0.1",
          timestamp: new Date().toLocaleString(),
          recommendedAction: "Inspect Super Admin Audit Logs and revoke compromised session tokens if necessary.",
        },
      });
    }

    return newLog;
  } catch (err) {
    // IMPORTANT: audit logging kabhi bhi main business logic ko fail nahi karni chahiye
    console.error("Audit log creation failed:", err.message);
    return null;
  }
};

export const triggerSecurityBreachAlertService = async ({ breachType, eventDetails, userIp, superAdminEmail }) => {
  dispatchAsyncEmail({
    to: superAdminEmail || "arayan.sharma.dev@gmail.com",
    type: "security_audit_breach",
    data: {
      superAdminName: "Super Admin Officer",
      breachType: breachType || "Unauthorized System Access Attempt",
      eventDetails: eventDetails || "Suspicious administrative data export or unauthorized privilege escalation.",
      userIp: userIp || "127.0.0.1",
      timestamp: new Date().toLocaleString(),
      recommendedAction: "Review security logs in Super Admin panel and immediately block source IP / user.",
    },
  });
  return { message: "Security audit breach alert dispatched to Super Admin." };
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
  if (!resourceId) return [];

  // Cache audit timeline history per resource in Redis for 10 minutes (600s)
  const { data: logs } = await getOrSetCache(
    `hms:audit:res:${resourceId}`,
    () =>
      AuditLog.find({ resourceId })
        .populate("userId", "name email")
        .sort({ createdAt: -1 }),
    600
  );

  return logs || [];
};