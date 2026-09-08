import React from "react";
import Modal from "../../../components/ui/Modal.jsx";
import { ClipboardList, Pill, Calendar, User, FileText } from "lucide-react";
import { formatDate } from "../../../utils/formatters.js";

export default function MedicineUsageHistoryModal({ item, isOpen, onClose }) {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Prescription & Usage History"
      subtitle={`${item.name} (${item.code || "MED-0000"}) — Brand: ${item.brandName || "Generic"}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        {/* Header Summary */}
        <div className="p-3.5 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">{item.name}</p>
              <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                Category: {item.category || "General"} | Dosage: {item.dosageForm || "Tablet"}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white text-blue-700 border border-blue-200">
            {item.status || "Active"}
          </span>
        </div>

        {/* Prescription History Timeline */}
        <div className="space-y-2">
          <p className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <span>Recent OPD / IPD Prescription History Log</span>
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2 max-h-60 overflow-y-auto">
            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="leading-tight">
                <p className="font-bold text-slate-800">OPD Prescription #RX-2026-089</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Prescribed by Dr. Rakesh Sharma to Rahul Verma</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 font-mono">10 Qty (1-0-1)</span>
            </div>

            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="leading-tight">
                <p className="font-bold text-slate-800">IPD Ward Medication Chart #ADM-104</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Prescribed by Dr. Ananya Gupta to Priya Patel</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 font-mono">15 Qty (1-1-1)</span>
            </div>

            <div className="p-2.5 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div className="leading-tight">
                <p className="font-bold text-slate-800">Pharmacy Counter Dispensed Order #PS-4402</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Dispensed to Walk-in Patient</p>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 font-mono">6 Qty (0-0-1)</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-100/70 border border-slate-200/60 rounded-xl text-[11px] text-slate-500">
          <p className="font-semibold text-slate-700">Note on Deactivated / Archived Status:</p>
          <p className="mt-0.5">Deactivating a medicine removes it from future prescription selection while retaining all historical prescription logs.</p>
        </div>
      </div>
    </Modal>
  );
}
