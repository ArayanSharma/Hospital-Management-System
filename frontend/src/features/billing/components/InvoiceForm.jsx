import React from "react";
import { FileText, AlertTriangle } from "lucide-react";
import { useInvoiceForm } from "../hooks/useInvoiceForm.js";
import InvoicePatientSection from "./form/InvoicePatientSection.jsx";
import InvoiceItemsSection from "./form/InvoiceItemsSection.jsx";
import InvoiceSummarySidebar from "./form/InvoiceSummarySidebar.jsx";

export default function InvoiceForm({ onSubmit, onCancel, submitting }) {
  const form = useInvoiceForm(onSubmit);

  return (
    <form onSubmit={form.handleSubmit} className="p-1 space-y-5 text-xs text-slate-800">
      {form.validationError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{form.validationError}</span>
        </div>
      )}

      {/* 2-Column Modular Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Patient Info, Add Items, Invoice Notes */}
        <div className="lg:col-span-8 space-y-4">
          <InvoicePatientSection form={form} />
          <InvoiceItemsSection form={form} />

          {/* SECTION 3: 3. Invoice Notes (Optional) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">
                3. Invoice Notes (Optional)
              </h2>
            </div>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => form.setNotes(e.target.value)}
              placeholder="Enter any additional notes..."
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Invoice Summary & Status Sidebar */}
        <div className="lg:col-span-4">
          <InvoiceSummarySidebar form={form} />
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting || !!form.validationError}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Invoice"}
        </button>
      </div>
    </form>
  );
}