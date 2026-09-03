import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { FileText, Save } from "lucide-react";

export default function AddClaimNoteModal({ isOpen, onClose, claim, onSuccess }) {
  const [noteText, setNoteText] = useState("");

  if (!claim) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(claim._id || claim.claimNumber, noteText);
    setNoteText("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Internal Claim Note"
      subtitle={`Claim No: ${claim.claimNumber} — Patient: ${claim.patientName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        <div>
          <label className="block text-slate-700 font-bold mb-1">Internal Note / Remarks</label>
          <textarea
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Enter TPA query details, auditor remarks, or internal follow-up note..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Existing Notes Audit Log */}
        {claim.internalNotes && claim.internalNotes.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <h5 className="font-bold text-slate-900 text-[11px]">Previous Internal Notes</h5>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {claim.internalNotes.map((n, i) => (
                <div key={i} className="p-2 bg-slate-50 rounded-lg text-[10px] space-y-0.5">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{n.author || "Admin"}</span>
                    <span className="text-slate-400">{n.date ? new Date(n.date).toLocaleDateString() : "Today"}</span>
                  </div>
                  <p className="text-slate-600 font-medium">{n.noteText}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Footer */}
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
            <span>Save Internal Note</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
