import React from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";

export default function LabStatusBadge({ status, className = "" }) {
  const s = String(status || "pending").toLowerCase();

  if (s === "pending") {
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 inline-flex items-center gap-1 ${className}`}>
        <Clock className="w-3 h-3 text-amber-500" />
        <span>Pending</span>
      </span>
    );
  }

  if (s === "sample-collected") {
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-200 inline-flex items-center gap-1 ${className}`}>
        <Clock className="w-3 h-3 text-purple-500" />
        <span>Sample Collected</span>
      </span>
    );
  }

  if (s === "completed" || s === "finalized") {
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 inline-flex items-center gap-1 ${className}`}>
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        <span>{s === "finalized" ? "Finalized" : "Completed"}</span>
      </span>
    );
  }

  if (s === "cancelled") {
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 inline-flex items-center gap-1 ${className}`}>
        <XCircle className="w-3 h-3 text-rose-500" />
        <span>Cancelled</span>
      </span>
    );
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 ${className}`}>
      {status}
    </span>
  );
}
