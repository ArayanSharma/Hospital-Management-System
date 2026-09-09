import mongoose from "mongoose";
import InsurancePolicy from "./insurancePolicy.model.js";
import Patient from "../patients/patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { getOrSetCache, invalidatePattern, delCache } from "../../utils/redisCache.js";

export const createPolicyService = async (data) => {
  const trimmedPolicyNumber = data.policyNumber?.trim();

  const existing = await InsurancePolicy.findOne({
    policyNumber: new RegExp(`^${trimmedPolicyNumber}$`, "i"),
  });
  if (existing) {
    throw new AppError("Policy number already exists.", 400, ErrorCodes.VALIDATION_ERROR);
  }

  let patient = null;
  if (data.patientId) {
    patient = await Patient.findById(data.patientId);
  }
  if (!patient && data.patientName) {
    patient = await Patient.findOne({ name: new RegExp(data.patientName, "i") });
  }

  const validFromDate = new Date(data.validFrom);
  const validUntilDate = new Date(data.validUntil);

  if (validFromDate >= validUntilDate) {
    throw new AppError("Policy validUntil date must be strictly after validFrom date", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const policy = await InsurancePolicy.create({
    patientId: patient ? patient._id : null,
    patientName: data.patientName || (patient ? patient.name : "Patient"),
    uhid: data.uhid || (patient ? patient.patientId : "UHID"),
    dateOfBirth: data.dateOfBirth || "16 Aug 1990",
    mobileNumber: data.mobileNumber || "9876543210",
    providerName: data.providerName || "Star Health & Allied Insurance Co. Ltd.",
    policyNumber: trimmedPolicyNumber,
    memberId: data.memberId || "",
    policyType: data.policyType || "Family Floater",
    tpaName: data.tpaName || "Health India TPA Services Pvt. Ltd.",
    coverageAmount: Math.max(0, Number(data.coverageAmount || 0)),
    sumInsured: Math.max(0, Number(data.sumInsured || data.coverageAmount || 0)),
    currency: data.currency || "INR",
    validFrom: validFromDate,
    validUntil: validUntilDate,
    renewalDate: data.renewalDate ? new Date(data.renewalDate) : null,
    status: data.status || "Active",
    employer: data.employer || "",
    relationship: data.relationship || "Self",
    notes: data.notes || "",
    documents: data.documents || {},
  });

  // Invalidate Redis Insurance Caches
  await invalidatePattern("hms:insurance:*");
  await invalidatePattern("hms:route:insurance*");

  return policy;
};

export const getAllPoliciesService = async ({ search, status } = {}) => {
  const query = {};
  if (status && status !== "all" && status !== "All Status") {
    query.status = new RegExp(status, "i");
  }
  if (search) {
    const reg = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { patientName: reg },
      { uhid: reg },
      { policyNumber: reg },
      { providerName: reg },
    ];
  }

  const policies = await InsurancePolicy.find(query).sort({ createdAt: -1 });
  return policies;
};

const findPolicyByIdOrNumber = async (idOrNumber) => {
  if (mongoose.Types.ObjectId.isValid(idOrNumber)) {
    const found = await InsurancePolicy.findById(idOrNumber);
    if (found) return found;
  }
  return await InsurancePolicy.findOne({ policyNumber: idOrNumber });
};

export const getPolicyByIdService = async (id) => {
  const { data: policy } = await getOrSetCache(
    `hms:insurance:policy:${id}`,
    () => findPolicyByIdOrNumber(id),
    600
  );

  if (!policy) {
    throw new AppError("Policy not found", 404, ErrorCodes.NOT_FOUND);
  }
  return policy;
};

export const updatePolicyService = async (id, data, currentUser) => {
  const policy = await findPolicyByIdOrNumber(id);
  if (!policy) {
    throw new AppError("Policy not found", 404, ErrorCodes.NOT_FOUND);
  }

  if ((policy.claimsCount || 0) > 0) {
    if (data.policyNumber && data.policyNumber !== policy.policyNumber) {
      throw new AppError("Cannot change Policy Number after claims have been processed.", 400, ErrorCodes.VALIDATION_ERROR);
    }
    if (data.providerName && data.providerName !== policy.providerName) {
      throw new AppError("Cannot change Insurance Provider Name after claims have been processed.", 400, ErrorCodes.VALIDATION_ERROR);
    }
  }

  Object.assign(policy, data);
  await policy.save();

  // Invalidate Redis Caches
  await delCache(`hms:insurance:policy:${id}`);
  await invalidatePattern("hms:route:insurance*");

  return policy;
};

export const togglePolicyStatusService = async (id) => {
  const policy = await findPolicyByIdOrNumber(id);
  if (!policy) {
    throw new AppError("Policy not found", 404, ErrorCodes.NOT_FOUND);
  }

  const currentStatus = (policy.status || "").toLowerCase();
  const nextStatus = currentStatus === "active" ? "Inactive" : "Active";
  policy.status = nextStatus;
  await policy.save();

  await delCache(`hms:insurance:policy:${id}`);
  await invalidatePattern("hms:route:insurance*");

  return { message: `Policy status updated to ${nextStatus}`, policy };
};

export const togglePolicyArchiveService = async (id) => {
  const policy = await findPolicyByIdOrNumber(id);
  if (!policy) {
    throw new AppError("Policy not found", 404, ErrorCodes.NOT_FOUND);
  }

  const isArchived = (policy.status || "").toLowerCase() === "archived";
  const nextStatus = isArchived ? "Active" : "Archived";
  policy.status = nextStatus;
  await policy.save();

  await delCache(`hms:insurance:policy:${id}`);
  await invalidatePattern("hms:route:insurance*");

  return { message: `Policy ${isArchived ? "restored" : "archived"} successfully`, policy };
};

export const deletePolicyService = async (id) => {
  const policy = await findPolicyByIdOrNumber(id);
  if (!policy) {
    throw new AppError("Policy not found", 404, ErrorCodes.NOT_FOUND);
  }
  policy.status = "Inactive";
  await policy.save();

  await delCache(`hms:insurance:policy:${id}`);
  await invalidatePattern("hms:route:insurance*");

  return { message: "Policy deactivated successfully" };
};

// Aliases for compatibility
export const createInsurancePolicy = createPolicyService;
export const getPolicies = getAllPoliciesService;
export const getPoliciesByPatient = async (patientId) => getAllPoliciesService({ search: patientId });
export const getPolicyById = getPolicyByIdService;
export const updateInsurancePolicy = updatePolicyService;