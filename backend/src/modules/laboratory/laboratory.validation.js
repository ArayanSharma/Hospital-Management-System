import { z } from "zod";

export const createLabTestSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    visitId: z.string().optional().nullable(),
    visitType: z.string().optional().nullable(),
    testName: z.string().trim().min(2, "Test name is required"),
    sampleType: z.string().trim().min(2, "Sample type is required"),
    priority: z.enum(["routine", "urgent", "emergency"]).optional(),
    additionalTests: z.array(z.string()).optional(),
    clinicalNotes: z.string().trim().optional(),
    requestedAt: z.string().optional().nullable(),
    attachmentUrl: z.string().trim().optional().nullable(),
  }),
});

export const updateLabTestStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "sample-collected", "completed", "cancelled"]),
  }),
});

export const createLabReportSchema = z.object({
  body: z.object({
    labTestId: z.string().min(1, "Lab test is required"),
    results: z.record(z.any()).refine((val) => Object.keys(val).length > 0, {
      message: "Results cannot be empty",
    }),
    interpretation: z.string().trim().optional(),
    reportFile: z.string().trim().optional(),
  }),
});

export const updateLabReportSchema = z.object({
  body: z.object({
    results: z.record(z.any()).optional(),
    interpretation: z.string().trim().optional(),
    reportFile: z.string().trim().optional(),
  }),
});