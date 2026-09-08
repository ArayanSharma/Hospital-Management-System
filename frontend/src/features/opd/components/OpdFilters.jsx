import React from "react";
import { Filter } from "lucide-react";
import SearchInput from "../../../components/common/SearchInput.jsx";

export default function OpdFilters({
  search,
  setSearch,
  date,
  setDate,
  doctorId,
  setDoctorId,
  status,
  setStatus,
  doctorList = [],
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
      {/* Search Input */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by Patient Name, ID or Doctor..."
        className="flex-1 min-w-[260px]"
      />

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        />
      </div>

      {/* Doctor Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Doctor</span>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          <option value="">All Doctors</option>
          {doctorList.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.userId?.name || doc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Status</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
          <option value="walk-in">Walk-in</option>
        </select>
      </div>

      {/* Filters Button */}
      <button
        type="button"
        className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
      >
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        <span>Filters</span>
      </button>
    </div>
  );
}
