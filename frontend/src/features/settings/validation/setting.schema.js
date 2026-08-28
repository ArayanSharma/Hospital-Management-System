import { z } from "zod";

export const settingsSchema = z.object({
  hospitalName: z.string().trim().min(2, "Hospital name is required"),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  currency: z.string().trim().optional(),
  invoiceSettings: z.object({
    taxPercentage: z.coerce.number().min(0).optional(),
    invoicePrefix: z.string().trim().optional(),
  }),
});