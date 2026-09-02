import React from "react";

export default function PosCustomerDetails({
  customerType,
  setCustomerType,
  customerName,
  setCustomerName,
  mobileNumber,
  setMobileNumber,
  prescriptionNo,
  setPrescriptionNo,
}) {
  return (
    <div className="space-y-3 bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/70">
      <h3 className="text-xs font-bold text-slate-900">Customer Details</h3>

      {/* Customer Type Radio Pills */}
      <div className="flex items-center gap-6 text-xs font-semibold text-slate-700">
        {["Walk-in Customer", "OPD Patient", "IPD Patient"].map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="customerType"
              checked={customerType === type}
              onChange={() => {
                setCustomerType(type);
                if (type === "Walk-in Customer") setCustomerName("Walk-in Customer");
                else setCustomerName("");
              }}
              className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Customer Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mobile Number</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter mobile number"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Prescription No. (Optional)</label>
          <input
            type="text"
            value={prescriptionNo}
            onChange={(e) => setPrescriptionNo(e.target.value)}
            placeholder="e.g. RX-2026-0158"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>
    </div>
  );
}
