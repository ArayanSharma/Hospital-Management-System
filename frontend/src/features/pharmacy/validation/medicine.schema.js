import { z } from "zod";

export const medicineSchema = z.object({
  name: z.string().trim().min(2, "Medicine name is required"),
  genericName: z.string().trim().optional(),
  category: z.string().trim().optional(),
  manufacturer: z.string().trim().optional(),
  unit: z.string().trim().min(1, "Unit is required"),
  price: z.coerce.number().min(0, "Price is required"),
  reorderLevel: z.coerce.number().min(0).optional(),
});