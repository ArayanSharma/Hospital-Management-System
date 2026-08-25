import { z } from "zod";
import { USER_STATUS } from "./user.constants.js";

const statusValues = Object.values(USER_STATUS);

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),

  roleId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid role ID"),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional(),

  status: z
    .enum([statusValues[0], ...statusValues.slice(1)])
    .default(USER_STATUS.ACTIVE),

  isVerified: z
    .boolean()
    .default(false),
});


export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address")
      .optional(),

    roleId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid role ID")
      .optional(),

    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .optional(),

    status: z
      .enum([statusValues[0], ...statusValues.slice(1)])
      .optional(),

    isVerified: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field is required for update",
    }
  );