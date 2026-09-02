import React, { useState } from "react";
import { Pill, Edit2, MoreVertical, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function MedicineTable({
  items = [],
  isLoading,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  onEditItem,
  onViewItem,
  onToggleStatusItem,
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs animate-pulse space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-xl" />
        ))}
      </div>
    );
  }

  const computedTotalItems = totalItems || items.length;
  const computedTotalPages = totalPages || Math.ceil(computedTotalItems / itemsPerPage) || 1;
  const startEntry = computedTotalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endEntry = Math.min(currentPage * itemsPerPage, computedTotalItems);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 min-w-[220px]">Medicine Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Manufacturer</th>
              <th className="py-3 px-4">Unit Price (₹)</th>
              <th className="py-3 px-4">GST (%)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  No medicines found matching your criteria.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id || row._id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Medicine Details */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          row.colorBg || "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <Pill className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div>
                        <p
                          onClick={() => onViewItem?.(row)}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {row.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Code: <span className="text-slate-500 font-semibold">{row.code || "MED-0000"}</span>
                          <span className="mx-1 font-normal">|</span>
                          Brand: <span className="text-slate-500 font-semibold">{row.brandName || "Generic"}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-slate-600">{row.category}</td>

                  {/* Manufacturer */}
                  <td className="py-3 px-4 text-slate-600">{row.manufacturer}</td>

                  {/* Unit Price */}
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹ {(Number(row.unitPrice || row.price) || 0).toFixed(2)}
                  </td>

                  {/* GST */}
                  <td className="py-3 px-4 text-slate-600">{row.gstRate || row.gst || 12}%</td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        row.status === "Active" || row.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {row.status === "active" ? "Active" : row.status === "inactive" ? "Inactive" : row.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 relative">
                      <button
                        type="button"
                        onClick={() => onEditItem?.(row)}
                        title="Edit Medicine"
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-blue-600 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu Toggle */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === (row.id || row._id) ? null : (row.id || row._id))}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {activeMenuId === (row.id || row._id) && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 text-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onViewItem?.(row);
                                }}
                                className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Details</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onEditItem?.(row);
                                }}
                                className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit Medicine</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onToggleStatusItem?.(row);
                                }}
                                className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>{row.status === "Active" || row.status === "active" ? "Deactivate" : "Activate"}</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
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
        <div>
          Showing {computedTotalItems > 0 ? startEntry : 0} to {endEntry} of {computedTotalItems.toLocaleString("en-IN")} entries
        </div>

        <div className="flex items-center gap-4">
          {/* Pagination Controls */}
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

          {/* Page Size Selector */}
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
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

