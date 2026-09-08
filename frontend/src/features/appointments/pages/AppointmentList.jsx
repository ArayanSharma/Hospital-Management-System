import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useAppointments } from "../hooks/useAppointments.js";
import {
  createAppointmentApi,
  updateAppointmentApi,
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
import AppointmentViewModal from "../components/modals/AppointmentViewModal.jsx";
import AppointmentRescheduleModal from "../components/modals/AppointmentRescheduleModal.jsx";
import AppointmentCancelModal from "../components/modals/AppointmentCancelModal.jsx";

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
  const [editingAppt, setEditingAppt] = useState(null);
  const [viewingAppt, setViewingAppt] = useState(null);
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const [cancellingAppt, setCancellingAppt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState("");

  const handleCreateOrUpdate = async (formData) => {
    setSubmitting(true);
    setConflictError("");
    try {
      if (editingAppt) {
        await updateAppointmentApi(editingAppt._id, formData);
      } else {
        await createAppointmentApi(formData);
      }
      setModalOpen(false);
      setEditingAppt(null);
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
    try {
      await changeAppointmentStatusApi(appointment._id, { status: newStatus });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update appointment status");
    }
  };

  const handleRescheduleSubmit = async (appointmentId, updatePayload) => {
    setSubmitting(true);
    try {
      await updateAppointmentApi(appointmentId, updatePayload);
      setRescheduleAppt(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reschedule appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmCancel = async (appointment, cancelledReason) => {
    setSubmitting(true);
    try {
      await changeAppointmentStatusApi(appointment._id, { status: "cancelled", cancelledReason });
      setCancellingAppt(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setSubmitting(false);
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
            setEditingAppt(null);
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
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
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
          onEdit={(appt) => {
            setEditingAppt(appt);
            setConflictError("");
            setModalOpen(true);
          }}
          onView={(appt) => setViewingAppt(appt)}
          onReschedule={(appt) => setRescheduleAppt(appt)}
          onStatusChange={handleStatusChange}
          onOpenCancelModal={(appt) => setCancellingAppt(appt)}
        />
      </div>

      {/* 5. Integrated Modules Bar */}
      <AppointmentIntegratedModules />

      {/* View Appointment Details Modal */}
      <AppointmentViewModal
        appointment={viewingAppt}
        onClose={() => setViewingAppt(null)}
      />

      {/* Reschedule Appointment Modal */}
      <AppointmentRescheduleModal
        appointment={rescheduleAppt}
        isOpen={!!rescheduleAppt}
        onClose={() => setRescheduleAppt(null)}
        onReschedule={handleRescheduleSubmit}
        submitting={submitting}
      />

      {/* Cancel Appointment Modal */}
      <AppointmentCancelModal
        appointment={cancellingAppt}
        isOpen={!!cancellingAppt}
        onClose={() => setCancellingAppt(null)}
        onConfirmCancel={handleConfirmCancel}
        submitting={submitting}
      />

      {/* Book / Edit Appointment Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAppt(null);
        }}
        title={editingAppt ? "Edit Appointment" : "Book New Appointment"}
        subtitle={editingAppt ? "Update appointment details" : "Schedule a patient OPD appointment slot with conflict prevention"}
        maxWidth="max-w-[700px]"
      >
        <AppointmentForm
          defaultValues={editingAppt}
          isEdit={!!editingAppt}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setModalOpen(false);
            setEditingAppt(null);
          }}
          submitting={submitting}
          conflictError={conflictError}
        />
      </Modal>
    </div>
  );
}