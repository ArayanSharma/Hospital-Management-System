import { z } from "zod";

export const createBedSchema = z.object({
  body: z.object({
    wardId: z.string().min(1, "Ward is required"),
    bedNumber: z.string().trim().min(1, "Bed number is required"),
  }),
});

export const updateBedStatusSchema = z.object({
  body: z.object({
    status: z.enum(["available", "maintenance"]),
    maintenanceReason: z.string().trim().optional(),
  }),
});