import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // "HH:MM" 24hr format

export const createAppointmentSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    doctorId: z.string().min(1, "Doctor is required"),
    appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    startTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
    endTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
    reason: z.string().trim().optional(),
  }),
});

export const updateAppointmentSchema = z.object({
  body: z.object({
    appointmentDate: z.string().optional(),
    startTime: z.string().regex(timeRegex).optional(),
    endTime: z.string().regex(timeRegex).optional(),
    reason: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  }),
});

export const changeStatusSchema = z.object({
  body: z.object({
    status: z.enum(["completed", "cancelled", "no-show"]),
    cancelledReason: z.string().trim().optional(),
  }),
});