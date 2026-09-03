import React, { useState, useRef, useEffect } from "react";
import {
  RotateCw,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Star,
  IndianRupee,
  Clock,
  Calendar,
  Users,
  History,
  FileText,
  Bed,
  UserX,
  UserCheck,
  Trash2,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Sparkles,
  Activity,
} from "lucide-react";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

const getDepartmentBadge = (deptName) => {
  const name = deptName || "General Medicine";
  if (name.toLowerCase().includes("cardio")) {
    return {
      icon: HeartPulse,
      style: "bg-rose-50 text-rose-600 border-rose-200",
    };
  }
  if (name.toLowerCase().includes("neuro")) {
    return {
      icon: Brain,
      style: "bg-purple-50 text-purple-600 border-purple-200",
    };
  }
  if (name.toLowerCase().includes("ortho")) {
    return { icon: Bone, style: "bg-blue-50 text-blue-600 border-blue-200" };
  }
  if (name.toLowerCase().includes("pedia")) {
    return { icon: Baby, style: "bg-pink-50 text-pink-600 border-pink-200" };
  }
  if (name.toLowerCase().includes("derma")) {
    return {
      icon: Sparkles,
      style: "bg-amber-50 text-amber-600 border-amber-200",
    };
  }
  return {
    icon: Activity,
    style: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };
};

function DoctorActionMenu({
  doctor,
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

  const isActive = doctor.status === "active";

  return (
    <div className="flex items-center justify-end gap-1.5" ref={ref}>
      <button
        type="button"
        onClick={() => onView(doctor)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition duration-150 cursor-pointer active:scale-95 shadow-2xs"
        title="View Doctor Profile"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={() => onEdit(doctor)}
        className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition duration-150 cursor-pointer active:scale-95 shadow-2xs"
        title="Edit Doctor Profile"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-lg border text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition duration-150 cursor-pointer active:scale-95 shadow-2xs ${
            isOpen
              ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10 text-blue-600"
              : "border-slate-200"
          }`}
          title="More Actions"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out origin-top-right">
            {/* 1. Appointments */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/appointments?doctorId=${doctor._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-700 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Appointments</span>
            </button>

            {/* 2. Patients */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/patients?doctorId=${doctor._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Patients</span>
            </button>

            {/* 3. Visit History */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/appointments?doctorId=${doctor._id}&tab=history`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-purple-50/70 hover:text-purple-700 transition cursor-pointer"
            >
              <History className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Visit History</span>
            </button>

            <div className="my-1 border-t border-slate-100"></div>

            {/* 4. Activate / Deactivate Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onToggleStatus(doctor);
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
                  <span>Deactivate Doctor</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Activate Doctor</span>
                </>
              )}
            </button>

            {/* 5. Delete Action */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDelete(doctor);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-rose-700 hover:bg-rose-50 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Delete Doctor</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DoctorTable({
  doctors,
  pagination,
  loading,
  error,
  page,
  setPage,
  refetch,
  handleExportCSV,
  exporting,
  limit,
  setLimit,
  openEditModal,
  openViewModal,
  handleToggleStatus,
  handleDelete,
  navigate,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Doctors List (
          {pagination?.total
            ? pagination.total.toLocaleString()
            : doctors.length}
          )
        </h3>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={refetch}
            className="group p-2 rounded-xl border border-slate-200/90 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 cursor-pointer active:scale-95"
            title="Refresh Doctor List"
          >
            <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300 ease-out" />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={exporting}
            className="group flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50"
            title="Export Doctors Data to CSV from Backend"
          >
            <Download
              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${exporting ? "animate-bounce text-blue-600" : "group-hover:translate-y-0.5"}`}
            />
            <span>{exporting ? "Exporting..." : "Export"}</span>
          </button>

          <CustomDropdown
            label="Show"
            value={limit}
            options={["10", "25", "50"]}
            onChange={setLimit}
            minWidth="65px"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loading message="Fetching doctor directory..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : doctors.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No doctors found matching the search or filter criteria.
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
                <th className="py-3 px-4">Doctor ID</th>
                <th className="py-3 px-4">Doctor Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Specialization</th>
                <th className="py-3 px-4">Fee</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {doctors.map((doctor) => {
                const deptInfo = getDepartmentBadge(doctor.departmentId?.name);
                const DeptIcon = deptInfo.icon;
                const docName = doctor.userId?.name || doctor.name || "Doctor";
                const docPhone = doctor.userId?.phone || doctor.phone || "N/A";

                return (
                  <tr
                    key={doctor._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                      {doctor.doctorId || "DOC-0001"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {doctor.photoUrl ? (
                          <img
                            src={doctor.photoUrl}
                            alt={docName}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {docName
                              ? docName.substring(0, 2).toUpperCase()
                              : "DOC"}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900">
                            Dr. {docName}
                          </p>
                          <p className="text-[11px] font-normal text-slate-400">
                            {docPhone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${deptInfo.style}`}
                      >
                        <DeptIcon className="w-3.5 h-3.5" />
                        <span>
                          {doctor.departmentId?.name || "General Medicine"}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-slate-900">
                          {doctor.specialization || "General Physician"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {doctor.qualification || "MBBS"}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doctor.consultationFee || 500}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">
                          {doctor.availability?.[0]?.day || "Mon - Sat"} (
                          {doctor.availability?.[0]?.startTime || "09:00 AM"})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80 w-fit">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-amber-700">
                          {doctor.rating || "4.8"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {doctor.status === "inactive" ? (
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
                      <DoctorActionMenu
                        doctor={doctor}
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
          {Math.min(page * 10, pagination?.total || doctors.length)} of{" "}
          {pagination?.total || doctors.length} entries
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
