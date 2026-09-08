import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Disc, Layers, FileCode, CheckCircle2 } from "lucide-react";
import { formatDate, formatTime } from "../../../../utils/formatters.js";

export default function RadiologyStudyDetailsModal({ order, isOpen, onClose }) {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Radiology Study Details & DICOM Metadata"
      subtitle={`Study Instance UID #${order.orderId || order._id}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Disc className="w-6 h-6 text-purple-600 shrink-0" />
            <div>
              <p className="font-extrabold text-slate-900 text-sm">{order.modality || "X-Ray"} PACS Study</p>
              <p className="text-[11px] text-purple-800 font-semibold">Body Region: {order.bodyRegion || "Chest"}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 capitalize">
            {order.status || "In-Progress"}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">DICOM Series Count:</span>
            <span className="font-bold text-slate-800">4 Series (128 Slices)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">PACS Node Server:</span>
            <span className="font-bold text-slate-800">PACS-AE-SERVER-01</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Acquisition Date:</span>
            <span className="font-bold text-slate-800">
              {formatDate(order.scheduledAt || order.createdAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Contrast Dosage:</span>
            <span className="font-bold text-slate-800">{order.contrastRequired ? "50ml Omnipaque IV" : "N/A (Non-Contrast)"}</span>
          </div>
        </div>

        <div className="p-3 border border-slate-200 rounded-xl flex items-center gap-3">
          <FileCode className="w-8 h-8 text-slate-700 shrink-0" />
          <div>
            <p className="font-bold text-slate-800 font-mono text-[11px]">1.2.840.113619.2.55.3.{order._id?.slice(-8)}</p>
            <p className="text-[10px] text-slate-400">PACS DICOM Study UID</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
