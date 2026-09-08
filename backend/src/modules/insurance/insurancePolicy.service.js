import mongoose from "mongoose";
import InsurancePolicy from "./insurancePolicy.model.js";
import Patient from "../patients/patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { getOrSetCache, invalidatePattern, delCache } from "../../utils/redisCache.js";

// Helper to seed initial DB policies if count is 0
export const ensureSamplePolicies = async () => {
  try {
    const count = await InsurancePolicy.countDocuments();
    if (count > 0) return;

    let patient = await Patient.findOne({ status: "active" });
    if (!patient) {
      patient = await Patient.create({
        name: "Priya Verma",
        patientId: "UHID12346",
        phone: "9876543210",
        gender: "Female",
        dateOfBirth: new Date("1990-08-16"),
      });
    }

    const samplePolicies = [
      {
        patientId: patient._id,
        patientName: "Priya Verma",
        uhid: "UHID12346",
        dateOfBirth: "16 Aug 1990",
        mobileNumber: "9876543210",
        providerName: "Star Health & Allied Insurance Co. Ltd.",
        policyNumber: "SH/2025/784512",
        policyType: "Family Floater",
        tpaName: "Health India TPA Services Pvt. Ltd.",
        coverageAmount: 500000,
        sumInsured: 500000,
        currency: "INR",
        validFrom: new Date("2025-04-01"),
        validUntil: new Date("2026-03-31"),
        renewalDate: new Date("2026-04-01"),
        status: "Active",
        employer: "ABC Pvt. Ltd.",
        relationship: "Self",
      },
      {
        patientId: patient._id,
        patientName: "Ramesh Kumar",
        uhid: "UHID12347",
        dateOfBirth: "10 Dec 1985",
        mobileNumber: "9123456780",
        providerName: "HDFC ERGO Health",
        policyNumber: "HDFCERGO/563214",
        policyType: "Individual Health",
        tpaName: "Medi Assist TPA",
        coverageAmount: 1000000,
        sumInsured: 1000000,
        currency: "INR",
        validFrom: new Date("2025-01-15"),
        validUntil: new Date("2026-01-14"),
        renewalDate: new Date("2026-01-15"),
        status: "Active",
        relationship: "Self",
      },
    ];

    await InsurancePolicy.insertMany(samplePolicies);
  } catch (err) {
    console.error("Error seeding sample policies:", err);
  }
};

export const createPolicyService = async (data) => {
  await ensureSamplePolicies();
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
  await ensureSamplePolicies();
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