import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  phone: z.string().trim().min(10, "Valid phone number required").optional().or(z.literal("")),
  roleId: z.string().min(1, "Role is required"),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  roleId: z.string().min(1, "Role is required"),
  status: z.enum(["active", "inactive"]),
});