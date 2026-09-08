import React from "react";

export default function OpdVitalsSection({ register }) {
  return (
    <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
        6. Initial Vitals (Optional - can be updated later)
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div>
          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
            Temperature (°C)
          </label>
          <input
            type="text"
            {...register("temp")}
            placeholder="e.g. 98.6"
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
            Blood Pressure (mmHg)
          </label>
          <input
            type="text"
            {...register("bp")}
            placeholder="e.g. 120/80"
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
            Pulse Rate (BPM)
          </label>
          <input
            type="text"
            {...register("pulse")}
            placeholder="e.g. 78"
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
            SpO2 (%)
          </label>
          <input
            type="text"
            {...register("spO2")}
            placeholder="e.g. 98"
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
            Weight (kg)
          </label>
          <input
            type="text"
            {...register("weight")}
            placeholder="e.g. 65.2"
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
            Height (cm)
          </label>
          <input
            type="text"
            {...register("height")}
            placeholder="e.g. 165"
            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
