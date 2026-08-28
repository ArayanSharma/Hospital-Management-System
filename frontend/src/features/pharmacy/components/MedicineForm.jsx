import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicineSchema } from "../validation/medicine.schema.js";
import Button from "../../../components/ui/Button.jsx";

export default function MedicineForm({ defaultValues, onSubmit, onCancel, submitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues: defaultValues || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
        <input {...register("name")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
          <input {...register("genericName")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input {...register("category")} placeholder="e.g. Antibiotic" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
          <input {...register("manufacturer")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <input {...register("unit")} placeholder="tablet, syrup" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          {errors.unit && <p className="text-xs text-red-600 mt-1">{errors.unit.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (per unit)</label>
          <input type="number" step="0.01" {...register("price")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
          <input type="number" {...register("reorderLevel")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Medicine"}</Button>
      </div>
    </form>
  );
}