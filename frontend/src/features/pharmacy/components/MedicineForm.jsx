import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicineSchema } from "../validation/medicine.schema.js";
import { Info } from "lucide-react";

export default function MedicineForm({ defaultValues, onSubmit, onCancel, submitting }) {
  const [descLength, setDescLength] = useState(defaultValues?.description?.length || 0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues: defaultValues
      ? {
          genericName: defaultValues.genericName || "",
          brandName: defaultValues.brandName || "",
          code: defaultValues.code || `MED-${Math.floor(1000 + Math.random() * 9000)}`,
          category: defaultValues.category || "",
          therapeuticCategory: defaultValues.therapeuticCategory || "",
          dosageForm: defaultValues.dosageForm || "",
          strength: defaultValues.strength || "",
          packSize: defaultValues.packSize || "",
          unit: defaultValues.unit || "",
          manufacturer: defaultValues.manufacturer || "",
          supplier: defaultValues.supplier || "",
          countryOfOrigin: defaultValues.countryOfOrigin || "India",
          unitPrice: defaultValues.unitPrice || defaultValues.price || 0,
          mrp: defaultValues.mrp || 0,
          gstRate: defaultValues.gstRate || 12,
          purchasePrice: defaultValues.purchasePrice || 0,
          margin: defaultValues.margin || 0,
          sellingPrice: defaultValues.sellingPrice || defaultValues.unitPrice || defaultValues.price || 0,
          prescriptionRequired: defaultValues.prescriptionRequired ? "Yes" : "No",
          controlledMedicine: defaultValues.controlledMedicine ? "Yes" : "No",
          shelfLifeValue: defaultValues.shelfLifeValue || 24,
          shelfLifeUnit: defaultValues.shelfLifeUnit || "Months",
          description: defaultValues.description || "",
          addAnother: false,
        }
      : {
          genericName: "",
          brandName: "",
          code: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
          category: "",
          therapeuticCategory: "",
          dosageForm: "",
          strength: "",
          packSize: "",
          unit: "",
          manufacturer: "",
          supplier: "",
          countryOfOrigin: "India",
          unitPrice: "",
          mrp: "",
          gstRate: 12,
          purchasePrice: "",
          margin: "",
          sellingPrice: "",
          prescriptionRequired: "No",
          controlledMedicine: "No",
          shelfLifeValue: 24,
          shelfLifeUnit: "Months",
          description: "",
          addAnother: false,
        },
  });

  const watchUnitPrice = watch("unitPrice");
  const watchPurchasePrice = watch("purchasePrice");
  const watchSellingPrice = watch("sellingPrice");
  const watchDescription = watch("description");

  // Auto calculate margin % when sellingPrice and purchasePrice change
  useEffect(() => {
    const pPrice = parseFloat(watchPurchasePrice) || 0;
    const sPrice = parseFloat(watchSellingPrice) || parseFloat(watchUnitPrice) || 0;
    if (sPrice > 0 && pPrice > 0) {
      const computedMargin = (((sPrice - pPrice) / sPrice) * 100).toFixed(2);
      setValue("margin", computedMargin);
    }
  }, [watchPurchasePrice, watchSellingPrice, watchUnitPrice, setValue]);

  // Keep description length updated
  useEffect(() => {
    setDescLength((watchDescription || "").length);
  }, [watchDescription]);

  const onFormSubmit = (data) => {
    const name = data.brandName
      ? `${data.genericName} (${data.brandName})`
      : `${data.genericName} ${data.strength || ""}`.trim();

    const finalData = {
      ...data,
      name: data.name || name,
      price: Number(data.unitPrice || data.sellingPrice || 0),
      unitPrice: Number(data.unitPrice || 0),
      mrp: Number(data.mrp || 0),
      gstRate: Number(data.gstRate || 12),
      purchasePrice: Number(data.purchasePrice || 0),
      margin: Number(data.margin || 0),
      sellingPrice: Number(data.sellingPrice || data.unitPrice || 0),
      shelfLifeValue: Number(data.shelfLifeValue || 24),
      prescriptionRequired: data.prescriptionRequired === "Yes",
      controlledMedicine: data.controlledMedicine === "Yes",
      status: "Active",
    };

    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 text-xs text-slate-700 font-medium">
      {/* SECTION 1: Basic Information */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5">Basic Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Generic Name * */}
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

          {/* Brand Name */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Brand Name</label>
            <input
              {...register("brandName")}
              placeholder="Enter brand name"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Medicine Code * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Medicine Code <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("code")}
              placeholder="e.g. MED-0011"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {errors.code && <p className="text-[11px] text-rose-600 mt-1">{errors.code.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Category * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("category")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select category</option>
              <option value="Analgesic / Antipyretic">Analgesic / Antipyretic</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Antihistamine">Antihistamine</option>
              <option value="Anti-ulcer">Anti-ulcer</option>
              <option value="Analgesic / NSAID">Analgesic / NSAID</option>
              <option value="Supplement">Supplement</option>
              <option value="Antiprotozoal / Antibiotic">Antiprotozoal / Antibiotic</option>
              <option value="Cardiovascular">Cardiovascular</option>
              <option value="Gastrointestinal">Gastrointestinal</option>
              <option value="Respiratory">Respiratory</option>
              <option value="Dermatological">Dermatological</option>
            </select>
            {errors.category && <p className="text-[11px] text-rose-600 mt-1">{errors.category.message}</p>}
          </div>

          {/* Therapeutic Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Therapeutic Category</label>
            <select
              {...register("therapeuticCategory")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select therapeutic category</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Analgesics">Analgesics</option>
              <option value="Antacids">Antacids</option>
              <option value="Vitamins & Supplements">Vitamins & Supplements</option>
              <option value="Antihistamines">Antihistamines</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Dosage Form * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Dosage Form <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("dosageForm")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select dosage form</option>
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
              <option value="Chewable Tablet">Chewable Tablet</option>
              <option value="Injection">Injection</option>
              <option value="Ointment">Ointment</option>
              <option value="Suspension">Suspension</option>
              <option value="Drops">Drops</option>
            </select>
            {errors.dosageForm && <p className="text-[11px] text-rose-600 mt-1">{errors.dosageForm.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Strength / Composition * */}
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

          {/* Pack Size * */}
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

          {/* Unit * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Unit <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("unit")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select unit</option>
              <option value="Strip of 10">Strip of 10</option>
              <option value="Strip of 15">Strip of 15</option>
              <option value="Strip of 5">Strip of 5</option>
              <option value="Bottle of 100ml">Bottle of 100ml</option>
              <option value="Bottle of 200ml">Bottle of 200ml</option>
              <option value="Vial">Vial</option>
              <option value="Ampoule">Ampoule</option>
              <option value="Tube of 30g">Tube of 30g</option>
              <option value="Box">Box</option>
            </select>
            {errors.unit && <p className="text-[11px] text-rose-600 mt-1">{errors.unit.message}</p>}
          </div>
        </div>
      </div>

      {/* SECTION 2: Manufacturer & Supplier */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5">Manufacturer & Supplier</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Manufacturer * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Manufacturer <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("manufacturer")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select manufacturer</option>
              <option value="GSK Pharmaceuticals">GSK Pharmaceuticals</option>
              <option value="Cipla Ltd.">Cipla Ltd.</option>
              <option value="Dr. Reddy's">Dr. Reddy's Laboratories</option>
              <option value="Sun Pharma">Sun Pharmaceutical</option>
              <option value="Abbott">Abbott</option>
              <option value="J. B. Chemicals">J. B. Chemicals</option>
              <option value="Zydus Lifesciences">Zydus Lifesciences</option>
              <option value="Lupin Ltd.">Lupin Ltd.</option>
              <option value="Torrent Pharma">Torrent Pharma</option>
            </select>
            {errors.manufacturer && <p className="text-[11px] text-rose-600 mt-1">{errors.manufacturer.message}</p>}
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Supplier</label>
            <select
              {...register("supplier")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select supplier (optional)</option>
              <option value="Medilife Pharma Pvt. Ltd.">Medilife Pharma Pvt. Ltd.</option>
              <option value="HealthCare Distributors">HealthCare Distributors</option>
              <option value="MediSupplies India">MediSupplies India</option>
              <option value="LifeCare Enterprises">LifeCare Enterprises</option>
              <option value="Suraksha Surgicals">Suraksha Surgicals</option>
            </select>
          </div>

          {/* Country of Origin */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Country of Origin</label>
            <input
              {...register("countryOfOrigin")}
              placeholder="Enter country of origin"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Pricing & Taxation */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5">Pricing & Taxation</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Unit Price (₹) * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Unit Price (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register("unitPrice")}
              placeholder="0.00"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {errors.unitPrice && <p className="text-[11px] text-rose-600 mt-1">{errors.unitPrice.message}</p>}
          </div>

          {/* MRP (₹) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">MRP (₹)</label>
            <input
              type="number"
              step="0.01"
              {...register("mrp")}
              placeholder="0.00"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* GST Rate (%) * */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              GST Rate (%) <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("gstRate")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="">Select GST rate</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
            {errors.gstRate && <p className="text-[11px] text-rose-600 mt-1">{errors.gstRate.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Purchase Price (₹) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Purchase Price (₹)</label>
            <input
              type="number"
              step="0.01"
              {...register("purchasePrice")}
              placeholder="0.00"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Margin (%) (i) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <span>Margin (%)</span>
              <Info className="w-3 h-3 text-slate-400" />
            </label>
            <input
              type="number"
              step="0.01"
              {...register("margin")}
              placeholder="0.00"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Selling Price (₹) (i) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <span>Selling Price (₹)</span>
              <Info className="w-3 h-3 text-slate-400" />
            </label>
            <input
              type="number"
              step="0.01"
              {...register("sellingPrice")}
              placeholder="0.00"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Additional Information */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5">Additional Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Prescription Required */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Prescription Required</label>
            <select
              {...register("prescriptionRequired")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Controlled Medicine */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Controlled Medicine</label>
            <select
              {...register("controlledMedicine")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Shelf Life */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Shelf Life</label>
            <div className="flex gap-2">
              <input
                type="number"
                {...register("shelfLifeValue")}
                placeholder="Enter shelf life"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              <select
                {...register("shelfLifeUnit")}
                className="w-28 bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
              >
                <option value="Months">Months</option>
                <option value="Years">Years</option>
                <option value="Days">Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description / Notes */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description / Notes</label>
          <div className="relative">
            <textarea
              {...register("description")}
              rows={3}
              maxLength={500}
              placeholder="Enter medicine description, uses, side effects, precautions, etc."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none"
            />
            <span className="absolute right-3 bottom-2.5 text-[10px] font-semibold text-slate-400">
              {descLength} / 500
            </span>
          </div>
          {errors.description && <p className="text-[11px] text-rose-600 mt-1">{errors.description.message}</p>}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        {/* Left: Add another medicine checkbox */}
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("addAnother")}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
          />
          <span>Add another medicine</span>
        </label>

        {/* Right: Cancel & Save Medicine Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Medicine"}
          </button>
        </div>
      </div>
    </form>
  );
}