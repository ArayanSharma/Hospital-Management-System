import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { ShieldCheck, Building, FileSpreadsheet, FileText, ArrowUpRight } from "lucide-react";
import { formatRupee, formatReportDate } from "../../../billing/helpers/invoiceCalculations.js";
import InsuranceStatusBadge from "../common/InsuranceStatusBadge.jsx";

export default function ViewPolicyDetailModal({ isOpen, onClose, policy, claims = [], onOpenSubmitClaim }) {
  if (!policy) return null;

  const totalCoverage = Number(policy.coverageAmount || policy.sumInsured || 0);
  
  // Dynamically compute utilized amount from actual settled/approved claims in database
  const linkedClaims = claims.filter((c) => c.policyNumber === policy.policyNumber || c.policyId === policy._id);
  const utilized = linkedClaims.reduce((sum, c) => sum + (Number(c.approvedAmount || c.settledAmount || 0)), 0);
  const remaining = Math.max(0, totalCoverage - utilized);
  const percentUsed = totalCoverage > 0 ? Math.min(100, Math.round((utilized / totalCoverage) * 100)) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Policy Complete Master Details"
      subtitle={`Policy No: ${policy.policyNumber} — Provider: ${policy.providerName}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5 text-xs font-medium">
        {/* Top Header Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{policy.patientName || "Patient"}</h3>
                <InsuranceStatusBadge status={policy.status || "Active"} />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                UHID: <span className="font-bold text-slate-700">{policy.uhid || "N/A"}</span> | Member ID: <span className="font-mono text-slate-700">{policy.memberId || "N/A"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSubmitClaim?.(policy);
              }}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Submit Claim</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: General Details & Coverage Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient & TPA Provider Info */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200/60 pb-2 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Insurance & TPA Provider</span>
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Insurance Provider:</span>
                <span className="font-bold text-slate-800">{policy.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TPA Name:</span>
                <span className="font-semibold text-slate-800">{policy.tpaName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Policy Type:</span>
                <span className="font-semibold text-slate-800">{policy.policyType || "Individual/Floater"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Validity Period:</span>
                <span className="font-semibold text-slate-800">
                  {formatReportDate(policy.validFrom)} — {formatReportDate(policy.validUntil)}
                </span>
              </div>
            </div>
          </div>

          {/* Coverage & Balance Tracker */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200/60 pb-2 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Coverage & Sum Insured</span>
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Sum Insured:</span>
                <span className="font-extrabold text-slate-900">{formatRupee(totalCoverage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Utilized Claims Amount:</span>
                <span className="font-bold text-rose-600">{formatRupee(utilized)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Balance:</span>
                <span className="font-extrabold text-emerald-600">{formatRupee(remaining)}</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>Coverage Utilized</span>
                  <span>{percentUsed}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${percentUsed}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Linked Claims Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Claims Processed Under Policy ({linkedClaims.length})</span>
            </h4>
          </div>

          <div className="border border-slate-200/80 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Claim No</th>
                  <th className="py-2.5 px-3">Claim Type</th>
                  <th className="py-2.5 px-3">Treatment Date</th>
                  <th className="py-2.5 px-3 text-right">Claimed</th>
                  <th className="py-2.5 px-3 text-right">Approved</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {linkedClaims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 font-medium">
                      No claims recorded under this policy.
                    </td>
                  </tr>
                ) : (
                  linkedClaims.map((c, i) => (
                    <tr key={c._id || i} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono font-bold text-blue-600">{c.claimNumber}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{c.claimType || "Cashless"}</td>
                      <td className="py-2 px-3 text-slate-600">{c.treatmentDate || c.submittedDate || "N/A"}</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-800">{formatRupee(c.claimAmount)}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-600">{formatRupee(c.approvedAmount || 0)}</td>
                      <td className="py-2 px-3 text-center">
                        <InsuranceStatusBadge status={c.status || "Submitted"} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
