import { z } from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Department name must be at least 2 characters"),
    code: z.string().trim().min(2, "Department code must be at least 2 characters").max(10, "Department code max 10 characters"),
    description: z.string().trim().min(5, "Description is required"),
    headDoctorId: z.string().nullable().optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});

export const updateDepartmentSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),
    code: z.string().trim().min(2).max(10).optional(),
    description: z.string().trim().optional(),
    headDoctorId: z.string().nullable().optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});