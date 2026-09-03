import React from "react";
import { Info } from "lucide-react";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";

export default function MedicineAdditionalFields({
  register,
  errors,
  watchPrescriptionRequired,
  watchControlledMedicine,
  watchShelfLifeUnit,
  setValue,
  descLength,
}) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <Info className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-extrabold text-slate-900">Additional Information</h3>
        <span className="text-[11px] text-slate-400 font-normal">Additional medicine details and compliance</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <CustomDropdown
            label="Prescription Required"
            value={watchPrescriptionRequired}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
            onChange={(val) => setValue("prescriptionRequired", val)}
            fullWidth
          />
        </div>

        <div>
          <CustomDropdown
            label="Controlled Medicine"
            value={watchControlledMedicine}
            options={[
              { label: "No", value: "No" },
              { label: "Yes", value: "Yes" },
            ]}
            onChange={(val) => setValue("controlledMedicine", val)}
            fullWidth
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Shelf Life</label>
          <div className="flex gap-2">
            <input
              type="number"
              {...register("shelfLifeValue")}
              placeholder="24"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium text-slate-800"
            />
            <CustomDropdown
              value={watchShelfLifeUnit}
              options={[
                { label: "Months", value: "Months" },
                { label: "Years", value: "Years" },
                { label: "Days", value: "Days" },
              ]}
              onChange={(val) => setValue("shelfLifeUnit", val)}
              minWidth="90px"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description / Notes</label>
        <div className="relative">
          <textarea
            {...register("description")}
            rows={3}
            maxLength={500}
            placeholder="Enter medicine description, uses, side effects, precautions, etc."
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none font-medium"
          />
          <span className="absolute right-3 bottom-2.5 text-[10px] font-semibold text-slate-400">
            {descLength} / 500
          </span>
        </div>
        {errors.description && <p className="text-[11px] text-rose-600 mt-1">{errors.description.message}</p>}
      </div>
    </div>
  );
}
