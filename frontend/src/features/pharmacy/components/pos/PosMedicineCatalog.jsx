import React from "react";
import { Search, Barcode } from "lucide-react";

export default function PosMedicineCatalog({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  manufacturerFilter,
  setManufacturerFilter,
  showOnlyInStock,
  setShowOnlyInStock,
  categoriesList,
  manufacturersList,
  filteredCatalog,
  onAddToCart,
}) {
  return (
    <div className="space-y-3 pt-1">
      <h3 className="text-xs font-bold text-slate-900">Search & Select Medicines</h3>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search medicine by name, code or batch..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
        />
        <Barcode className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Dynamic Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={manufacturerFilter}
            onChange={(e) => setManufacturerFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Manufacturers</option>
            {manufacturersList.map((mfg) => (
              <option key={mfg} value={mfg}>
                {mfg}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOnlyInStock}
            onChange={(e) => setShowOnlyInStock(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
          />
          <span>Show Only In Stock</span>
        </label>
      </div>

      {/* Catalog Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs bg-white max-h-[300px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500">
              <th className="py-2.5 px-3 font-semibold">Medicine Name</th>
              <th className="py-2.5 px-2 font-semibold">MRP (₹)</th>
              <th className="py-2.5 px-2 text-center font-semibold">Available Stock</th>
              <th className="py-2.5 px-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredCatalog.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 font-medium text-xs">
                  No matching medicines found in catalog.
                </td>
              </tr>
            ) : (
              filteredCatalog.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <p className="font-bold text-slate-800 leading-tight">{med.name}</p>
                    <p className="text-[10px] text-slate-400">{med.manufacturer} • {med.unit}</p>
                  </td>
                  <td className="py-2.5 px-2 font-bold text-slate-900">₹ {med.mrp.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-center font-bold">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] ${med.stock > 10 ? "bg-emerald-50 text-emerald-600" : med.stock > 0 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>
                      {med.stock > 0 ? `${med.stock} ${med.unit}` : "Out of stock"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onAddToCart(med)}
                      disabled={med.stock <= 0}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      + Add
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
