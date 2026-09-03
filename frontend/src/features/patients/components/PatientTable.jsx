import React, { useState, useRef, useEffect } from "react";
import {
  RotateCw,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Receipt,
  FlaskConical,
  Scan,
  UserX,
  UserCheck,
  Trash2,
} from "lucide-react";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

function PatientActionMenu({
  patient,
  onEdit,
  onView,
  onToggleStatus,
  onDelete,
  navigate,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = patient.status === "active";

  return (
    <div className="flex items-center justify-end gap-1.5" ref={ref}>
      {/* 1. [ 👁 ] View Button */}
      <button
        type="button"
        onClick={() => onView(patient)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
        title="View Patient Details"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>

      {/* 2. [ ✏ ] Edit Button */}
      <button
        type="button"
        onClick={() => onEdit(patient)}
        className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
        title="Edit Patient"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      {/* 3. [ ⋮ ] More Menu Button */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-lg border text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs ${
            isOpen
              ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10 text-blue-600"
              : "border-slate-200"
          }`}
          title="More Patient Actions"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out origin-top-right">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/patients/${patient._id}?tab=history`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-700 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Medical History</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/appointments?patientId=${patient._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-cyan-50/70 hover:text-cyan-700 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Appointments</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/billing?patientId=${patient._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Billing</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/laboratory?patientId=${patient._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 transition cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Lab Reports</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/radiology?patientId=${patient._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-purple-50/70 hover:text-purple-700 transition cursor-pointer"
            >
              <Scan className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Radiology Reports</span>
            </button>

            <div className="my-1 border-t border-slate-100"></div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onToggleStatus(patient);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold transition cursor-pointer ${
                isActive
                  ? "text-amber-700 hover:bg-amber-50"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {isActive ? (
                <>
                  <UserX className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Deactivate Patient</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Activate Patient</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PatientTable({
  patients,
  pagination,
  loading,
  error,
  page,
  setPage,
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

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Patients List (
          {pagination?.total
            ? pagination.total.toLocaleString()
            : patients.length}
          )
        </h3>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={refetch}
            className="group p-2 rounded-xl border border-slate-200/90 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 cursor-pointer active:scale-95"
            title="Refresh Patient List"
          >
            <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300 ease-out" />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exporting}
            className="group flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50"
            title="Export Patients Data to CSV from Backend"
          >
            <Download
              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${exporting ? "animate-bounce text-blue-600" : "group-hover:translate-y-0.5"}`}
            />
            <span>{exporting ? "Exporting..." : "Export"}</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loading message="Fetching database records..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : patients.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No patients found in database matching search criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600"
                  />
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
              {patients.map((patient) => {
                const formattedDob = patient.dateOfBirth
                  ? new Date(patient.dateOfBirth).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A";
                const ageText = formatAge(patient.dateOfBirth);

                return (
                  <tr
                    key={patient._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                      {patient.patientId || "PAT-0001"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {patient.name
                            ? patient.name.substring(0, 2).toUpperCase()
                            : "PT"}
                        </div>
                        <span>{patient.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {patient.gender === "female" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-pink-50 text-pink-600">
                          Female
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600">
                          Male
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="leading-tight">
                        <p className="font-medium text-slate-900">
                          {formattedDob}
                        </p>
                        <p className="text-[11px] text-slate-400">{ageText}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {patient.phone}
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
                      {patient.status === "inactive" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          Inactive
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <PatientActionMenu
                        patient={patient}
                        onEdit={openEditModal}
                        onView={openViewModal}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
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

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 font-medium">
          Showing {(page - 1) * 10 + 1} to{" "}
          {Math.min(page * 10, pagination?.total || patients.length)} of{" "}
          {pagination?.total || patients.length} entries
        </p>
        <div className="flex items-center gap-1 self-center sm:self-auto">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
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
