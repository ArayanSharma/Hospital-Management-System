import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import api from "../../../../lib/axios.js";

export default function LabUploadReportModal({ test, isOpen, onClose, onSuccess }) {
  const [fileUrl, setFileUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!test) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.patch(`/lab-tests/${test._id}`, {
        attachmentUrl: fileUrl || `https://hospital.org/reports/${test.orderId}.pdf`,
        clinicalNotes: remarks ? `${test.clinicalNotes || ""}\n[Upload Note]: ${remarks}` : test.clinicalNotes,
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload report attachment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Scanned Report / Document"
      subtitle={`Order #${test.orderId || test._id}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">Document URL / PDF Link</label>
          <input
            type="url"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://storage.hospital.com/lab-reports/report.pdf"
            className="w-full bg-white border border-slate-200 text-slate-800 p-2.5 rounded-xl focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">Attachment Remarks</label>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optional notes regarding the uploaded file..."
            className="w-full bg-white border border-slate-200 text-slate-800 p-2.5 rounded-xl focus:outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{submitting ? "Uploading..." : "Save Attachment"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
