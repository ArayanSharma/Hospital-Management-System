import { z } from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Department name must be at least 2 characters"),
    code: z.string().trim().min(2, "Department code must be at least 2 characters"),
    description: z.string().trim().optional(),
  }),
});

export const updateDepartmentSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),
    description: z.string().trim().optional(),
    headDoctorId: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});