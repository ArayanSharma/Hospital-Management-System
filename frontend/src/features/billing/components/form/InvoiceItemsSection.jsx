import React, { useRef } from "react";
import { FileCheck, Search, Plus, Minus, Paperclip, Trash2, X, Inbox } from "lucide-react";
import { formatRupee, calculateItemAmount } from "../../helpers/invoiceCalculations.js";

export default function InvoiceItemsSection({ form }) {
  const {
    activeCategory,
    categories,
    itemSearch,
    setItemSearch,
    showCatalogDropdown,
    setShowCatalogDropdown,
    catalogLoading,
    filteredCatalogOptions,
    items,
    handleCategoryClick,
    handleSelectCatalogItem,
    handleAddBlankCustomItem,
    handleItemChange,
    handleQtyChange,
    handleRemoveItem,
  } = form;

  const searchRef = useRef(null);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">
            2. Add Invoice Items
          </h2>
        </div>
        <span className="text-[10px] font-bold text-slate-400">Traceable Charge Source</span>
      </div>

      {/* Quick Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryClick(cat)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
              activeCategory === cat
                ? "bg-blue-50 text-blue-600 border border-blue-500 shadow-2xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Add Custom Item row with Interactive Search Dropdown */}
      <div className="relative flex items-center justify-between gap-3" ref={searchRef}>
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={itemSearch}
            onFocus={() => setShowCatalogDropdown(true)}
            onChange={(e) => {
              setItemSearch(e.target.value);
              setShowCatalogDropdown(true);
            }}
            placeholder={`Search ${activeCategory} catalog from database...`}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />

          {/* LIVE SEARCH DROPDOWN FROM MONGODB CATALOG */}
          {showCatalogDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto divide-y divide-slate-100">
              <div className="p-2 bg-slate-50 text-[10px] font-bold text-slate-500 flex justify-between items-center">
                <span>SELECT FROM {activeCategory.toUpperCase()} CATALOG</span>
                <button
                  type="button"
                  onClick={() => setShowCatalogDropdown(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {catalogLoading ? (
                <p className="p-3 text-[11px] text-slate-400 text-center">Loading database catalog...</p>
              ) : filteredCatalogOptions.length === 0 ? (
                <p className="p-3 text-[11px] text-slate-400 text-center">No matching billable items found</p>
              ) : (
                filteredCatalogOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectCatalogItem(opt)}
                    className="w-full text-left p-2.5 hover:bg-blue-50/60 flex items-center justify-between text-xs transition cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{opt.description}</p>
                      <p className="text-[10px] font-mono text-blue-600">{opt.code}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-800">{formatRupee(opt.unitPrice)}</span>
                      <span className="text-[9px] text-slate-400 block">GST {opt.taxPercent || 12}%</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* + Add Custom Item Button (Adds clean blank row) */}
        <button
          type="button"
          onClick={handleAddBlankCustomItem}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Custom Item</span>
        </button>
      </div>

      {/* Line Items Table with Source Traceability */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase">
              <th className="py-2.5 px-2.5 w-6 text-center">#</th>
              <th className="py-2.5 px-3">Item / Test Name</th>
              <th className="py-2.5 px-3">Source / Code</th>
              <th className="py-2.5 px-2 text-center w-24">Qty</th>
              <th className="py-2.5 px-3 text-right">Unit Price (₹)</th>
              <th className="py-2.5 px-3 text-right">Discount (₹)</th>
              <th className="py-2.5 px-3 text-center">Tax (%)</th>
              <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              <th className="py-2.5 px-2 text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Inbox className="w-5 h-5 text-slate-300" />
                    <p className="font-semibold text-slate-600 text-xs">No items added to invoice</p>
                    <p className="text-[11px] text-slate-400">
                      Search from database catalog above or click &quot;+ Add Custom Item&quot; to add a blank line.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const rowAmount = calculateItemAmount(item);
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    {/* # */}
                    <td className="py-2 px-2 text-center font-bold text-slate-500">{idx + 1}</td>

                    {/* Item Name */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={item.description}
                        placeholder="Enter item description..."
                        onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                        className="w-full font-bold text-slate-900 border-b border-transparent hover:border-slate-300 bg-transparent focus:outline-none focus:bg-white focus:border-blue-500 rounded px-1"
                      />
                    </td>

                    {/* Source / Code Traceability */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={item.code}
                        placeholder="e.g. RAD-001"
                        onChange={(e) => handleItemChange(idx, "code", e.target.value)}
                        className="w-full font-mono text-[11px] font-bold text-blue-600 border-b border-transparent hover:border-slate-300 bg-transparent focus:outline-none focus:bg-white focus:border-blue-500 rounded px-1"
                      />
                    </td>

                    {/* Qty Counter - 1 + */}
                    <td className="py-2 px-2 text-center">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(idx, -1)}
                          className="px-1.5 py-0.5 text-slate-500 hover:bg-slate-100 font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(idx, 1)}
                          className="px-1.5 py-0.5 text-slate-500 hover:bg-slate-100 font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                        className="w-20 text-right font-semibold text-slate-800 border-b border-transparent hover:border-slate-300 bg-transparent focus:outline-none focus:bg-white focus:border-blue-500 rounded px-1"
                      />
                    </td>

                    {/* Discount */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => handleItemChange(idx, "discount", e.target.value)}
                        className="w-20 text-right font-semibold text-slate-800 border-b border-transparent hover:border-slate-300 bg-transparent focus:outline-none focus:bg-white focus:border-blue-500 rounded px-1"
                      />
                    </td>

                    {/* Tax Dropdown */}
                    <td className="py-2 px-3 text-center">
                      <select
                        value={item.taxPercent}
                        onChange={(e) => handleItemChange(idx, "taxPercent", Number(e.target.value))}
                        className="bg-transparent border border-slate-200 rounded-lg px-1.5 py-0.5 text-[11px] font-bold text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                      </select>
                    </td>

                    {/* Amount */}
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {rowAmount.toFixed(2)}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-2 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          className="p-1 rounded text-blue-500 hover:bg-blue-50 cursor-pointer"
                          title="Attach Note"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Remove Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* + Add Another Item Button */}
      <button
        type="button"
        onClick={handleAddBlankCustomItem}
        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer pt-1"
      >
        <Plus className="w-4 h-4" />
        <span>+ Add Another Item</span>
      </button>
    </div>
  );
}
