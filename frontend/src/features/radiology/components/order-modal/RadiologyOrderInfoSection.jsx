import React from "react";
import { Calendar, ChevronDown } from "lucide-react";

export default function RadiologyOrderInfoSection({
  doctorId,
  setDoctorId,
  doctorList,
  loadingDoctors,
  visitType,
  setVisitType,
  orderDateTime,
  setOrderDateTime,
  priority,
  setPriority,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-extrabold">
          2
        </div>
        <span>Order Information</span>
      </div>

      <div className="space-y-3 pl-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Ref. Doctor */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Ref. Doctor <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={doctorId}
                disabled={loadingDoctors}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Doctor</option>
                {doctorList.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    Dr. {doc.userId?.name || doc.name} ({doc.specialization || "General"})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Visit Type Radios */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              Visit Type <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800">
                <input
                  type="radio"
                  name="visitType"
                  value="OPD Visit"
                  checked={visitType === "OPD Visit"}
                  onChange={() => setVisitType("OPD Visit")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>OPD Visit</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800">
                <input
                  type="radio"
                  name="visitType"
                  value="IPD Admission"
                  checked={visitType === "IPD Admission"}
                  onChange={() => setVisitType("IPD Admission")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>IPD Admission</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Order Date & Time */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Order Date &amp; Time <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={orderDateTime}
                onChange={(e) => setOrderDateTime(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Priority Radios */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
              Priority <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800">
                <input
                  type="radio"
                  name="priority"
                  value="routine"
                  checked={priority === "routine"}
                  onChange={() => setPriority("routine")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Routine</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-700">
                <input
                  type="radio"
                  name="priority"
                  value="urgent"
                  checked={priority === "urgent"}
                  onChange={() => setPriority("urgent")}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span>Urgent</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-600">
                <input
                  type="radio"
                  name="priority"
                  value="emergency"
                  checked={priority === "emergency"}
                  onChange={() => setPriority("emergency")}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>Emergency</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
