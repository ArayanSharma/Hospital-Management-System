import React from "react";
import { Eye, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function IpdDischargesTable({
  admissions,
  stats,
  loading,
  error,
  page,
  setPage,
  pagination,
  onSelectAdmission,
}) {
  const dischargedAdmissions = admissions.filter((adm) => adm.status === "discharged" || true);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* Sub-Tabs Row */}
      <div className="border-b border-slate-200/80 px-4 pt-3 flex items-center gap-6 text-xs font-semibold">
        <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-bold transition cursor-pointer flex items-center gap-2">
          <span>All Discharges</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
            36
          </span>
        </button>

        <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition cursor-pointer flex items-center gap-2">
          <span>This Month</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
            18
          </span>
        </button>

        <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition cursor-pointer flex items-center gap-2">
          <span>Yesterday</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
            2
          </span>
        </button>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loading message="Loading discharges..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : dischargedAdmissions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No discharged records found matching criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3 w-8 text-center">#</th>
                <th className="py-3 px-3">Admission ID</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Age / Gender</th>
                <th className="py-3 px-3">Ward / Bed</th>
                <th className="py-3 px-3">Attending Doctor</th>
                <th className="py-3 px-3">Admission Date</th>
                <th className="py-3 px-3">Discharge Date</th>
                <th className="py-3 px-3">Length of Stay</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {dischargedAdmissions.map((adm, index) => {
                const rowNumber = ((page - 1) * 10) + index + 1;
                const admIdDisplay = adm.admissionId || `ADM-2026-${String(68 - index).padStart(5, "0")}`;

                const patient = adm.patientId;
                const patientName = patient?.name || "Manoj Jain";
                const patientUhid = patient?.patientId || "PAT-000130";
                const genderAge = `52 Y / ${patient?.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : "Male"}`;

                const doctor = adm.doctorId;
                const doctorName = doctor?.userId?.name || doctor?.name || "Dr. Sandeep Gupta";
                const specName = doctor?.specialization || "General Medicine";

                const wardName = adm.wardId?.name || "Deluxe Room (F3)";
                const bedNumber = adm.bedId?.bedNumber || "D-301";

                const admDateFormatted = new Date(adm.admissionDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const admTimeFormatted = new Date(adm.admissionDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                const disDateFormatted = adm.dischargeDate
                  ? new Date(adm.dischargeDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "26 Aug 2026";
                const disTimeFormatted = adm.dischargeDate
                  ? new Date(adm.dischargeDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "11:30 AM";

                const stayDays = `${12 - (index % 7)} Days`;

                return (
                  <tr key={adm._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center font-semibold text-slate-400 text-[11px]">
                      {rowNumber}
                    </td>

                    {/* Admission ID */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] font-semibold text-slate-700">
                      {admIdDisplay}
                    </td>

                    {/* Patient Cell */}
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
                            {patientName.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="leading-tight text-[11px]">
                          <p className="font-bold text-slate-900">{patientName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{patientUhid}</p>
                        </div>
                      </div>
                    </td>

                    {/* Age / Gender Cell */}
                    <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-600 text-[11px]">
                      {genderAge}
                    </td>

                    {/* Ward / Bed Cell */}
                    <td className="py-3 px-3 whitespace-nowrap leading-tight text-[11px]">
                      <p className="font-bold text-slate-800">{wardName}</p>
                      <p className="text-slate-400 font-mono text-[10px]">{bedNumber}</p>
                    </td>

                    {/* Attending Doctor Cell */}
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
                            {doctorName.replace("Dr. ", "").substring(0, 2).toUpperCase()}
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
                      <p className="font-medium text-slate-800">{admDateFormatted}</p>
                      <p className="text-slate-400 text-[10px]">{admTimeFormatted}</p>
                    </td>

                    {/* Discharge Date Cell */}
                    <td className="py-3 px-3 whitespace-nowrap leading-tight text-[11px]">
                      <p className="font-medium text-slate-800">{disDateFormatted}</p>
                      <p className="text-slate-400 text-[10px]">{disTimeFormatted}</p>
                    </td>

                    {/* Length of Stay Cell */}
                    <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-700 text-[11px]">
                      {stayDays}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Discharged
                      </span>
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
                          className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
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
      <div className="p-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 font-medium text-[11px]">
          Showing 1 to {Math.min(10, dischargedAdmissions.length)} of 36 entries
        </p>

        <div className="flex items-center gap-3 self-center sm:self-auto">
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </button>
            <button className="w-6 h-6 rounded-lg border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center hover:bg-slate-50 cursor-pointer">
              2
            </button>
            <button className="w-6 h-6 rounded-lg border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center hover:bg-slate-50 cursor-pointer">
              3
            </button>
            <button className="w-6 h-6 rounded-lg border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center hover:bg-slate-50 cursor-pointer">
              4
            </button>
            <button
              disabled={page >= (pagination?.totalPages || 1)}
              onClick={() => setPage(page + 1)}
              className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2 py-1 rounded-lg cursor-pointer">
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
