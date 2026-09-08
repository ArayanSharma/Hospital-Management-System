import React from "react";
import { Shield, Receipt, CheckCircle2 } from "lucide-react";
import { formatRupee } from "../../../billing/helpers/invoiceCalculations.js";

export default function ClaimSummarySidebar({
  providerName,
  policyNumber,
  tpaName,
  sumInsured,
  policyValidity,
  policyStatus,
  invoiceNumber,
  invoiceDate,
  invoiceTotal,
  invoicePaid,
  invoiceDue,
}) {
  return (
    <div className="space-y-4">
      {/* Card 1: Policy Summary */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">Policy Summary</h3>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Provider</span>
            <p className="font-extrabold text-slate-900">{providerName || "Select Policy..."}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Policy Number</span>
            <p className="font-mono font-extrabold text-slate-900">{policyNumber || "—"}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">TPA Name</span>
            <p className="font-bold text-slate-800">{tpaName || "—"}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Sum Insured</span>
            <p className="font-black text-emerald-600 text-sm">
              {sumInsured ? formatRupee(sumInsured) : "₹ 0.00"}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Policy Validity</span>
            <p className="font-bold text-slate-800">{policyValidity || "Not Specified"}</p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-slate-400 font-medium">Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {policyStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Card 2: Invoice Summary */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Receipt className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">Invoice Summary</h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Invoice ID</span>
            <span className="font-mono font-extrabold text-blue-600">
              {invoiceNumber || "Select Invoice..."}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Invoice Date</span>
            <span className="font-bold text-slate-800">{invoiceDate || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Total Amount</span>
            <span className="font-extrabold text-slate-900">
              {invoiceTotal ? formatRupee(invoiceTotal) : "₹ 0.00"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Paid Amount</span>
            <span className="font-bold text-slate-700">{formatRupee(invoicePaid)}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-slate-400 font-medium">Due Amount</span>
            <span className="font-black text-rose-600 text-sm">
              {invoiceDue ? formatRupee(invoiceDue) : "₹ 0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Important Notes */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2.5">
        <h3 className="text-xs font-extrabold text-slate-900 border-b border-slate-100 pb-2">
          Important Notes
        </h3>

        <div className="space-y-2 text-[11px] font-medium text-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Ensure all documents are uploaded before submitting claim.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>Claim amount should not exceed invoice amount.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>You will be notified for any update on claim status.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>For any query, contact TPA helpdesk.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
