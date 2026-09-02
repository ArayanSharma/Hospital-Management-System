import { z } from "zod";

export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().trim().optional(),
    supplierName: z.string().trim().optional(),
    companyType: z.string().optional(),
    gstNumber: z.string().optional(),
    contactPerson: z.string().optional(),
    designation: z.string().optional(),
    phone: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    alternatePhone: z.string().optional(),
    website: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pinCode: z.string().optional(),
    country: z.string().optional(),
    category: z.string().optional(),
    supplierCategory: z.string().optional(),
    paymentTerms: z.string().optional(),
    creditLimit: z.coerce.number().optional(),
    preferredSupplier: z.union([z.string(), z.boolean()]).optional(),
    panNumber: z.string().optional(),
    notes: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const updateSupplierSchema = z.object({
  body: createSupplierSchema.shape.body.partial(),
});