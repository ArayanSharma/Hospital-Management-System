import { z } from "zod";

const vitalsSchema = z.object({
  temperature: z.number().optional(),
  bloodPressure: z.string().optional(),
  pulse: z.number().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
});

export const createOPDVisitSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    appointmentId: z.string().optional(),
    symptoms: z.string().trim().optional(),
    vitals: vitalsSchema.optional(),
  }),
});

export const updateOPDVisitSchema = z.object({
  body: z.object({
    symptoms: z.string().trim().optional(),
    diagnosis: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    vitals: vitalsSchema.optional(),
    status: z.enum(["in-progress", "completed"]).optional(),
  }),
});