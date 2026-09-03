import React from "react";
import { Eye, MoreVertical, ChevronLeft, ChevronRight, Filter, UserCheck } from "lucide-react";
import SearchInput from "../../../components/common/SearchInput.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";
import { formatDate, formatTime, formatGenderAge, getInitials } from "../../../utils/formatters.js";

export default function IpdActiveAdmissionsTable({
  admissions,
  loading,
  error,
  page,
  setPage,
  pagination,
  search,
  setSearch,
  wardId,
  setWardId,
  doctorId,
  setDoctorId,
  status,
  setStatus,
  date,
  setDate,
  doctorList = [],
  wardList = [],
  onSelectAdmission,
  onDischarge,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden p-4 space-y-3">
      {/* Title Header & Discharge Button */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <h3 className="text-sm font-bold text-slate-900">
          Active Admissions
        </h3>
        <button
          type="button"
          onClick={() => onDischarge(null)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Discharge Patient</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <select
          value={wardId}
          onChange={(e) => setWardId(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-xl cursor-pointer"
        >
          <option value="">All Wards</option>
          {wardList.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>

        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-xl cursor-pointer"
        >
          <option value="">All Doctors</option>
          {doctorList.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.userId?.name || doc.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-xl cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="admitted">Admitted</option>
          <option value="discharged">Discharged</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-2 py-1.5 rounded-xl cursor-pointer"
        />

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search patient, ID, bed..."
          className="flex-1 min-w-[180px]"
        />

        <button
          type="button"
          className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loading message="Loading admissions..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : admissions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No active admissions found matching criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3">Patient Info</th>
                <th className="py-2.5 px-3">Ward / Bed</th>
                <th className="py-2.5 px-3">Attending Doctor</th>
                <th className="py-2.5 px-3">Admission Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {admissions.map((adm, index) => {
                const rowNumber = ((page - 1) * 10) + index + 1;
                const patient = adm.patientId;
                const patientName = patient?.name || "Patient";
                const patientUhid = patient?.patientId || "PAT-000123";
                const genderAge = formatGenderAge(patient?.dateOfBirth, patient?.gender);

                const doctor = adm.doctorId;
                const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Doctor";
                const specName = doctor?.specialization || "Cardiology";

                const wardName = adm.wardId?.name || "ICU";
                const bedNumber = adm.bedId?.bedNumber || "ICU-02";

                return (
                  <tr key={adm._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-semibold text-slate-400 text-[11px]">
                      {rowNumber}
                    </td>

                    {/* Patient Info Cell */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {patient?.photoUrl ? (
                          <img
                            src={patient.photoUrl}
                            alt={patientName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {getInitials(patientName)}
                          </div>
                        )}
                        <div className="leading-tight">
                          <p className="font-bold text-slate-900 text-xs">{patientName}</p>
                          <p className="text-[10px] text-slate-400">{patientUhid} · {genderAge}</p>
                        </div>
                      </div>
                    </td>

                    {/* Ward / Bed Cell */}
                    <td className="py-3 px-3 whitespace-nowrap leading-tight text-[11px]">
                      <p className="font-bold text-slate-800">{wardName}</p>
                      <p className="text-slate-400 font-mono text-[10px]">{bedNumber}</p>
                    </td>

                    {/* Doctor Cell */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {doctor?.photoUrl ? (
                          <img
                            src={doctor.photoUrl}
                            alt={doctorName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {getInitials(doctorName)}
                          </div>
                        )}
                        <div className="leading-tight text-[11px]">
                          <p className="font-bold text-slate-900">{doctorName}</p>
                          <p className="text-[10px] text-slate-400">{specName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Admission Date Cell */}
                    <td className="py-3 px-3 whitespace-nowrap leading-tight text-[11px]">
                      <p className="font-medium text-slate-800">{formatDate(adm.admissionDate)}</p>
                      <p className="text-slate-400 text-[10px]">{formatTime(adm.admissionDate)}</p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {adm.status === "admitted" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Admitted
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Discharged
                        </span>
                      )}
                    </td>

                    {/* Actions Cell */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectAdmission(adm)}
                          className="p-1 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={adm.status === "discharged"}
                          onClick={() => onDischarge(adm)}
                          className={`p-1 rounded-lg border text-[10px] px-2 py-1 flex items-center gap-1 transition ${
                            adm.status === "discharged"
                              ? "border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed opacity-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 cursor-pointer font-bold"
                          }`}
                          title={adm.status === "discharged" ? "Patient already discharged" : "Discharge Patient"}
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>{adm.status === "discharged" ? "Discharged" : "Discharge"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Bar */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 font-medium text-[10px]">
          Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination?.total || admissions.length)} of {pagination?.total || admissions.length} entries
        </p>
        <div className="flex items-center gap-1 self-center sm:self-auto">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            {page}
          </button>
          <button
            disabled={page >= (pagination?.totalPages || 1)}
            onClick={() => setPage(page + 1)}
            className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
