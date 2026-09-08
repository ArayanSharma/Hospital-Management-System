import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { AlertTriangle, Lock, Save } from "lucide-react";

export default function EditPolicyModal({ isOpen, onClose, policy, onSuccess }) {
  const [formData, setFormData] = useState({
    providerName: "",
    policyNumber: "",
    coverageAmount: "",
    validFrom: "",
    validUntil: "",
    tpaName: "",
    notes: "",
  });

  const hasClaims = (policy?.claimsCount || 0) > 0;

  useEffect(() => {
    if (policy) {
      setFormData({
        providerName: policy.providerName || "",
        policyNumber: policy.policyNumber || "",
        coverageAmount: policy.coverageAmount || policy.sumInsured || 500000,
        validFrom: policy.validFrom ? new Date(policy.validFrom).toISOString().split("T")[0] : "",
        validUntil: policy.validUntil ? new Date(policy.validUntil).toISOString().split("T")[0] : "",
        tpaName: policy.tpaName || "Health India TPA Services Pvt. Ltd.",
        notes: policy.notes || "",
      });
    }
  }, [policy]);

  if (!policy) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(policy._id, formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Master Insurance Policy"
      subtitle={`Patient: ${policy.patientName} (${policy.uhid})`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        {/* Audit Lock Warning if Claims exist */}
        {hasClaims ? (
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-amber-900">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-xs">Critical Audit Lock Active</h5>
              <p className="text-[11px] text-amber-800 mt-0.5">
                This policy has active linked claims. Critical fields (Provider Name, Policy Number) are locked for audit & version control compliance.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-center gap-2 text-blue-900 font-semibold text-[11px]">
            <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Edits on active policy master data will create an immutable audit log entry in database.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Provider Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Insurance Provider Name</label>
            <input
              type="text"
              disabled={hasClaims}
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 ${
                hasClaims ? "opacity-60 cursor-not-allowed" : ""
              }`}
              required
            />
          </div>

          {/* Policy Number */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Policy Number</label>
            <input
              type="text"
              disabled={hasClaims}
              value={formData.policyNumber}
              onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 ${
                hasClaims ? "opacity-60 cursor-not-allowed" : ""
              }`}
              required
            />
          </div>

          {/* Coverage Amount */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Coverage Amount (INR)</label>
            <input
              type="number"
              value={formData.coverageAmount}
              onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* TPA Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">TPA Provider Name</label>
            <input
              type="text"
              value={formData.tpaName}
              onChange={(e) => setFormData({ ...formData, tpaName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Valid From */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Valid From Date</label>
            <input
              type="date"
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Valid Until */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Valid Until Date</label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Policy Details / Notes */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Policy Master Notes / Terms</label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional policy coverage details..."
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
            <span>Save Policy Changes</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
