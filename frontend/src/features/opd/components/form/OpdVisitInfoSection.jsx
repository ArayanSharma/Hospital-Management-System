import React from "react";

export default function OpdVisitInfoSection({ register, visitType, setVisitType, appointmentsList }) {
  return (
    <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
        4. Visit Information
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Visit Date &amp; Time <span className="text-rose-500">*</span>
          </label>
          <input
            type="datetime-local"
            {...register("visitDate")}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Source
          </label>
          <select
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="walk-in">Walk-in</option>
            <option value="appointment">Appointment</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Appointment (optional)
          </label>
          <select
            {...register("appointmentId")}
            disabled={visitType !== "appointment"}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer disabled:bg-slate-100"
          >
            <option value="">Select Appointment (if any)</option>
            {appointmentsList.map((appt) => (
              <option key={appt._id} value={appt._id}>
                {appt.appointmentId || appt._id} — {appt.patientId?.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
