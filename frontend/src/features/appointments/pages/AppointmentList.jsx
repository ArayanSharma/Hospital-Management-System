import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useAppointments } from "../hooks/useAppointments.js";
import {
  createAppointmentApi,
  changeAppointmentStatusApi,
} from "../services/appointment.api.js";
import { useDoctors } from "../../doctors/hooks/useDoctors.js";
import { useDepartmentOptions } from "../../../hooks/useDepartmentOptions.js";
import Modal from "../../../components/ui/Modal.jsx";
import AppointmentForm from "../components/AppointmentForm.jsx";
import AppointmentStatCards from "../components/AppointmentStatCards.jsx";
import AppointmentFilters from "../components/AppointmentFilters.jsx";
import AppointmentTabs from "../components/AppointmentTabs.jsx";
import AppointmentTable from "../components/AppointmentTable.jsx";
import AppointmentIntegratedModules from "../components/AppointmentIntegratedModules.jsx";

export default function AppointmentList() {
  const {
    appointments,
    stats,
    pagination,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    date,
    setDate,
    doctorId,
    setDoctorId,
    departmentId,
    setDepartmentId,
    status,
    setStatus,
    activeTab,
    setActiveTab,
    refetch,
  } = useAppointments();

  const { doctors: rawDoctors } = useDoctors();
  const { departments: rawDepts } = useDepartmentOptions();

  const doctorList = Array.isArray(rawDoctors) ? rawDoctors : rawDoctors?.doctors || [];
  const deptList = Array.isArray(rawDepts) ? rawDepts : rawDepts?.departments || [];

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState("");

  const handleCreate = async (formData) => {
    setSubmitting(true);
    setConflictError("");
    try {
      await createAppointmentApi(formData);
      setModalOpen(false);
      refetch();
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictError(err.response.data.message);
      } else {
        alert(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (appointment, newStatus) => {
    let cancelledReason = null;
    if (newStatus === "cancelled") {
      cancelledReason = prompt("Reason for cancellation:");
      if (cancelledReason === null) return;
    }

    try {
      await changeAppointmentStatusApi(appointment._id, { status: newStatus, cancelledReason });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Primary Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Appointments
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Home &gt; <span className="text-slate-600">Appointments</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setConflictError("");
            setModalOpen(true);
          }}
          className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* 2. Five Statistics Cards */}
      <AppointmentStatCards stats={stats} />

      {/* 3. Search & Filters Panel */}
      <AppointmentFilters
        search={search}
        setSearch={setSearch}
        date={date}
        setDate={setDate}
        doctorId={doctorId}
        setDoctorId={setDoctorId}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
        status={status}
        setStatus={setStatus}
        doctorList={doctorList}
        deptList={deptList}
      />

      {/* 4. Tab Navigation & Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <AppointmentTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
          refetch={refetch}
        />
        <AppointmentTable
          appointments={appointments}
          loading={loading}
          error={error}
          page={page}
          setPage={setPage}
          pagination={pagination}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* 5. Integrated Modules Bar */}
      <AppointmentIntegratedModules />

      {/* Book Appointment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Book New Appointment"
        subtitle="Schedule a patient OPD appointment slot with conflict prevention"
        maxWidth="max-w-[700px]"
      >
        <AppointmentForm
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
          conflictError={conflictError}
        />
      </Modal>
    </div>
  );
}