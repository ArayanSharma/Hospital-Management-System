import mongoose from "mongoose";

const stockInItemSchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
  },
  name: {
    type: String,
    required: [true, "Medicine name is required"],
    trim: true,
  },
  dosageForm: {
    type: String,
    trim: true,
  },
  batchNo: {
    type: String,
    required: [true, "Batch number is required"],
    trim: true,
  },
  expiryDate: {
    type: Date,
    required: [true, "Expiry date is required"],
  },
  purchasePrice: {
    type: Number,
    required: [true, "Purchase price is required"],
    min: 0,
  },
  qtyReceived: {
    type: Number,
    required: [true, "Quantity received is required"],
    min: 1,
  },
  unit: {
    type: String,
    default: "Strip",
  },
  gstRate: {
    type: Number,
    default: 12,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const stockInSchema = new mongoose.Schema(
  {
    // Section 1: Purchase Information
    supplier: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },
    invoiceNo: {
      type: String,
      required: [true, "Invoice number is required"],
      trim: true,
      index: true,
    },
    invoiceDate: {
      type: Date,
      required: [true, "Invoice date is required"],
      default: Date.now,
    },
    purchaseType: {
      type: String,
      enum: ["Cash Purchase", "Credit Purchase", "Advance Payment"],
      default: "Cash Purchase",
    },
    referenceChallanNo: {
      type: String,
      trim: true,
    },
    paymentTerms: {
      type: String,
      trim: true,
    },
    expectedDeliveryDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },

    // Section 2: Items Added
    items: {
      type: [stockInItemSchema],
      validate: [(val) => val.length > 0, "At least one item is required in Stock In"],
    },

    // Totals & Financials
    subTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    totalGst: {
      type: Number,
      required: true,
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // Section 3: Additional Information
    receivedBy: {
      type: String,
      required: [true, "Received by is required"],
      trim: true,
    },
    checkedBy: {
      type: String,
      trim: true,
    },
    storeLocation: {
      type: String,
      default: "Main Pharmacy Store",
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    printGrn: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "cancelled"],
      default: "completed",
    },
  },
  { timestamps: true }
);

const StockIn = mongoose.model("StockIn", stockInSchema);

export default StockIn;
