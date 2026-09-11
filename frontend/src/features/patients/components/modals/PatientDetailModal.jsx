import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { getPatientFullDetailsApi } from "../../services/patient.api.js";
import PatientDetailHeader from "./patient-detail/PatientDetailHeader.jsx";
import PatientKpiCards from "./patient-detail/PatientKpiCards.jsx";
import PatientDetailNavTabs from "./patient-detail/PatientDetailNavTabs.jsx";
import PatientPrintSummary from "./patient-detail/PatientPrintSummary.jsx";

// Tab Sub-Components
import OverviewTab from "./patient-detail/tabs/OverviewTab.jsx";
import MedicalHistoryTab from "./patient-detail/tabs/MedicalHistoryTab.jsx";
import TestsTab from "./patient-detail/tabs/TestsTab.jsx";
import AppointmentsTab from "./patient-detail/tabs/AppointmentsTab.jsx";
import DiagnosesTab from "./patient-detail/tabs/DiagnosesTab.jsx";
import MedicationsTab from "./patient-detail/tabs/MedicationsTab.jsx";
import AllergiesTab from "./patient-detail/tabs/AllergiesTab.jsx";
import DocumentsTab from "./patient-detail/tabs/DocumentsTab.jsx";
import InsuranceTab from "./patient-detail/tabs/InsuranceTab.jsx";
import BillingTab from "./patient-detail/tabs/BillingTab.jsx";
import AdmissionsTab from "./patient-detail/tabs/AdmissionsTab.jsx";
import VitalsTab from "./patient-detail/tabs/VitalsTab.jsx";
import ActivityLogTab from "./patient-detail/tabs/ActivityLogTab.jsx";

export default function PatientDetailModal({
  patientId,
  isOpen,
  onClose,
  patientsList = [],
  currentIndex = 0,
  onSelectPatientIndex,
  totalPatientsCount = 0,
  currentPage = 1,
  limitPerPage = 10,
  onEditPatient,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFullDetails = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError("");
    try {
      const res = await getPatientFullDetailsApi(patientId);
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patient details.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchFullDetails();
    }
  }, [isOpen, patientId, fetchFullDetails]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && currentIndex > 0) onSelectPatientIndex?.(currentIndex - 1);
      else if (e.key === "ArrowRight" && currentIndex < patientsList.length - 1) onSelectPatientIndex?.(currentIndex + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, patientsList.length, onSelectPatientIndex, onClose]);

  if (!isOpen) return null;

  const currentPatient = data?.patient || patientsList[currentIndex] || {};
  const globalPositionIndex = (currentPage - 1) * limitPerPage + currentIndex + 1;
  const totalCount = totalPatientsCount || patientsList.length;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-7xl h-[94vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200/90 shrink-0">
          <div className="flex items-center gap-3">
            <button
              disabled={currentIndex <= 0}
              onClick={() => onSelectPatientIndex?.(currentIndex - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <div className="px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-xl text-blue-700 font-extrabold text-xs">
              Patient {globalPositionIndex} of {totalCount}
            </div>
            <button
              disabled={currentIndex >= patientsList.length - 1}
              onClick={() => onSelectPatientIndex?.(currentIndex + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold disabled:opacity-40 transition cursor-pointer"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && !data ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold text-slate-600">Loading Patient Details Workspace...</p>
            </div>
          ) : error ? (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
              <p className="text-sm font-bold text-rose-800">{error}</p>
              <button onClick={fetchFullDetails} className="px-4 py-2 bg-rose-600 text-white font-semibold text-xs rounded-xl hover:bg-rose-700 transition">
                Retry Loading
              </button>
            </div>
          ) : (
            <>
              <PatientDetailHeader currentPatient={currentPatient} data={data} onEditPatient={onEditPatient} onPrintSummary={() => window.print()} />
              <PatientKpiCards kpis={data?.kpis} />
              <PatientDetailNavTabs activeTab={activeTab} setActiveTab={setActiveTab} data={data} />

              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs">
                {activeTab === "overview" && <OverviewTab patient={currentPatient} data={data} />}
                {activeTab === "history" && <MedicalHistoryTab patient={currentPatient} timeline={data?.medicalHistoryTimeline} />}
                {activeTab === "tests" && <TestsTab patient={currentPatient} tests={data?.tests || currentPatient?.labTests} />}
                {activeTab === "appointments" && <AppointmentsTab patient={currentPatient} appointments={data?.appointments || currentPatient?.appointments || currentPatient?.appointmentHistory} />}
                {activeTab === "diagnoses" && <DiagnosesTab patient={currentPatient} diagnoses={data?.diagnoses || currentPatient?.diagnoses} />}
                {(activeTab === "prescriptions" || activeTab === "medications") && <MedicationsTab patient={currentPatient} medications={data?.medications || currentPatient?.medications} />}
                {activeTab === "allergies" && <AllergiesTab patient={currentPatient} allergies={data?.allergies || currentPatient?.allergies} />}
                {activeTab === "documents" && <DocumentsTab patient={currentPatient} documents={data?.documents || currentPatient?.documents} />}
                {activeTab === "insurance" && <InsuranceTab patient={currentPatient} insurance={data?.insurance || currentPatient?.insurance} />}
                {activeTab === "billing" && <BillingTab patient={currentPatient} billing={data?.billing || currentPatient?.billing} />}
                {activeTab === "admissions" && <AdmissionsTab patient={currentPatient} admissions={data?.admissions || currentPatient?.admissions} />}
                {activeTab === "vitals" && <VitalsTab patient={currentPatient} vitals={data?.vitals || currentPatient?.vitals} />}
                {(activeTab === "timeline" || activeTab === "activity") && <ActivityLogTab patient={currentPatient} activityLogs={data?.activityLogs || currentPatient?.activityLogs} />}
              </div>


              {/* Printable Document Container (Target for @media print matching Image 2) */}
              <PatientPrintSummary patient={currentPatient} data={data} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

