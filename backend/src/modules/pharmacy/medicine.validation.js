import { z } from "zod";

export const createMedicineSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Medicine name is required"),
    genericName: z.string().trim().optional(),
    category: z.string().trim().optional(),
    manufacturer: z.string().trim().optional(),
    unit: z.string().trim().min(1, "Unit is required"),
    price: z.number().min(0, "Price is required"),
    reorderLevel: z.number().min(0).optional(),
  }),
});

export const updateMedicineSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),
    genericName: z.string().trim().optional(),
    category: z.string().trim().optional(),
    manufacturer: z.string().trim().optional(),
    unit: z.string().trim().optional(),
    price: z.number().min(0).optional(),
    reorderLevel: z.number().min(0).optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});