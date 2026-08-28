import { z } from "zod";

export const createAppointmentSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    reason: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    sendNotification: z.boolean().optional(),
  }),
});

export const updateAppointmentSchema = z.object({
  body: z.object({
    appointmentDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    reason: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    sendNotification: z.boolean().optional(),
  }),
});

export const changeStatusSchema = z.object({
  body: z.object({
    status: z.enum(["completed", "cancelled", "no-show", "scheduled"]),
    cancelledReason: z.string().trim().optional(),
  }),
});