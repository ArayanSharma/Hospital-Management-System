import { z } from "zod";

const emergencyContactSchema = z.object({
  name: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  relation: z.string().trim().optional(),
});

export const createPatientSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    gender: z.enum(["male", "female", "other"]),
    phone: z.string().trim().min(10, "Valid phone number required"),
    email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
    address: z.string().trim().optional(),
    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .optional()
      .or(z.literal(""))
      .nullable(),
    maritalStatus: z
      .enum(["single", "married", "divorced", "widowed"])
      .optional()
      .or(z.literal(""))
      .nullable(),
    occupation: z.string().trim().optional(),
    nationality: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    emergencyContact: emergencyContactSchema.optional(),
  }),
});

export const updatePatientSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),
    phone: z.string().trim().min(10).optional(),
    email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
    address: z.string().trim().optional(),
    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
      .optional()
      .or(z.literal(""))
      .nullable(),
    maritalStatus: z
      .enum(["single", "married", "divorced", "widowed"])
      .optional()
      .or(z.literal(""))
      .nullable(),
    occupation: z.string().trim().optional(),
    nationality: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    emergencyContact: emergencyContactSchema.optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});