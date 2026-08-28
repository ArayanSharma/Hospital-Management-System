import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().trim().min(2, "Supplier name is required"),
  company: z.string().trim().optional(),
  phone: z.string().trim().min(10, "Valid phone number required"),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  address: z.string().trim().optional(),
});
