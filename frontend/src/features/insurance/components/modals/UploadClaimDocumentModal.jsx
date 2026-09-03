import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Upload, FileText, Check } from "lucide-react";

export default function UploadClaimDocumentModal({ isOpen, onClose, claim, onSuccess }) {
  const [category, setCategory] = useState("Hospital Discharge Summary");
  const [docName, setDocName] = useState("");

  if (!claim) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(claim._id || claim.claimNumber, {
      name: docName || category,
      category,
      url: `https://storage.citycare.org/claims/${claim.claimNumber}_${Date.now()}.pdf`,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Claim Supporting Document"
      subtitle={`Claim No: ${claim.claimNumber} — Patient: ${claim.patientName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        {/* Document Category */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Document Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Hospital Discharge Summary">Hospital Discharge Summary</option>
            <option value="Itemized Hospital Bills & Receipts">Itemized Hospital Bills & Receipts</option>
            <option value="Laboratory & Diagnostic Test Reports">Laboratory & Diagnostic Test Reports</option>
            <option value="TPA Pre-Auth Approval Document">TPA Pre-Auth Approval Document</option>
            <option value="Pharmacy Prescriptions & Receipts">Pharmacy Prescriptions & Receipts</option>
          </select>
        </div>

        {/* Document Display Name */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Document File Title</label>
          <input
            type="text"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="e.g. Discharge Summary IPD 2026.pdf"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Dropzone Box */}
        <div className="border-2 border-dashed border-slate-200 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/40 rounded-2xl p-6 text-center transition-colors cursor-pointer space-y-2">
          <Upload className="w-6 h-6 text-purple-600 mx-auto" />
          <p className="font-bold text-slate-800 text-xs">Click or Drag & Drop PDF / Image File</p>
          <p className="text-[10px] text-slate-400">Supports PDF, PNG, JPG (Max File Size: 10MB)</p>
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
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
