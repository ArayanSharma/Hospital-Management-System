import React, { useState } from "react";
import { UserPlus, Download } from "lucide-react";
import { useIpdAdmissions } from "../hooks/useIpdAdmissions.js";
import { useDoctors } from "../../doctors/hooks/useDoctors.js";
import IpdStatCards from "../components/IpdStatCards.jsx";
import IpdTabs from "../components/IpdTabs.jsx";
import IpdBedLiveMap from "../components/IpdBedLiveMap.jsx";
import IpdActiveAdmissionsTable from "../components/IpdActiveAdmissionsTable.jsx";
import IpdRightPanel from "../components/IpdRightPanel.jsx";
import IpdIntegratedModules from "../components/IpdIntegratedModules.jsx";
import IpdBedDetailsModal from "../components/IpdBedDetailsModal.jsx";
import AdmitPatientModal from "../components/AdmitPatientModal.jsx";
import DischargePatientModal from "../components/DischargePatientModal.jsx";
import AddWardBedModal from "../components/AddWardBedModal.jsx";

// Dedicated Admissions View Components
import IpdAdmissionsStatCards from "../components/IpdAdmissionsStatCards.jsx";
import IpdAdmissionsFilters from "../components/IpdAdmissionsFilters.jsx";
import IpdAdmissionsTable from "../components/IpdAdmissionsTable.jsx";

// Dedicated Discharges View Components
import IpdDischargesStatCards from "../components/IpdDischargesStatCards.jsx";
import IpdDischargesFilters from "../components/IpdDischargesFilters.jsx";
import IpdDischargesTable from "../components/IpdDischargesTable.jsx";
import IpdDischargesRightPanel from "../components/IpdDischargesRightPanel.jsx";

import BedTransferModal from "../components/modals/BedTransferModal.jsx";
import ViewAllBedsModal from "../components/modals/ViewAllBedsModal.jsx";
import IpdBillingModal from "../components/modals/IpdBillingModal.jsx";
import IpdViewAdmissionModal from "../components/modals/IpdViewAdmissionModal.jsx";

