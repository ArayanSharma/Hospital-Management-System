import { z } from "zod";

export const createRadiologyTestSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    visitId: z.string().optional().nullable(),
    visitType: z.enum(["OPD Visit", "IPD Admission", "OPDVisit", "Admission"]).optional().nullable(),
    modality: z.string().trim().optional(),
    bodyRegion: z.string().trim().optional(),
    testType: z.string().trim().optional(),
    bodyPart: z.string().trim().optional(),
    priority: z.enum(["routine", "urgent", "emergency"]).optional(),
    clinicalInstructions: z.string().trim().optional(),
    additionalTests: z.array(z.string()).optional(),
    scheduledAt: z.string().optional().nullable(),
    locationRoom: z.string().trim().optional(),
    requestedAt: z.string().optional(),
    attachmentUrl: z.string().trim().optional().nullable(),
  }),
});

export const updateRadiologyTestStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "scheduled", "in-progress", "completed", "cancelled"]),
    scheduledAt: z.string().optional().nullable(),
  }),
});

export const createRadiologyReportSchema = z.object({
  body: z.object({
    testId: z.string().min(1, "Radiology test is required"),
    findings: z.string().trim().optional().default(""),
    technique: z.string().trim().optional().default(""),
    impression: z.string().trim().optional().default(""),
    recommendations: z.string().trim().optional().default(""),
    additionalNotes: z.string().trim().optional().default(""),
    technicianName: z.string().trim().optional().default("Rakesh Kumar"),
    checkedByName: z.string().trim().optional().default(""),
    studyReviewed: z.boolean().optional().default(false),
    clinicalIndication: z.string().trim().optional().default(""),
    relevantHistory: z.string().trim().optional().default(""),
    examinationTechnique: z.string().trim().optional().default(""),
    bodyPart: z.string().trim().optional().default(""),
    views: z.string().trim().optional().default(""),
    contrast: z.string().trim().optional().default("Not Used"),
    imageQuality: z.string().trim().optional().default("Diagnostic"),
    images: z.array(z.string()).optional(),
    reportFile: z.string().trim().optional().nullable(),
    status: z.enum(["draft", "finalized"]).optional().default("draft"),
  }),
});

export const updateRadiologyReportSchema = z.object({
  body: z.object({
    findings: z.string().trim().optional(),
    technique: z.string().trim().optional(),
    impression: z.string().trim().optional(),
    recommendations: z.string().trim().optional(),
    additionalNotes: z.string().trim().optional(),
    technicianName: z.string().trim().optional(),
    checkedByName: z.string().trim().optional(),
    studyReviewed: z.boolean().optional(),
    clinicalIndication: z.string().trim().optional(),
    relevantHistory: z.string().trim().optional(),
    examinationTechnique: z.string().trim().optional(),
    bodyPart: z.string().trim().optional(),
    views: z.string().trim().optional(),
    contrast: z.string().trim().optional(),
    imageQuality: z.string().trim().optional(),
    images: z.array(z.string()).optional(),
    reportFile: z.string().trim().optional().nullable(),
    status: z.enum(["draft", "finalized"]).optional(),
  }),
});