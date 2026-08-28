import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  Stethoscope,
  Upload,
  Plus,
  Filter,
  RotateCw,
  Download,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Bed,
  FlaskConical,
  Scan,
  Receipt,
  FileText,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Activity,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../hooks/useDoctors.js";
import { createDoctorApi, updateDoctorApi, deleteDoctorApi } from "../services/doctor.api.js";
import { useDepartmentOptions } from "../../../hooks/useDepartmentOptions.js";
import Modal from "../../../components/ui/Modal.jsx";
import DoctorForm from "../components/DoctorForm.jsx";
import SearchInput from "../../../components/common/SearchInput.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

// Helper for department icon & color badge matching reference UI
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
    return {
      icon: Bone,
      style: "bg-blue-50 text-blue-600 border-blue-200",
    };
  }
  if (name.toLowerCase().includes("pedia")) {
    return {
      icon: Baby,
      style: "bg-pink-50 text-pink-600 border-pink-200",
    };
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

export default function DoctorList() {
  const navigate = useNavigate();
  const {
    doctors,
    stats,
    pagination,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    departmentId,
    setDepartmentId,
    specialization,
    setSpecialization,
    status,
    setStatus,
    refetch,
  } = useDoctors();

  const { departments } = useDepartmentOptions();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingDoctor(null);
    setCurrentDoctorId(null);
    setModalOpen(true);
  };

  const openEditModal = (doctor) => {
    setCurrentDoctorId(doctor._id);
    setEditingDoctor({
      departmentId: doctor.departmentId?._id,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      consultationFee: doctor.consultationFee,
      availability: doctor.availability,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingDoctor) {
        await updateDoctorApi(currentDoctorId, formData);
      } else {
        await createDoctorApi(formData);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (doctor) => {
    const docName = doctor.userId?.name || doctor.name || "Doctor";
    if (!confirm(`Deactivate Dr. ${docName}?`)) return;
    try {
      await deleteDoctorApi(doctor._id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete doctor");
    }
  };

  // Dynamic MongoDB Stat Counters
  const totalDoctors = stats?.totalDoctors ?? (pagination?.total || doctors.length);
  const activeDoctors = stats?.activeDoctors ?? doctors.filter((d) => d.status === "active").length;
  const inactiveDoctors = stats?.inactiveDoctors ?? doctors.filter((d) => d.status === "inactive").length;
  const totalDepartments = stats?.totalDepartments ?? (departments.length || 12);
  const avgFee = stats?.avgConsultationFee ?? 650;
  const activePct = stats?.activePercentage ?? "92.19";
  const inactivePct = stats?.inactivePercentage ?? "7.81";

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Doctors
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Home &gt; <span className="text-slate-600">Doctors</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs flex items-center gap-2 transition cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Import Doctors</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Doctor</span>
          </button>
        </div>
      </div>

      {/* 2. Five Doctor Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Doctors */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Doctors</p>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(totalDoctors).toLocaleString()}
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
              All Registered
            </p>
          </div>
        </div>

        {/* Card 2: Active Doctors */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Active Doctors</p>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(activeDoctors).toLocaleString()}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] font-semibold text-slate-400">
                {activePct}% of total
              </span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                ↑ 12%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Inactive Doctors */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Inactive Doctors</p>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(inactiveDoctors).toLocaleString()}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] font-semibold text-slate-400">
                {inactivePct}% of total
              </span>
              <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded">
                ↓ 4%
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Departments */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Departments</p>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(totalDepartments).toLocaleString()}
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
              Total Departments
            </p>
          </div>
        </div>

        {/* Card 5: Avg Consultation Fee */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Avg. Consultation Fee</p>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              ₹{Number(avgFee).toLocaleString()}
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
              Overall Average
            </p>
          </div>
        </div>
      </div>

      {/* 3. Full-Width Filter Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Main Search Input Box */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by Name, Specialization or Doctor ID..."
          className="flex-1 min-w-[260px]"
        />

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Department</span>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specialization Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Specialization</span>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">All Specializations</option>
              <option value="Interventional Cardiologist">Cardiologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="General Physician">General Physician</option>
              <option value="Dermatologist">Dermatologist</option>
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
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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

      {/* 4. Doctors List Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Doctors List ({pagination?.total ? pagination.total.toLocaleString() : doctors.length})
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
            <Loading message="Fetching doctor records..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : doctors.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              No doctors found in database matching search criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-10 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                  </th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Doctor ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Specialization</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Consultation Fee</th>
                  <th className="py-3 px-4">Availability (This Week)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {doctors.map((doctor) => {
                  const doctorName = doctor.userId?.name || doctor.name || "Dr. Doctor";
                  const doctorEmail = doctor.userId?.email || doctor.email || "doctor@citycare.com";
                  const doctorPhone = doctor.userId?.phone || doctor.phone || "+91 98765 43210";
                  const deptName = doctor.departmentId?.name || doctor.deptName || "General Medicine";
                  const deptBadge = getDepartmentBadge(deptName);
                  const DeptIcon = deptBadge.icon;

                  const daysText = doctor.availability?.[0]?.day || "Mon - Sat";
                  const timeText = doctor.availability?.[0]?.startTime && doctor.availability?.[0]?.endTime
                    ? `${doctor.availability[0].startTime} - ${doctor.availability[0].endTime}`
                    : "09:00 AM - 05:00 PM";

                  return (
                    <tr
                      key={doctor._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {doctor.photoUrl ? (
                            <img
                              src={doctor.photoUrl}
                              alt={doctorName}
                              className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {doctorName.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="leading-tight">
                            <p className="font-bold text-slate-900">{doctorName}</p>
                            <p className="text-[11px] text-slate-400">{doctorEmail}</p>
                            <p className="text-[11px] text-slate-400">{doctorPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                        {doctor.doctorId || "DOC-0001"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${deptBadge.style}`}>
                          <DeptIcon className="w-3.5 h-3.5" />
                          <span>{deptName}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {doctor.specialization || "General Physician"}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {doctor.experience ? `${doctor.experience} Years` : "10 Years"}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                        ₹{doctor.consultationFee || 650}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="leading-tight">
                          <span className="inline-block bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded text-[11px] mb-0.5">
                            {daysText}
                          </span>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {timeText}
                          </p>
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(doctor)}
                            className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                            title="Edit Doctor"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(doctor)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                            title="Deactivate Doctor"
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
            Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination?.total || doctors.length)} of {pagination?.total || doctors.length} entries
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
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
              Slot booking & queue
            </p>
          </div>

          <div
            onClick={() => navigate("/opd-visits")}
            className="p-3.5 bg-slate-50/60 hover:bg-cyan-50/50 border border-slate-200/80 hover:border-cyan-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
              OPD Visits
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Consultation & notes
            </p>
          </div>

          <div
            onClick={() => navigate("/pharmacy/medicines")}
            className="p-3.5 bg-slate-50/60 hover:bg-rose-50/50 border border-slate-200/80 hover:border-rose-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
              Prescriptions
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Medicines & orders
            </p>
          </div>

          <div
            onClick={() => navigate("/ipd")}
            className="p-3.5 bg-slate-50/60 hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Bed className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              IPD Admissions
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Doctor assignment
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
              Test referrals
            </p>
          </div>

          <div
            onClick={() => navigate("/radiology")}
            className="p-3.5 bg-slate-50/60 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Scan className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              Radiology
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Scan approvals
            </p>
          </div>

          <div
            onClick={() => navigate("/billing")}
            className="p-3.5 bg-slate-50/60 hover:bg-teal-50/50 border border-slate-200/80 hover:border-teal-200 rounded-xl transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
              Billing
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              Fees & commission
            </p>
          </div>
        </div>
      </div>

      {/* Doctor Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDoctor ? "Edit Doctor Profile" : "Add New Doctor"}
        subtitle={editingDoctor ? "Update doctor consultation fee, department & schedule" : "Register a new doctor account and assigned department"}
        maxWidth="max-w-3xl"
      >
        <DoctorForm
          defaultValues={editingDoctor}
          isEdit={!!editingDoctor}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}