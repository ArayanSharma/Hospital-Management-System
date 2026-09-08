/**
 * Centralized Insurance Helper & Utility Functions
 */

export const getStatusBadgeStyle = (status) => {
  const s = String(status || "").toLowerCase();
  switch (s) {
    case "active":
    case "approved":
      return {
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-200",
        iconColor: "text-emerald-600",
        label: status || "Active",
      };
    case "under review":
    case "under-review":
      return {
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
        iconColor: "text-amber-600",
        label: "Under Review",
      };
    case "settled":
      return {
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
        label: "Settled",
      };
    case "expired":
    case "rejected":
    case "inactive":
      return {
        bgColor: "bg-rose-50",
        textColor: "text-rose-700",
        borderColor: "border-rose-200",
        iconColor: "text-rose-600",
        label: status || "Expired",
      };
    default:
      return {
        bgColor: "bg-slate-100",
        textColor: "text-slate-700",
        borderColor: "border-slate-200",
        iconColor: "text-slate-500",
        label: status || "Submitted",
      };
  }
};

export const calculateNextYearUntilDate = (validFromStr) => {
  if (!validFromStr) return "";
  const fromDate = new Date(validFromStr);
  const untilDate = new Date(fromDate);
  untilDate.setFullYear(untilDate.getFullYear() + 1);
  untilDate.setDate(untilDate.getDate() - 1);
  return untilDate.toISOString().split("T")[0];
};

export const calculateNextYearRenewalDate = (validFromStr) => {
  if (!validFromStr) return "";
  const fromDate = new Date(validFromStr);
  fromDate.setFullYear(fromDate.getFullYear() + 1);
  return fromDate.toISOString().split("T")[0];
};

export const validateMaxFileSize = (file, maxMB = 5) => {
  if (!file) return { valid: true };
  if (file.size > maxMB * 1024 * 1024) {
    return {
      valid: false,
      message: `File "${file.name}" exceeds maximum limit of ${maxMB}MB.`,
    };
  }
  return { valid: true };
};
