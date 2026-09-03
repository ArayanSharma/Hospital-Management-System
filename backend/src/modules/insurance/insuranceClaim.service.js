import mongoose from "mongoose";
import InsuranceClaim from "./insuranceClaim.model.js";
import Patient from "../patients/patient.model.js";
import AppError from "../../core/errors/AppError.js";
import { ErrorCodes } from "../../core/errors/errorCodes.js";

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
      {
        claimNumber: "CLM-2025-000102",
        patientId: patient._id,
        patientName: "Ramesh Kumar",
        uhid: "UHID12347",
        policyNumber: "HDFCERGO/563214",
        providerName: "HDFC ERGO Health Insurance",
        tpaName: "Medi Assist TPA Services",
        invoiceNumber: "INV-2025-000568",
        admissionType: "Inpatient (IPD)",
        treatmentDate: "30 May 2025",
        claimType: "Cashless",
        claimAmount: 240000,
        approvedAmount: 0,
        settledAmount: 0,
        patientPayable: 240000,
        status: "Under Review",
        submittedDate: "30 May 2025",
        expectedReviewDate: "08 Jun 2025",
        lastUpdatedDate: "30 May 2025",
      },
      {
        claimNumber: "CLM-2025-000103",
        patientId: patient._id,
        patientName: "Anita Sharma",
        uhid: "UHID12348",
        policyNumber: "MAXBUPA/774512",
        providerName: "Max Bupa Health Insurance",
        tpaName: "Heritage Health TPA",
        invoiceNumber: "INV-2025-000569",
        admissionType: "Outpatient (OPD)",
        treatmentDate: "28 May 2025",
        claimType: "Reimbursement",
        claimAmount: 95000,
        approvedAmount: 0,
        settledAmount: 0,
        patientPayable: 95000,
        status: "Rejected",
        rejectionReason: "Non-covered procedure per policy terms",
        submittedDate: "28 May 2025",
        expectedReviewDate: "05 Jun 2025",
        lastUpdatedDate: "28 May 2025",
      },
      {
        claimNumber: "CLM-2025-000104",
        patientId: patient._id,
        patientName: "Vikram Singh",
        uhid: "UHID12349",
        policyNumber: "AB/KA/2025/112233",
        providerName: "Ayushman Bharat",
        tpaName: "Direct Settlement",
        invoiceNumber: "INV-2025-000570",
        admissionType: "Inpatient (IPD)",
        treatmentDate: "27 May 2025",
        claimType: "Cashless",
        claimAmount: 50000,
        approvedAmount: 50000,
        settledAmount: 50000,
        patientPayable: 0,
        status: "Settled",
        settlementDetails: {
          utrNumber: "UTR99281745",
          bankName: "HDFC Bank Ltd.",
          settlementDate: "27 May 2025",
          settledAmount: 50000,
          paymentMode: "NEFT",
        },
        submittedDate: "27 May 2025",
        expectedReviewDate: "04 Jun 2025",
        lastUpdatedDate: "27 May 2025",
      },
      {
        claimNumber: "CLM-2025-000105",
        patientId: patient._id,
        patientName: "Sneha Reddy",
        uhid: "UHID12350",
        policyNumber: "ICICI Lombard",
        providerName: "ICICI Lombard General Insurance",
        tpaName: "Health India TPA",
        invoiceNumber: "INV-2025-000571",
        admissionType: "Outpatient (OPD)",
        treatmentDate: "31 May 2025",
        claimType: "Cashless",
        claimAmount: 175000,
        approvedAmount: 0,
        settledAmount: 0,
        patientPayable: 175000,
        status: "Submitted",
        submittedDate: "31 May 2025",
        expectedReviewDate: "09 Jun 2025",
        lastUpdatedDate: "31 May 2025",
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
  const claim = await findClaimByIdOrNumber(id);
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
  return claim;
};

export const updateClaimStatusService = async (id, payload) => {
  const claim = await findClaimByIdOrNumber(id);
  if (!claim) {
    throw new AppError("Claim not found", 404, ErrorCodes.NOT_FOUND);
  }

  const { status, approvedAmount, rejectionReason, settlementDetails, remarks } = payload;
  if (status) claim.status = status;

  if (approvedAmount !== undefined) {
    claim.approvedAmount = Number(approvedAmount);
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
  return claim;
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
