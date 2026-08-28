import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { radiologyTestSchema } from "../validation/radiologyTest.schema.js";
import { useDoctorOptions } from "../../../hooks/useDoctorOptions.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import Button from "../../../components/ui/Button.jsx";

const TEST_TYPES = ["X-Ray", "MRI", "CT Scan", "Ultrasound"];

export default function RadiologyTestForm({ onSubmit, onCancel, submitting }) {
  const { doctors } = useDoctorOptions();
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(radiologyTestSchema),
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
          <select {...register("testType")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option value="">Select type</option>
            {TEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.testType && <p className="text-xs text-red-600 mt-1">{errors.testType.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body Part</label>
          <input {...register("bodyPart")} placeholder="e.g. Chest" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Ordering..." : "Order Test"}</Button>
      </div>
    </form>
  );
}
