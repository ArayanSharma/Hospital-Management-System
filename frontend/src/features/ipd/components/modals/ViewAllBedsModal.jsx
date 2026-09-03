import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { BedDouble, Filter } from "lucide-react";
import api from "../../../../lib/axios.js";

export default function ViewAllBedsModal({ isOpen, onClose }) {
  const [beds, setBeds] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([api.get("/beds"), api.get("/wards")])
        .then(([bedsRes, wardsRes]) => {
          setBeds(Array.isArray(bedsRes.data.data) ? bedsRes.data.data : bedsRes.data.data?.beds || []);
          setWards(Array.isArray(wardsRes.data.data) ? wardsRes.data.data : wardsRes.data.data?.wards || []);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBeds = beds.filter((b) => {
    if (selectedWard !== "all" && b.wardId?._id !== selectedWard && b.wardId !== selectedWard) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="All Hospital Wards & Beds Directory"
      subtitle="Real-time status overview of all hospital bed allocations"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4 text-xs">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-700">Ward:</span>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="all">All Wards</option>
                {wards.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] font-semibold text-slate-500">
            Showing <span className="text-slate-900 font-bold">{filteredBeds.length}</span> beds
          </p>
        </div>

        {/* Live Grid */}
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading beds matrix...</div>
        ) : filteredBeds.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border border-dashed rounded-2xl">
            No beds match the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto p-1">
            {filteredBeds.map((bed) => {
              const wardName = bed.wardId?.name || "Ward";
              const isAvailable = bed.status === "available";
              const isOccupied = bed.status === "occupied";

              return (
                <div
                  key={bed._id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isAvailable
                      ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                      : isOccupied
                      ? "bg-rose-50/50 border-rose-200 text-rose-900"
                      : "bg-amber-50/50 border-amber-200 text-amber-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm font-mono">Bed {bed.bedNumber}</span>
                    <BedDouble
                      className={`w-4 h-4 ${
                        isAvailable ? "text-emerald-600" : isOccupied ? "text-rose-600" : "text-amber-600"
                      }`}
                    />
                  </div>

                  <p className="text-[10px] font-semibold text-slate-500 mt-1 truncate">{wardName}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{bed.type || "Standard"}</p>

                  <span
                    className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold capitalize ${
                      isAvailable
                        ? "bg-emerald-100 text-emerald-700"
                        : isOccupied
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {bed.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
