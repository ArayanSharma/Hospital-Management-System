import { z } from "zod";

export const labTestSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  testName: z.string().trim().min(2, "Test name is required"),
  sampleType: z.string().trim().min(2, "Sample type is required"),
  priority: z.enum(["routine", "urgent", "emergency"]),
});
