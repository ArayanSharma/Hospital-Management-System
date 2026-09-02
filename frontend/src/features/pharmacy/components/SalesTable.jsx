import React from "react";
import { Eye, Printer, ChevronLeft, ChevronRight } from "lucide-react";

export default function SalesTable({
  items = [],
  isLoading,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  onViewInvoice,
  onPrintInvoice,
}) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded" />
        ))}
      </div>
    );
  }

  const computedTotalItems = totalItems || items.length;
  const computedTotalPages = totalPages || Math.ceil(computedTotalItems / itemsPerPage) || 1;
  const startEntry = computedTotalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endEntry = Math.min(currentPage * itemsPerPage, computedTotalItems);

  const getTypeBadge = (type) => {
    if (type === "OPD" || type === "OPD Patient") {
      return (
        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
          OPD
        </span>
      );
    }
    if (type === "IPD" || type === "IPD Patient") {
      return (
        <span className="bg-blue-50 text-blue-600 border border-blue-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
          IPD
        </span>
      );
    }
    return (
      <span className="bg-amber-50 text-amber-600 border border-amber-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
        Walk-in
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    if (status === "Paid") {
      return (
        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold inline-block">
          Paid
        </span>
      );
    }
    if (status === "Pending") {
      return (
        <span className="bg-amber-50 text-amber-600 border border-amber-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold inline-block">
          Pending
        </span>
      );
    }
    return (
      <span className="bg-rose-50 text-rose-600 border border-rose-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold inline-block">
        Unpaid
      </span>
    );
  };

  const getSaleStatusBadge = (status) => {
    if (status === "Completed") {
      return (
        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
          Completed
        </span>
      );
    }
    if (status === "Pending") {
      return (
        <span className="bg-blue-50 text-blue-600 border border-blue-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
          Pending
        </span>
      );
    }
    return (
      <span className="bg-rose-50 text-rose-600 border border-rose-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
        Cancelled
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500">
              <th className="py-3 px-4 font-semibold">Invoice No.</th>
              <th className="py-3 px-3 font-semibold">Date & Time</th>
              <th className="py-3 px-3 font-semibold">Patient / Customer</th>
              <th className="py-3 px-3 font-semibold text-center">Type</th>
              <th className="py-3 px-3 font-semibold text-center">Items</th>
              <th className="py-3 px-3 font-semibold text-right">Amount (₹)</th>
              <th className="py-3 px-3 font-semibold text-center">Payment</th>
              <th className="py-3 px-3 font-semibold text-center">Status</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-400">
                  No sales / dispensing records found matching your filter criteria.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id || row._id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Invoice No */}
                  <td className="py-3 px-4 font-bold text-blue-600">{row.invoiceNo}</td>

                  {/* Date & Time */}
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-800 leading-tight">{row.date}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{row.time}</p>
                  </td>

                  {/* Patient / Customer */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {row.avatarImg ? (
                        <img
                          src={row.avatarImg}
                          alt={row.patientName || row.customerName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${row.avatarBg || "bg-slate-100 text-slate-600"}`}>
                          {(row.patientName || row.customerName) ? (row.patientName || row.customerName).charAt(0) : "W"}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{row.patientName || row.customerName || "Walk-in Customer"}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{row.patientId || row.customerPhone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-3 text-center">{getTypeBadge(row.patientType || row.customerType)}</td>

                  {/* Items */}
                  <td className="py-3 px-3 text-center font-bold text-slate-800">{row.itemsCount || (row.medicines ? row.medicines.length : 1)}</td>

                  {/* Amount */}
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    ₹ {Number(row.amount || row.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>

                  {/* Payment Status + Method */}
                  <td className="py-3 px-3 text-center">
                    <div>{getPaymentStatusBadge(row.paymentStatus)}</div>
                    {row.paymentMethod && (
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5">{row.paymentMethod}</p>
                    )}
                  </td>

                  {/* Sale Status */}
                  <td className="py-3 px-3 text-center">{getSaleStatusBadge(row.status || "Completed")}</td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewInvoice && onViewInvoice(row)}
                        title="View Invoice Details"
                        aria-label={`View invoice ${row.invoiceNo}`}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 border border-blue-200/60 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onPrintInvoice && onPrintInvoice(row)}
                        title="Print Invoice"
                        aria-label={`Print invoice ${row.invoiceNo}`}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p className="font-medium">
          Showing <span className="font-bold text-slate-800">{computedTotalItems > 0 ? startEntry : 0}</span> to{" "}
          <span className="font-bold text-slate-800">{endEntry}</span> of{" "}
          <span className="font-bold text-slate-800">{computedTotalItems.toLocaleString("en-IN")}</span> entries
        </p>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            className="w-8 h-8 rounded-lg border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: Math.min(5, computedTotalPages) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange && onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-blue-600 text-white shadow-xs"
                  : "border border-slate-200/80 hover:bg-slate-50 text-slate-700"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= computedTotalPages}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            className="w-8 h-8 rounded-lg border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Page-size dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange && onItemsPerPageChange(Number(e.target.value))}
            className="bg-slate-50/60 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
