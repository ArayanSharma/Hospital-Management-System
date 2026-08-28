import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    admissionId: {
      type: String,
      unique: true,
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    wardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: true,
    },
    bedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bed",
      required: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      trim: true,
      required: [true, "Admission reason is required"],
    },
    diagnosis: {
      type: String,
      trim: true,
    },
    provisionalDiagnosis: {
      type: String,
      trim: true,
      default: "",
    },
    allergies: {
      type: String,
      trim: true,
      default: "",
    },
    medicalHistory: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    dailyRent: {
      type: Number,
      default: 0,
    },
    bedType: {
      type: String,
      trim: true,
      default: "Standard",
    },
    dischargeDate: {
      type: Date,
      default: null,
    },
    dischargeSummary: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["admitted", "discharged"],
      default: "admitted",
    },
  },
  { timestamps: true }
);

admissionSchema.index({ patientId: 1, admissionDate: -1 });
admissionSchema.index({ status: 1 });
admissionSchema.index({ admissionId: 1 });

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;