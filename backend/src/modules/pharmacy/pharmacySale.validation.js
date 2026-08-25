import { z } from "zod";

const saleMedicineItemSchema = z.object({
  medicineId: z.string().min(1, "Medicine is required"),
  inventoryItemId: z.string().min(1, "Inventory item is required"),
  quantity: z.number().positive("Quantity must be positive"),
});

export const createPharmacySaleSchema = z.object({
  body: z.object({
    patientId: z.string().optional(),
    prescriptionId: z.string().optional(),
    medicines: z.array(saleMedicineItemSchema).min(1, "At least one medicine is required"),
  }),
});