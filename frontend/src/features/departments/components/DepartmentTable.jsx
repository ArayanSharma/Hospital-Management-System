import React, { useState, useRef, useEffect } from "react";
import {
  RotateCw,
  Download,
  Eye,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserCheck,
  Users,
  Calendar,
  IndianRupee,
  FileText,
  UserX,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Ambulance,
  Wind,
  Activity,
} from "lucide-react";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";
import CustomDropdown from "../../../components/ui/CustomDropdown.jsx";

const getDepartmentMeta = (deptName, deptCode) => {
  const name = deptName ? deptName.toLowerCase() : "";
  const code = deptCode ? deptCode.toLowerCase() : "";

  if (name.includes("cardio") || code.includes("card")) {
    return {
      icon: HeartPulse,
      iconStyle: "bg-rose-50 text-rose-600 border border-rose-100",
      codeBadge: "bg-rose-50 text-rose-600 border border-rose-200",
    };
  }
  if (name.includes("neuro") || code.includes("neuro")) {
    return {
      icon: Brain,
      iconStyle: "bg-purple-50 text-purple-600 border border-purple-100",
      codeBadge: "bg-purple-50 text-purple-600 border border-purple-200",
    };
  }
  if (name.includes("ortho") || code.includes("ortho")) {
    return {
      icon: Bone,
      iconStyle: "bg-blue-50 text-blue-600 border border-blue-100",
      codeBadge: "bg-blue-50 text-blue-600 border border-blue-200",
    };
  }
  if (name.includes("pedia") || code.includes("ped")) {
    return {
      icon: Baby,
      iconStyle: "bg-pink-50 text-pink-600 border border-pink-100",
      codeBadge: "bg-pink-50 text-pink-600 border border-pink-200",
    };
  }
  if (name.includes("emergency") || code.includes("emrg")) {
    return {
      icon: Ambulance,
      iconStyle: "bg-rose-50 text-rose-600 border border-rose-100",
      codeBadge: "bg-rose-50 text-rose-600 border border-rose-200",
    };
  }
  if (name.includes("pulmo") || code.includes("pulmo")) {
    return {
      icon: Wind,
      iconStyle: "bg-cyan-50 text-cyan-600 border border-cyan-100",
      codeBadge: "bg-cyan-50 text-cyan-600 border border-cyan-200",
    };
  }
  return {
    icon: Activity,
    iconStyle: "bg-teal-50 text-teal-600 border border-teal-100",
    codeBadge: "bg-teal-50 text-teal-600 border border-teal-200",
  };
};

function DepartmentActionMenu({
  dept,
  onEdit,
  onView,
  onAssignHod,
  onToggleStatus,
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

  const isActive = dept.status === "active";

  return (
    <div className="flex items-center justify-end gap-1.5" ref={ref}>
      {/* 1. [ 👁 ] View Button */}
      <button
        type="button"
        onClick={() => onView(dept)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
        title="View Department Details"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>

      {/* 2. [ ✏️ ] Edit Button */}
      <button
        type="button"
        onClick={() => onEdit(dept)}
        className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
        title="Edit Department"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </button>

      {/* 3. [ ⋮ ] More Menu Button */}
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-lg border text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs ${
            isOpen ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10 text-blue-600" : "border-slate-200"
          }`}
          title="More Actions"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200/90 rounded-2xl shadow-2xl z-[100] p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out origin-top-right">
            {/* 1. Edit Department */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onEdit(dept);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-700 transition cursor-pointer"
            >
              <Edit2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Edit Department</span>
            </button>

            {/* 3. Assign / Change HOD */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onAssignHod(dept);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-purple-50/70 hover:text-purple-700 transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Assign / Change HOD</span>
            </button>

            <div className="my-1 border-t border-slate-100"></div>

            {/* 4. Manage Doctors */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/doctors?departmentId=${dept._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Manage Doctors</span>
            </button>

            {/* 5. View Patients */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/patients?departmentId=${dept._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-teal-50/70 hover:text-teal-700 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-teal-600 shrink-0" />
              <span>View Patients</span>
            </button>

            {/* 6. View Appointments */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/appointments?departmentId=${dept._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-cyan-50/70 hover:text-cyan-700 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>View Appointments</span>
            </button>

            {/* 7. View Reports */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(`/billing?departmentId=${dept._id}`);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-amber-50/70 hover:text-amber-700 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-600 shrink-0" />
              <span>View Reports</span>
            </button>

            <div className="my-1 border-t border-slate-100"></div>

            {/* 8. Deactivate / Activate Department */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onToggleStatus(dept);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-semibold transition cursor-pointer ${
                isActive ? "text-amber-700 hover:bg-amber-50" : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {isActive ? (
                <>
                  <UserX className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Deactivate Department</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Activate Department</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DepartmentTable({
  departments,
  pagination,
  loading,
  error,
  page,
  setPage,
  refetch,
  limit,
  setLimit,
  openEditModal,
  openViewModal,
  openAssignHodModal,
  handleToggleStatus,
  navigate,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Departments List ({pagination?.total ? pagination.total.toLocaleString() : departments.length})
        </h3>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={refetch}
            className="group p-2 rounded-xl border border-slate-200/90 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 cursor-pointer active:scale-95"
            title="Refresh Department List"
          >
            <RotateCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300 ease-out" />
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
          <Loading message="Fetching department records..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : departments.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No departments found matching search criteria.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">#</th>
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4 max-w-xs">Description</th>
                <th className="py-3 px-4">Head of Department (HOD)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {departments.map((dept, index) => {
                const meta = getDepartmentMeta(dept.name, dept.code);
                const DeptIcon = meta.icon;
                const rowNumber = (page - 1) * 10 + index + 1;

                const hodDoctor = dept.headDoctorId;
                const hodName = hodDoctor?.userId?.name || hodDoctor?.name;
                const hodSpec = hodDoctor?.specialization || "Head Doctor";

                return (
                  <tr key={dept._id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-400">
                      {rowNumber}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${meta.iconStyle}`}>
                          <DeptIcon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900">{dept.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${meta.codeBadge}`}>
                        {dept.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs leading-relaxed text-slate-500">
                      <p className="line-clamp-2">{dept.description || "—"}</p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {hodName ? (
                        <div className="flex items-center gap-2.5">
                          {hodDoctor.photoUrl ? (
                            <img
                              src={hodDoctor.photoUrl}
                              alt={hodName}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {hodName.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="leading-tight">
                            <p className="font-bold text-slate-900">{hodName}</p>
                            <p className="text-[11px] text-slate-400">{hodSpec}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="leading-tight text-slate-400 font-medium">
                          <p>—</p>
                          <p className="text-[11px]">Not Assigned</p>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {dept.status === "inactive" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          Inactive
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <DepartmentActionMenu
                        dept={dept}
                        onEdit={openEditModal}
                        onView={openViewModal}
                        onAssignHod={openAssignHodModal}
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

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <p className="text-slate-500 font-medium">
          Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination?.total || departments.length)} of {pagination?.total || departments.length} entries
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
