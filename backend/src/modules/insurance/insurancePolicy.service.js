import InsurancePolicy from "./insurancePolicy.model.js";
import Patient from "../patients/patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { createAuditLog } from "../audit-logs/audit-log.service.js";

export const createInsurancePolicy = async (data, currentUser, requestMeta) => {
  const { patientId, providerName, policyNumber, coverageAmount, validFrom, validUntil } = data;

  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404, ErrorCodes.NOT_FOUND);
  }

  const existing = await InsurancePolicy.findOne({ policyNumber });
  if (existing) {
    throw new AppError("Policy number already exists", 409, ErrorCodes.VALIDATION_ERROR);
  }

  if (new Date(validFrom) >= new Date(validUntil)) {
    throw new AppError("validUntil must be after validFrom", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const policy = await InsurancePolicy.create({
    patientId,
    providerName,
    policyNumber,
    coverageAmount,
    validFrom,
    validUntil,
  });

  await createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    resource: "insurance",
    resourceId: policy._id,
    newValue: policy.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return policy;
};

export const getPolicies = async (query = {}) => {
  const filter = {};
  if (query.patientId) filter.patientId = query.patientId;
  return InsurancePolicy.find(filter).populate("patientId", "name patientId").sort({ createdAt: -1 });
};

export const getPoliciesByPatient = async (patientId) => {
  return InsurancePolicy.find({ patientId }).populate("patientId", "name patientId").sort({ createdAt: -1 });
};

export const getPolicyById = async (id) => {
  const policy = await InsurancePolicy.findById(id).populate("patientId", "name patientId");
  if (!policy) {
    throw new AppError("Insurance policy not found", 404, ErrorCodes.NOT_FOUND);
  }

  // Real-time expiry check
  if (policy.status === "active" && new Date() > policy.validUntil) {
    policy.status = "expired";
    await policy.save();
  }

  return policy;
};

export const updateInsurancePolicy = async (id, data, currentUser, requestMeta) => {
  const policy = await InsurancePolicy.findById(id);
  if (!policy) {
    throw new AppError("Insurance policy not found", 404, ErrorCodes.NOT_FOUND);
  }

  const oldValue = policy.toObject();
  const { coverageAmount, validUntil, status } = data;

  if (coverageAmount !== undefined) policy.coverageAmount = coverageAmount;
  if (validUntil !== undefined) policy.validUntil = validUntil;
  if (status !== undefined) policy.status = status;

  await policy.save();

  await createAuditLog({
    userId: currentUser.id,
    action: "UPDATE",
    resource: "insurance",
    resourceId: policy._id,
    oldValue,
    newValue: policy.toObject(),
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
  });

  return policy;
};