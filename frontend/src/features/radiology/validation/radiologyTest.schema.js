import { z } from "zod";

export const radiologyTestSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  testType: z.string().trim().min(2, "Test type is required"),
  bodyPart: z.string().trim().optional(),
  priority: z.enum(["routine", "urgent", "emergency"]),
});
