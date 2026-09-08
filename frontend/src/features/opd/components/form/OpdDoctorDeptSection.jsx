import React from "react";
import { Stethoscope, Building2 } from "lucide-react";

export default function OpdDoctorDeptSection({
  register,
  errors,
  loadingDoctors,
  doctorList,
  selectedDept,
  setSelectedDept,
  setValue,
  deptList,
}) {
  return (
    <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
        3. Doctor &amp; Department
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Doctor <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register("doctorId", { required: "Doctor is required" })}
              disabled={loadingDoctors}
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">Select Doctor</option>
              {doctorList.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  Dr. {doc.userId?.name || doc.name}
                </option>
              ))}
            </select>
            <Stethoscope className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.doctorId && (
            <p className="text-[10px] text-rose-500 mt-0.5">{errors.doctorId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Department <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setValue("departmentId", e.target.value);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">Select Department</option>
              {deptList.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
            <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Consultation Type <span className="text-rose-500">*</span>
          </label>
          <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer">
            <option value="OPD">OPD</option>
            <option value="Specialist">Specialist</option>
          </select>
        </div>
      </div>
    </div>
  );
}
