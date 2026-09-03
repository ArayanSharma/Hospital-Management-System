import React, { useState, useRef, useEffect } from "react";
import { Pill, Edit2, MoreVertical, Eye, ChevronLeft, ChevronRight, ClipboardList, Pause, Play, Archive, RotateCcw } from "lucide-react";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

function MedicineActionsDropdown({ row, onEditItem, onViewHistory, onChangeStatus }) {
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

  const rawStatus = String(row.status || "active").toLowerCase();

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-all cursor-pointer"
        title="More Options"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-1 w-48 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out"
        >
          {/* Active Status Options */}
          {(rawStatus === "active" || rawStatus === "in stock" || rawStatus === "low stock") && (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onEditItem?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Medicine</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onViewHistory?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
                <span>Prescription</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onChangeStatus?.(row, "inactive");
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-amber-700 hover:bg-amber-50 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Deactivate Medicine</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onChangeStatus?.(row, "archived");
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5 text-slate-500" />
                <span>Archive Medicine</span>
              </button>
            </>
          )}

          {/* Inactive Status Options */}
          {rawStatus === "inactive" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onEditItem?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Medicine</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onViewHistory?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
                <span>Prescription</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onChangeStatus?.(row, "active");
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>Activate Medicine</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onChangeStatus?.(row, "archived");
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5 text-slate-500" />
                <span>Archive Medicine</span>
              </button>
            </>
          )}

          {/* Archived Status Options */}
          {rawStatus === "archived" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onViewHistory?.(row);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <ClipboardList className="w-3.5 h-3.5 text-purple-600" />
                <span>Prescription</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onChangeStatus?.(row, "active");
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                <span>Restore Medicine</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

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
  onViewHistory,
  onChangeStatus,
}) {
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
              items.map((row) => {
                const statusStr = String(row.status || "Active").toLowerCase();

                return (
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

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold capitalize ${
                          statusStr === "active" || statusStr === "in stock" || statusStr === "low stock"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : statusStr === "archived"
                            ? "bg-slate-100 text-slate-600 border border-slate-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {statusStr === "active" ? "Active" : statusStr === "inactive" ? "Inactive" : statusStr === "archived" ? "Archived" : row.status}
                      </span>
                    </td>

                    {/* Actions Cell: [ 👁 ] [ ✏️ ] [ ⋮ ] */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewItem?.(row)}
                          title="View Medicine Details"
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditItem?.(row)}
                          title="Edit Medicine"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <MedicineActionsDropdown
                          row={row}
                          onEditItem={onEditItem}
                          onViewHistory={onViewHistory}
                          onChangeStatus={onChangeStatus}
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

          {/* Page Size Custom Dropdown */}
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
