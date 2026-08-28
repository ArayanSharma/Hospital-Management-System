import React from "react";
import { Plus } from "lucide-react";

export default function OpdPrescriptionTab({ prescription, setPrescription }) {
  const addPrescriptionRow = () => {
    setPrescription([
      ...prescription,
      {
        medicineName: "",
        dosage: "1 tablet",
        frequency: "Twice Daily",
        duration: "5 Days",
        instructions: "After meals",
      },
    ]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-900">Rx Medicines</h4>
        <button
          type="button"
          onClick={addPrescriptionRow}
          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Medicine
        </button>
      </div>

      <div className="space-y-2">
        {prescription.map((med, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Medicine Name (e.g. Paracetamol 650mg)"
                value={med.medicineName}
                onChange={(e) => {
                  const updated = [...prescription];
                  updated[idx].medicineName = e.target.value;
                  setPrescription(updated);
                }}
                className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-800"
              />
              <input
                type="text"
                placeholder="Dosage (e.g. 1 tablet)"
                value={med.dosage}
                onChange={(e) => {
                  const updated = [...prescription];
                  updated[idx].dosage = e.target.value;
                  setPrescription(updated);
                }}
                className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Frequency (Twice Daily)"
                value={med.frequency}
                onChange={(e) => {
                  const updated = [...prescription];
                  updated[idx].frequency = e.target.value;
                  setPrescription(updated);
                }}
                className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
              />
              <input
                type="text"
                placeholder="Duration (5 Days)"
                value={med.duration}
                onChange={(e) => {
                  const updated = [...prescription];
                  updated[idx].duration = e.target.value;
                  setPrescription(updated);
                }}
                className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
              />
              <input
                type="text"
                placeholder="Instructions (After meals)"
                value={med.instructions}
                onChange={(e) => {
                  const updated = [...prescription];
                  updated[idx].instructions = e.target.value;
                  setPrescription(updated);
                }}
                className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
