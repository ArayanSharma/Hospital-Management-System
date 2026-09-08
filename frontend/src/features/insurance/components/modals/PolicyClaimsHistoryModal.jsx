import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { formatRupee } from "../../../billing/helpers/invoiceCalculations.js";
import InsuranceStatusBadge from "../common/InsuranceStatusBadge.jsx";

export default function PolicyClaimsHistoryModal({ isOpen, onClose, policy, claims = [] }) {
  if (!policy) return null;

  const linkedClaims = claims.filter((c) => c.policyNumber === policy.policyNumber || c.policyId === policy._id);
  const totalCoverage = Number(policy.coverageAmount || policy.sumInsured || 0);
  const totalUtilized = linkedClaims.reduce((sum, c) => sum + (Number(c.approvedAmount || c.settledAmount || 0)), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Claims & Pre-Auth History Timeline"
      subtitle={`Policy No: ${policy.policyNumber} — Patient: ${policy.patientName} (${policy.uhid})`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs font-medium">
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Sum Insured</span>
            <p className="font-bold text-slate-900 text-sm">{formatRupee(totalCoverage)}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400">Utilized Claims</span>
            <p className="font-bold text-rose-600 text-sm">{formatRupee(totalUtilized)}</p>
          </div>
        </div>

        {/* Dynamic Audit Log Timeline */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {linkedClaims.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No historical claims found for this policy.
            </div>
          ) : (
            linkedClaims.map((c, i) => (
              <div key={c._id || i} className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-700 text-xs">{c.claimNumber}</span>
                  <InsuranceStatusBadge status={c.status || "Submitted"} />
                </div>

                <div className="text-[11px] text-slate-700 leading-snug">
                  <p className="font-bold text-slate-900">{c.diagnosis || "General Admission / Treatment"}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Date: {c.treatmentDate || c.submittedDate || "N/A"} | Type: {c.claimType || "Cashless"}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
                  <span className="text-slate-500">Claimed: <strong className="text-slate-800">{formatRupee(c.claimAmount)}</strong></span>
                  <span className="text-slate-500">Approved: <strong className="text-emerald-600">{formatRupee(c.approvedAmount || 0)}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
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
