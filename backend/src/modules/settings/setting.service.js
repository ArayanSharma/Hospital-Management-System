import Setting from "./setting.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

// ---------------- GET (singleton — always returns the one doc, creates default if missing) ----------------
export const getSettings = async () => {
  let settings = await Setting.findOne();

  if (!settings) {
    // Pehli baar access hone pe default settings create ho jayengi
    settings = await Setting.create({
      hospitalName: "My Hospital",
    });
  }

  return settings;
};

// ---------------- UPDATE (singleton — hamesha wahi ek document update hoga) ----------------
export const updateSettings = async (data, currentUser, requestMeta) => {
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
    settings.invoiceSettings = { ...settings.invoiceSettings.toObject(), ...invoiceSettings };
  }
  if (notificationSettings !== undefined) {
    settings.notificationSettings = { ...settings.notificationSettings.toObject(), ...notificationSettings };
  }

  await settings.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "setting",
    resourceId: settings._id,
    oldValue,
    newValue: settings.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return settings;
};