import React from "react";
import { X, Shield, FileText } from "lucide-react";
import { formatRupee, formatReportDate } from "../../../billing/helpers/invoiceCalculations.js";

export default function PolicyDetailsModal({ isOpen, onClose, policy }) {
  if (!isOpen || !policy) return null;

  const isActive = (policy.status || "").toLowerCase() === "active";

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Insurance Policy Details</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Patient & Policy Header Card */}
        <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">PATIENT INFORMATION</p>
              <h3 className="font-extrabold text-slate-900 text-sm">{policy.patientName}</h3>
              <p className="font-mono text-xs text-blue-600 font-bold">{policy.uhid}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {policy.status || "Active"}
            </span>
          </div>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-2 gap-3 p-1">
          <div>
            <span className="text-slate-400 font-medium">Provider Name</span>
            <p className="font-bold text-slate-900">{policy.providerName}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Policy Number</span>
            <p className="font-mono font-bold text-slate-800">{policy.policyNumber}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Coverage Amount</span>
            <p className="font-extrabold text-emerald-700 text-sm">{formatRupee(policy.coverageAmount)}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Plan Type</span>
            <p className="font-semibold text-slate-800">{policy.planType || "Individual Health"}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Valid From</span>
            <p className="font-bold text-slate-800">{formatReportDate(policy.validFrom)}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Valid Until</span>
            <p className="font-bold text-slate-800">{formatReportDate(policy.validUntil)}</p>
          </div>
        </div>

        {/* Attached Documents */}
        <div className="border-t border-slate-100 pt-3 space-y-2">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Policy Documents</span>
          </h4>
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">{policy.policyNumber}_Insurance_Card.pdf</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-200">
              Verified
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
