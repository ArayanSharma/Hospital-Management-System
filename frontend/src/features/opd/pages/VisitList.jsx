import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useOpdVisits } from "../hooks/useOpdVisits.js";
import { useDoctors } from "../../doctors/hooks/useDoctors.js";
import OpdStatCards from "../components/OpdStatCards.jsx";
import OpdFilters from "../components/OpdFilters.jsx";
import OpdTabs from "../components/OpdTabs.jsx";
import OpdVisitTable from "../components/OpdVisitTable.jsx";
import OpdVisitDetailsPanel from "../components/OpdVisitDetailsPanel.jsx";
import OpdVisitFormModal from "../components/OpdVisitFormModal.jsx";
import OpdCancelVisitModal from "../components/modals/OpdCancelVisitModal.jsx";
import OpdAssignDoctorModal from "../components/modals/OpdAssignDoctorModal.jsx";
import OpdViewVisitModal from "../components/modals/OpdViewVisitModal.jsx";
import { updateOPDVisitApi } from "../services/opdVisit.api.js";

export default function VisitList() {
  const {
    visits,
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
    status,
    setStatus,
    activeTab,
    setActiveTab,
    selectedVisit,
    setSelectedVisit,
    refetch,
  } = useOpdVisits();

  const { doctors: rawDoctors } = useDoctors();
  const doctorList = Array.isArray(rawDoctors) ? rawDoctors : rawDoctors?.doctors || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [viewingVisit, setViewingVisit] = useState(null);
  const [cancellingVisit, setCancellingVisit] = useState(null);
  const [assignDoctorVisit, setAssignDoctorVisit] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleStatusChange = async (visit, newStatus) => {
    try {
      await updateOPDVisitApi(visit._id, { status: newStatus });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update visit status");
    }
  };

  const handleAssignDoctor = async (visitId, newDoctorId) => {
    setSubmitting(true);
    try {
      await updateOPDVisitApi(visitId, { doctorId: newDoctorId });
      setAssignDoctorVisit(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign doctor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmCancel = async (visit, cancelledReason) => {
    setSubmitting(true);
    try {
      await updateOPDVisitApi(visit._id, { status: "cancelled", cancelledReason });
      setCancellingVisit(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel visit");
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
            OPD Visits
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Home &gt; <span className="text-slate-600">OPD Visits</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingVisit(null);
            setModalOpen(true);
          }}
          className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New OPD Visit (Walk-in)</span>
        </button>
      </div>

      {/* 2. Four OPD Statistics Cards */}
      <OpdStatCards stats={stats} />

      {/* 3. Search & Filter Bar */}
      <OpdFilters
        search={search}
        setSearch={setSearch}
        date={date}
        setDate={setDate}
        doctorId={doctorId}
        setDoctorId={setDoctorId}
        status={status}
        setStatus={setStatus}
        doctorList={doctorList}
      />

      {/* 4. Split Workspace Layout (OPD Visits Table Left, Visit Details Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Visits Table Container */}
        <div className="lg:col-span-7 xl:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          <OpdTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stats={stats}
          />
          <OpdVisitTable
            visits={visits}
            loading={loading}
            error={error}
            page={page}
            setPage={setPage}
            pagination={pagination}
            selectedVisit={selectedVisit}
            onSelectVisit={(v, action) => {
              setSelectedVisit(v);
              if (action === "edit") {
                setEditingVisit(v);
              } else {
                setViewingVisit(v);
              }
            }}
            onStatusChange={handleStatusChange}
            onAssignDoctor={(v) => setAssignDoctorVisit(v)}
            onOpenCancelModal={(v) => setCancellingVisit(v)}
          />
        </div>

        {/* Right Side: Visit Details Panel */}
        <div className="lg:col-span-5 xl:col-span-5 sticky top-20">
          <OpdVisitDetailsPanel
            visit={selectedVisit}
            onClose={() => setSelectedVisit(null)}
            onUpdateSuccess={refetch}
          />
        </div>
      </div>

      {/* View OPD Visit Modal */}
      <OpdViewVisitModal
        visit={viewingVisit}
        isOpen={!!viewingVisit}
        onClose={() => setViewingVisit(null)}
      />

      {/* Assign Doctor Modal */}
      <OpdAssignDoctorModal
        visit={assignDoctorVisit}
        doctorList={doctorList}
        isOpen={!!assignDoctorVisit}
        onClose={() => setAssignDoctorVisit(null)}
        onAssign={handleAssignDoctor}
        submitting={submitting}
      />

      {/* Cancel Visit Modal */}
      <OpdCancelVisitModal
        visit={cancellingVisit}
        isOpen={!!cancellingVisit}
        onClose={() => setCancellingVisit(null)}
        onConfirmCancel={handleConfirmCancel}
        submitting={submitting}
      />

      {/* New / Edit OPD Visit Modal */}
      <OpdVisitFormModal
        isOpen={modalOpen || !!editingVisit}
        defaultValues={editingVisit}
        isEdit={!!editingVisit}
        onClose={() => {
          setModalOpen(false);
          setEditingVisit(null);
        }}
        onSuccess={refetch}
      />
    </div>
  );
}