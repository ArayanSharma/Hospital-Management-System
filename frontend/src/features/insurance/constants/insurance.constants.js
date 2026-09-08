/**
 * Centralized Insurance Constants
 */

export const POLICY_STATUSES = ["All Status", "Active", "Expired", "Inactive", "Suspended"];

export const CLAIM_STATUSES = [
  "All Status",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
  "Settled",
];

export const CLAIM_STATUS_GUIDE = [
  { status: "Submitted", desc: "Claim request submitted to TPA" },
  { status: "Under Review", desc: "TPA is reviewing the claim" },
  { status: "Approved", desc: "Claim approved by TPA" },
  { status: "Rejected", desc: "Claim rejected by TPA" },
  { status: "Settled", desc: "Amount settled to hospital" },
];

export const INSURANCE_PROVIDERS = [
  "Star Health & Allied Insurance Co. Ltd.",
  "HDFC ERGO Health Insurance Co. Ltd.",
  "Max Bupa Health Insurance Co. Ltd.",
  "Ayushman Bharat",
  "ICICI Lombard General Insurance",
  "Niva Bupa Health Insurance",
];

export const TPA_NAMES = [
  "Health India TPA Services Pvt. Ltd.",
  "Medi Assist TPA Services",
  "Heritage Health TPA Pvt. Ltd.",
  "Vipul MedCorp TPA Pvt. Ltd.",
  "Direct Settlement",
];

export const POLICY_TYPES = [
  "Individual Health",
  "Family Floater",
  "Senior Citizen",
  "Critical Illness",
  "Corporate Group Policy",
];

export const RELATIONSHIPS = ["Self", "Spouse", "Child", "Parent", "Other"];

export const POLICY_DOC_ITEMS = [
  { key: "policyDoc", label: "Policy Document *", subText: "Upload policy document" },
  { key: "cardFront", label: "Insurance Card (Front)", subText: "Upload front side" },
  { key: "cardBack", label: "Insurance Card (Back)", subText: "Upload back side" },
  { key: "otherDoc", label: "Any Other Document", subText: "Upload any other document" },
];

export const CLAIM_DOC_ITEMS = [
  { key: "claimForm", label: "Claim Form *", subText: "Upload claim form" },
  { key: "medicalReports", label: "Medical Reports *", subText: "Upload medical reports" },
  { key: "labReports", label: "Investigation Reports", subText: "Upload lab / test reports" },
  { key: "dischargeSummary", label: "Discharge Summary", subText: "Upload discharge summary" },
  { key: "invoiceCopy", label: "Bills / Invoice Copy *", subText: "Upload bills / invoice" },
  { key: "otherDocs", label: "Other Documents", subText: "Upload other documents" },
];
