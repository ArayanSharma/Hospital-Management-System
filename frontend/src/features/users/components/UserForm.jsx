import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, updateUserSchema } from "../validation/user.schema.js";
import { useRoleOptions } from "../../../hooks/useRoleOptions.js";
import Button from "../../../components/ui/Button.jsx";

export default function UserForm({ defaultValues, isEdit, onSubmit, onCancel, submitting }) {
  const { roles, loading: loadingRoles } = useRoleOptions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: defaultValues || { status: "active" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!isEdit && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input {...register("name")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input {...register("email")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" {...register("password")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input {...register("phone")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          </div>
        </>
      )}

      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input {...register("name")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select {...register("roleId")} disabled={loadingRoles} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">Select role</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
          {errors.roleId && <p className="text-xs text-red-600 mt-1">{errors.roleId.message}</p>}
        </div>

        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select {...register("status")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}