import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVisitSchema } from "../validation/opdVisit.schema.js";
import { useDoctorOptions } from "../../../hooks/useDoctorOptions.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import VitalsInput from "./VitalsInput.jsx";
import Button from "../../../components/ui/Button.jsx";

export default function CreateVisitForm({ onSubmit, onCancel, submitting }) {
  const { doctors } = useDoctorOptions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createVisitSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
        <Controller
          name="patientId"
          control={control}
          render={({ field }) => (
            <PatientAutocomplete
              value={field.value}
              onChange={(id) => field.onChange(id)}
              error={errors.patientId?.message}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
        <select {...register("doctorId")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">Select doctor</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>Dr. {d.userId?.name} — {d.specialization}</option>
          ))}
        </select>
        {errors.doctorId && <p className="text-xs text-red-600 mt-1">{errors.doctorId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
        <textarea
          {...register("symptoms")}
          rows={2}
          placeholder="e.g. Fever, headache since 2 days"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Vitals</p>
        <VitalsInput register={register} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Starting..." : "Start Visit"}
        </Button>
      </div>
    </form>
  );
}