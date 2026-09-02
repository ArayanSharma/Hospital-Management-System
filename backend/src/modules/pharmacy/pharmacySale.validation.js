import { z } from "zod";

const saleMedicineItemSchema = z.object({
  medicineId: z.string().optional(),
  medicineName: z.string().optional(),
  name: z.string().optional(),
  batchNo: z.string().optional(),
  expiryDate: z.string().optional(),
  quantity: z.coerce.number().positive("Quantity must be positive").optional(),
  qty: z.coerce.number().optional(),
  unit: z.string().optional(),
  unitPrice: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  amount: z.coerce.number().optional(),
  subtotal: z.coerce.number().optional(),
});

export const createPharmacySaleSchema = z.object({
  body: z.object({
    invoiceNo: z.string().optional(),
    customerType: z.string().optional(),
    customerName: z.string().optional(),
    mobileNumber: z.string().optional(),
    prescriptionNo: z.string().optional(),
    patientId: z.string().optional(),
    medicines: z.array(saleMedicineItemSchema).min(1, "At least one medicine is required"),
    totalItems: z.coerce.number().optional(),
    totalQuantity: z.coerce.number().optional(),
    subTotal: z.coerce.number().optional(),
    discountAmount: z.coerce.number().optional(),
    gstAmount: z.coerce.number().optional(),
    totalAmount: z.coerce.number().optional(),
    grandTotal: z.coerce.number().optional(),
    paymentMethod: z.string().optional(),
    amountReceived: z.coerce.number().optional(),
    changeAmount: z.coerce.number().optional(),
    notes: z.string().optional(),
    paymentStatus: z.string().optional(),
    printInvoice: z.boolean().optional(),
  }),
});