import { z } from "zod";

const vitalsSchema = z.object({
  temperature: z.number().optional(),
  bloodPressure: z.string().optional(),
  pulse: z.number().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
  spO2: z.number().optional(),
});

export const createOPDVisitSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    appointmentId: z.string().optional().nullable(),
    visitType: z.enum(["appointment", "walk-in"]).optional(),
    symptoms: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    vitals: vitalsSchema.optional(),
    visitDate: z.string().optional(),
  }),
});

export const updateOPDVisitSchema = z.object({
  body: z.object({
    symptoms: z.string().trim().optional(),
    diagnosis: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    vitals: vitalsSchema.optional(),
    clinicalNotes: z.object({
      examinationFindings: z.string().optional(),
      clinicalAssessment: z.string().optional(),
      additionalNotes: z.string().optional(),
    }).optional(),
    prescription: z.array(z.object({
      medicineName: z.string().optional(),
      dosage: z.string().optional(),
      frequency: z.string().optional(),
      duration: z.string().optional(),
      instructions: z.string().optional(),
    })).optional(),
    status: z.enum(["in-progress", "completed", "walk-in", "cancelled"]).optional(),
  }),
});