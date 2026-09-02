import React from "react";
import { CheckCircle2, Search, XCircle, Building, Hourglass } from "lucide-react";
import { getStatusBadgeStyle } from "../../helpers/insuranceHelpers.js";

export default function InsuranceStatusBadge({ status }) {
  const style = getStatusBadgeStyle(status);
  const s = String(status || "").toLowerCase();

  const getIcon = () => {
    if (s === "approved" || s === "active") return <CheckCircle2 className="w-3 h-3 text-emerald-600" />;
    if (s === "under review" || s === "under-review") return <Search className="w-3 h-3 text-amber-600" />;
    if (s === "rejected" || s === "expired" || s === "inactive") return <XCircle className="w-3 h-3 text-rose-600" />;
    if (s === "settled") return <Building className="w-3 h-3 text-blue-600" />;
    return <Hourglass className="w-3 h-3 text-slate-500" />;
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${style.bgColor} ${style.textColor} ${style.borderColor}`}
    >
      {getIcon()}
      <span>{style.label}</span>
    </span>
  );
}
