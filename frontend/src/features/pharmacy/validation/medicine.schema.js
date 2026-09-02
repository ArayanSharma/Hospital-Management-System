import { z } from "zod";

export const medicineSchema = z.object({
  genericName: z.string().trim().min(1, "Generic Name is required"),
  brandName: z.string().trim().optional(),
  code: z.string().trim().min(1, "Medicine Code is required"),
  category: z.string().trim().min(1, "Category is required"),
  therapeuticCategory: z.string().trim().optional(),
  dosageForm: z.string().trim().min(1, "Dosage Form is required"),
  strength: z.string().trim().min(1, "Strength / Composition is required"),
  packSize: z.string().trim().min(1, "Pack Size is required"),
  unit: z.string().trim().min(1, "Unit is required"),

  manufacturer: z.string().trim().min(1, "Manufacturer is required"),
  supplier: z.string().trim().optional(),
  countryOfOrigin: z.string().trim().optional(),

  unitPrice: z.coerce.number().min(0, "Unit Price is required"),
  mrp: z.coerce.number().min(0).optional(),
  gstRate: z.coerce.number().min(0, "GST Rate is required"),
  purchasePrice: z.coerce.number().min(0).optional(),
  margin: z.coerce.number().optional(),
  sellingPrice: z.coerce.number().min(0).optional(),

  prescriptionRequired: z.string().optional(),
  controlledMedicine: z.string().optional(),
  shelfLifeValue: z.coerce.number().optional(),
  shelfLifeUnit: z.string().optional(),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters").optional(),

  addAnother: z.boolean().optional(),
});