export default function IPDManagementPage() {
  const {
    admissions,
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
    wardId,
    setWardId,
    doctorId,
    setDoctorId,
    status,
    setStatus,
    activeTab,
    setActiveTab,
    selectedBed,
    setSelectedBed,
    selectedAdmission,
    setSelectedAdmission,
    refetch,
  } = useIpdAdmissions();

  const { doctors: rawDoctors } = useDoctors();
  const doctorList = Array.isArray(rawDoctors) ? rawDoctors : rawDoctors?.doctors || [];

  const [admitModalOpen, setAdmitModalOpen] = useState(false);
  const [dischargeModalOpen, setDischargeModalOpen] = useState(false);
  const [addWardBedModalOpen, setAddWardBedModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [viewBedsModalOpen, setViewBedsModalOpen] = useState(false);
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [viewingAdmission, setViewingAdmission] = useState(null);

  // Auto-refresh Key state for instant real-time live map & stats updates
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshAll = () => {
    setRefreshKey((prev) => prev + 1);
    refetch();
  };

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Page Header & Top Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            IPD Management{" "}
            {activeTab === "admissions" && <span className="text-slate-400 font-medium">&gt; Admissions</span>}
            {activeTab === "discharges" && <span className="text-slate-400 font-medium">&gt; Discharges</span>}
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Home &gt; IPD Management &gt;{" "}
            <span className="text-slate-600">
              {activeTab === "discharges"
                ? "Discharges"
                : activeTab === "admissions"
                ? "Admissions"
                : "Bed Overview"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setAdmitModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Admit New Patient</span>
          </button>

          <button
            type="button"
            onClick={() => alert("Exporting report...")}
            className="border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500 stroke-[2.5]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. Top Statistics Cards */}
      {activeTab === "discharges" ? (
        <IpdDischargesStatCards stats={stats} />
      ) : activeTab === "admissions" ? (
        <IpdAdmissionsStatCards stats={stats} />
      ) : (
        <IpdStatCards stats={stats} />
      )}

      {/* 3. IPD Navigation Tabs */}
      <IpdTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 4. Main IPD Workspace Layout */}
      {activeTab === "discharges" ? (
        /* Discharges View */
        <div className="space-y-4">
          <IpdDischargesFilters
            search={search}
            setSearch={setSearch}
            wardId={wardId}
            setWardId={setWardId}
            doctorId={doctorId}
            setDoctorId={setDoctorId}
            status={status}
            setStatus={setStatus}
            date={date}
            setDate={setDate}
            doctorList={doctorList}
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-9 xl:col-span-9">
              <IpdDischargesTable
                admissions={admissions}
                stats={stats}
                loading={loading}
                error={error}
                page={page}
                setPage={setPage}
                pagination={pagination}
                onSelectAdmission={(adm) => {
                  setSelectedAdmission(adm);
                  setViewingAdmission(adm);
                }}
              />
            </div>
            <div className="lg:col-span-3 xl:col-span-3">
              <IpdDischargesRightPanel
                onAdmitOpen={() => setAdmitModalOpen(true)}
              />
            </div>
          </div>
        </div>
      ) : activeTab === "admissions" ? (
        /* Admissions View */
        <div className="space-y-4">
          <IpdAdmissionsFilters
            search={search}
            setSearch={setSearch}
            wardId={wardId}
            setWardId={setWardId}
            doctorId={doctorId}
            setDoctorId={setDoctorId}
            status={status}
            setStatus={setStatus}
            date={date}
            setDate={setDate}
            doctorList={doctorList}
          />
          <IpdAdmissionsTable
            admissions={admissions}
            stats={stats}
            loading={loading}
            error={error}
            page={page}
            setPage={setPage}
            pagination={pagination}
            statusFilter={status}
            setStatusFilter={setStatus}
            onSelectAdmission={(adm) => {
              setSelectedAdmission(adm);
              setViewingAdmission(adm);
            }}
            onDischarge={(adm) => {
              setSelectedAdmission(adm);
              setDischargeModalOpen(true);
            }}
          />
        </div>
      ) : (
        /* Bed Overview 3-Column Hospital Operations Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-5 xl:col-span-5">
            <IpdBedLiveMap
              onSelectBed={setSelectedBed}
              selectedBed={selectedBed}
              onAddWardBedOpen={() => setAddWardBedModalOpen(true)}
              refreshKey={refreshKey}
            />
          </div>

          <div className="lg:col-span-4 xl:col-span-4">
            <IpdActiveAdmissionsTable
              admissions={admissions}
              loading={loading}
              error={error}
              page={page}
              setPage={setPage}
              pagination={pagination}
              search={search}
              setSearch={setSearch}
              wardId={wardId}
              setWardId={setWardId}
              doctorId={doctorId}
              setDoctorId={setDoctorId}
              status={status}
              setStatus={setStatus}
              date={date}
              setDate={setDate}
              doctorList={doctorList}
              onSelectAdmission={(adm) => {
                setSelectedAdmission(adm);
                setViewingAdmission(adm);
              }}
              onDischarge={(adm) => {
                setSelectedAdmission(adm);
                setDischargeModalOpen(true);
              }}
            />
          </div>

          <div className="lg:col-span-3 xl:col-span-3">
            <IpdRightPanel
              stats={stats}
              refreshKey={refreshKey}
              onAdmitOpen={() => setAdmitModalOpen(true)}
              onDischargeOpen={() => setDischargeModalOpen(true)}
              onTransferOpen={() => setTransferModalOpen(true)}
              onBedTransferOpen={() => setTransferModalOpen(true)}
              onViewBedsOpen={() => setViewBedsModalOpen(true)}
              onBillingOpen={() => setBillingModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* 5. Integrated Modules Bar */}
      <IpdIntegratedModules />

      {/* Modals */}
      <IpdBedDetailsModal
        bed={selectedBed}
        onClose={() => setSelectedBed(null)}
        onAdmitNew={() => {
          setSelectedBed(null);
          setAdmitModalOpen(true);
        }}
      />

      <AdmitPatientModal
        isOpen={admitModalOpen}
        onClose={() => setAdmitModalOpen(false)}
        onSuccess={handleRefreshAll}
      />

      <DischargePatientModal
        isOpen={dischargeModalOpen}
        onClose={() => setDischargeModalOpen(false)}
        onSuccess={handleRefreshAll}
        admissions={admissions}
      />

      <AddWardBedModal
        isOpen={addWardBedModalOpen}
        onClose={() => setAddWardBedModalOpen(false)}
        onSuccess={handleRefreshAll}
      />

      {/* Quick Action Modals */}
      <BedTransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onSuccess={handleRefreshAll}
        admissions={admissions}
      />

      <ViewAllBedsModal
        isOpen={viewBedsModalOpen}
        onClose={() => setViewBedsModalOpen(false)}
      />

      <IpdBillingModal
        isOpen={billingModalOpen}
        onClose={() => setBillingModalOpen(false)}
        admissions={admissions}
      />

      <IpdViewAdmissionModal
        admission={viewingAdmission}
        isOpen={!!viewingAdmission}
        onClose={() => setViewingAdmission(null)}
      />
    </div>
  );
}
