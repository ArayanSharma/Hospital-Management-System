import { z } from "zod";

const saleItemSchema = z.object({
  medicineId: z.string().min(1),
  inventoryItemId: z.string().min(1),
  medicineName: z.string(),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unitPrice: z.number(),
  availableStock: z.number(),
});

export const pharmacySaleSchema = z.object({
  patientId: z.string().optional(),
  medicines: z.array(saleItemSchema).min(1, "Add at least one medicine"),
});