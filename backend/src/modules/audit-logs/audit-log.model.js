import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      // Example: "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"
      uppercase: true,
    },
    resource: {
      type: String,
      required: true,
      // Example: "patient", "user", "role", "prescription"
      lowercase: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      // Kis specific document pe action hua
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Query performance ke liye — audit logs bahut jaldi large ho jaate hain
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;