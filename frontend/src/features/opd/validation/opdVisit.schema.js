import { z } from "zod";

export const createVisitSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  appointmentId: z.string().optional(),
  symptoms: z.string().trim().optional(),
  vitals: z.object({
    temperature: z.coerce.number().optional().or(z.literal("")),
    bloodPressure: z.string().optional(),
    pulse: z.coerce.number().optional().or(z.literal("")),
    weight: z.coerce.number().optional().or(z.literal("")),
    height: z.coerce.number().optional().or(z.literal("")),
  }),
});

export const diagnosisSchema = z.object({
  diagnosis: z.string().trim().min(2, "Diagnosis is required"),
  notes: z.string().trim().optional(),
  status: z.enum(["in-progress", "completed"]),
});