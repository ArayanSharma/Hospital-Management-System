import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  phone: z.string().trim().min(10, "Valid 10-digit phone number required"),
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  address: z.string().trim().min(3, "Full address is required"),
  bloodGroup: z.string().optional(),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
  nationality: z.string().optional(),
  notes: z.string().optional(),
  emergencyContact: z
    .object({
      name: z.string().trim().min(2, "Emergency contact name is required"),
      relation: z.string().trim().min(1, "Relationship is required"),
      phone: z.string().trim().min(10, "Emergency phone number is required"),
    })
    .optional(),
});