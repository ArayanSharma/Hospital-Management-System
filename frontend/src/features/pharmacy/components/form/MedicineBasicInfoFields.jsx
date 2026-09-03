import React from "react";
import { Pill, Lock } from "lucide-react";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";

export default function MedicineBasicInfoFields({
  register,
  errors,
  watchCategory,
  watchTherapeuticCategory,
  watchDosageForm,
  watchUnit,
  setValue,
  categoryOptions,
}) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <Pill className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-extrabold text-slate-900">Medicine Information</h3>
        <span className="text-[11px] text-slate-400 font-normal">Basic medicine identification and classification</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Generic Name <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("genericName")}
            placeholder="Enter generic name"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {errors.genericName && <p className="text-[11px] text-rose-600 mt-1">{errors.genericName.message}</p>}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Brand Name</label>
          <input
            {...register("brandName")}
            placeholder="Enter brand name"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Medicine Code <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              {...register("code")}
              readOnly
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-700 focus:outline-none cursor-not-allowed"
            />
          </div>
          <span className="inline-block mt-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            Auto-generated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <CustomDropdown
            label="Category"
            value={watchCategory}
            options={categoryOptions}
            onChange={(val) => setValue("category", val)}
            fullWidth
          />
          {errors.category && <p className="text-[11px] text-rose-600 mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <CustomDropdown
            label="Therapeutic Category"
            value={watchTherapeuticCategory}
            options={[
              { label: "Select therapeutic category", value: "" },
              { label: "Antibiotics", value: "Antibiotics" },
              { label: "Analgesics", value: "Analgesics" },
              { label: "Antacids", value: "Antacids" },
              { label: "Vitamins & Supplements", value: "Vitamins & Supplements" },
              { label: "Antihistamines", value: "Antihistamines" },
              { label: "Others", value: "Others" },
            ]}
            onChange={(val) => setValue("therapeuticCategory", val)}
            fullWidth
          />
        </div>

        <div>
          <CustomDropdown
            label="Dosage Form"
            value={watchDosageForm}
            options={[
              { label: "Select dosage form", value: "" },
              { label: "Tablet", value: "Tablet" },
              { label: "Capsule", value: "Capsule" },
              { label: "Syrup", value: "Syrup" },
              { label: "Chewable Tablet", value: "Chewable Tablet" },
              { label: "Injection", value: "Injection" },
              { label: "Ointment", value: "Ointment" },
              { label: "Suspension", value: "Suspension" },
              { label: "Drops", value: "Drops" },
            ]}
            onChange={(val) => setValue("dosageForm", val)}
            fullWidth
          />
          {errors.dosageForm && <p className="text-[11px] text-rose-600 mt-1">{errors.dosageForm.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Strength / Composition <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("strength")}
            placeholder="e.g. 500 mg"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {errors.strength && <p className="text-[11px] text-rose-600 mt-1">{errors.strength.message}</p>}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Pack Size <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("packSize")}
            placeholder="e.g. 10 Tablets"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
          {errors.packSize && <p className="text-[11px] text-rose-600 mt-1">{errors.packSize.message}</p>}
        </div>

        <div>
          <CustomDropdown
            label="Unit"
            value={watchUnit}
            options={[
              { label: "Select unit", value: "" },
              { label: "Strip of 10", value: "Strip of 10" },
              { label: "Strip of 15", value: "Strip of 15" },
              { label: "Strip of 5", value: "Strip of 5" },
              { label: "Bottle of 100ml", value: "Bottle of 100ml" },
              { label: "Bottle of 200ml", value: "Bottle of 200ml" },
              { label: "Vial", value: "Vial" },
              { label: "Ampoule", value: "Ampoule" },
              { label: "Tube of 30g", value: "Tube of 30g" },
              { label: "Box", value: "Box" },
            ]}
            onChange={(val) => setValue("unit", val)}
            fullWidth
          />
          {errors.unit && <p className="text-[11px] text-rose-600 mt-1">{errors.unit.message}</p>}
        </div>
      </div>
    </div>
  );
}
