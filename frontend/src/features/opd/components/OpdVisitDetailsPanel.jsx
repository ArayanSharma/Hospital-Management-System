import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { updateOPDVisitApi } from "../services/opdVisit.api.js";
import OpdPatientSummaryHeader from "./OpdPatientSummaryHeader.jsx";
import OpdVitalsTab from "./OpdVitalsTab.jsx";
import OpdClinicalNotesTab from "./OpdClinicalNotesTab.jsx";
import OpdPrescriptionTab from "./OpdPrescriptionTab.jsx";
import OpdBillsSummaryTab from "./OpdBillsSummaryTab.jsx";

export default function OpdVisitDetailsPanel({ visit, onClose, onUpdateSuccess }) {
  const [activeTab, setActiveTab] = useState("vitals");
  const [saving, setSaving] = useState(false);

  // Editable Form State
  const [symptoms, setSymptoms] = useState(visit?.symptoms || "High fever, Dry cough for 3 days, Body ache");
  const [diagnosis, setDiagnosis] = useState(visit?.diagnosis || "Acute Viral Bronchitis");
  const [notes, setNotes] = useState(visit?.notes || "Rest advised. Drink warm fluids. Take medicines as prescribed.");

  const [vitals, setVitals] = useState({
    temperature: visit?.vitals?.temperature ?? 98.6,
    bloodPressure: visit?.vitals?.bloodPressure ?? "120/80",
    pulse: visit?.vitals?.pulse ?? 78,
    weight: visit?.vitals?.weight ?? 65.2,
    height: visit?.vitals?.height ?? 165,
    spO2: visit?.vitals?.spO2 ?? 98,
  });

  const [prescription, setPrescription] = useState(
    visit?.prescription && visit.prescription.length > 0
      ? visit.prescription
      : [
          {
            medicineName: "Paracetamol 650mg",
            dosage: "1 tablet",
            frequency: "Twice Daily",
            duration: "5 Days",
            instructions: "After meals",
          },
        ]
  );

  if (!visit) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400 text-xs shadow-2xs">
        Select a visit record to view consultation details.
      </div>
    );
  }

  const handleSave = async (newStatus) => {
    setSaving(true);
    try {
      await updateOPDVisitApi(visit._id, {
        symptoms,
        diagnosis,
        notes,
        vitals,
        prescription,
        status: newStatus || visit.status,
      });
      if (onUpdateSuccess) onUpdateSuccess();
      alert(`Visit successfully ${newStatus === "completed" ? "completed" : "saved as draft"}!`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update visit details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden flex flex-col space-y-4 p-4">
      {/* Header & Status Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">Visit Details</h3>
          <span className="font-mono text-xs font-semibold text-slate-400">
            {visit.visitId || "VIS-20260826-001"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {visit.status === "in-progress" && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
              In-Progress
            </span>
          )}
          {visit.status === "completed" && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              Completed
            </span>
          )}
          {visit.status === "walk-in" && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 text-pink-600 border border-pink-200">
              Walk-in
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Patient & Consultation Summary Header */}
      <OpdPatientSummaryHeader visit={visit} />

      {/* Detail Tabs Bar */}
      <div className="border-b border-slate-100 flex items-center gap-5 text-xs font-semibold pt-1">
        <button
          onClick={() => setActiveTab("vitals")}
          className={`pb-2 border-b-2 transition cursor-pointer ${
            activeTab === "vitals"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Vitals
        </button>

        <button
          onClick={() => setActiveTab("clinical-notes")}
          className={`pb-2 border-b-2 transition cursor-pointer ${
            activeTab === "clinical-notes"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Clinical Notes
        </button>

        <button
          onClick={() => setActiveTab("prescription")}
          className={`pb-2 border-b-2 transition cursor-pointer ${
            activeTab === "prescription"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Prescription
        </button>

        <button
          onClick={() => setActiveTab("bills")}
          className={`pb-2 border-b-2 transition cursor-pointer ${
            activeTab === "bills"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Bills &amp; Summary
        </button>
      </div>

      {/* Active Tab View */}
      <div className="flex-1">
        {activeTab === "vitals" && (
          <OpdVitalsTab
            vitals={vitals}
            symptoms={symptoms}
            setSymptoms={setSymptoms}
            diagnosis={diagnosis}
            setDiagnosis={setDiagnosis}
            notes={notes}
            setNotes={setNotes}
          />
        )}
        {activeTab === "clinical-notes" && (
          <OpdClinicalNotesTab
            symptoms={symptoms}
            setSymptoms={setSymptoms}
            diagnosis={diagnosis}
            setDiagnosis={setDiagnosis}
            notes={notes}
            setNotes={setNotes}
          />
        )}
        {activeTab === "prescription" && (
          <OpdPrescriptionTab
            prescription={prescription}
            setPrescription={setPrescription}
          />
        )}
        {activeTab === "bills" && <OpdBillsSummaryTab />}
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => handleSave("in-progress")}
          disabled={saving}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
        >
          Save as Draft
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("prescription");
            handleSave("in-progress");
          }}
          disabled={saving}
          className="px-3.5 py-2 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition cursor-pointer"
        >
          Generate Prescription
        </button>

        <button
          type="button"
          onClick={() => handleSave("completed")}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm shadow-emerald-500/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Complete Visit</span>
        </button>
      </div>
    </div>
  );
}
