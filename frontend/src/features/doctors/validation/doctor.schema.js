import { z } from "zod";

export const createDoctorSchema = z
  .object({
    name: z.string().trim().min(2, "Full Name is required"),
    email: z.string().trim().email("Valid email address is required"),
    phone: z.string().trim().min(10, "Valid phone number required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    departmentId: z.string().min(1, "Department selection is required"),
    specialization: z.string().trim().min(2, "Specialization is required"),
    qualification: z.string().trim().min(2, "Qualification is required"),
    experience: z.coerce.number().min(0, "Experience is required"),
    consultationFee: z.coerce.number().min(0, "Consultation Fee is required"),
    additionalInfo: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateDoctorSchema = z.object({
  departmentId: z.string().min(1, "Department selection is required"),
  specialization: z.string().trim().min(2, "Specialization is required"),
  qualification: z.string().trim().optional(),
  experience: z.coerce.number().min(0).optional(),
  consultationFee: z.coerce.number().min(0, "Consultation fee is required"),
  additionalInfo: z.string().optional(),
});