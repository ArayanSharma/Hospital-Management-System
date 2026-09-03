import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  CreditCard,
  Printer,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Inbox,
  FileText,
  History,
  RefreshCw,
  Ban,
  Plus,
  AlertCircle,
} from "lucide-react";
import { formatRupee, getStatusBadgeConfig, formatReportDate } from "../helpers/invoiceCalculations.js";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

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
  onViewPaymentDetails,
  onViewPaymentHistory,
  onRefundInvoice,
  onVoidInvoice,
  onViewCancellationDetails,
  onCreateNewInvoice,
}) {
  const displayInvoices = Array.isArray(invoices) ? invoices : [];
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs relative">
      {/* Table Data Container */}
      <div className="overflow-x-auto rounded-t-2xl">
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
                    <p className="text-xs text-slate-400">Click &quot;New Invoice&quot; above to create a new patient bill.</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayInvoices.map((row) => {
                const rowId = row._id || row.invoiceNumber;
                const rawStatus = (row.status || "unpaid").toLowerCase();
                const isPaid = rawStatus === "paid";
                const isPartiallyPaid = rawStatus === "partially-paid" || rawStatus === "partially paid";
                const isUnpaid = rawStatus === "unpaid";
                const isCancelled = rawStatus === "cancelled" || rawStatus === "voided";

                const pName = row.patientName || row.patientId?.name || "Patient";
                const pPhone = row.patientPhone || row.patientId?.phone || "";
                const uhid = row.uhid || row.patientId?.patientId || "UHID-N/A";
                const dateDisplay = row.createdAt ? formatReportDate(row.createdAt) : "31 Aug 2026";
                const deptsStr = Array.isArray(row.departments) && row.departments.length > 0
                  ? row.departments.join(", ")
                  : "OPD";

                const badgeConfig = getStatusBadgeConfig(row.status);
                const totalStr = formatRupee(row.total);
                const paidStr = formatRupee(row.amountPaid || 0);
                const dueVal = row.dueAmount !== undefined ? row.dueAmount : (row.total - (row.amountPaid || 0));
                const dueStr = formatRupee(dueVal);

                const isDropdownOpen = activeDropdownId === rowId;

                return (
                  <tr
                    key={rowId}
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

                    {/* Actions Matrix: [ 👁 ] [ 💵 (if Unpaid/Partial) ] [ 🖨 ] [ ⋮ ] */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap relative">
                      <div className="flex items-center justify-end gap-1">
                        {/* 1. Standalone View Invoice */}
                        <button
                          type="button"
                          onClick={() => onViewInvoice && onViewInvoice(row)}
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* 2. Standalone Collect Payment (ONLY for Unpaid or Partially Paid) */}
                        {(isUnpaid || isPartiallyPaid) && (
                          <button
                            type="button"
                            onClick={() => onCollectPayment && onCollectPayment(row)}
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                            title="Collect Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* 3. Standalone Print / Download */}
                        <button
                          type="button"
                          onClick={() => onPrintInvoice && onPrintInvoice(row)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                          title="Print / Download Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* 4. Three Dots Options Dropdown */}
                        <div className="relative inline-block text-left" ref={isDropdownOpen ? dropdownRef : null}>
                          <button
                            type="button"
                            onClick={() => setActiveDropdownId(isDropdownOpen ? null : rowId)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isDropdownOpen
                                ? "bg-blue-50 border-blue-300 text-blue-600"
                                : "border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            }`}
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {/* Context-Aware Dropdown Menu */}
                          {isDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200/90 rounded-xl shadow-xl z-50 p-1 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out">
                              {/* 1. View Invoice */}
                              <button
                                type="button"
                                onClick={() => {
                                  onViewInvoice?.(row);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>View Invoice</span>
                              </button>

                              {/* 2. Paid Status Actions */}
                              {isPaid && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onViewPaymentDetails?.(row);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Payment Details</span>
                                  </button>
                                </>
                              )}

                              {/* 3. Collect Payment (Partially Paid or Unpaid) */}
                              {(isPartiallyPaid || isUnpaid) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onCollectPayment?.(row);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                                >
                                  <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Collect Payment</span>
                                </button>
                              )}

                              {/* 4. Payment History (Paid, Partially Paid, Unpaid) */}
                              {!isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onViewPaymentHistory?.(row);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                                >
                                  <History className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                  <span>Payment History</span>
                                </button>
                              )}

                              {/* 5. View Cancellation Details (Cancelled) */}
                              {isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onViewCancellationDetails?.(row);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                                >
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span>View Cancellation Details</span>
                                </button>
                              )}

                              {/* 6. Print / Download */}
                              <button
                                type="button"
                                onClick={() => {
                                  onPrintInvoice?.(row);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                <span>Print / Download</span>
                              </button>

                              {/* 7. Refund / Credit Note (Paid or Partially Paid) */}
                              {(isPaid || isPartiallyPaid) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onRefundInvoice?.(row);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                                >
                                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>Refund / Credit Note</span>
                                </button>
                              )}

                              {/* 8. Void Invoice (Paid, Partially Paid, Unpaid) */}
                              {!isCancelled && (
                                <div className="pt-1 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onVoidInvoice?.(row);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition"
                                  >
                                    <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                    <span>Void Invoice*</span>
                                  </button>
                                </div>
                              )}

                              {/* 9. Create New Invoice (Cancelled) */}
                              {isCancelled && (
                                <div className="pt-1 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onCreateNewInvoice?.();
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition"
                                  >
                                    <Plus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span>Create New Invoice</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-slate-500 overflow-visible relative z-20">
        <p className="font-medium text-[11px]">
          Showing {displayInvoices.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, pagination.total || 1248)} of {(pagination.total || 1248).toLocaleString()} entries
        </p>

        <div className="flex items-center gap-4 self-center sm:self-auto">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange && onPageChange(page - 1)}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all"
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
              disabled={page >= (pagination.totalPages || 125)}
              onClick={() => onPageChange && onPageChange(page + 1)}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page-size Custom Dropdown (Opens Downward) */}
          <CustomDropdown
            value={limit}
            options={[
              { label: "10 / page", value: 10 },
              { label: "25 / page", value: 25 },
              { label: "50 / page", value: 50 },
              { label: "100 / page", value: 100 },
            ]}
            onChange={(val) => onLimitChange && onLimitChange(Number(val))}
            minWidth="110px"
            direction="down"
            alignRight={true}
          />
        </div>
      </div>
    </div>
  );
}
