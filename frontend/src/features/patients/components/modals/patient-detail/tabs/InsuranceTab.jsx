import React from "react";
import EmptyState from "../common/EmptyState.jsx";

export default function InsuranceTab({ insurance }) {
  if (!insurance) {
    return <EmptyState title="No Insurance Policy On File" message="No active health insurance policy registered for this patient." />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Insurance Policy Details
      </h3>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-black text-slate-900">{insurance.provider || insurance.insuranceCompany}</h4>
            <p className="text-xs text-slate-500">{insurance.planName || "Health Insurance Policy"}</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 font-bold text-xs border border-emerald-200 rounded-full">
            {insurance.status || "Active & Verified"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-3 border-t border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Policy Number</span>
            <p className="font-extrabold text-slate-800 font-mono mt-0.5">{insurance.policyNumber || "N/A"}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Member ID</span>
            <p className="font-extrabold text-slate-800 font-mono mt-0.5">{insurance.memberId || "N/A"}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Coverage Amount</span>
            <p className="font-extrabold text-slate-800 mt-0.5">{insurance.coverageAmount ? `₹${insurance.coverageAmount}` : "Coverage Active"}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Expiry Date</span>
            <p className="font-extrabold text-slate-800 mt-0.5">{insurance.expiryDate ? new Date(insurance.expiryDate).toLocaleDateString("en-GB") : "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
