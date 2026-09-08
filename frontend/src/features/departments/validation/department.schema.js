import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, "Department name is required"),
  code: z
    .string()
    .trim()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code cannot exceed 10 characters")
    .transform((val) => val.toUpperCase()),
  description: z.string().trim().min(5, "Description is required"),
  headDoctorId: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export const updateDepartmentSchema = z.object({
  name: z.string().trim().min(2, "Department name is required"),
  code: z
    .string()
    .trim()
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code cannot exceed 10 characters")
    .transform((val) => val.toUpperCase()),
  description: z.string().trim().min(5, "Description is required"),
  headDoctorId: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});