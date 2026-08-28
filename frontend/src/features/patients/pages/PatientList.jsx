import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Plus,
  Filter,
  RotateCw,
  Download,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Stethoscope,
  Bed,
  FlaskConical,
  Scan,
  Receipt,
  FileText,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePatients } from "../hooks/usePatients.js";
import { createPatientApi, updatePatientApi, deletePatientApi } from "../services/patient.api.js";
import Modal from "../../../components/ui/Modal.jsx";
import PatientForm from "../components/PatientForm.jsx";
import SearchInput from "../../../components/common/SearchInput.jsx";
import Loading from "../../../components/common/Loading.jsx";
import ErrorState from "../../../components/common/ErrorState.jsx";

export default function PatientList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    patients,
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
    gender,
    setGender,
    bloodGroup,
    setBloodGroup,
    refetch,
  } = usePatients();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (searchParams.get("new") === "true") {
      setEditingPatient(null);
      setModalOpen(true);
    }
  }, [searchParams]);

  const openCreateModal = () => {
    setEditingPatient(null);
    setModalOpen(true);
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingPatient) {
        await updatePatientApi(editingPatient._id, formData);
      } else {
        await createPatientApi(formData);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (patient) => {
    if (!confirm(`Deactivate patient ${patient.name}?`)) return;
    try {
      await deletePatientApi(patient._id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete patient");
    }
  };

  // Helper for Age calculation
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "N/A";
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return `${Math.abs(ageDate.getUTCFullYear() - 1970)} Y`;
  };

  // Dynamic MongoDB Stat Values
  const totalPatientsCount = stats?.totalPatients ?? (pagination?.total || patients.length);
  const activePatientsCount = stats?.activePatients ?? patients.filter((p) => p.status === "active").length;
  const inactivePatientsCount = stats?.inactivePatients ?? patients.filter((p) => p.status === "inactive").length;
  const newThisMonthCount = stats?.newThisMonth ?? 0;
  const activePercentage = stats?.activePercentage ?? "100.00";
  const inactivePercentage = stats?.inactivePercentage ?? "0.00";

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Patients
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Home &gt; <span className="text-slate-600">Patients</span>
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* 2. Four Statistic Cards (100% Dynamic DB Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Patients */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Patients</p>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(totalPatientsCount).toLocaleString()}
            </h3>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Active Database</p>
          </div>
        </div>

        {/* Card 2: Active Patients */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Active Patients</p>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(activePatientsCount).toLocaleString()}
            </h3>
            <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
              {activePercentage}% of total
            </p>
          </div>
        </div>

        {/* Card 3: Inactive Patients */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Inactive Patients</p>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(inactivePatientsCount).toLocaleString()}
            </h3>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              {inactivePercentage}% of total
            </p>
          </div>
        </div>

        {/* Card 4: New This Month */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">New This Month</p>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {Number(newThisMonthCount).toLocaleString()}
            </h3>
            <p className="text-[11px] font-semibold text-emerald-600 mt-0.5 flex items-center gap-0.5">
              + Registered this month
            </p>
          </div>
        </div>
      </div>

      {/* 3. Full-Width Filter Card (API Query Integration) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Search Input Box */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by Name, Phone or Patient ID..."
          className="flex-1 min-w-[260px]"
        />

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Gender</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Blood Group Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Blood Group</span>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">All</option>
              <option value="O+">O+</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="O-">O-</option>
              <option value="A-">A-</option>
              <option value="B-">B-</option>
              <option value="AB-">AB-</option>
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

      {/* 4. Patients List Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Patients List ({pagination?.total ? pagination.total.toLocaleString() : patients.length})
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
                {patients.map((patient) => {
                  const formattedDob = patient.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A";
                  const ageText = calculateAge(patient.dateOfBirth);

                  return (
                    <tr
                      key={patient._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                        {patient.patientId || "PAT-0001"}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {patient.name ? patient.name.substring(0, 2).toUpperCase() : "PT"}
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
                          <p className="font-medium text-slate-900">{formattedDob}</p>
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(patient)}
                            className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                            title="Edit Patient"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(patient)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                            title="Deactivate Patient"
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
            Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination?.total || patients.length)} of {pagination?.total || patients.length} entries
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
              Book & manage appointments
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
              Visit history & tokens
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
              Admissions & bed allocation
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
              Medicines & prescriptions
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
              Lab tests & reports
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
              Scan & imaging reports
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
              Invoices & payments
            </p>
          </div>
        </div>
      </div>

      {/* Patient Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPatient ? "Edit Patient Details" : "Add New Patient"}
        subtitle={editingPatient ? "Modify existing patient information" : "Enter patient details to create a new record"}
        maxWidth="max-w-4xl"
      >
        <PatientForm
          defaultValues={editingPatient}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}