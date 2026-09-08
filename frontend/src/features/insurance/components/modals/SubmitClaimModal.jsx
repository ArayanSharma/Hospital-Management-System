import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { ArrowUpRight, DollarSign, FileText } from "lucide-react";

export default function SubmitClaimModal({ isOpen, onClose, policy, onSuccess }) {
  const [claimType, setClaimType] = useState("Cashless Pre-Auth");
  const [claimedAmount, setClaimedAmount] = useState("");
  const [hospitalizationDate, setHospitalizationDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Vikram Patel");

  if (!policy) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(policy._id, {
      policyId: policy._id,
      policyNumber: policy.policyNumber,
      patientName: policy.patientName,
      uhid: policy.uhid,
      claimType,
      claimedAmount: Number(claimedAmount),
      hospitalizationDate,
      diagnosis,
      doctorName,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Insurance Claim"
      subtitle={`Policy No: ${policy.policyNumber} — Patient: ${policy.patientName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-center justify-between">
          <span className="text-slate-600">Available Sum Insured</span>
          <span className="font-extrabold text-blue-900 text-sm">
            ₹ {(Number(policy.coverageAmount || policy.sumInsured || 500000)).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Claim Type */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Claim Type</label>
          <select
            value={claimType}
            onChange={(e) => setClaimType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Cashless Pre-Auth">Cashless Pre-Authorization</option>
            <option value="Reimbursement">Reimbursement Claim</option>
            <option value="OPD Consultation">OPD Cashless Claim</option>
            <option value="Emergency IPD">Emergency IPD Cashless</option>
          </select>
        </div>

        {/* Claimed Amount */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Estimated Claimed Amount (INR)</label>
          <input
            type="number"
            min={100}
            value={claimedAmount}
            onChange={(e) => setClaimedAmount(e.target.value)}
            placeholder="e.g. 75000"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Hospitalization Date */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Hospitalization / Admission Date</label>
          <input
            type="date"
            value={hospitalizationDate}
            onChange={(e) => setHospitalizationDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Primary Diagnosis */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Primary Clinical Diagnosis / Procedure</label>
          <textarea
            rows={2}
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter clinical diagnosis, surgery or treatment details..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            required
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
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Submit Claim to TPA</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
