import { z } from "zod";

export const admissionSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  wardId: z.string().min(1, "Ward is required"),
  bedId: z.string().min(1, "Bed is required"),
  reason: z.string().trim().min(2, "Admission reason is required"),
  diagnosis: z.string().trim().optional(),
});
