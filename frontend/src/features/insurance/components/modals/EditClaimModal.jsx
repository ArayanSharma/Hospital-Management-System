import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Save, AlertCircle } from "lucide-react";

export default function EditClaimModal({ isOpen, onClose, claim, onSuccess }) {
  const [claimAmount, setClaimAmount] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentSummary, setTreatmentSummary] = useState("");
  const [preAuthNumber, setPreAuthNumber] = useState("");
  const [admissionType, setAdmissionType] = useState("Outpatient (OPD)");

  useEffect(() => {
    if (claim) {
      setClaimAmount(claim.claimAmount || "");
      setDiagnosis(claim.diagnosis || "");
      setTreatmentSummary(claim.treatmentSummary || claim.remarks || "");
      setPreAuthNumber(claim.preAuthNumber || "");
      setAdmissionType(claim.admissionType || "Outpatient (OPD)");
    }
  }, [claim]);

  if (!claim) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(claim._id || claim.claimNumber, {
      claimAmount: Number(claimAmount),
      diagnosis,
      treatmentSummary,
      preAuthNumber,
      admissionType,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Claim Information"
      subtitle={`Claim No: ${claim.claimNumber} — Patient: ${claim.patientName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-amber-900 font-semibold text-[11px]">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Edits are permitted prior to TPA final claim settlement decision.</span>
        </div>

        {/* Claim Amount */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Claimed Amount (INR)</label>
          <input
            type="number"
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Admission Type */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Admission Type</label>
          <select
            value={admissionType}
            onChange={(e) => setAdmissionType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Outpatient (OPD)">Outpatient (OPD)</option>
            <option value="Inpatient (IPD)">Inpatient (IPD)</option>
            <option value="Day Care Procedure">Day Care Procedure</option>
            <option value="Emergency IPD">Emergency IPD</option>
          </select>
        </div>

        {/* Pre-Auth Number */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Pre-Authorization Approval Number</label>
          <input
            type="text"
            value={preAuthNumber}
            onChange={(e) => setPreAuthNumber(e.target.value)}
            placeholder="e.g. PA-998201"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Primary Clinical Diagnosis</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Treatment Summary */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Treatment Summary / Remarks</label>
          <textarea
            rows={2}
            value={treatmentSummary}
            onChange={(e) => setTreatmentSummary(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Claim Changes</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
