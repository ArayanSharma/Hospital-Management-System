import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { prescriptionSchema } from "../validation/prescription.schema.js";
import Button from "../../../components/ui/Button.jsx";

const FREQUENCY_PRESETS = ["1-0-0", "0-1-0", "0-0-1", "1-0-1", "1-1-1"];

const emptyMedicine = { name: "", dosage: "", frequency: "", duration: "", instructions: "" };

export default function PrescriptionForm({ defaultValues, onSubmit, submitting }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: defaultValues || { medicines: [emptyMedicine], instructions: "" },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "medicines" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Medicine Name</label>
                <input
                  {...register(`medicines.${index}.name`)}
                  placeholder="e.g. Paracetamol"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                />
                {errors.medicines?.[index]?.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.medicines[index].name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Dosage</label>
                <input
                  {...register(`medicines.${index}.dosage`)}
                  placeholder="500mg"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                <input
                  {...register(`medicines.${index}.frequency`)}
                  placeholder="1-0-1"
                  list={`freq-presets-${index}`}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                />
                <datalist id={`freq-presets-${index}`}>
                  {FREQUENCY_PRESETS.map((p) => <option key={p} value={p} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                <input
                  {...register(`medicines.${index}.duration`)}
                  placeholder="5 days"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Instructions</label>
                <input
                  {...register(`medicines.${index}.instructions`)}
                  placeholder="After food"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                />
              </div>
            </div>
          </div>
        ))}

        {errors.medicines?.root && (
          <p className="text-xs text-red-600">{errors.medicines.root.message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => append(emptyMedicine)}
        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        <Plus className="w-4 h-4" /> Add another medicine
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">General Instructions</label>
        <textarea
          {...register("instructions")}
          rows={2}
          placeholder="e.g. Rest and hydration"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Prescription"}
        </Button>
      </div>
    </form>
  );
}