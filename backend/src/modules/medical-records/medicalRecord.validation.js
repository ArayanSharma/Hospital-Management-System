import { z } from "zod";

export const createMedicalRecordSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    visitId: z.string().optional(),
    visitType: z.enum(["OPDVisit", "Admission"]).optional(),
    diagnosis: z.string().trim().min(2, "Diagnosis is required"),
    treatment: z.string().trim().optional(),
    allergies: z.array(z.string()).optional(),
    chronicConditions: z.array(z.string()).optional(),
    notes: z.string().trim().optional(),
  }),
});

export const updateMedicalRecordSchema = z.object({
  body: z.object({
    diagnosis: z.string().trim().min(2).optional(),
    treatment: z.string().trim().optional(),
    allergies: z.array(z.string()).optional(),
    chronicConditions: z.array(z.string()).optional(),
    notes: z.string().trim().optional(),
  }),
});