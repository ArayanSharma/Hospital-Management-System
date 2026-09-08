import React from "react";
import { DollarSign, Calculator, Info } from "lucide-react";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";

export default function MedicinePricingFields({
  register,
  errors,
  watchGstRate,
  setValue,
}) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <DollarSign className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-extrabold text-slate-900">Pricing & Taxation</h3>
        <span className="text-[11px] text-slate-400 font-normal">Pricing details and tax configuration</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Unit Price (₹) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("unitPrice")}
            placeholder="0.00"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-bold text-slate-900"
          />
          {errors.unitPrice && <p className="text-[11px] text-rose-600 mt-1">{errors.unitPrice.message}</p>}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">MRP (₹)</label>
          <input
            type="number"
            step="0.01"
            {...register("mrp")}
            placeholder="0.00"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-bold text-slate-900"
          />
        </div>

        <div>
          <CustomDropdown
            label="GST Rate (%)"
            value={watchGstRate}
            options={[
              { label: "5%", value: 5 },
              { label: "12%", value: 12 },
              { label: "18%", value: 18 },
              { label: "28%", value: 28 },
            ]}
            onChange={(val) => setValue("gstRate", Number(val))}
            fullWidth
          />
          {errors.gstRate && <p className="text-[11px] text-rose-600 mt-1">{errors.gstRate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Purchase Price (₹)</label>
          <input
            type="number"
            step="0.01"
            {...register("purchasePrice")}
            placeholder="0.00"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-bold text-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <span>Margin (%)</span>
            <Calculator className="w-3.5 h-3.5 text-purple-600" />
            <Info className="w-3 h-3 text-slate-400" />
          </label>
          <input
            type="number"
            step="0.01"
            {...register("margin")}
            readOnly
            className="w-full bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold text-purple-900 focus:outline-none cursor-not-allowed"
          />
          <span className="inline-block mt-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
            Calculated (Derived)
          </span>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <span>Selling Price (₹)</span>
            <Calculator className="w-3.5 h-3.5 text-purple-600" />
            <Info className="w-3 h-3 text-slate-400" />
          </label>
          <input
            type="number"
            step="0.01"
            {...register("sellingPrice")}
            readOnly
            className="w-full bg-purple-50/50 border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold text-purple-900 focus:outline-none cursor-not-allowed"
          />
          <span className="inline-block mt-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
            Calculated
          </span>
        </div>
      </div>
    </div>
  );
}
