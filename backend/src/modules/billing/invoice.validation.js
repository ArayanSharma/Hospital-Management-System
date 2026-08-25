import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  sourceType: z.enum(["consultation", "lab_test", "radiology_test", "pharmacy", "room_charge", "other"]).optional(),
  sourceId: z.string().optional(),
  quantity: z.number().positive().optional(),
  unitPrice: z.number().min(0, "Unit price is required"),
});

export const createInvoiceSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, "Patient is required"),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
    discount: z.number().min(0).optional(),
    tax: z.number().min(0).optional(),
    dueDate: z.string().optional(),
  }),
});