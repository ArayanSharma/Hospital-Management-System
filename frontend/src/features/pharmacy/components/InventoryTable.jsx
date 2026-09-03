import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  MoreVertical,
  Pill,
  ChevronLeft,
  ChevronRight,
  Package,
  ClipboardList,
  Scale,
  ArrowLeftRight,
  ShoppingCart,
  Bell,
  Archive,
  AlertTriangle,
  Ban,
  RotateCcw,
} from "lucide-react";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

function InventoryActionsDropdown({
  row,
  onViewItem,
  onStockInItem,
  onViewHistory,
  onAdjustStock,
  onTransferStock,
  onCreatePO,
  onQuarantine,
  onArchive,
  onRestore,
  onSetReorderLevel,
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

  const rawStatus = String(row.status || "").toLowerCase();
  const isArchived = rawStatus === "archived" || row.isArchived;
  const isExpired = !isArchived && (row.daysLeft < 0 || rawStatus === "expired" || rawStatus === "expiring soon");
  const isOutOfStock = !isArchived && (row.availableStock === 0 || rawStatus === "out of stock");
  const isLowStock = !isArchived && !isOutOfStock && !isExpired && (rawStatus === "low stock" || (row.availableStock > 0 && row.availableStock <= 50));
  const isInStock = !isArchived && !isOutOfStock && !isExpired && !isLowStock;

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
          className="absolute right-0 mt-1 w-48 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out"
        >
          {/* Stock History */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onViewHistory?.(row);
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
            <span>Stock History</span>
          </button>

          {/* Expired / Near Expiry Options */}
          {isExpired && (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onQuarantine?.(row, "quarantine");
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-amber-700 hover:bg-amber-50 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Quarantine Batch</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onQuarantine?.(row, "expired");
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5 text-rose-600" />
                <span>Mark as Expired</span>
              </button>
            </>
          )}

          {/* Out of Stock Options */}
          {isOutOfStock && (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onStockInItem?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add Stock / Refill</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onCreatePO?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                <span>Create Purchase Order</span>
              </button>
            </>
          )}

          {/* Low Stock Options */}
          {isLowStock && (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onStockInItem?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                <span>Refill / Add Stock</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onCreatePO?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                <span>Create Purchase Order</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onAdjustStock?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Adjust Stock</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onSetReorderLevel?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-purple-600" />
                <span>Set Reorder Level</span>
              </button>
            </>
          )}

          {/* Normal / In Stock Options */}
          {isInStock && (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onAdjustStock?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Adjust Stock</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onTransferStock?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-sky-700 hover:bg-sky-50 cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-sky-600" />
                <span>Transfer Stock</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onStockInItem?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add Stock</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onSetReorderLevel?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-purple-700 hover:bg-purple-50 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-purple-600" />
                <span>Set Reorder Level</span>
              </button>
            </>
          )}

          {/* Archive / Restore Batch Option */}
          {isArchived ? (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onRestore?.(row);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Restore Batch</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onArchive?.(row);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5 text-slate-500" />
              <span>Archive Batch</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function InventoryTable({
  items = [],
  isLoading,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  onViewItem,
  onStockInItem,
  onViewHistory,
  onAdjustStock,
  onTransferStock,
  onCreatePO,
  onQuarantine,
  onArchive,
  onRestore,
  onSetReorderLevel,
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

  const getStatusBadge = (status, daysLeft, stock) => {
    if (status === "Archived" || status === "archived") {
      return (
        <span className="bg-slate-100 text-slate-600 border border-slate-300 px-2.5 py-0.5 rounded-md text-[11px] font-bold inline-block">
          Archived
        </span>
      );
    }
    if (stock === 0 || status === "Out of Stock") {
      return (
        <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold inline-block">
          Out of Stock
        </span>
      );
    }
    if (daysLeft < 0 || status === "Expired" || status === "Expiring Soon") {
      return (
        <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold inline-block">
          {daysLeft < 0 ? "Expired" : "Expiring Soon"}
        </span>
      );
    }
    if (status === "Low Stock" || (stock > 0 && stock <= 50)) {
      return (
        <span className="bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold inline-block">
          Low Stock
        </span>
      );
    }
    return (
      <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold inline-block">
        In Stock
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Medicine / Batch Details</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Batch No.</th>
              <th className="py-3 px-3">Expiry Date</th>
              <th className="py-3 px-3 text-right">Purchase Price</th>
              <th className="py-3 px-3 text-right">MRP</th>
              <th className="py-3 px-3 text-center">Available Stock</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-400">
                  No inventory items found matching your filter criteria.
                </td>
              </tr>
            ) : (
              items.map((row) => {
                const isDaysNegative = row.daysLeft < 0;

                return (
                  <tr key={row.id || row._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Medicine / Batch Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
                          <Pill className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div>
                          <p
                            onClick={() => onViewItem?.(row)}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {row.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">{row.dosage}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-slate-600">{row.category}</td>

                    {/* Batch No */}
                    <td className="py-3 px-3 text-slate-500 font-mono font-semibold">{row.batchNo}</td>

                    {/* Expiry Date */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800 leading-tight">{row.expiryDate}</p>
                      <p className={`text-[11px] font-medium ${isDaysNegative ? "text-rose-600 font-bold" : "text-slate-400"}`}>
                        {isDaysNegative ? `${row.daysLeft} days left` : `${row.daysLeft} days left`}
                      </p>
                    </td>

                    {/* Purchase Price */}
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₹ {Number(row.purchasePrice || 0).toFixed(2)}
                    </td>

                    {/* MRP */}
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      ₹ {Number(row.mrp || 0).toFixed(2)}
                    </td>

                    {/* Available Stock */}
                    <td className="py-3 px-3 text-center">
                      <p className="font-extrabold text-slate-900 leading-tight">{(Number(row.availableStock) || 0).toLocaleString("en-IN")}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{row.unit}</p>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(row.status, row.daysLeft, row.availableStock)}
                    </td>

                    {/* Actions Cell: [ 👁 ] [ 📦 ] [ ⋮ ] */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewItem?.(row)}
                          title="View Batch Details"
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onStockInItem?.(row)}
                          title="Refill / Add Stock"
                          className="p-1.5 rounded-lg border border-slate-200 text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                        >
                          <Package className="w-3.5 h-3.5" />
                        </button>

                        <InventoryActionsDropdown
                          row={row}
                          onViewItem={onViewItem}
                          onStockInItem={onStockInItem}
                          onViewHistory={onViewHistory}
                          onAdjustStock={onAdjustStock}
                          onTransferStock={onTransferStock}
                          onCreatePO={onCreatePO}
                          onQuarantine={onQuarantine}
                          onArchive={onArchive}
                          onRestore={onRestore}
                          onSetReorderLevel={onSetReorderLevel}
                        />
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
