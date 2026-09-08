import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Scan, User, Stethoscope, Clock, FileText, Calendar, Activity } from "lucide-react";
import { formatDate, formatTime } from "../../../../utils/formatters.js";

export default function RadiologyViewOrderModal({ order, isOpen, onClose }) {
  if (!order) return null;

  const patient = order.patientId;
  const doctor = order.doctorId;
  const doctorName = doctor?.userId?.name || doctor?.name || order.doctorName || "N/A";
  const patientUhid = patient?.patientId || patient?._id || "N/A";
  const modality = order.modality || order.testType || "X-Ray";
  const bodyRegion = order.bodyRegion || order.bodyPart || "Chest";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Radiology Scan Order Overview"
      subtitle={`Scan Order Reference #${order.orderId || order._id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Header Card */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold shrink-0">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">{modality} Scan — {bodyRegion}</h4>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Priority: <span className="capitalize font-bold text-slate-900">{order.priority || "routine"}</span> | Status:{" "}
                <span className="capitalize font-bold text-purple-700">{order.status || "pending"}</span>
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
            {order.status || "Pending"}
          </span>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Patient Information</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">{patient?.name || order.patientName || "N/A"}</p>
            <p className="text-[11px] font-mono text-slate-500">UHID: {patientUhid}</p>
            <p className="text-[11px] text-slate-400">Phone: {patient?.phone || "N/A"}</p>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
              <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
              <span>Ordering Physician</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">
              {doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`}
            </p>
            <p className="text-[11px] font-semibold text-purple-700">{doctor?.specialization || "Radiologist / Physician"}</p>
            <p className="text-[11px] text-slate-400">Order Date: {formatDate(order.createdAt || new Date())}</p>
          </div>
        </div>

        {/* Schedule & Notes */}
        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            <span>Scan Schedule & Instructions</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500">Scheduled Date:</span>
              <p className="font-bold text-slate-800">{order.scheduledAt ? formatDate(order.scheduledAt) : "Not Scheduled Yet"}</p>
            </div>
            <div>
              <span className="text-slate-500">Contrast Required:</span>
              <p className="font-bold text-slate-800">{order.contrastRequired ? "Yes (IV Contrast)" : "No"}</p>
            </div>
          </div>
          {order.clinicalHistory && (
            <p className="text-slate-600 text-[11px] pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-700">Clinical History:</span> {order.clinicalHistory}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
