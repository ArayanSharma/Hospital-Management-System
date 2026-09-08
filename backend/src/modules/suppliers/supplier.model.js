import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      index: true,
    },
    companyType: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person is required"],
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    alternatePhone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    addressLine1: {
      type: String,
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      default: "India",
      trim: true,
    },
    category: {
      type: String,
      default: "Pharmaceuticals",
      trim: true,
    },
    paymentTerms: {
      type: String,
      trim: true,
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    outstandingBalance: {
      type: Number,
      default: 45000,
    },
    paymentHistory: [
      {
        payAmount: Number,
        paymentMode: String,
        notes: String,
        date: { type: Date, default: Date.now },
        processedBy: String,
      },
    ],
    preferredSupplier: {
      type: Boolean,
      default: false,
    },
    panNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "archived", "Active", "Inactive", "Archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;