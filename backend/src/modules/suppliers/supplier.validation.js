import { z } from "zod";

export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Supplier name is required"),
    company: z.string().trim().optional(),
    phone: z.string().trim().min(10, "Valid phone number required"),
    email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
    address: z.string().trim().optional(),
  }),
});

export const updateSupplierSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),
    company: z.string().trim().optional(),
    phone: z.string().trim().min(10).optional(),
    email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
    address: z.string().trim().optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});