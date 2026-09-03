import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Edit,
  MoreVertical,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ClipboardList,
  CreditCard,
  AlertTriangle,
  Power,
  Archive,
  RotateCcw,
} from "lucide-react";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

function SupplierActionsDropdown({
  row,
  onViewSupplier,
  onEditSupplier,
  onPurchaseOrders,
  onPurchaseHistory,
  onPaymentHistory,
  onOutstandingPayments,
  onToggleStatus,
  onToggleArchive,
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

  const statusRaw = String(row.status || "").toLowerCase();
  const isInactive = statusRaw === "inactive";
  const isArchived = statusRaw === "archived";

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
          className="absolute right-0 mt-1 w-52 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out text-left"
        >
          {/* View Supplier */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onViewSupplier?.(row);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>View Supplier</span>
          </button>

          {/* Edit Supplier */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEditSupplier?.(row);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5 text-amber-600" />
            <span>Edit Supplier</span>
          </button>

          {/* Purchase Orders */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onPurchaseOrders?.(row);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
            <span>Purchase Orders</span>
          </button>

          {/* Purchase History */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onPurchaseHistory?.(row);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
            <span>Purchase History</span>
          </button>

          {/* Payment History */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onPaymentHistory?.(row);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span>Payment History</span>
          </button>

          {/* Outstanding Payments */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOutstandingPayments?.(row);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-amber-700 hover:bg-amber-50 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Outstanding Payments</span>
          </button>

          <div className="my-1 border-t border-slate-100" />

          {/* Deactivate / Activate Supplier */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onToggleStatus?.(row);
            }}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold cursor-pointer ${
              isInactive
                ? "text-emerald-700 hover:bg-emerald-50"
                : "text-rose-700 hover:bg-rose-50"
            }`}
          >
            <Power className={`w-3.5 h-3.5 ${isInactive ? "text-emerald-600" : "text-rose-600"}`} />
            <span>{isInactive ? "Activate Supplier" : "Deactivate Supplier"}</span>
          </button>

          {/* Archive / Restore Supplier */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onToggleArchive?.(row);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {isArchived ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Restore Supplier</span>
              </>
            ) : (
              <>
                <Archive className="w-3.5 h-3.5 text-slate-500" />
                <span>Archive Supplier</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SupplierTable({
  items = [],
  isLoading,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  onViewSupplier,
  onEditSupplier,
  onPurchaseOrders,
  onPurchaseHistory,
  onPaymentHistory,
  onOutstandingPayments,
  onToggleStatus,
  onToggleArchive,
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

  const getCategoryBadge = (cat) => {
    if (cat === "Surgical") {
      return (
        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
          Surgical
        </span>
      );
    }
    if (cat === "Equipment") {
      return (
        <span className="bg-purple-50 text-purple-600 border border-purple-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
          Equipment
        </span>
      );
    }
    return (
      <span className="bg-blue-50 text-blue-600 border border-blue-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
        Pharmaceuticals
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "inactive") {
      return (
        <span className="bg-rose-50 text-rose-600 border border-rose-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold inline-block">
          Inactive
        </span>
      );
    }
    if (s === "archived") {
      return (
        <span className="bg-slate-100 text-slate-600 border border-slate-300 px-2 py-0.5 rounded-md text-[10px] font-bold inline-block">
          Archived
        </span>
      );
    }
    return (
      <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2 py-0.5 rounded-md text-[10px] font-bold inline-block">
        Active
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Supplier Name</th>
              <th className="py-3 px-3">Contact Person</th>
              <th className="py-3 px-3">Phone / Email</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3 text-center">Category</th>
              <th className="py-3 px-3 font-semibold">Last Purchase</th>
              <th className="py-3 px-3 text-right">Total Purchases (₹)</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-400">
                  No suppliers found matching your search criteria.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id || row._id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Supplier Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${row.colorBg || "bg-blue-100 text-blue-600 font-bold"}`}>
                        <Building2 className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div>
                        <p
                          onClick={() => onViewSupplier?.(row)}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {row.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium font-mono">{row.supplierCode || row.code || "SUP-001"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Person */}
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-800 leading-tight">{row.contactPerson || "Manager"}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{row.designation || "Sales Head"}</p>
                  </td>

                  {/* Phone / Email */}
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-800 leading-tight">{row.phone}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{row.email}</p>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3 font-semibold text-slate-700">{row.location || row.city || row.state || "India"}</td>

                  {/* Category */}
                  <td className="py-3 px-3 text-center">{getCategoryBadge(row.category || "Pharmaceuticals")}</td>

                  {/* Last Purchase */}
                  <td className="py-3 px-3 font-medium text-slate-600">{row.lastPurchase || "15 Aug 2026"}</td>

                  {/* Total Purchases */}
                  <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                    ₹ {(Number(row.totalPurchases || row.creditLimit || 500000)).toLocaleString("en-IN")}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">{getStatusBadge(row.status || "active")}</td>

                  {/* Actions Cell: [ 👁 ] [ ✏️ ] [ ⋮ ] */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewSupplier?.(row)}
                        title="View Supplier Details"
                        className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditSupplier?.(row)}
                        title="Edit Supplier Record"
                        className="p-1.5 rounded-lg border border-slate-200 text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <SupplierActionsDropdown
                        row={row}
                        onViewSupplier={onViewSupplier}
                        onEditSupplier={onEditSupplier}
                        onPurchaseOrders={onPurchaseOrders}
                        onPurchaseHistory={onPurchaseHistory}
                        onPaymentHistory={onPaymentHistory}
                        onOutstandingPayments={onOutstandingPayments}
                        onToggleStatus={onToggleStatus}
                        onToggleArchive={onToggleArchive}
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
          <span className="font-bold text-slate-800">{computedTotalItems.toLocaleString("en-IN")}</span> suppliers
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
