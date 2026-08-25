import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
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

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;