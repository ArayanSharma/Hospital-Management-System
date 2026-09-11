import React from "react";
import EmptyState from "../common/EmptyState.jsx";

export default function BillingTab({ billing }) {
  const invoices = billing?.invoices || [];
  const summary = billing?.summary || {};

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Billing & Payment Invoices
      </h3>

      {/* Financial Summary */}
      <div className="grid grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Billed</span>
          <p className="text-base font-black text-slate-900">{summary.totalBilling || "₹0"}</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Paid Amount</span>
          <p className="text-base font-black text-emerald-600">{summary.paidAmount || "₹0"}</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Outstanding Balance</span>
          <p className="text-base font-black text-rose-600">{summary.outstandingBalance || "₹0"}</p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <EmptyState title="No Invoices Generated" message="No OPD or IPD billing invoices recorded for this patient." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Due</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invoices.map((inv) => (
                <tr key={inv._id || inv.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber || inv.invoiceNo || "INV-001"}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">
                    {inv.date || (inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("en-GB") : "N/A")}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{inv.service || inv.department || "Medical Service"}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">₹{(inv.totalAmount || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">₹{(inv.paidAmount || 0).toLocaleString()}</td>
                  <td className="py-3 px-4 text-rose-600 font-bold">₹{(inv.dueAmount || 0).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        (inv.paymentStatus || "").toLowerCase() === "paid"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-amber-50 text-amber-600 border border-amber-200"
                      }`}
                    >
                      {inv.paymentStatus || "Paid"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
