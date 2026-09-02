import InsurancePolicy from "./insurancePolicy.model.js";
import Patient from "../patients/patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";

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
      {
        patientId: patient._id,
        patientName: "Anita Sharma",
        uhid: "UHID12348",
        dateOfBirth: "05 May 1978",
        mobileNumber: "9988776655",
        providerName: "Max Bupa Health",
        policyNumber: "MAXBUPA/774512",
        policyType: "Senior Citizen",
        tpaName: "Heritage Health TPA",
        coverageAmount: 750000,
        sumInsured: 750000,
        currency: "INR",
        validFrom: new Date("2024-02-10"),
        validUntil: new Date("2025-02-09"),
        renewalDate: new Date("2025-02-10"),
        status: "Expired",
        relationship: "Self",
      },
      {
        patientId: patient._id,
        patientName: "Vikram Singh",
        uhid: "UHID12349",
        dateOfBirth: "22 Nov 1992",
        mobileNumber: "9811223344",
        providerName: "Ayushman Bharat",
        policyNumber: "AB/KA/2025/112233",
        policyType: "Government Scheme",
        tpaName: "Direct Settlement",
        coverageAmount: 500000,
        sumInsured: 500000,
        currency: "INR",
        validFrom: new Date("2025-04-01"),
        validUntil: new Date("2026-03-31"),
        renewalDate: new Date("2026-04-01"),
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
  const existing = await InsurancePolicy.findOne({ policyNumber: data.policyNumber });
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

  const policy = await InsurancePolicy.create({
    patientId: patient ? patient._id : null,
    patientName: data.patientName || (patient ? patient.name : "Patient"),
    uhid: data.uhid || (patient ? patient.patientId : "UHID"),
    dateOfBirth: data.dateOfBirth || "16 Aug 1990",
    mobileNumber: data.mobileNumber || "9876543210",
    providerName: data.providerName || "Star Health & Allied Insurance Co. Ltd.",
    policyNumber: data.policyNumber,
    memberId: data.memberId || "",
    policyType: data.policyType || "Family Floater",
    tpaName: data.tpaName || "Health India TPA Services Pvt. Ltd.",
    coverageAmount: Number(data.coverageAmount || 0),
    sumInsured: Number(data.sumInsured || data.coverageAmount || 0),
    currency: data.currency || "INR",
    validFrom: new Date(data.validFrom),
    validUntil: new Date(data.validUntil),
    renewalDate: data.renewalDate ? new Date(data.renewalDate) : null,
    status: data.status || "Active",
    employer: data.employer || "",
    relationship: data.relationship || "Self",
    notes: data.notes || "",
    documents: data.documents || {},
  });

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

export const getPolicyByIdService = async (id) => {
  const policy = await InsurancePolicy.findById(id);
  if (!policy) {
    throw new AppError("Policy not found", 404, ErrorCodes.NOT_FOUND);
  }
  return policy;
};

export const updatePolicyService = async (id, data) => {
  const policy = await InsurancePolicy.findById(id);
  if (!policy) {
    throw new AppError("Policy not found", 404, ErrorCodes.NOT_FOUND);
  }
  Object.assign(policy, data);
  await policy.save();
  return policy;
};

export const deletePolicyService = async (id) => {
  const policy = await InsurancePolicy.findById(id);
  if (!policy) {
    throw new AppError("Policy not found", 404, ErrorCodes.NOT_FOUND);
  }
  policy.status = "Inactive";
  await policy.save();
  return { message: "Policy deactivated successfully" };
};

// Aliases for compatibility
export const createInsurancePolicy = createPolicyService;
export const getPolicies = getAllPoliciesService;
export const getPoliciesByPatient = async (patientId) => getAllPoliciesService({ search: patientId });
export const getPolicyById = getPolicyByIdService;
export const updateInsurancePolicy = updatePolicyService;