import { z } from "zod";

export const inventoryItemSchema = z.object({
  itemName: z.string().trim().min(2, "Item name is required"),
  category: z.string().trim().min(2, "Category is required"),
  quantity: z.coerce.number().min(0).optional(),
  unit: z.string().trim().min(1, "Unit is required"),
  minimumStock: z.coerce.number().min(0, "Minimum stock is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  batchNumber: z.string().trim().optional(),
  expiryDate: z.string().optional(),
});

export const stockInSchema = z.object({
  quantity: z.coerce.number().positive("Quantity must be positive"),
});