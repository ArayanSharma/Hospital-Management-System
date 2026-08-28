import { z } from "zod";

const medicineItemSchema = z.object({
  name: z.string().trim().min(1, "Medicine name required"),
  dosage: z.string().trim().min(1, "Dosage required"),
  frequency: z.string().trim().min(1, "Frequency required"),
  duration: z.string().trim().min(1, "Duration required"),
  instructions: z.string().trim().optional(),
});

export const prescriptionSchema = z.object({
  medicines: z.array(medicineItemSchema).min(1, "Add at least one medicine"),
  instructions: z.string().trim().optional(),
});