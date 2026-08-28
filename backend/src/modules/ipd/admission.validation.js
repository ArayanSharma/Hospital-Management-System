import { z } from "zod";

export const createAdmissionSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    wardId: z.string().min(1, "Ward is required"),
    bedId: z.string().min(1, "Bed is required"),
    reason: z.string().trim().min(1, "Admission reason is required"),
    diagnosis: z.string().trim().optional(),
    provisionalDiagnosis: z.string().trim().optional(),
    allergies: z.string().trim().optional(),
    medicalHistory: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    admissionDate: z.string().optional(),
    dailyRent: z.number().optional(),
    bedType: z.string().optional(),
  }),
});

export const updateAdmissionSchema = z.object({
  body: z.object({
    reason: z.string().trim().optional(),
    diagnosis: z.string().trim().optional(),
    provisionalDiagnosis: z.string().trim().optional(),
    allergies: z.string().trim().optional(),
    medicalHistory: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  }),
});

export const dischargeSchema = z.object({
  body: z.object({
    dischargeSummary: z.string().trim().min(1, "Discharge summary is required"),
  }),
});