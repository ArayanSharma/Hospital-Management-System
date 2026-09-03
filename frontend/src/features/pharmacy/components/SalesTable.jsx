import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Printer,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  RotateCcw,
  ClipboardList,
  DollarSign,
  Ban,
} from "lucide-react";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

function SalesActionsDropdown({
  row,
  onViewInvoice,
  onPrintInvoice,
  onPaymentDetails,
  onCollectPayment,
  onReturnRefund,
  onTransactionHistory,
  onCancelSale,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPaid = row.paymentStatus === "Paid" || row.paymentStatus === "paid";
  const isPendingPayment = !isPaid && row.status !== "Cancelled";

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-all cursor-pointer"
        title="More Actions"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-1 w-48 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out text-left"
        >
          {/* View Invoice */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onViewInvoice?.(row);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>View Invoice</span>
          </button>

          {/* Option Set 1: Completed + Paid */}
          {isPaid && (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onPaymentDetails?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Payment Details</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onPrintInvoice?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onReturnRefund?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>Return / Refund</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onTransactionHistory?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
                <span>Transaction History</span>
              </button>
            </>
          )}

          {/* Option Set 2: Completed + Pending Payment */}
          {isPendingPayment && (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onCollectPayment?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Collect Payment</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onPrintInvoice?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onTransactionHistory?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
                <span>Payment History</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onCancelSale?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5 text-rose-600" />
                <span>Cancel Sale</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

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
  onPaymentDetails,
  onCollectPayment,
  onReturnRefund,
  onTransactionHistory,
  onCancelSale,
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
    if (status === "Paid" || status === "paid") {
      return (
        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold inline-block">
          Paid
        </span>
      );
    }
    if (status === "Pending" || status === "pending") {
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
    if (status === "Completed" || status === "completed") {
      return (
        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
          Completed
        </span>
      );
    }
    if (status === "Pending" || status === "pending") {
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
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Invoice No.</th>
              <th className="py-3 px-3">Date & Time</th>
              <th className="py-3 px-3">Patient / Customer</th>
              <th className="py-3 px-3 text-center">Type</th>
              <th className="py-3 px-3 text-center">Items</th>
              <th className="py-3 px-3 text-right">Amount (₹)</th>
              <th className="py-3 px-3 text-center">Payment</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
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
                  <td className="py-3 px-4 font-extrabold text-blue-600 font-mono">{row.invoiceNo}</td>

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
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${row.avatarBg || "bg-blue-100 text-blue-700"}`}>
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
                  <td className="py-3 px-3 text-center font-extrabold text-slate-900">{row.itemsCount || (row.medicines ? row.medicines.length : 1)}</td>

                  {/* Amount */}
                  <td className="py-3 px-3 text-right font-extrabold text-slate-900">
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

                  {/* Actions Cell: [ 👁 ] [ 🖨 ] [ ⋮ ] */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewInvoice?.(row)}
                        title="View Invoice Details"
                        className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onPrintInvoice?.(row)}
                        title="Print Invoice"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <SalesActionsDropdown
                        row={row}
                        onViewInvoice={onViewInvoice}
                        onPrintInvoice={onPrintInvoice}
                        onPaymentDetails={onPaymentDetails}
                        onCollectPayment={onCollectPayment}
                        onReturnRefund={onReturnRefund}
                        onTransactionHistory={onTransactionHistory}
                        onCancelSale={onCancelSale}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-500">
        <p className="font-medium">
          Showing <span className="font-bold text-slate-800">{computedTotalItems > 0 ? startEntry : 0}</span> to{" "}
          <span className="font-bold text-slate-800">{endEntry}</span> of{" "}
          <span className="font-bold text-slate-800">{computedTotalItems.toLocaleString("en-IN")}</span> entries
        </p>

        {/* Page Buttons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, computedTotalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange?.(page)}
                className={`w-7 h-7 rounded-lg font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-white"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= computedTotalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page-size Custom Dropdown */}
          <CustomDropdown
            value={itemsPerPage}
            options={[
              { label: "10 / page", value: 10 },
              { label: "25 / page", value: 25 },
              { label: "50 / page", value: 50 },
              { label: "100 / page", value: 100 },
            ]}
            onChange={(val) => onItemsPerPageChange?.(Number(val))}
            minWidth="110px"
          />
        </div>
      </div>
    </div>
  );
}
