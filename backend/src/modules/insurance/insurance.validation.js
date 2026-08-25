import { z } from "zod";

export const createPolicySchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    providerName: z.string().trim().min(2, "Provider name is required"),
    policyNumber: z.string().trim().min(2, "Policy number is required"),
    coverageAmount: z.number().min(0, "Coverage amount is required"),
    validFrom: z.string(),
    validUntil: z.string(),
  }),
});

export const updatePolicySchema = z.object({
  body: z.object({
    coverageAmount: z.number().min(0).optional(),
    validUntil: z.string().optional(),
    status: z.enum(["active", "expired", "inactive"]).optional(),
  }),
});

export const createClaimSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    policyId: z.string().min(1, "Policy is required"),
    invoiceId: z.string().min(1, "Invoice is required"),
    claimAmount: z.number().min(0, "Claim amount is required"),
    documents: z.array(z.string()).optional(),
  }),
});

export const updateClaimStatusSchema = z.object({
  body: z.object({
    status: z.enum(["under-review", "approved", "rejected", "settled"]),
    approvedAmount: z.number().min(0).optional(),
    rejectionReason: z.string().trim().optional(),
  }),
});