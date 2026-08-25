import { z } from "zod";

const medicineItemSchema = z.object({
  name: z.string().trim().min(1, "Medicine name is required"),
  dosage: z.string().trim().min(1, "Dosage is required"),
  frequency: z.string().trim().min(1, "Frequency is required"),
  duration: z.string().trim().min(1, "Duration is required"),
  instructions: z.string().trim().optional(),
});

export const createPrescriptionSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    visitId: z.string().min(1, "Visit reference is required"),
    visitType: z.enum(["OPDVisit", "Admission"]),
    medicines: z.array(medicineItemSchema).min(1, "At least one medicine is required"),
    instructions: z.string().trim().optional(),
  }),
});

export const updatePrescriptionSchema = z.object({
  body: z.object({
    medicines: z.array(medicineItemSchema).optional(),
    instructions: z.string().trim().optional(),
    status: z.enum(["active", "completed", "cancelled"]).optional(),
  }),
});