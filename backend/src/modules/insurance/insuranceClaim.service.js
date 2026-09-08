import mongoose from "mongoose";
import InsuranceClaim from "./insuranceClaim.model.js";
import Patient from "../patients/patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";
import { getOrSetCache, invalidatePattern, delCache, acquireLock, releaseLock } from "../../utils/redisCache.js";
import { notifyInsuranceClaimEvent } from "../../utils/notificationDispatcher.js";

// Helper to seed initial DB claims if count is 0
export const ensureSampleClaims = async () => {
  try {
    const count = await InsuranceClaim.countDocuments();
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

    const sampleClaims = [
      {
        claimNumber: "CLM-2025-000101",
        patientId: patient._id,
        patientName: "Priya Verma",
        uhid: "UHID12346",
        policyNumber: "SH/2025/784512",
        providerName: "Star Health & Allied Insurance Co. Ltd.",
        tpaName: "Health India TPA Services Pvt. Ltd.",
        policyValidity: "01 Apr 2025 to 31 Mar 2026",
        invoiceNumber: "INV-2025-000567",
        admissionType: "Outpatient (OPD)",
        treatmentDate: "29 May 2025",
        claimType: "Cashless",
        claimAmount: 125000,
        approvedAmount: 110000,
        settledAmount: 0,
        patientPayable: 15000,
        status: "Approved",
        submittedDate: "29 May 2025",
        expectedReviewDate: "07 Jun 2025",
        lastUpdatedDate: "29 May 2025",
      },
    ];

    await InsuranceClaim.insertMany(sampleClaims);
  } catch (err) {
    console.error("Error seeding sample claims:", err);
  }
};

