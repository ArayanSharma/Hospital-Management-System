import { z } from "zod";

const availabilitySchema = z.object({
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const createDoctorSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    phone: z.string().trim().optional(),
    departmentId: z.string().min(1, "Department is required"),
    specialization: z.string().trim().min(2, "Specialization is required"),
    qualification: z.string().trim().optional(),
    experience: z.number().min(0).optional(),
    consultationFee: z.number().min(0, "Consultation fee is required"),
    availability: z.array(availabilitySchema).optional(),
    additionalInfo: z.string().trim().optional(),
  }),
});

export const updateDoctorSchema = z.object({
  body: z.object({
    departmentId: z.string().optional(),
    specialization: z.string().trim().min(2).optional(),
    qualification: z.string().trim().optional(),
    experience: z.number().min(0).optional(),
    consultationFee: z.number().min(0).optional(),
    availability: z.array(availabilitySchema).optional(),
    additionalInfo: z.string().trim().optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});