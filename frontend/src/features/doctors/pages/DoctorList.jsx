import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../hooks/useDoctors.js";
import { createDoctorApi, updateDoctorApi, deleteDoctorApi, exportDoctorsApi } from "../services/doctor.api.js";
import { useDepartmentOptions } from "../../../hooks/useDepartmentOptions.js";
import Modal from "../../../components/ui/Modal.jsx";
import DoctorForm from "../components/DoctorForm.jsx";
import DoctorStatsCards from "../components/DoctorStatsCards.jsx";
import DoctorFilterBar from "../components/DoctorFilterBar.jsx";
import DoctorTable from "../components/DoctorTable.jsx";
import DoctorViewModal from "../components/modals/DoctorViewModal.jsx";
import { downloadFileBlob } from "../../../utils/downloadBlob.js";

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

  // Modal & Export State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [limit, setLimit] = useState("10");

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
    if (!confirm(`Are you sure you want to deactivate Dr. ${doctor.name || doctor.userId?.name}?`)) return;
    try {
      await deleteDoctorApi(doctor._id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate doctor");
    }
  };

  const handleToggleStatus = async (doctor) => {
    const newStatus = doctor.status === "active" ? "inactive" : "active";
    try {
      await updateDoctorApi(doctor._id, { status: newStatus });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update doctor status");
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await exportDoctorsApi({ departmentId, status, specialization, search });
      downloadFileBlob(response.data, `Doctors_Export_${new Date().toISOString().split("T")[0]}.csv`);
    } catch (err) {
      alert("Failed to export doctor records from backend server.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Doctors Directory</h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Home &gt; <span className="text-slate-600">Doctors</span>
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* 2. Four Statistic Cards */}
      <DoctorStatsCards
        stats={stats}
        totalFallback={pagination?.total}
        doctorsLength={doctors.length}
      />

      {/* 3. Full-Width Filter Bar */}
      <DoctorFilterBar
        search={search}
        setSearch={setSearch}
        departmentId={departmentId}
        setDepartmentId={setDepartmentId}
        departments={departments}
        specialization={specialization}
        setSpecialization={setSpecialization}
        status={status}
        setStatus={setStatus}
        showMoreFilters={showMoreFilters}
        setShowMoreFilters={setShowMoreFilters}
      />

      {/* 4. Doctors List Table Card */}
      <DoctorTable
        doctors={doctors}
        pagination={pagination}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        refetch={refetch}
        handleExportCSV={handleExportCSV}
        exporting={exporting}
        limit={limit}
        setLimit={setLimit}
        openEditModal={openEditModal}
        openViewModal={(d) => setViewingDoctor(d)}
        handleToggleStatus={handleToggleStatus}
        handleDelete={handleDelete}
        navigate={navigate}
      />

      {/* View Doctor Profile Modal */}
      <DoctorViewModal
        viewingDoctor={viewingDoctor}
        onClose={() => setViewingDoctor(null)}
        navigate={navigate}
      />

      {/* Doctor Add/Edit Form Modal */}
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