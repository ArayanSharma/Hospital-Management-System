import React from "react";
import { RotateCw, Download } from "lucide-react";

export default function AppointmentTabs({
  activeTab,
  setActiveTab,
  stats,
  refetch,
}) {
  const todayCount = stats?.todayCount ?? 0;
  const scheduledCount = stats?.scheduledCount ?? 0;
  const completedCount = stats?.completedCount ?? 0;
  const cancelledCount = stats?.cancelledCount ?? 0;
  const noShowCount = stats?.noShowCount ?? 0;

  return (
    <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto text-xs font-semibold border-b sm:border-0 border-slate-100 pb-2 sm:pb-0">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
            activeTab === "all"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>All Appointments</span>
        </button>

        <button
          onClick={() => setActiveTab("today")}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
            activeTab === "today"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Today</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
            {todayCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
            activeTab === "upcoming"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Upcoming</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
            {scheduledCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("checked_in")}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
            activeTab === "checked_in"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Checked-In</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600">
            {stats?.checkedInCount ?? 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
            activeTab === "completed"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Completed</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
            {completedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("cancelled")}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
            activeTab === "cancelled"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Cancelled</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600">
            {cancelledCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("no-show")}
          className={`flex items-center gap-1.5 pb-1 border-b-2 transition cursor-pointer ${
            activeTab === "no-show"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>No-Show</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
            {noShowCount}
          </span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          type="button"
          onClick={refetch}
          className="p-2 rounded-xl border border-slate-200/90 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer"
          title="Refresh List"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-500">Show</span>
          <select className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-2 py-1.5 rounded-xl cursor-pointer">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
