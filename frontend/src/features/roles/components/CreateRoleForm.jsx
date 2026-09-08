import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoleSchema } from "../validation/role.schema.js";
import Button from "../../../components/ui/Button.jsx";

export default function CreateRoleForm({ onSubmit, onCancel, submitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createRoleSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
        <input {...register("name")} placeholder="e.g. NURSE" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm uppercase" />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea {...register("description")} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Role"}</Button>
      </div>
    </form>
  );
}