import React, { useState } from "react";
import { Eye, MoreVertical, Pill, ChevronLeft, ChevronRight, Package, Edit, ArrowUpDown } from "lucide-react";

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
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

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
    if (stock === 0 || status === "Out of Stock") {
      return (
        <span className="bg-rose-50 text-rose-600 border border-rose-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
          Out of Stock
        </span>
      );
    }
    if (daysLeft < 0 || status === "Expired" || status === "Expiring Soon") {
      return (
        <span className="bg-rose-50 text-rose-600 border border-rose-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
          {daysLeft < 0 ? "Expired" : "Expiring Soon"}
        </span>
      );
    }
    if (status === "Low Stock" || (stock > 0 && stock <= 50)) {
      return (
        <span className="bg-amber-50 text-amber-600 border border-amber-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
          Low Stock
        </span>
      );
    }
    return (
      <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2.5 py-0.5 rounded-md text-[11px] font-semibold inline-block">
        In Stock
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500">
              <th className="py-3 px-4 font-semibold">Medicine / Batch Details</th>
              <th className="py-3 px-3 font-semibold">Category</th>
              <th className="py-3 px-3 font-semibold">Batch No.</th>
              <th className="py-3 px-3 font-semibold">Expiry Date</th>
              <th className="py-3 px-3 font-semibold text-right">Purchase Price</th>
              <th className="py-3 px-3 font-semibold text-right">MRP</th>
              <th className="py-3 px-3 font-semibold text-center">Available Stock</th>
              <th className="py-3 px-3 font-semibold text-center">Status</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
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
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors group">
                    {/* Medicine / Batch Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{row.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{row.dosage}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 font-medium text-slate-600">{row.category}</td>

                    {/* Batch No */}
                    <td className="py-3 px-3 font-medium text-slate-500">{row.batchNo}</td>

                    {/* Expiry Date */}
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800 leading-tight">{row.expiryDate}</p>
                      <p className={`text-[11px] font-medium ${isDaysNegative ? "text-rose-600 font-bold" : "text-slate-400"}`}>
                        {isDaysNegative ? `${row.daysLeft} days left` : `${row.daysLeft} days left`}
                      </p>
                    </td>

                    {/* Purchase Price */}
                    <td className="py-3 px-3 text-right font-semibold text-slate-700">
                      ₹ {Number(row.purchasePrice || 0).toFixed(2)}
                    </td>

                    {/* MRP */}
                    <td className="py-3 px-3 text-right font-semibold text-slate-700">
                      ₹ {Number(row.mrp || 0).toFixed(2)}
                    </td>

                    {/* Available Stock */}
                    <td className="py-3 px-3 text-center">
                      <p className="font-bold text-slate-900 leading-tight">{(Number(row.availableStock) || 0).toLocaleString("en-IN")}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{row.unit}</p>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      {getStatusBadge(row.status, row.daysLeft, row.availableStock)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center relative">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewItem && onViewItem(row)}
                          title="View Details"
                          aria-label={`View details for ${row.name}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                          title="More Actions"
                          aria-label={`More actions for ${row.name}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === row.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-4 mt-8 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                              <button
                                onClick={() => {
                                  onViewItem && onViewItem(row);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" /> View Details
                              </button>
                              <button
                                onClick={() => {
                                  onStockInItem && onStockInItem(row);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Package className="w-3.5 h-3.5 text-emerald-600" /> Refill Stock In
                              </button>
                              <button
                                onClick={() => {
                                  alert(`Editing batch ${row.batchNo}`);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Edit className="w-3.5 h-3.5 text-amber-600" /> Edit Batch
                              </button>
                            </div>
                          </>
                        )}
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
