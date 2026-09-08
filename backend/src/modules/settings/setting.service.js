import Setting from "./setting.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";

// ---------------- GET (Singleton — Cached in Redis) ----------------
export const getSettings = async () => {
  const { data: settings } = await getOrSetCache(
    "hms:settings:config",
    async () => {
      let doc = await Setting.findOne();
      if (!doc) {
        doc = await Setting.create({
          hospitalName: "My Hospital",
        });
      }
      return doc;
    },
    3600
  );

  return settings;
};

// ---------------- UPDATE (Singleton — Mutex Lock + Cache Invalidation) ----------------
export const updateSettings = async (data, currentUser, requestMeta) => {
  const lockKey = "hms:lock:settings:update";
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("Hospital configuration settings are currently being updated by another administrator", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({ hospitalName: data.hospitalName || "My Hospital" });
    }

    const oldValue = settings.toObject();

    const {
      hospitalName,
      logo,
      address,
      phone,
      email,
      timezone,
      currency,
      invoiceSettings,
      notificationSettings,
    } = data;

    if (hospitalName !== undefined) settings.hospitalName = hospitalName;
    if (logo !== undefined) settings.logo = logo;
    if (address !== undefined) settings.address = address;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (timezone !== undefined) settings.timezone = timezone;
    if (currency !== undefined) settings.currency = currency;
    if (invoiceSettings !== undefined) {
      settings.invoiceSettings = { ...(settings.invoiceSettings?.toObject ? settings.invoiceSettings.toObject() : settings.invoiceSettings || {}), ...invoiceSettings };
    }
    if (notificationSettings !== undefined) {
      settings.notificationSettings = { ...(settings.notificationSettings?.toObject ? settings.notificationSettings.toObject() : settings.notificationSettings || {}), ...notificationSettings };
    }

    await settings.save();

    await delCache("hms:settings:config");
    await invalidatePattern("hms:settings:*");
    await invalidatePattern("hms:route:setting*");

    if (currentUser) {
      await createAuditLog({
        userId: currentUser.id,
        action: "UPDATE",
        resource: "setting",
        resourceId: settings._id,
        oldValue,
        newValue: settings.toObject(),
        ipAddress: requestMeta?.ipAddress || "",
        userAgent: requestMeta?.userAgent || "",
      });
    }

    return settings;
  } finally {
    await releaseLock(lockKey);
  }
};