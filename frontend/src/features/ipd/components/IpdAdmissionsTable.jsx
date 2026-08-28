import React from "react";
import { Eye, MoreVertical, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";
import { formatDate, formatTime, formatGenderAge, getInitials } from "../../../utils/formatters.js";

export default function IpdAdmissionsTable({
  admissions,
  stats,
  loading,
  error,
  page,
  setPage,
  pagination,
  statusFilter,
  setStatusFilter,
  onSelectAdmission,
  onDischarge,
}) {
  const totalCount = stats?.totalAdmissions ?? 78;
  const admittedCount = stats?.currentlyAdmitted ?? 42;
  const dischargedCount = stats?.dischargedThisMonth ?? 36;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* Sub-Tabs Row */}
      <div className="border-b border-slate-200/80 px-4 pt-3 flex items-center gap-6 text-xs font-semibold">
        <button
          onClick={() => setStatusFilter("")}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            statusFilter === ""
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>All Admissions</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              statusFilter === ""
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("admitted")}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            statusFilter === "admitted"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Currently Admitted</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              statusFilter === "admitted"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {admittedCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("discharged")}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            statusFilter === "discharged"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Discharged</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              statusFilter === "discharged"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {dischargedCount}
          </span>
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
            No admissions found matching criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-8 text-center">#</th>
                <th className="py-3 px-4">Admission ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Ward / Bed</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Admission Date &amp; Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {admissions.map((adm, index) => {
                const rowNumber = ((page - 1) * 10) + index + 1;
                const admIdDisplay = adm.admissionId || `ADM-2026-${String(78 - index).padStart(5, "0")}`;

                const patient = adm.patientId;
                const patientName = patient?.name || "Patient";
                const patientUhid = patient?.patientId || "PAT-000123";
                const genderAge = formatGenderAge(patient?.dateOfBirth, patient?.gender);

                const doctor = adm.doctorId;
                const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Doctor";
                const specName = doctor?.specialization || "Cardiology";

                const wardName = adm.wardId?.name || "ICU (Floor 2)";
                const bedNumber = adm.bedId?.bedNumber || "ICU-02";

                return (
                  <tr key={adm._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-semibold text-slate-400 text-[11px]">
                      {rowNumber}
                    </td>

                    {/* Admission ID */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-xs font-semibold text-slate-700">
                      {admIdDisplay}
                    </td>

                    {/* Patient Cell */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {patient?.photoUrl ? (
                          <img
                            src={patient.photoUrl}
                            alt={patientName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {getInitials(patientName)}
                          </div>
                        )}
                        <div className="leading-tight">
                          <p className="font-bold text-slate-900 text-xs">{patientName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{patientUhid}</p>
                        </div>
                      </div>
                    </td>

                    {/* Age / Gender Cell */}
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-600 text-xs">
                      {genderAge}
                    </td>

                    {/* Ward / Bed Cell */}
                    <td className="py-3 px-4 whitespace-nowrap leading-tight text-xs">
                      <p className="font-bold text-slate-800">{wardName}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{bedNumber}</p>
                    </td>

                    {/* Attending Doctor Cell */}
                    <td className="py-3 px-4 whitespace-nowrap">
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
                        <div className="leading-tight text-xs">
                          <p className="font-bold text-slate-900">{doctorName}</p>
                          <p className="text-[10px] text-slate-400">{specName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Admission Date & Time Cell */}
                    <td className="py-3 px-4 whitespace-nowrap leading-tight text-xs">
                      <p className="font-medium text-slate-800">{formatDate(adm.admissionDate)}</p>
                      <p className="text-slate-400 text-[11px]">{formatTime(adm.admissionDate)}</p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {adm.status === "admitted" ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Admitted
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                          Discharged
                        </span>
                      )}
                    </td>

                    {/* Actions Cell */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectAdmission(adm)}
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {adm.status === "admitted" && (
                          <button
                            type="button"
                            onClick={() => onDischarge(adm)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Discharge Patient"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDischarge(adm)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                          title="More Actions"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
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
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 font-medium text-xs">
          Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination?.total || admissions.length)} of {pagination?.total || admissions.length} entries
        </p>
        <div className="flex items-center gap-1 self-center sm:self-auto">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
            {page}
          </button>
          <button
            disabled={page >= (pagination?.totalPages || 1)}
            onClick={() => setPage(page + 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
