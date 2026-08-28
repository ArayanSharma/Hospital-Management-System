import { z } from "zod";

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient selection is required"),
  departmentId: z.string().min(1, "Department selection is required"),
  doctorId: z.string().min(1, "Doctor selection is required"),
  appointmentDate: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  reason: z.string().trim().min(2, "Visit reason / symptoms is required"),
  notes: z.string().optional(),
  sendNotification: z.boolean().optional(),
});