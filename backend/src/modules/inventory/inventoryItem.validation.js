import { z } from "zod";

export const createInventoryItemSchema = z.object({
  body: z.object({
    itemName: z.string().trim().min(2, "Item name is required"),
    category: z.string().trim().min(2, "Category is required"),
    quantity: z.number().min(0).optional(),
    unit: z.string().trim().min(1, "Unit is required"),
    minimumStock: z.number().min(0, "Minimum stock is required"),
    supplierId: z.string().min(1, "Supplier is required"),
    batchNumber: z.string().trim().optional(),
    expiryDate: z.string().optional(),
  }),
});

export const stockInSchema = z.object({
  body: z.object({
    quantity: z.number().positive("Quantity must be positive"),
  }),
});

export const updateInventoryItemSchema = z.object({
  body: z.object({
    itemName: z.string().trim().min(2).optional(),
    category: z.string().trim().optional(),
    unit: z.string().trim().optional(),
    minimumStock: z.number().min(0).optional(),
    supplierId: z.string().optional(),
    batchNumber: z.string().trim().optional(),
    expiryDate: z.string().optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});