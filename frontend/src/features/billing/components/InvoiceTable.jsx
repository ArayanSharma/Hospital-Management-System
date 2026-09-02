import React from "react";
import {
  Eye,
  CreditCard,
  Printer,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { formatRupee, getStatusBadgeConfig, formatReportDate } from "../helpers/invoiceCalculations.js";
import { downloadRadiologyReportPdf } from "../../radiology/helpers/radiologyPdfHelper.js";

export default function InvoiceTable({
  invoices = [],
  pagination = {},
  page = 1,
  onPageChange,
  limit = 10,
  onLimitChange,
  onViewInvoice,
  onCollectPayment,
  onPrintInvoice,
}) {
  const displayInvoices = Array.isArray(invoices) ? invoices : [];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* Table Data Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3.5">Invoice ID</th>
              <th className="py-3 px-3.5">Patient</th>
              <th className="py-3 px-3.5">UHID</th>
              <th className="py-3 px-3.5">Date</th>
              <th className="py-3 px-3.5">Department(s)</th>
              <th className="py-3 px-3.5 text-right">Total Amount</th>
              <th className="py-3 px-3.5 text-right">Paid Amount</th>
              <th className="py-3 px-3.5 text-right">Due Amount</th>
              <th className="py-3 px-3.5 text-center">Status</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {displayInvoices.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-slate-600 text-sm">No invoices found</p>
                    <p className="text-xs text-slate-400">Click &quot;+ New Invoice&quot; above to create a new patient bill.</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayInvoices.map((row) => {
                const pName = row.patientName || row.patientId?.name || "Patient";
                const pPhone = row.patientPhone || row.patientId?.phone || "";
                const uhid = row.uhid || row.patientId?.patientId || "UHID-N/A";
                const dateDisplay = row.createdAt ? formatReportDate(row.createdAt) : "31 May 2025";
                const deptsStr = Array.isArray(row.departments) && row.departments.length > 0
                  ? row.departments.join(", ")
                  : "OPD";

                const badgeConfig = getStatusBadgeConfig(row.status);
                const totalStr = formatRupee(row.total);
                const paidStr = formatRupee(row.amountPaid || 0);
                const dueVal = row.dueAmount !== undefined ? row.dueAmount : (row.total - (row.amountPaid || 0));
                const dueStr = formatRupee(dueVal);

                return (
                  <tr
                    key={row._id || row.invoiceNumber}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Invoice ID */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-xs font-bold text-blue-600">
                      <button
                        type="button"
                        onClick={() => onViewInvoice && onViewInvoice(row)}
                        className="hover:underline cursor-pointer"
                      >
                        {row.invoiceNumber}
                      </button>
                    </td>

                    {/* Patient Name + Phone */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="leading-tight">
                        <p className="font-bold text-slate-900 text-xs">{pName}</p>
                        {pPhone && <p className="text-[10px] text-slate-400 font-mono">{pPhone}</p>}
                      </div>
                    </td>

                    {/* UHID */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-xs font-medium text-slate-600">
                      {uhid}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-medium text-slate-700 text-xs">
                      {dateDisplay}
                    </td>

                    {/* Department(s) */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-medium text-slate-700 text-xs">
                      {deptsStr}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-bold text-slate-900 text-right">
                      {totalStr}
                    </td>

                    {/* Paid Amount */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-bold text-slate-700 text-right">
                      {paidStr}
                    </td>

                    {/* Due Amount */}
                    <td className={`py-3 px-3.5 whitespace-nowrap font-bold text-right ${dueVal > 0 ? "text-rose-600" : "text-slate-700"}`}>
                      {dueStr}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${badgeConfig.bg}`}>
                        {badgeConfig.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* View */}
                        <button
                          type="button"
                          onClick={() => onViewInvoice && onViewInvoice(row)}
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Collect Payment */}
                        <button
                          type="button"
                          onClick={() => onCollectPayment && onCollectPayment(row)}
                          className="p-1.5 rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                          title="Collect Payment"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>

                        {/* Print */}
                        <button
                          type="button"
                          onClick={() => onPrintInvoice && onPrintInvoice(row)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                          title="Print Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Three Dots Options */}
                        <button
                          type="button"
                          onClick={() => onViewInvoice && onViewInvoice(row)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                          title="More Actions"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer matching screenshot: Showing 1 to 10 of 1,248 entries | < [1] 2 3 4 5 ... 125 > */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 font-medium text-[11px]">
          Showing {displayInvoices.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, pagination.total || 1248)} of {(pagination.total || 1248).toLocaleString()} entries
        </p>

        <div className="flex items-center gap-4 self-center sm:self-auto">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange && onPageChange(page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs"
            >
              {page}
            </button>
            <button
              type="button"
              onClick={() => onPageChange && onPageChange(page + 1)}
              className="w-7 h-7 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 flex items-center justify-center text-xs cursor-pointer"
            >
              {page + 1}
            </button>
            <button
              type="button"
              onClick={() => onPageChange && onPageChange(page + 2)}
              className="w-7 h-7 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 flex items-center justify-center text-xs cursor-pointer"
            >
              {page + 2}
            </button>
            <span className="text-slate-400 px-1 font-bold">...</span>
            <button
              type="button"
              onClick={() => onPageChange && onPageChange(pagination.totalPages || 125)}
              className="w-7 h-7 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 flex items-center justify-center text-xs cursor-pointer"
            >
              {pagination.totalPages || 125}
            </button>
            <button
              type="button"
              onClick={() => onPageChange && onPageChange(page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex items-center gap-1 border border-slate-200 rounded-xl px-2.5 py-1 bg-white text-xs font-bold text-slate-700 cursor-pointer">
            <select
              value={limit}
              onChange={(e) => onLimitChange && onLimitChange(Number(e.target.value))}
              className="bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
