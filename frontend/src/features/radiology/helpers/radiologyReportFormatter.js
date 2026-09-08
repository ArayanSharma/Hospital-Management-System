/**
 * Radiology Report Helper & Formatter Utilities
 */

export const DEFAULT_REPORT_DATA = {
  technique: "",
  findings: "",
  impression: "",
  recommendations: "",
  additionalNotes: "",
  technicianName: "",
  checkedByName: "",
  studyReviewed: true,
  clinicalIndication: "",
  relevantHistory: "",
  examinationTechnique: "",
  bodyPart: "",
  views: "Standard Views",
  contrast: "Not Used",
  imageQuality: "Diagnostic",
  images: [],
};

export const CHARACTER_LIMITS = {
  technique: 500,
  findings: 2000,
  impression: 1000,
  recommendations: 1000,
  additionalNotes: 1000,
};

export function getCharacterCounter(text = "", limit = 1000) {
  return `${text.length}/${limit}`;
}

export function formatReportDate(dateString) {
  if (!dateString) return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function getStatusBadgeStyle(status = "draft") {
  switch (String(status).toLowerCase()) {
    case "finalized":
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "draft":
    case "in-progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}
