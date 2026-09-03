import React from "react";
import { Plus, Download } from "lucide-react";

export default function InvoicesHeader({ onNewInvoice, onExport }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Invoices</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage patient invoices, billing and collections
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onNewInvoice}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
