import { z } from "zod";

export const updateSettingSchema = z.object({
  body: z.object({
    hospitalName: z.string().trim().min(2).optional(),
    logo: z.string().trim().optional(),
    address: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
    timezone: z.string().trim().optional(),
    currency: z.string().trim().optional(),
    invoiceSettings: z
      .object({
        taxPercentage: z.number().min(0).optional(),
        invoicePrefix: z.string().trim().optional(),
      })
      .optional(),
    notificationSettings: z
      .object({
        emailEnabled: z.boolean().optional(),
        smsEnabled: z.boolean().optional(),
      })
      .optional(),
  }),
});