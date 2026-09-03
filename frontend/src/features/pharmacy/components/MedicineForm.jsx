import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicineSchema } from "../validation/medicine.schema.js";
import { Info, Lock, Calculator, Edit3, Save, RotateCcw, CheckCircle2 } from "lucide-react";

import MedicineBasicInfoFields from "./form/MedicineBasicInfoFields.jsx";
import MedicineManufacturerFields from "./form/MedicineManufacturerFields.jsx";
import MedicinePricingFields from "./form/MedicinePricingFields.jsx";
import MedicineAdditionalFields from "./form/MedicineAdditionalFields.jsx";

export default function MedicineForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
  categoriesList = [],
  manufacturersList = [],
}) {
  const [descLength, setDescLength] = useState(defaultValues?.description?.length || 0);
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
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
        },
  });

  const watchCategory = watch("category");
  const watchTherapeuticCategory = watch("therapeuticCategory");
  const watchDosageForm = watch("dosageForm");
  const watchUnit = watch("unit");
  const watchManufacturer = watch("manufacturer");
  const watchSupplier = watch("supplier");
  const watchGstRate = watch("gstRate");
  const watchPrescriptionRequired = watch("prescriptionRequired");
  const watchControlledMedicine = watch("controlledMedicine");
  const watchShelfLifeUnit = watch("shelfLifeUnit");

  const watchUnitPrice = watch("unitPrice");
  const watchPurchasePrice = watch("purchasePrice");
  const watchSellingPrice = watch("sellingPrice");
  const watchDescription = watch("description");

  // Dynamic Options derived from live DB list
  const categoryOptions = [
    { label: "Select category", value: "" },
    ...categoriesList.map((c) => ({ label: c, value: c })),
    { label: "Pharmaceuticals", value: "Pharmaceuticals" },
    { label: "Analgesic / Antipyretic", value: "Analgesic / Antipyretic" },
    { label: "Antibiotic", value: "Antibiotic" },
    { label: "Antihistamine", value: "Antihistamine" },
    { label: "Anti-ulcer", value: "Anti-ulcer" },
  ].filter((v, i, a) => a.findIndex((t) => t.value === v.value) === i);

  const manufacturerOptions = [
    { label: "Select manufacturer", value: "" },
    ...manufacturersList.map((m) => ({ label: m, value: m })),
    { label: "Cipla Ltd.", value: "Cipla Ltd." },
    { label: "Sun Pharma", value: "Sun Pharma" },
    { label: "Dr. Reddy's", value: "Dr. Reddy's" },
    { label: "Abbott", value: "Abbott" },
  ].filter((v, i, a) => a.findIndex((t) => t.value === v.value) === i);

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
      status: defaultValues?.status || "Active",
    };

    onSubmit(finalData);

    if (data.addAnother) {
      setSuccessMsg(`Medicine "${finalData.name}" saved to database! Ready to enter 2nd medicine below.`);
      reset({
        genericName: "",
        brandName: "",
        code: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
        category: data.category || "",
        therapeuticCategory: data.therapeuticCategory || "",
        dosageForm: data.dosageForm || "",
        strength: "",
        packSize: "",
        unit: data.unit || "",
        manufacturer: data.manufacturer || "",
        supplier: data.supplier || "",
        countryOfOrigin: "India",
        unitPrice: "",
        mrp: "",
        gstRate: data.gstRate || 12,
        purchasePrice: "",
        margin: "",
        sellingPrice: "",
        prescriptionRequired: data.prescriptionRequired ? "Yes" : "No",
        controlledMedicine: data.controlledMedicine ? "Yes" : "No",
        shelfLifeValue: 24,
        shelfLifeUnit: "Months",
        description: "",
        addAnother: true,
      });
    } else {
      setSuccessMsg("");
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 text-xs text-slate-700 font-medium">
      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between font-bold animate-fadeIn text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg("")}
            className="text-emerald-500 hover:text-emerald-700 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Legend Badge Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 p-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-semibold text-slate-600">
        <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100">
          <Lock className="w-3 h-3" />
          <span>System Generated</span>
        </span>
        <span className="flex items-center gap-1.5 text-sky-700 bg-sky-50/80 px-2.5 py-1 rounded-lg border border-sky-100">
          <Edit3 className="w-3 h-3" />
          <span>Auto-filled</span>
        </span>
        <span className="flex items-center gap-1.5 text-purple-700 bg-purple-50/80 px-2.5 py-1 rounded-lg border border-purple-100">
          <Calculator className="w-3 h-3" />
          <span>Calculated</span>
        </span>
        <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100">
          <Edit3 className="w-3 h-3" />
          <span>Editable</span>
        </span>
      </div>

      {/* Section 1: Basic Information */}
      <MedicineBasicInfoFields
        register={register}
        errors={errors}
        watchCategory={watchCategory}
        watchTherapeuticCategory={watchTherapeuticCategory}
        watchDosageForm={watchDosageForm}
        watchUnit={watchUnit}
        setValue={setValue}
        categoryOptions={categoryOptions}
      />

      {/* Section 2: Manufacturer & Supplier */}
      <MedicineManufacturerFields
        register={register}
        errors={errors}
        watchManufacturer={watchManufacturer}
        watchSupplier={watchSupplier}
        setValue={setValue}
        manufacturerOptions={manufacturerOptions}
      />

      {/* Section 3: Pricing & Taxation */}
      <MedicinePricingFields
        register={register}
        errors={errors}
        watchGstRate={watchGstRate}
        setValue={setValue}
      />

      {/* Section 4: Additional Information */}
      <MedicineAdditionalFields
        register={register}
        errors={errors}
        watchPrescriptionRequired={watchPrescriptionRequired}
        watchControlledMedicine={watchControlledMedicine}
        watchShelfLifeUnit={watchShelfLifeUnit}
        setValue={setValue}
        descLength={descLength}
      />

      {/* Field Information Legend Box */}
      <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-1.5 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-blue-700">
          <Info className="w-3.5 h-3.5" />
          <span>Field Information</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[10.5px] text-slate-500 pl-1 font-medium">
          <li>
            <strong className="text-slate-700">System Generated:</strong> Values created and managed by the system (cannot be edited)
          </li>
          <li>
            <strong className="text-slate-700">Auto-filled:</strong> Values populated from master data or selections
          </li>
          <li>
            <strong className="text-slate-700">Calculated:</strong> Values computed based on other fields
          </li>
          <li>
            <strong className="text-slate-700">Editable:</strong> You can modify these values
          </li>
        </ul>
      </div>

      {/* Footer Bar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("addAnother")}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
          />
          <span>Add another medicine</span>
        </label>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setSuccessMsg("");
              reset();
            }}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{submitting ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}