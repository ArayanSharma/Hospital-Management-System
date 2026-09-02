import React from "react";
import { Shield, CheckCircle2 } from "lucide-react";
import { formatRupee, formatReportDate } from "../../../billing/helpers/invoiceCalculations.js";

export default function PolicySummarySidebar({
  patientDisplay,
  providerName,
  policyNumber,
  policyType,
  tpaName,
  sumInsured,
  validFrom,
  validUntil,
  status,
  relationship,
}) {
  return (
    <div className="space-y-4">
      {/* Card 1: Policy Summary (Preview) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">
            Policy Summary (Preview)
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Patient</span>
            <p className="font-extrabold text-slate-900">{patientDisplay || "Select Patient..."}</p>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Provider</span>
            <p className="font-bold text-slate-800">{providerName}</p>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Policy Number</span>
            <p className="font-mono font-extrabold text-slate-900">
              {policyNumber || "Enter Policy Number..."}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Policy Type</span>
            <p className="font-bold text-slate-800">{policyType}</p>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">TPA Name</span>
            <p className="font-bold text-slate-800">{tpaName}</p>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Sum Insured</span>
            <p className="font-black text-emerald-600 text-sm">
              {sumInsured ? formatRupee(sumInsured) : "₹ 0.00"}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Validity</span>
            <p className="font-bold text-slate-800">
              {validFrom && validUntil
                ? `${formatReportDate(validFrom)} to ${formatReportDate(validUntil)}`
                : "Not Specified"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-slate-400 font-medium">Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Relationship</span>
            <span className="font-bold text-slate-800">{relationship}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Important Notes */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
        <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2">
          Important Notes
        </h3>

        <div className="space-y-2 text-[11px] font-medium text-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Ensure policy is active at the time of admission or billing.</span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Upload clear and valid policy documents.</span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Incorrect policy details may lead to claim rejection.</span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Approved amount may differ from claimed amount.</span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Settled amount will be reflected in hospital account.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
