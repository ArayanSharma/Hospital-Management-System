import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wardSchema } from "../validation/ward.schema.js";
import Button from "../../../components/ui/Button.jsx";

const TYPES = ["general", "icu", "private", "semi-private", "emergency"];

export default function WardForm({ onSubmit, onCancel, submitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(wardSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ward Name</label>
        <input {...register("name")} placeholder="e.g. General Ward A" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select {...register("type")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            {TYPES.map((t) => <option key={t} value={t}>{t.replace("-", " ")}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
          <input {...register("floor")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (total beds)</label>
        <input type="number" {...register("capacity")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        {errors.capacity && <p className="text-xs text-red-600 mt-1">{errors.capacity.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Ward"}</Button>
      </div>
    </form>
  );
}
