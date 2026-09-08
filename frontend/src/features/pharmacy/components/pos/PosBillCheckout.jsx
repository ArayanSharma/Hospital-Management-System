import React from "react";

export default function PosBillCheckout({
  subTotal,
  gstAmount,
  grandTotal,
  paymentMethod,
  setPaymentMethod,
  onCompleteSale,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shrink-0">
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-bold text-slate-800">₹ {subTotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>GST (12%)</span>
          <span className="font-bold text-slate-800">₹ {gstAmount.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-100">
          <span>Grand Total</span>
          <span className="text-blue-600 text-base">₹ {grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Pills */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Payment Method</label>
        <div className="grid grid-cols-4 gap-2">
          {["Cash", "UPI", "Card", "Credit"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setPaymentMethod(m)}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                paymentMethod === m
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Complete Sale Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onCompleteSale}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Complete Sale & Print Invoice (₹ {grandTotal.toFixed(2)})
        </button>
      </div>
    </div>
  );
}
