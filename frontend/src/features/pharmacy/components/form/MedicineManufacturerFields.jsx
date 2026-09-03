import React from "react";
import { Building2 } from "lucide-react";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";

export default function MedicineManufacturerFields({
  register,
  errors,
  watchManufacturer,
  watchSupplier,
  setValue,
  manufacturerOptions,
}) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <Building2 className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-extrabold text-slate-900">Manufacturer & Supplier</h3>
        <span className="text-[11px] text-slate-400 font-normal">Manufacturer and supplier information</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <CustomDropdown
            label="Manufacturer"
            value={watchManufacturer}
            options={manufacturerOptions}
            onChange={(val) => setValue("manufacturer", val)}
            fullWidth
          />
          {errors.manufacturer && <p className="text-[11px] text-rose-600 mt-1">{errors.manufacturer.message}</p>}
        </div>

        <div>
          <CustomDropdown
            label="Supplier"
            value={watchSupplier}
            options={[
              { label: "Select supplier (optional)", value: "" },
              { label: "Medilife Pharma Pvt. Ltd.", value: "Medilife Pharma Pvt. Ltd." },
              { label: "HealthCare Distributors", value: "HealthCare Distributors" },
              { label: "MediSupplies India", value: "MediSupplies India" },
              { label: "LifeCare Enterprises", value: "LifeCare Enterprises" },
              { label: "Suraksha Surgicals", value: "Suraksha Surgicals" },
            ]}
            onChange={(val) => setValue("supplier", val)}
            fullWidth
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Country of Origin</label>
          <input
            {...register("countryOfOrigin")}
            readOnly
            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-not-allowed"
          />
          <span className="inline-block mt-1 text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
            Auto-filled
          </span>
        </div>
      </div>
    </div>
  );
}
