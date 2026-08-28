import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { pharmacySaleSchema } from "../validation/pharmacySale.schema.js";
import { useMedicineInventoryOptions } from "../../../hooks/useMedicineInventoryOptions.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import Button from "../../../components/ui/Button.jsx";

export default function SaleForm({ onSubmit, onCancel, submitting }) {
  const { options } = useMedicineInventoryOptions();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pharmacySaleSchema),
    defaultValues: { medicines: [{ medicineId: "", quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "medicines" });
  const medicines = watch("medicines");

  const handleMedicineSelect = (index, medicineId) => {
    const selected = options.find((o) => o.medicineId === medicineId);
    if (!selected) return;
    setValue(`medicines.${index}.medicineId`, selected.medicineId);
    setValue(`medicines.${index}.inventoryItemId`, selected.inventoryItemId);
    setValue(`medicines.${index}.medicineName`, selected.medicineName);
    setValue(`medicines.${index}.unitPrice`, selected.price);
    setValue(`medicines.${index}.availableStock`, selected.availableStock);
  };

  const grandTotal = medicines.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Patient (optional — for walk-in leave blank)</label>
        <Controller
          name="patientId"
          control={control}
          render={({ field }) => <PatientAutocomplete value={field.value} onChange={(id) => field.onChange(id)} />}
        />
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const item = medicines[index];
          const overStock = item?.quantity > item?.availableStock;

          return (
            <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-5">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Medicine</label>
                  <select
                    onChange={(e) => handleMedicineSelect(index, e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                  >
                    <option value="">Select medicine</option>
                    {options.map((o) => (
                      <option key={o.medicineId} value={o.medicineId}>
                        {o.medicineName} (Stock: {o.availableStock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                  <input
                    type="number"
                    {...register(`medicines.${index}.quantity`)}
                    className={`w-full px-2 py-1.5 border rounded-md text-sm bg-white ${overStock ? "border-red-400" : "border-gray-300"}`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                  <p className="px-2 py-1.5 text-sm text-gray-600">₹{(item?.unitPrice || 0).toFixed(2)}</p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Subtotal</label>
                  <p className="px-2 py-1.5 text-sm font-medium text-gray-900">
                    ₹{((item?.quantity || 0) * (item?.unitPrice || 0)).toFixed(2)}
                  </p>
                </div>

                <div className="col-span-1 pt-5">
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {overStock && (
                <p className="text-xs text-red-600 mt-1.5">
                  ⚠️ Only {item.availableStock} units available in stock
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append({ medicineId: "", quantity: 1 })}
        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        <Plus className="w-4 h-4" /> Add another medicine
      </button>

      <div className="flex justify-end pt-2 border-t border-gray-100">
        <div className="text-right">
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="text-lg font-semibold text-gray-900">₹{grandTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Processing..." : "Complete Sale"}</Button>
      </div>
    </form>
  );
}