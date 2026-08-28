import React, { useState } from "react";
import { Info, Bed as BedIcon, Wrench, ChevronDown, Plus } from "lucide-react";
import Loading from "../../../components/common/Loading.jsx";
import { useWards } from "../hooks/useWards.js";

export default function IpdBedLiveMap({ onSelectBed, selectedBed, onAddWardBedOpen, refreshKey }) {
  const { wards, loading } = useWards(refreshKey);
  const [selectedWardFilter, setSelectedWardFilter] = useState("all");

  const filteredWards = selectedWardFilter === "all"
    ? wards
    : wards.filter((w) => w._id === selectedWardFilter || w.id === selectedWardFilter);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden p-4 space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-slate-900">Bed Overview &amp; Live Map</h3>
          <Info className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Ward Filter Select & Add Ward / Bed Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Ward Filter</span>
          <select
            value={selectedWardFilter}
            onChange={(e) => setSelectedWardFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">All Wards</option>
            {wards.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name} ({w.floor || "Floor 1"})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onAddWardBedOpen}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Ward / Bed</span>
        </button>
      </div>

      {/* Ward Sections */}
      {loading ? (
        <Loading message="Loading live bed map..." />
      ) : filteredWards.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-medium">
          No ward beds found in database.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWards.map((ward) => {
            const bedList = ward.beds || [];
            const availCount = ward.available ?? bedList.filter((b) => b.status === "available").length;
            const occCount = ward.occupied ?? bedList.filter((b) => b.status === "occupied").length;
            const maintCount = ward.maintenance ?? bedList.filter((b) => b.status === "maintenance").length;
            const totalCount = ward.total ?? bedList.length;

            return (
              <div key={ward._id} className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/40 space-y-2.5">
                {/* Ward Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                    <span>{ward.name} — {ward.floor || "Floor 1"}</span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400">
                    Total: {totalCount} | <span className="text-emerald-600">Available: {availCount}</span> | <span className="text-rose-500">Occupied: {occCount}</span> | <span className="text-amber-600">Maintenance: {maintCount}</span>
                  </p>
                </div>

                {/* Bed Cards Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {bedList.map((bed) => {
                    const isSelected = selectedBed?._id === bed._id || selectedBed?.id === bed.id;
                    let bgStyle = "bg-emerald-50/60 border-emerald-200 text-emerald-700 hover:bg-emerald-100/60";
                    let IconComponent = BedIcon;

                    if (bed.status === "occupied") {
                      bgStyle = "bg-rose-50/60 border-rose-200 text-rose-700 hover:bg-rose-100/60";
                    } else if (bed.status === "maintenance") {
                      bgStyle = "bg-amber-50/60 border-amber-200 text-amber-700 hover:bg-amber-100/60";
                      IconComponent = Wrench;
                    }

                    const patientUhid = bed.currentPatientId?.patientId || bed.patientId;

                    return (
                      <div
                        key={bed._id || bed.id}
                        onClick={() => onSelectBed(bed)}
                        className={`p-2 rounded-xl border transition cursor-pointer flex flex-col items-center justify-center text-center ${bgStyle} ${
                          isSelected ? "ring-2 ring-blue-500 shadow-sm" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <IconComponent className="w-3.5 h-3.5" />
                          <span className="text-xs font-extrabold">{bed.bedNumber}</span>
                        </div>
                        <p className="text-[9px] font-semibold capitalize mt-0.5">
                          {bed.status}
                        </p>
                        {patientUhid && (
                          <p className="text-[9px] font-mono text-slate-500 truncate w-full mt-0.5">
                            {patientUhid}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-slate-400 text-center pt-1">
        ℹ️ Click on any bed to view details
      </p>
    </div>
  );
}
