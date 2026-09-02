import { z } from "zod";

export const createPolicySchema = z.object({
  body: z.object({
    patientId: z.string().optional(),
    patientName: z.string().trim().min(1, "Patient name is required"),
    uhid: z.string().trim().min(1, "UHID is required"),
    dateOfBirth: z.string().optional(),
    mobileNumber: z.string().optional(),
    providerName: z.string().trim().min(1, "Provider name is required"),
    policyNumber: z.string().trim().min(1, "Policy number is required"),
    memberId: z.string().optional(),
    policyType: z.string().optional(),
    tpaName: z.string().optional(),
    coverageAmount: z.coerce.number().min(0, "Coverage amount is required"),
    sumInsured: z.coerce.number().optional(),
    currency: z.string().optional(),
    validFrom: z.string().min(1, "Valid from date is required"),
    validUntil: z.string().min(1, "Valid until date is required"),
    renewalDate: z.string().optional(),
    status: z.enum(["Active", "Expired", "Inactive", "Suspended", "active", "expired", "inactive"]).optional(),
    employer: z.string().optional(),
    relationship: z.string().optional(),
    notes: z.string().optional(),
    documents: z.record(z.any()).optional(),
  }),
});

export const updatePolicySchema = z.object({
  body: z.object({
    patientName: z.string().optional(),
    uhid: z.string().optional(),
    providerName: z.string().optional(),
    coverageAmount: z.coerce.number().min(0).optional(),
    sumInsured: z.coerce.number().optional(),
    validUntil: z.string().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const createClaimSchema = z.object({
  body: z.object({
    patientId: z.string().optional(),
    patientName: z.string().optional(),
    uhid: z.string().optional(),
    policyId: z.string().optional(),
    policyNumber: z.string().optional(),
    providerName: z.string().optional(),
    tpaName: z.string().optional(),
    policyValidity: z.string().optional(),
    invoiceId: z.string().optional(),
    invoiceNumber: z.string().optional(),
    admissionType: z.string().optional(),
    treatmentDate: z.string().optional(),
    claimType: z.string().optional(),
    claimAmount: z.coerce.number().min(0, "Claim amount is required"),
    approvedAmount: z.coerce.number().optional(),
    patientPayable: z.coerce.number().optional(),
    preAuthNumber: z.string().optional(),
    submittedDate: z.string().optional(),
    expectedReviewDate: z.string().optional(),
    remarks: z.string().optional(),
    diagnosis: z.string().optional(),
    treatmentSummary: z.string().optional(),
    documents: z.record(z.any()).optional(),
    status: z.string().optional(),
  }),
});

export const updateClaimStatusSchema = z.object({
  body: z.object({
    status: z.string().min(1, "Status is required"),
    approvedAmount: z.coerce.number().min(0).optional(),
    rejectionReason: z.string().trim().optional(),
  }),
});