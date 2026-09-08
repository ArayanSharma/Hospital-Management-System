import React, { useState, useEffect } from "react";
import {
  UserPlus,
  UserCheck,
  ArrowRightLeft,
  BedDouble,
  Eye,
  Receipt,
} from "lucide-react";
import api from "../../../lib/axios.js";

export default function IpdRightPanel({
  stats,
  onAdmitOpen,
  onDischargeOpen,
  onTransferOpen,
  onBedTransferOpen,
  onViewBedsOpen,
  onBillingOpen,
  refreshKey,
}) {
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchWardSummary = async () => {
      try {
        const { data } = await api.get("/wards");
        setWards(Array.isArray(data.data) ? data.data : data.data?.wards || []);
      } catch (err) {
        setWards([]);
      }
    };
    fetchWardSummary();
  }, [refreshKey]);

  const todayAdmissions = stats?.todayAdmissions ?? 6;
  const todayDischarges = stats?.todayDischarges ?? 4;
  const occupiedBeds = stats?.occupiedBeds ?? 78;
  const totalBeds = stats?.totalBeds ?? 120;
  const occPct = stats?.occupiedPercentage ?? "65.00%";
  const averageStay = stats?.averageStay ?? "4.6";
  const pendingDischarges = stats?.pendingDischarges ?? 3;

  return (
    <div className="space-y-4">
      {/* 1. Ward Summary Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-900">Ward Summary</h4>
        </div>

        <div className="space-y-2.5 text-xs">
          {wards.length === 0 ? (
            <div className="text-slate-400 text-[11px] py-2 text-center">Loading wards...</div>
          ) : (
            wards.map((ward) => {
              const available = ward.available ?? 2;
              const total = ward.total ?? ward.capacity ?? 10;
              const pct = total > 0 ? Math.round((available / total) * 100) : 0;

              return (
                <div key={ward._id}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">
                      {ward.name} ({ward.floor || "Floor 1"})
                    </span>
                    <span className="text-slate-500 font-medium">
                      {available} / {total} available
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          type="button"
          onClick={onViewBedsOpen}
          className="w-full py-1.5 text-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl transition cursor-pointer"
        >
          View All Wards
        </button>
      </div>

      {/* 2. Quick Actions Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
          Quick Actions
        </h4>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <button
            onClick={onAdmitOpen}
            className="p-2 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-slate-700 font-semibold truncate"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Admit New Patient</span>
          </button>

          <button
            onClick={onDischargeOpen}
            className="p-2 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-slate-700 font-semibold truncate"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Discharge Patient</span>
          </button>

          <button
            onClick={onTransferOpen}
            className="p-2 bg-slate-50 hover:bg-purple-50/60 border border-slate-200/80 hover:border-purple-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-slate-700 font-semibold truncate"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="truncate">Transfer Patient</span>
          </button>

          <button
            onClick={onBedTransferOpen}
            className="p-2 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-slate-700 font-semibold truncate"
          >
            <BedDouble className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">Bed Transfer</span>
          </button>

          <button
            onClick={onViewBedsOpen}
            className="p-2 bg-slate-50 hover:bg-cyan-50/60 border border-slate-200/80 hover:border-cyan-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-slate-700 font-semibold truncate"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span className="truncate">View All Beds</span>
          </button>

          <button
            onClick={onBillingOpen}
            className="p-2 bg-slate-50 hover:bg-teal-50/60 border border-slate-200/80 hover:border-teal-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-slate-700 font-semibold truncate"
          >
            <Receipt className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="truncate">IPD Billing</span>
          </button>
        </div>
      </div>

      {/* 3. Today's Overview Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-2.5 text-xs">
        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
          Today's Overview
        </h4>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">New Admissions</span>
            <span className="font-extrabold text-slate-900">{todayAdmissions}</span>
          </div>

          <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Discharges</span>
            <span className="font-extrabold text-slate-900">{todayDischarges}</span>
          </div>

          <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Bed Occupancy</span>
            <span className="font-extrabold text-slate-900">
              {occupiedBeds} / {totalBeds} ({occPct})
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Average Stay (Days)</span>
            <span className="font-extrabold text-slate-900">{averageStay}</span>
          </div>

          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-500 font-medium">Pending Discharges</span>
            <span className="font-extrabold text-slate-900">{pendingDischarges}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
