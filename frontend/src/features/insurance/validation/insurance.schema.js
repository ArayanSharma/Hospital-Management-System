import { z } from "zod";

export const policySchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  providerName: z.string().trim().min(2, "Provider name is required"),
  policyNumber: z.string().trim().min(2, "Policy number is required"),
  coverageAmount: z.coerce.number().min(0, "Coverage amount is required"),
  validFrom: z.string().min(1, "Start date is required"),
  validUntil: z.string().min(1, "End date is required"),
}).refine((data) => new Date(data.validFrom) < new Date(data.validUntil), {
  message: "End date must be after start date",
  path: ["validUntil"],
});

export const claimSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  policyId: z.string().min(1, "Policy is required"),
  invoiceId: z.string().min(1, "Invoice is required"),
  claimAmount: z.coerce.number().min(0, "Claim amount is required"),
});

export const claimStatusSchema = z.object({
  status: z.enum(["under-review", "approved", "rejected", "settled"]),
  approvedAmount: z.coerce.number().min(0).optional(),
  rejectionReason: z.string().trim().optional(),
});