export const createClaimService = async (data) => {
  await ensureSampleClaims();
  const count = await InsuranceClaim.countDocuments();
  const seq = (count + 106).toString().padStart(6, "0");
  const claimNumber = data.claimNumber || `CLM-2025-${seq}`;

  let patient = null;
  if (data.patientId) {
    patient = await Patient.findById(data.patientId);
  }
  if (!patient && data.patientName) {
    patient = await Patient.findOne({ name: new RegExp(data.patientName, "i") });
  }

  const claimAmount = Number(data.claimAmount || data.estimatedAmount || 0);

  if (claimAmount <= 0) {
    throw new AppError("Claim amount must be greater than 0", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const claim = await InsuranceClaim.create({
    claimNumber,
    patientId: patient ? patient._id : null,
    patientName: data.patientName || (patient ? patient.name : "Patient"),
    uhid: data.uhid || (patient ? patient.patientId : "UHID"),
    policyNumber: data.policyNumber || "SH/2025/784512",
    providerName: data.providerName || "Star Health & Allied Insurance Co. Ltd.",
    tpaName: data.tpaName || "Health India TPA Services Pvt. Ltd.",
    policyValidity: data.policyValidity || "01 Apr 2025 to 31 Mar 2026",
    invoiceNumber: data.invoiceNumber || "INV-2025-000567",
    admissionType: data.admissionType || "Outpatient (OPD)",
    treatmentDate: data.treatmentDate || "29 May 2025",
    claimType: data.claimType || "Cashless",
    claimAmount,
    approvedAmount: data.approvedAmount ? Number(data.approvedAmount) : 0,
    settledAmount: 0,
    patientPayable: claimAmount,
    preAuthNumber: data.preAuthNumber || "",
    status: data.status || "Submitted",
    submittedDate: data.submittedDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    expectedReviewDate: data.expectedReviewDate || "07 Jun 2025",
    remarks: data.remarks || "",
    diagnosis: data.diagnosis || "",
    treatmentSummary: data.treatmentSummary || "",
    lastUpdatedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  });

  // Invalidate Redis Claim Caches
  await invalidatePattern("hms:insurance:*");
  await invalidatePattern("hms:route:insurance*");

    if (claim.patientId) {
      await notifyInsuranceClaimEvent({
        userId: claim.patientId,
        claimId: claim._id,
        claimNumber: claim.claimNumber,
        status: claim.status,
        claimAmount: claim.claimAmount,
      });
    }

    return claim;
};

export const getAllClaimsService = async ({ search, status } = {}) => {
  await ensureSampleClaims();
  const query = {};
  if (status && status !== "all" && status !== "All Status") {
    query.status = new RegExp(status, "i");
  }
  if (search) {
    const reg = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { claimNumber: reg },
      { patientName: reg },
      { uhid: reg },
      { policyNumber: reg },
      { invoiceNumber: reg },
    ];
  }

  const claims = await InsuranceClaim.find(query).sort({ createdAt: -1 });
  return claims;
};

const findClaimByIdOrNumber = async (idOrNumber) => {
  if (mongoose.Types.ObjectId.isValid(idOrNumber)) {
    const found = await InsuranceClaim.findById(idOrNumber);
    if (found) return found;
  }
  return await InsuranceClaim.findOne({ claimNumber: idOrNumber });
};

export const getClaimByIdService = async (id) => {
  const { data: claim } = await getOrSetCache(
    `hms:insurance:claim:${id}`,
    () => findClaimByIdOrNumber(id),
    600
  );

  if (!claim) {
    throw new AppError("Claim not found", 404, ErrorCodes.NOT_FOUND);
  }
  return claim;
};

export const updateClaimService = async (id, updateData) => {
  const claim = await findClaimByIdOrNumber(id);
  if (!claim) {
    throw new AppError("Claim not found", 404, ErrorCodes.NOT_FOUND);
  }

  Object.assign(claim, updateData);
  claim.lastUpdatedDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  await claim.save();

  await delCache(`hms:insurance:claim:${id}`);
  await invalidatePattern("hms:route:insurance*");

  return claim;
};

export const updateClaimStatusService = async (id, payload) => {
  const lockKey = `hms:lock:claim:${id}`;
  const hasLock = await acquireLock(lockKey, 5);
  if (!hasLock) {
    throw new AppError("Claim status update currently in progress by another TPA officer", 409, ErrorCodes.VALIDATION_ERROR);
  }

  try {
    const claim = await findClaimByIdOrNumber(id);
    if (!claim) {
      throw new AppError("Claim not found", 404, ErrorCodes.NOT_FOUND);
    }

    const { status, approvedAmount, rejectionReason, settlementDetails, remarks } = payload;
    if (status) claim.status = status;

    if (approvedAmount !== undefined) {
      const appAmt = Number(approvedAmount);
      // Edge Case Guard: Approved amount cannot exceed total claim amount
      if (appAmt > claim.claimAmount) {
        throw new AppError(`Approved amount (₹${appAmt}) cannot exceed total claim amount (₹${claim.claimAmount})`, 400, ErrorCodes.VALIDATION_ERROR);
      }
      claim.approvedAmount = appAmt;
      claim.patientPayable = Math.max(0, claim.claimAmount - claim.approvedAmount);
    }

    if (status === "Settled" || status === "settled") {
      claim.settledAmount = claim.approvedAmount || claim.claimAmount;
      if (settlementDetails) {
        claim.settlementDetails = { ...claim.settlementDetails, ...settlementDetails };
      }
    }

    if (rejectionReason) {
      claim.rejectionReason = rejectionReason;
    }

    if (remarks) {
      claim.remarks = remarks;
    }

    claim.lastUpdatedDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    await claim.save();

    await delCache(`hms:insurance:claim:${id}`);
    await invalidatePattern("hms:route:insurance*");

    if (claim.patientId) {
      await notifyInsuranceClaimEvent({
        userId: claim.patientId,
        claimId: claim._id,
        claimNumber: claim.claimNumber,
        status: claim.status,
        claimAmount: claim.approvedAmount || claim.claimAmount,
      });
    }

    return claim;
  } finally {
    await releaseLock(lockKey);
  }
};


export const addClaimNoteService = async (id, noteText, author = "TPA Admin") => {
  const claim = await findClaimByIdOrNumber(id);
  if (!claim) {
    throw new AppError("Claim not found", 404, ErrorCodes.NOT_FOUND);
  }

  claim.internalNotes = claim.internalNotes || [];
  claim.internalNotes.push({
    noteText,
    author,
    date: new Date(),
  });

  claim.lastUpdatedDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  await claim.save();
  return claim;
};

export const uploadClaimDocumentService = async (id, docData) => {
  const claim = await findClaimByIdOrNumber(id);
  if (!claim) {
    throw new AppError("Claim not found", 404, ErrorCodes.NOT_FOUND);
  }

  claim.documentsList = claim.documentsList || [];
  claim.documentsList.push({
    name: docData.name || "Medical Document.pdf",
    category: docData.category || "General",
    url: docData.url || "",
    uploadedAt: new Date(),
  });

  claim.lastUpdatedDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  await claim.save();
  return claim;
};

// Compatibility exports
export const createInsuranceClaim = createClaimService;
export const getClaims = getAllClaimsService;
export const getAllClaims = getAllClaimsService;
export const getClaimById = getClaimByIdService;
export const updateClaimStatus = updateClaimStatusService;
