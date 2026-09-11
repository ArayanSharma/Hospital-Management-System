import React from "react";
import { RotateCw, Download } from "lucide-react";
import TableSkeleton from "../../../components/ui/TableSkeleton.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";
import MaskedField from "../../../components/common/MaskedField.jsx";
import PatientActionMenu from "./table/PatientActionMenu.jsx";
import PatientPagination from "./table/PatientPagination.jsx";

export default function PatientTable({
  patients,
  pagination,
  loading,
  error,
  page,
  setPage,
  limit = 10,
  setLimit,
  refetch,
  handleExportCSV,
  exporting,
  openEditModal,
  openViewModal,
  handleToggleStatus,
  handleDelete,
  navigate,
}) {
  const formatAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "N/A";
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return `${Math.abs(ageDate.getUTCFullYear() - 1970)} Y`;
  };

  const totalPages = pagination?.totalPages || Math.ceil((pagination?.total || patients.length) / limit) || 1;
  const totalCount = pagination?.total || patients.length;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Patients List ({totalCount.toLocaleString()})
        </h3>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={refetch}
            className="group p-2 rounded-xl border border-slate-200/90 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer active:scale-95"
            title="Refresh Patient List"
          >
            <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exporting}
            className="group flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-50"
            title="Export Patients Data to CSV"
          >
            <Download className={`w-3.5 h-3.5 text-slate-500 ${exporting ? "animate-bounce text-blue-600" : ""}`} />
            <span>{exporting ? "Exporting..." : "Export"}</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={6} columns={10} />
        ) : error ? (
          <ErrorState message={error} />
        ) : patients.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No patients found matching search criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                </th>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">DOB / Age</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {patients.map((patient, idx) => {
                const formattedDob = patient.dateOfBirth
                  ? new Date(patient.dateOfBirth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                  : "N/A";
                const ageText = formatAge(patient.dateOfBirth);

                return (
                  <tr
                    key={patient._id}
                    onClick={() => openViewModal(patient, idx)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap group-hover:text-blue-700">
                      {patient.patientId || "PAT-0001"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {patient.name ? patient.name.substring(0, 2).toUpperCase() : "PT"}
                        </div>
                        <span className="group-hover:text-blue-700 font-extrabold">{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${patient.gender === "female" ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"}`}>
                        {patient.gender === "female" ? "Female" : "Male"}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="leading-tight">
                        <p className="font-medium text-slate-900">{formattedDob}</p>
                        <p className="text-[11px] text-slate-400">{ageText}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                      <MaskedField value={patient.phone} type="phone" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-rose-50 text-rose-600 border border-rose-200">
                        {patient.bloodGroup || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">
                      {patient.address || "N/A"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${patient.status === "inactive" ? "bg-slate-100 text-slate-500 border border-slate-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>
                        {patient.status === "inactive" ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <PatientActionMenu
                        patient={patient}
                        onEdit={openEditModal}
                        onView={() => openViewModal(patient, idx)}
                        onToggleStatus={handleToggleStatus}
                        navigate={navigate}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer Component */}
      <PatientPagination
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        totalCount={totalCount}
        totalPages={totalPages}
      />
    </div>
  );
}
