import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Scan, User, Stethoscope, Clock, FileText, Calendar, Activity, Printer, Building2 } from "lucide-react";
import { formatDate, formatTime } from "../../../../utils/formatters.js";

export default function RadiologyViewOrderModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const orderIdNo = order.orderId || order._id || "RO-N/A";
  const patient = order.patientId;
  const patientName = patient?.name || order.patientName || "N/A";
  const patientPhone = patient?.phone || order.patientPhone || "N/A";
  const patientUhid = patient?.patientId || patient?._id || order.uhid || "N/A";
  const patientAge = patient?.age || order.age || "N/A";
  const patientGender = patient?.gender || order.gender || "N/A";

  const doctor = order.doctorId;
  const rawDoctorName = doctor?.userId?.name || doctor?.name || order.doctorName || "Physician";
  const doctorName = rawDoctorName.startsWith("Dr.") ? rawDoctorName : `Dr. ${rawDoctorName}`;
  const doctorSpecialization = doctor?.specialization || "Radiology & Imaging Specialist";

  const modality = order.modality || order.testType || "Radiology Imaging";
  const bodyRegion = order.bodyRegion || order.bodyPart || "General Area";
  const priorityStr = (order.priority || "Routine").toUpperCase();
  const statusStr = (order.status || "Pending").toUpperCase();
  const clinicalHistory = order.clinicalHistory || order.clinicalNotes || "N/A";
  const scheduledDateStr = order.scheduledAt ? formatDate(order.scheduledAt) : "Pending Scheduling";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Radiology Imaging Scan Order Overview"
      subtitle={`Scan Order Reference #${orderIdNo}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs text-slate-700 font-medium">
        {/* Printable Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-purple-600" />
            <span>Ready to print official Radiology Order &amp; Requisition Sheet</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Radiology Order</span>
          </button>
        </div>

        {/* PRINTABLE CONTAINER (Target for @media print CSS) */}
        <div
          id="printable-radiology-order"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* Hospital Letterhead Header */}
          <div className="flex items-start justify-between border-b-2 border-purple-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-purple-700 uppercase tracking-tight">
                  CityCare Hospital &amp; Medical Research Center
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  Department of Radio-Diagnosis &amp; Advanced Imaging
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Radiology Requisition Order ID: {orderIdNo}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                Radiology Requisition Order
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">{orderIdNo}</p>
              <p className="text-[10px] text-slate-400 font-medium">
                {formatDate(order.createdAt || new Date())}
              </p>
            </div>
          </div>

          {/* Section 1: Patient & Ordering Physician Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            {/* Patient Information */}
            <div className="space-y-1 border-r border-slate-200/80 pr-4">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Patient Demographics</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{patientName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">UHID:</span> {patientUhid}</p>
                <p><span className="font-bold text-slate-700">Age / Gender:</span> {patientAge} Y / {patientGender}</p>
                <p><span className="font-bold text-slate-700">Phone Number:</span> {patientPhone}</p>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="space-y-1 pl-2">
              <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-[10px] uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Ordering Physician</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{doctorName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Specialization:</span> {doctorSpecialization}</p>
                <p><span className="font-bold text-slate-700">Order Priority:</span> <span className="font-extrabold text-purple-700">{priorityStr}</span></p>
                <p><span className="font-bold text-slate-700">Scan Status:</span> <span className="font-extrabold text-emerald-600">{statusStr}</span></p>
              </div>
            </div>
          </div>

          {/* Section 2: Scan Modality & Body Region Specifications */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Scan className="w-4 h-4 text-purple-600" />
              <span>Requested Imaging Modality &amp; Anatomical Target</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-purple-50/40 p-3.5 rounded-xl border border-purple-200/60">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Modality Type</p>
                <p className="font-extrabold text-purple-800 text-sm">{modality}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Anatomical Body Region</p>
                <p className="font-extrabold text-slate-900 text-sm">{bodyRegion}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">IV Contrast Required</p>
                <p className="font-bold text-slate-800">{order.contrastRequired ? "Yes (IV Contrast)" : "No Contrast"}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Scheduled Date &amp; Time</p>
                <p className="font-bold text-slate-800">{scheduledDateStr}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Clinical History / Indications</p>
                <p className="font-medium text-slate-800 leading-relaxed bg-white p-2 rounded-lg border border-purple-100">{clinicalHistory}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Signatures */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-0.5 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Requisition Note:</p>
              <p>• Digital order computer-generated via CityCare Hospital EMR System.</p>
              <p>• Printed on {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                {doctorName}
              </div>
              <p className="font-extrabold text-slate-900 text-[10px]">Ordering Physician Signature</p>
              <p className="text-[10px] font-semibold text-slate-500">CityCare Radiology Desk</p>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2 flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
