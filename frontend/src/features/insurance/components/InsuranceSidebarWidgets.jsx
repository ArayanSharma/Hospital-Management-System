import React from "react";
import {
  ChevronRight,
  PlusCircle,
  FileCheck,
  Upload,
  BarChart3,
  Hourglass,
  Search,
  CheckCircle2,
  XCircle,
  Building,
} from "lucide-react";
import { CLAIM_STATUS_GUIDE } from "../constants/insurance.constants.js";

export default function InsuranceSidebarWidgets({
  onOpenAddPolicy,
  onOpenSubmitClaim,
  onOpenUploadDoc,
  onOpenReport,
}) {
  const getGuideIcon = (iconName) => {
    switch (iconName) {
      case "CheckCircle":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case "Search":
        return <Search className="w-4 h-4 text-amber-600 shrink-0" />;
      case "XCircle":
        return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case "Building":
        return <Building className="w-4 h-4 text-blue-600 shrink-0" />;
      case "Hourglass":
      default:
        return <Hourglass className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Widget 1: Quick Actions */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2">
          Quick Actions
        </h3>

        <div className="space-y-2">
          {/* Add Insurance Policy */}
          <button
            type="button"
            onClick={onOpenAddPolicy}
            className="w-full p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/70 text-blue-600 hover:border-blue-200 flex items-center justify-between font-bold transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>Add Insurance Policy</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Submit New Claim */}
          <button
            type="button"
            onClick={onOpenSubmitClaim}
            className="w-full p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/70 text-blue-600 hover:border-blue-200 flex items-center justify-between font-bold transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Submit New Claim</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Upload Documents */}
          <button
            type="button"
            onClick={onOpenUploadDoc}
            className="w-full p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/70 text-blue-600 hover:border-blue-200 flex items-center justify-between font-bold transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Upload Documents</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Insurance Report */}
          <button
            type="button"
            onClick={onOpenReport}
            className="w-full p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/70 text-blue-600 hover:border-blue-200 flex items-center justify-between font-bold transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Insurance Report</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Widget 2: Claim Status Guide */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2">
          Claim Status Guide
        </h3>

        <div className="space-y-3">
          {CLAIM_STATUS_GUIDE.map((guide, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="mt-0.5">{getGuideIcon(guide.icon)}</div>
              <div>
                <p className="font-extrabold text-slate-900 leading-tight">{guide.status}</p>
                <p className="text-[11px] text-slate-500 font-medium leading-normal">{guide.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 3: Important Notes */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2">
          Important Notes
        </h3>

        <ul className="space-y-2 text-slate-600 font-medium text-[11px] list-disc pl-4 leading-relaxed">
          <li>Ensure active policy before submitting claim.</li>
          <li>Upload all required documents.</li>
          <li>Approved amount may differ from claimed amount.</li>
          <li>Settled amount will be reflected in hospital account.</li>
        </ul>
      </div>
    </div>
  );
}
