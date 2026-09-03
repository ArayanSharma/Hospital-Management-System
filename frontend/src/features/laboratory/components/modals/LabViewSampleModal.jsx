import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { TestTube, QrCode } from "lucide-react";
import { formatDate, formatTime } from "../../../../utils/formatters.js";

export default function LabViewSampleModal({ test, isOpen, onClose }) {
  if (!test) return null;

  const sampleType = test.sampleType || "Blood";
  const containerType = sampleType === "Blood" ? "EDTA Purple Top Tube" : sampleType === "Urine" ? "Sterile Urine Container" : `${sampleType} Specimen Container`;
  const storageTemp = sampleType === "Tissue" ? "-20°C Cryo Storage" : "2°C – 8°C (Refrigerated)";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sample Collection Details"
      subtitle={`Specimen ID #${test.orderId || test._id}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TestTube className="w-6 h-6 text-purple-600 shrink-0" />
            <div>
              <p className="font-extrabold text-slate-900 text-sm">{sampleType} Specimen</p>
              <p className="text-[11px] text-purple-800 font-semibold">Container: {containerType}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 capitalize">
            {test.status === "sample-collected" ? "Sample Collected" : test.status}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-200">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Collected At:</span>
            <span className="font-bold text-slate-800">
              {formatDate(test.updatedAt || test.createdAt)} {formatTime(test.updatedAt || test.createdAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Collected By:</span>
            <span className="font-bold text-slate-800">
              {test.checkedBy || test.labTechnicianName || "Lab Phlebotomist"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Storage Temp:</span>
            <span className="font-bold text-slate-800">{storageTemp}</span>
          </div>
        </div>

        <div className="p-3 border border-slate-200 rounded-xl flex items-center gap-3">
          <QrCode className="w-10 h-10 text-slate-700 shrink-0" />
          <div>
            <p className="font-bold text-slate-800 font-mono">SPECIMEN-BARCODE-{test.orderId || String(test._id).slice(-8).toUpperCase()}</p>
            <p className="text-[10px] text-slate-400">Barcode scanned & validated into LIMS system</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
