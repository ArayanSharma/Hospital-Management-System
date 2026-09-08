import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Upload, FileText, Check } from "lucide-react";

export default function UploadPolicyDocumentModal({ isOpen, onClose, policy, onSuccess }) {
  const [docType, setDocType] = useState("Policy Card / E-Card");
  const [docName, setDocName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  if (!policy) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(policy._id, {
      docType,
      docName: docName || docType,
      fileUrl: fileUrl || `https://storage.citycare.org/docs/${policy.policyNumber}_${Date.now()}.pdf`,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Policy Document"
      subtitle={`Policy No: ${policy.policyNumber} — Patient: ${policy.patientName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
        {/* Document Category */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Document Category</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Policy Card / E-Card">Policy Card / E-Card</option>
            <option value="Government ID Proof (Aadhaar/PAN)">Government ID Proof (Aadhaar/PAN)</option>
            <option value="Pre-Auth Approval Letter">Pre-Auth Approval Letter</option>
            <option value="Discharge Summary & Bills">Discharge Summary & Bills</option>
          </select>
        </div>

        {/* Document Display Title */}
        <div>
          <label className="block text-slate-700 font-bold mb-1">Document Title / File Description</label>
          <input
            type="text"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="e.g. Star Health E-Card 2026.pdf"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Upload Box Dropzone */}
        <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-6 text-center transition-colors cursor-pointer space-y-2">
          <Upload className="w-6 h-6 text-blue-600 mx-auto" />
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Upload & Save Document</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
