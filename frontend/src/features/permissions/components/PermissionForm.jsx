import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPermissionSchema } from "../validation/permission.schema.js";
import Button from "../../../components/ui/Button.jsx";

const ACTIONS = ["create", "read", "update", "delete", "manage"];

export default function PermissionForm({ onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createPermissionSchema) });

  const resource = watch("resource");
  const action = watch("action");
  const previewName = resource && action ? `${resource.toLowerCase()}:${action}` : "";

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, name: `${data.resource}:${data.action}` });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
        <input {...register("resource")} placeholder="e.g. patient, invoice, lab_test" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        {errors.resource && <p className="text-xs text-red-600 mt-1">{errors.resource.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
        <select {...register("action")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">Select action</option>
          {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        {errors.action && <p className="text-xs text-red-600 mt-1">{errors.action.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
        <input {...register("description")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
      </div>

      {previewName && (
        <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
          <p className="text-xs text-gray-500 mb-0.5">Permission name (auto-generated)</p>
          <p className="text-sm font-mono font-medium text-gray-900">{previewName}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Permission"}</Button>
      </div>
    </form>
  );
}