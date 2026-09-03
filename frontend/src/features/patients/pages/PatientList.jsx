import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePatients } from "../hooks/usePatients.js";
import { createPatientApi, updatePatientApi, deletePatientApi, exportPatientsApi } from "../services/patient.api.js";
import Modal from "../../../components/ui/Modal.jsx";
import PatientForm from "../components/PatientForm.jsx";
import PatientStatsCards from "../components/PatientStatsCards.jsx";
import PatientFilterBar from "../components/PatientFilterBar.jsx";
import PatientTable from "../components/PatientTable.jsx";
import PatientViewModal from "../components/modals/PatientViewModal.jsx";
import { downloadFileBlob } from "../../../utils/downloadBlob.js";

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

  // Modal & Export State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  useEffect(() => {
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
    if (!confirm(`Are you sure you want to delete patient "${patient.name}"?`)) return;
    try {
      await deletePatientApi(patient._id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete patient");
    }
  };

  const handleToggleStatus = async (patient) => {
    const newStatus = patient.status === "active" ? "inactive" : "active";
    try {
      await updatePatientApi(patient._id, { status: newStatus });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update patient status");
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await exportPatientsApi({ gender, status, bloodGroup, search });
      downloadFileBlob(response.data, `Patients_Export_${new Date().toISOString().split("T")[0]}.csv`);
    } catch (err) {
      alert("Failed to export patient records from backend server.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Patients</h1>
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

      {/* 2. Four Statistic Cards */}
      <PatientStatsCards
        stats={stats}
        totalFallback={pagination?.total}
        patientsLength={patients.length}
      />

      {/* 3. Full-Width Filter Bar */}
      <PatientFilterBar
        search={search}
        setSearch={setSearch}
        gender={gender}
        setGender={setGender}
        bloodGroup={bloodGroup}
        setBloodGroup={setBloodGroup}
        status={status}
        setStatus={setStatus}
        showMoreFilters={showMoreFilters}
        setShowMoreFilters={setShowMoreFilters}
      />

      {/* 4. Patients Table Card */}
      <PatientTable
        patients={patients}
        pagination={pagination}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        refetch={refetch}
        handleExportCSV={handleExportCSV}
        exporting={exporting}
        openEditModal={openEditModal}
        openViewModal={(p) => setViewingPatient(p)}
        handleToggleStatus={handleToggleStatus}
        handleDelete={handleDelete}
        navigate={navigate}
      />

      {/* View Patient Details Modal */}
      <PatientViewModal
        viewingPatient={viewingPatient}
        onClose={() => setViewingPatient(null)}
      />

      {/* Patient Add/Edit Form Modal */}
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