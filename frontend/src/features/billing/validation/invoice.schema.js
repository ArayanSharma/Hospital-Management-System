import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, "Description required"),
  quantity: z.coerce.number().min(1).default(1),
  unitPrice: z.coerce.number().min(0, "Price required"),
});

export const invoiceSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  items: z.array(invoiceItemSchema).min(1, "Add at least one item"),
  discount: z.coerce.number().min(0).optional(),
  tax: z.coerce.number().min(0).optional(),
});

export const paymentSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  method: z.enum(["cash", "card", "upi", "net-banking", "insurance"]),
  transactionId: z.string().trim().optional(),
});