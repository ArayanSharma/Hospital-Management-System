import React from "react";
import { FileText, Banknote, CreditCard, AlertCircle } from "lucide-react";
import { formatRupee } from "../helpers/invoiceCalculations.js";

export default function InvoiceKpiCards({ stats = {} }) {
  const totalInvoices = stats.totalInvoices !== undefined ? stats.totalInvoices.toLocaleString() : "1,248";
  const totalBilled = stats.totalBilledAmount !== undefined ? formatRupee(stats.totalBilledAmount, false) : "₹ 38,72,450";
  const totalPaid = stats.totalPaidAmount !== undefined ? formatRupee(stats.totalPaidAmount, false) : "₹ 26,81,230";
  const totalOutstanding = stats.totalOutstandingAmount !== undefined ? formatRupee(stats.totalOutstandingAmount, false) : "₹ 11,91,220";

  const cards = [
    {
      title: "Total Invoices",
      value: totalInvoices,
      subtitle: "This Month",
      icon: FileText,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
      valueColor: "text-slate-900",
    },
    {
      title: "Total Billed Amount",
      value: totalBilled,
      subtitle: "This Month",
      icon: Banknote,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      valueColor: "text-slate-900",
    },
    {
      title: "Total Paid Amount",
      value: totalPaid,
      subtitle: "This Month",
      icon: CreditCard,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      valueColor: "text-slate-900",
    },
    {
      title: "Total Outstanding",
      value: totalOutstanding,
      subtitle: "This Month",
      icon: AlertCircle,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      valueColor: "text-slate-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <div
            key={c.title}
            className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-semibold text-slate-500">{c.title}</p>
                <p className={`text-xl font-extrabold my-0.5 tracking-tight ${c.valueColor}`}>{c.value}</p>
                <p className="text-[10px] font-medium text-slate-400">{c.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
