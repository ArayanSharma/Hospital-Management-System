import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { admissionSchema } from "../validation/admission.schema.js";
import { useDoctorOptions } from "../../../hooks/useDoctorOptions.js";
import { getWardsApi } from "../../wards/services/ward.api.js";
import { getBedsApi } from "../../beds/services/bed.api.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import Button from "../../../components/ui/Button.jsx";

export default function AdmissionForm({ onSubmit, onCancel, submitting }) {
  const { doctors } = useDoctorOptions();
  const [wards, setWards] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(admissionSchema),
  });

  useEffect(() => {
    getWardsApi({ status: "active" }).then((res) => setWards(res.data.data));
  }, []);

  useEffect(() => {
    if (!selectedWard) {
      setAvailableBeds([]);
      return;
    }
    getBedsApi({ wardId: selectedWard, status: "available" }).then((res) => setAvailableBeds(res.data.data));
  }, [selectedWard]);

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
        <label className="block text-sm font-medium text-gray-700 mb-1">Attending Doctor</label>
        <select {...register("doctorId")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">Select doctor</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              Dr. {d.userId?.name || d.name}
            </option>
          ))}
        </select>
        {errors.doctorId && <p className="text-xs text-red-600 mt-1">{errors.doctorId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
          <select
            {...register("wardId")}
            onChange={(e) => {
              register("wardId").onChange(e);
              setSelectedWard(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Select ward</option>
            {wards.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
          </select>
          {errors.wardId && <p className="text-xs text-red-600 mt-1">{errors.wardId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bed</label>
          <select {...register("bedId")} disabled={!selectedWard} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50">
            <option value="">{selectedWard ? "Select bed" : "Select ward first"}</option>
            {availableBeds.map((b) => <option key={b._id} value={b._id}>{b.bedNumber}</option>)}
          </select>
          {errors.bedId && <p className="text-xs text-red-600 mt-1">{errors.bedId.message}</p>}
          {selectedWard && availableBeds.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">No available beds in this ward</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Admission Reason</label>
        <textarea {...register("reason")} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        {errors.reason && <p className="text-xs text-red-600 mt-1">{errors.reason.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis (optional)</label>
        <textarea {...register("diagnosis")} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "Admitting..." : "Admit Patient"}</Button>
      </div>
    </form>
  );
}
