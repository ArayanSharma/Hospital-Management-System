import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { policySchema } from "../validation/insurance.schema.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import Button from "../../../components/ui/Button.jsx";

export default function PolicyForm({ onSubmit, onCancel, submitting }) {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(policySchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
        <Controller
          name="patientId"
          control={control}
          render={({ field }) => <PatientAutocomplete value={field.value} onChange={(id) => field.onChange(id)} error={errors.patientId?.message} />}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provider Name</label>
          <input {...register("providerName")} placeholder="e.g. Star Health" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          {errors.providerName && <p className="text-xs text-red-600 mt-1">{errors.providerName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
          <input {...register("policyNumber")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          {errors.policyNumber && <p className="text-xs text-red-600 mt-1">{errors.policyNumber.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount</label>
        <input type="number" {...register("coverageAmount")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        {errors.coverageAmount && <p className="text-xs text-red-600 mt-1">{errors.coverageAmount.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
          <input type="date" {...register("validFrom")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          {errors.validFrom && <p className="text-xs text-red-600 mt-1">{errors.validFrom.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
          <input type="date" {...register("validUntil")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          {errors.validUntil && <p className="text-xs text-red-600 mt-1">{errors.validUntil.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Policy"}</Button>
      </div>
    </form>
  );
}
