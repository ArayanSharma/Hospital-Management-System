import React from "react";

export default function OpdBillsSummaryTab() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
      <div className="flex justify-between py-1 border-b border-slate-200">
        <span className="text-slate-500">OPD Consultation Fee</span>
        <span className="font-bold text-slate-800">₹500.00</span>
      </div>
      <div className="flex justify-between py-1 border-b border-slate-200">
        <span className="text-slate-500">Medicine Charges</span>
        <span className="font-bold text-slate-800">₹180.00</span>
      </div>
      <div className="flex justify-between py-1.5 font-bold text-sm text-slate-900">
        <span>Total Payable</span>
        <span className="text-blue-600">₹680.00</span>
      </div>
    </div>
  );
}
