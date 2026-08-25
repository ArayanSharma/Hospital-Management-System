import { z } from "zod";

const availabilitySchema = z.object({
  day: z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),
  startTime: z.string(),
  endTime: z.string(),
});

export const createDoctorSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    phone: z.string().trim().optional(),
    departmentId: z.string().min(1, "Department is required"),
    specialization: z.string().trim().min(2, "Specialization is required"),
    qualification: z.string().trim().optional(),
    experience: z.number().min(0).optional(),
    consultationFee: z.number().min(0, "Consultation fee is required"),
    availability: z.array(availabilitySchema).optional(),
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
    status: z.enum(["active", "inactive"]).optional(),
  }),
});