import React from "react";
import { Calendar, Clock } from "lucide-react";
import { getTodaySchedule } from "../helpers/radiologyCalculations.js";
import { formatReportDate } from "../helpers/radiologyReportFormatter.js";

export default function RadiologyTodayScheduleCard({ orders = [] }) {
  const scheduleItems = getTodaySchedule(orders);

  const getStatusBadge = (status) => {
    switch (status) {
      case "in-progress":
        return "bg-cyan-50 text-cyan-600 border-cyan-200";
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "scheduled":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "pending":
      default:
        return "bg-amber-50 text-amber-600 border-amber-200";
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
        Today&apos;s Schedule
      </h3>

      {scheduleItems.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400 font-medium">
          <Clock className="w-5 h-5 mx-auto mb-1 opacity-50" />
          No scans scheduled for today
        </div>
      ) : (
        <div className="space-y-2 text-xs max-h-60 overflow-y-auto pr-1">
          {scheduleItems.map((item) => {
            const pName = item.patientName || item.patientId?.name || "Patient";
            const pUhid = item.patientId?.patientId || item.patientId?._id || item.patientId || "";
            const modality = item.modality || item.testType || "X-Ray";
            const bodyRegion = item.bodyRegion || item.bodyPart || "Chest";
            const dateStr = item.scheduledAt ? formatReportDate(item.scheduledAt) : "Today";

            return (
              <div
                key={item._id || item.orderId}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-2 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-extrabold text-slate-500 font-mono shrink-0">
                    {dateStr.slice(0, 11)}
                  </span>
                  <div className="leading-tight">
                    <p className="font-bold text-slate-900 text-xs">{`${modality} - ${bodyRegion}`}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{`${pName} ${pUhid ? `(${pUhid})` : ""}`}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 capitalize ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status || "Scheduled"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="w-full mt-1 border border-blue-100 text-blue-600 hover:bg-blue-50 bg-blue-50/40 rounded-xl py-2 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Active Scans Schedule</span>
      </button>
    </div>
  );
}
