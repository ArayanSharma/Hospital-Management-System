import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PatientPagination({
  page,
  setPage,
  limit,
  setLimit,
  totalCount,
  totalPages,
}) {
  const startItem = totalCount > 0 ? (page - 1) * limit + 1 : 0;
  const endItem = Math.min(page * limit, totalCount);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      {/* Left: Showing Range & Rows Per Page */}
      <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
        <p>
          Showing <strong className="text-slate-800 font-bold">{startItem}–{endItem}</strong> of{" "}
          <strong className="text-slate-800 font-bold">{totalCount}</strong> patients
        </p>

        {setLimit && (
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
            <span className="text-[11px]">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Controls */}
      <div className="flex items-center gap-1 self-center sm:self-auto">
        <button
          disabled={page <= 1}
          onClick={() => setPage(1)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 font-semibold cursor-pointer"
          title="First Page"
        >
          First
        </button>

        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition cursor-pointer ${
              page === num
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(totalPages)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 font-semibold cursor-pointer"
          title="Last Page"
        >
          Last
        </button>
      </div>
    </div>
  );
}
