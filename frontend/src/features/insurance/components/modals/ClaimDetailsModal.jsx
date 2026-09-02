import React from "react";
import { X, FileCheck, CheckCircle2, Search, XCircle, Building, Hourglass } from "lucide-react";
import { formatRupee } from "../../../billing/helpers/invoiceCalculations.js";

export default function ClaimDetailsModal({ isOpen, onClose, claim, onUpdateStatus }) {
  if (!isOpen || !claim) return null;

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approved</span>
        </span>
      );
    }
    if (s === "under review" || s === "under-review") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Search className="w-3.5 h-3.5 text-amber-600" />
          <span>Under Review</span>
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Rejected</span>
        </span>
      );
    }
    if (s === "settled") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Building className="w-3.5 h-3.5 text-blue-600" />
          <span>Settled</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <Hourglass className="w-3.5 h-3.5 text-slate-500" />
        <span>Submitted</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Insurance Claim Details</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Claim Header Card */}
        <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">CLAIM NUMBER</p>
              <h3 className="font-extrabold text-blue-600 font-mono text-base">{claim.claimNumber}</h3>
              <p className="text-xs font-bold text-slate-900">{claim.patientName} ({claim.uhid})</p>
            </div>
            <div>{getStatusBadge(claim.status)}</div>
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-2 gap-3 p-1">
          <div>
            <span className="text-slate-400 font-medium">Policy Number</span>
            <p className="font-mono font-bold text-slate-800">{claim.policyNumber}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Invoice ID</span>
            <p className="font-mono font-bold text-blue-600">{claim.invoiceNumber}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Claim Amount</span>
            <p className="font-extrabold text-slate-900 text-sm">{formatRupee(claim.claimAmount)}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Approved Amount</span>
            <p className="font-extrabold text-emerald-700 text-sm">
              {claim.approvedAmount !== null && claim.approvedAmount !== undefined
                ? formatRupee(claim.approvedAmount)
                : "—"}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Diagnosis</span>
            <p className="font-semibold text-slate-800">{claim.diagnosis || "Acute Appendicitis"}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Last Updated</span>
            <p className="font-medium text-slate-800">{claim.lastUpdatedDate || "31 May 2025"}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          {claim.status !== "Approved" && claim.status !== "Settled" && (
            <button
              type="button"
              onClick={() => {
                const appAmt = prompt("Enter Approved Amount (₹):", claim.claimAmount);
                if (appAmt) {
                  onUpdateStatus(claim._id, "Approved", { approvedAmount: Number(appAmt) });
                  onClose();
                }
              }}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Approve Claim
            </button>
          )}

          {claim.status === "Approved" && (
            <button
              type="button"
              onClick={() => {
                onUpdateStatus(claim._id, "Settled");
                onClose();
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Mark Settled
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
