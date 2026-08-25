import Notification from "./notification.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";

// ---------------- CREATE (internal use — dusre modules yeh call karenge) ----------------
export const createNotification = async ({ userId, type, title, message, channel = "in-app", metadata = null }) => {
  try {
    return await Notification.create({ userId, type, title, message, channel, metadata });
  } catch (err) {
    // Audit log jaisa hi pattern — notification fail hone se main operation block nahi honi chahiye
    console.error("Notification creation failed:", err.message);
    return null;
  }
};

// ---------------- BULK CREATE (jaise sab doctors ko ek saath notify karna) ----------------
export const createBulkNotifications = async (userIds, { type, title, message, channel = "in-app", metadata = null }) => {
  try {
    const docs = userIds.map((userId) => ({ userId, type, title, message, channel, metadata }));
    return await Notification.insertMany(docs);
  } catch (err) {
    console.error("Bulk notification creation failed:", err.message);
    return [];
  }
};

// ---------------- GET MY NOTIFICATIONS ----------------
export const getMyNotifications = async (userId, { page = 1, limit = 20, isRead }) => {
  const query = { userId };
  if (isRead !== undefined) query.isRead = isRead === "true";

  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Notification.countDocuments(query),
    Notification.countDocuments({ userId, isRead: false }),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

// ---------------- MARK AS READ ----------------
export const markAsRead = async (id, userId) => {
  const notification = await Notification.findOne({ _id: id, userId });
  if (!notification) {
    throw new AppError("Notification not found", 404, ErrorCodes.NOT_FOUND);
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};

// ---------------- MARK ALL AS READ ----------------
export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return { message: "All notifications marked as read" };
};