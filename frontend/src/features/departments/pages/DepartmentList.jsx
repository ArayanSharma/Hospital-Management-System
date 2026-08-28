import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  UserCheck,
  Plus,
  Filter,
  RotateCw,
  Download,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Bed,
  Ambulance,
  Wind,
  Activity,
  Users,
  Calendar,
  IndianRupee,
  Package,
  FlaskConical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDepartments } from "../hooks/useDepartments.js";
import {
  createDepartmentApi,
  updateDepartmentApi,
  deleteDepartmentApi,
} from "../services/department.api.js";
import { useDoctors } from "../../doctors/hooks/useDoctors.js";
import Modal from "../../../components/ui/Modal.jsx";
import DepartmentForm from "../components/DepartmentForm.jsx";
import SearchInput from "../../../components/common/SearchInput.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

// Helper for department icon & soft badge color matching reference UI
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
  if (name.includes("intensive") || name.includes("icu") || code.includes("icu")) {
    return {
      icon: Bed,
      iconStyle: "bg-amber-50 text-amber-600 border border-amber-100",
      codeBadge: "bg-amber-50 text-amber-600 border border-amber-200",
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

export default function DepartmentList() {
  const navigate = useNavigate();
  const {
    departments,
    stats,
    pagination,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    hodDoctorId,
    setHodDoctorId,
    refetch,
  } = useDepartments();

  const { doctors: doctorList } = useDoctors();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingDept(null);
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept({
      _id: dept._id,
      name: dept.name,
      code: dept.code,
      description: dept.description,
      headDoctorId: dept.headDoctorId?._id || "",
      status: dept.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingDept) {
        await updateDepartmentApi(editingDept._id, formData);
      } else {
        await createDepartmentApi(formData);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (dept) => {
    if (!confirm(`Deactivate ${dept.name} department?`)) return;
    try {
      await deleteDepartmentApi(dept._id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate department");
    }
  };

  // Dynamic MongoDB Stat Counters
  const totalDepts = stats?.totalDepartments ?? (pagination?.total || departments.length);
  const activeDepts = stats?.activeDepartments ?? departments.filter((d) => d.status === "active").length;
  const inactiveDepts = stats?.inactiveDepartments ?? departments.filter((d) => d.status === "inactive").length;
  const withHod = stats?.withHodCount ?? departments.filter((d) => d.headDoctorId).length;

  const activePct = stats?.activePercentage ?? "87.5";
  const inactivePct = stats?.inactivePercentage ?? "12.5";
  const hodPct = stats?.hodPercentage ?? "93.8";

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Primary Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Departments
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Home &gt; <span className="text-slate-600">Departments</span>
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Department</span>
        </button>
      </div>

      {/* 2. Four Department Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Departments */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Departments</p>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(totalDepts).toLocaleString()}
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
              All Registered
            </p>
          </div>
        </div>

        {/* Card 2: Active Departments */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Active Departments</p>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(activeDepts).toLocaleString()}
            </h3>
            <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
              {activePct}% of total
            </p>
          </div>
        </div>

        {/* Card 3: Inactive Departments */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Inactive Departments</p>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(inactiveDepts).toLocaleString()}
            </h3>
            <p className="text-[10px] font-semibold text-rose-500 mt-0.5">
              {inactivePct}% of total
            </p>
          </div>
        </div>

        {/* Card 4: Departments with HOD */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Departments with HOD</p>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(withHod).toLocaleString()}
            </h3>
            <p className="text-[10px] font-semibold text-purple-600 mt-0.5">
              {hodPct}% of total
            </p>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Main Search Input Box */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by Department Name, Code or HOD..."
          className="flex-1 min-w-[260px]"
        />

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* HOD Doctor Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">HOD Doctor</span>
            <select
              value={hodDoctorId}
              onChange={(e) => setHodDoctorId(e.target.value)}
              className="bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">All</option>
              {doctorList.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.userId?.name || doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* More Filters Button */}
          <button
            type="button"
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* 4. Departments List Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Departments List ({pagination?.total ? pagination.total.toLocaleString() : departments.length})
          </h3>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={refetch}
              className="p-2 rounded-xl border border-slate-200/90 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer"
              title="Refresh List"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500">Show</span>
              <select className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-2 py-1.5 rounded-xl cursor-pointer">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Data */}
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
                  const rowNumber = ((page - 1) * 10) + index + 1;

                  const hodDoctor = dept.headDoctorId;
                  const hodName = hodDoctor?.userId?.name || hodDoctor?.name;
                  const hodSpec = hodDoctor?.specialization || "Head Doctor";

                  return (
                    <tr
                      key={dept._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-400">
                        {rowNumber}
                      </td>

                      {/* Department Name Cell */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${meta.iconStyle}`}>
                            <DeptIcon className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-900">{dept.name}</span>
                        </div>
                      </td>

                      {/* Code Cell */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${meta.codeBadge}`}>
                          {dept.code}
                        </span>
                      </td>

                      {/* Description Cell */}
                      <td className="py-3.5 px-4 max-w-xs leading-relaxed text-slate-500">
                        <p className="line-clamp-2">{dept.description || "—"}</p>
                      </td>

                      {/* HOD Cell */}
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

                      {/* Status Cell */}
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

                      {/* Actions Cell */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(dept)}
                            className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                            title="Edit Department"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(dept)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                            title="Deactivate Department"
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
          <p className="text-slate-500 font-medium">
            Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination?.total || departments.length)} of {pagination?.total || departments.length} entries
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

      {/* 5. Integrated Modules Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Integrated Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <div
            onClick={() => navigate("/doctors")}
            className="p-3.5 bg-slate-50/60 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Doctors
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Doctors belong to departments
            </p>
          </div>

          <div
            onClick={() => navigate("/appointments")}
            className="p-3.5 bg-slate-50/60 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Appointments
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Book by department
            </p>
          </div>

          <div
            onClick={() => navigate("/ipd")}
            className="p-3.5 bg-slate-50/60 hover:bg-cyan-50/50 border border-slate-200/80 hover:border-cyan-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Bed className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
              IPD & Wards
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Wards under departments
            </p>
          </div>

          <div
            onClick={() => navigate("/billing")}
            className="p-3.5 bg-slate-50/60 hover:bg-teal-50/50 border border-slate-200/80 hover:border-teal-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <IndianRupee className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
              Billing & Reports
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Department-wise reports
            </p>
          </div>

          <div
            onClick={() => navigate("/pharmacy/inventory")}
            className="p-3.5 bg-slate-50/60 hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Inventory
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Stock by department
            </p>
          </div>

          <div
            onClick={() => navigate("/laboratory")}
            className="p-3.5 bg-slate-50/60 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Laboratory
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Tests by department
            </p>
          </div>
        </div>
      </div>

      {/* Department Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDept ? "Edit Department" : "Add New Department"}
        subtitle={editingDept ? "Update department details or assigned HOD" : "Create a new hospital department with unique code"}
      >
        <DepartmentForm
          defaultValues={editingDept}
          isEdit={!!editingDept}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}