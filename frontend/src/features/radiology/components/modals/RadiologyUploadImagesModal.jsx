import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Upload, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import api from "../../../../lib/axios.js";

export default function RadiologyUploadImagesModal({ order, isOpen, onClose, onSuccess }) {
  const [fileUrl, setFileUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.patch(`/radiology-tests/${order._id}`, {
        imageUrls: [fileUrl || `https://pacs.hospital.org/dicom/${order.orderId}.dcm`],
        notes: remarks,
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to attach radiology scan images");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload / Attach Radiology DICOM Scans"
      subtitle={`Order #${order.orderId || order._id}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">PACS DICOM / Image URL</label>
          <input
            type="url"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://pacs.hospital.org/viewer?study=123"
            className="w-full bg-white border border-slate-200 text-slate-800 p-2.5 rounded-xl focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">Image Acquisition Notes</label>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Technician acquisition remarks..."
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
            <span>{submitting ? "Attaching..." : "Save Scan Images"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
