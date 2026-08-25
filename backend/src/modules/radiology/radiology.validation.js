import { z } from "zod";

export const createRadiologyTestSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    visitId: z.string().optional(),
    visitType: z.enum(["OPDVisit", "Admission"]).optional(),
    testType: z.string().trim().min(2, "Test type is required"),
    bodyPart: z.string().trim().optional(),
    priority: z.enum(["routine", "urgent", "emergency"]).optional(),
  }),
});

export const updateRadiologyTestStatusSchema = z.object({
  body: z.object({
    status: z.enum(["scheduled", "cancelled"]),
    scheduledAt: z.string().optional(),
  }),
});

export const createRadiologyReportSchema = z.object({
  body: z.object({
    testId: z.string().min(1, "Radiology test is required"),
    findings: z.string().trim().min(2, "Findings are required"),
    impression: z.string().trim().optional(),
    images: z.array(z.string()).optional(),
    reportFile: z.string().trim().optional(),
  }),
});

export const updateRadiologyReportSchema = z.object({
  body: z.object({
    findings: z.string().trim().optional(),
    impression: z.string().trim().optional(),
    images: z.array(z.string()).optional(),
    reportFile: z.string().trim().optional(),
  }),
});