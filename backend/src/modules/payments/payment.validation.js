import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    invoiceId: z.string().min(1, "Invoice is required"),
    amount: z.number().positive("Amount must be positive"),
    method: z.enum(["cash", "card", "upi", "net-banking", "insurance"]),
    transactionId: z.string().trim().optional(),
  }),
});