import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/(?=.*[0-9])|(?=.*[^A-Za-z0-9])/, "Password must contain at least one number or special character"),
    roleId: z.string().min(1, "Role is required").optional(),
    role: z.string().optional(),
    phone: z.string().trim().optional(),
    departmentId: z.string().optional(),
    department: z.string().optional(),
  }).refine((data) => data.roleId || data.role, {
    message: "Role is required",
    path: ["roleId"],
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});