import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { AlertTriangle, RotateCcw, FileText } from "lucide-react";

export default function ClaimRejectionDetailsModal({ isOpen, onClose, claim, onAppealSuccess }) {
  const [appealNotes, setAppealNotes] = useState("");
  const [showAppealForm, setShowAppealForm] = useState(false);

  if (!claim) return null;

  const handleAppealSubmit = (e) => {
    e.preventDefault();
    onAppealSuccess?.(claim._id || claim.claimNumber, {
      status: "Submitted",
      remarks: `Appealed & Resubmitted with justification: ${appealNotes}`,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Claim Rejection Audit Details"
      subtitle={`Claim No: ${claim.claimNumber} — Patient: ${claim.patientName}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs font-medium">
        {/* Rejection Notice Banner */}
        <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-rose-900 text-xs">TPA Claim Disallowance Notice</h4>
            <p className="text-[11px] text-rose-800 leading-relaxed font-semibold">
              {claim.rejectionReason || "Non-covered procedure per clause 4.2 of policy terms & conditions."}
            </p>
          </div>
        </div>

        {/* Claim Summary */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Claimed Amount:</span>
            <span className="font-bold text-slate-800">₹ {(Number(claim.claimAmount || 0)).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Insurance Provider:</span>
            <span className="font-semibold text-slate-800">{claim.providerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">TPA Name:</span>
            <span className="font-semibold text-slate-800">{claim.tpaName || "Health India TPA"}</span>
          </div>
        </div>

        {/* Appeal Form Toggle */}
        {showAppealForm ? (
          <form onSubmit={handleAppealSubmit} className="space-y-3 pt-1 border-t border-slate-100">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Appeal Justification & Resubmission Notes</label>
              <textarea
                rows={3}
                value={appealNotes}
                onChange={(e) => setAppealNotes(e.target.value)}
                placeholder="Provide medical justification or additional clinical records reference..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAppealForm(false)}
                className="px-3.5 py-1.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-blue-600 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Submit Appeal to TPA</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAppealForm(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Appeal / Resubmit Claim</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
