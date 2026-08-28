import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { labTestSchema } from "../validation/labTest.schema.js";
import { useDoctorOptions } from "../../../hooks/useDoctorOptions.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import Button from "../../../components/ui/Button.jsx";

const SAMPLE_TYPES = ["Blood", "Urine", "Stool", "Sputum", "Swab"];
const PRIORITIES = [
  { value: "routine", label: "Routine", color: "text-gray-600" },
  { value: "urgent", label: "Urgent", color: "text-amber-600" },
  { value: "emergency", label: "Emergency", color: "text-red-600" },
];

export default function LabTestForm({ onSubmit, onCancel, submitting }) {
  const { doctors } = useDoctorOptions();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(labTestSchema),
    defaultValues: { priority: "routine" },
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ordering Doctor</label>
        <select {...register("doctorId")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">Select doctor</option>
          {doctors.map((d) => <option key={d._id} value={d._id}>Dr. {d.userId?.name || d.name}</option>)}
        </select>
        {errors.doctorId && <p className="text-xs text-red-600 mt-1">{errors.doctorId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
          <input {...register("testName")} placeholder="e.g. Complete Blood Count" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          {errors.testName && <p className="text-xs text-red-600 mt-1">{errors.testName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sample Type</label>
          <input {...register("sampleType")} list="sample-types" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          <datalist id="sample-types">
            {SAMPLE_TYPES.map((s) => <option key={s} value={s} />)}
          </datalist>
          {errors.sampleType && <p className="text-xs text-red-600 mt-1">{errors.sampleType.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => (
            <label key={p.value} className={`flex-1 text-center border border-gray-300 rounded-md py-2 text-sm cursor-pointer has-[:checked]:border-gray-900 has-[:checked]:bg-gray-50 ${p.color}`}>
              <input type="radio" value={p.value} {...register("priority")} className="sr-only" />
              {p.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Ordering..." : "Order Test"}</Button>
      </div>
    </form>
  );
}
