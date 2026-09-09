import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { FlaskConical, User, Stethoscope, FileText, Printer, Building2, Calendar, Activity } from "lucide-react";
import { formatDate, formatTime } from "../../../../utils/formatters.js";
import LabStatusBadge from "../LabStatusBadge.jsx";

export default function LabViewOrderModal({ test, isOpen, onClose }) {
  if (!isOpen || !test) return null;

  const orderIdNo = test.orderId || test._id || "LT-N/A";
  const patient = test.patientId;
  const patientName = patient?.name || test.patientName || "N/A";
  const patientPhone = patient?.phone || test.patientPhone || "N/A";
  const patientUhid = patient?.patientId || patient?._id || test.uhid || "N/A";
  const patientAge = patient?.age || test.age || "N/A";
  const patientGender = patient?.gender || test.gender || "N/A";

  const doctor = test.doctorId;
  const rawDoctorName = doctor?.userId?.name || doctor?.name || test.doctorName || "Physician";
  const doctorName = rawDoctorName.startsWith("Dr.") ? rawDoctorName : `Dr. ${rawDoctorName}`;
  const doctorSpec = doctor?.specialization || doctor?.departmentId?.name || "Pathology & Diagnostics";

  const testNameStr = test.testName || "Laboratory Diagnostic Panel";
  const sampleTypeStr = test.sampleType || "Clinical Specimen";
  const priorityStr = (test.priority || "Routine").toUpperCase();
  const statusStr = (test.status || "Pending").toUpperCase();
  const clinicalNotesStr = test.clinicalNotes || test.doctorNotes || "N/A";
  const orderDateStr = test.requestedAt || test.createdAt ? `${formatDate(test.requestedAt || test.createdAt)} ${formatTime(test.requestedAt || test.createdAt)}` : "N/A";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Laboratory Test Order Overview"
      subtitle={`Order Reference #${orderIdNo}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4 text-xs text-slate-700 font-medium">
        {/* Action Bar (hidden during print) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Ready to print official Laboratory Test Requisition Sheet</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Lab Requisition Order</span>
          </button>
        </div>

        {/* PRINTABLE CONTAINER (Target for @media print CSS) */}
        <div
          id="printable-lab-order"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* Hospital Letterhead Header */}
          <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-blue-700 uppercase tracking-tight">
                  CityCare Hospital &amp; Medical Research Center
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  Department of Pathology &amp; Clinical Laboratory
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Laboratory Requisition Order ID: {orderIdNo}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                Laboratory Requisition Order
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">{orderIdNo}</p>
              <p className="text-[10px] text-slate-400 font-medium">{orderDateStr}</p>
            </div>
          </div>

          {/* Section 1: Patient & Ordering Physician Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            {/* Patient Information */}
            <div className="space-y-1 border-r border-slate-200/80 pr-4">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Billed Patient Information</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{patientName}</p>
              <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">Patient UHID:</span> {patientUhid}</p>
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
                <p><span className="font-bold text-slate-700">Specialization:</span> {doctorSpec}</p>
                <p><span className="font-bold text-slate-700">Priority Level:</span> <span className="font-extrabold text-rose-600">{priorityStr}</span></p>
                <p><span className="font-bold text-slate-700">Requisition Status:</span> <span className="font-extrabold text-emerald-600">{statusStr}</span></p>
              </div>
            </div>
          </div>

          {/* Section 2: Laboratory Test & Specimen Specifications */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <FlaskConical className="w-4 h-4 text-blue-600" />
              <span>Requested Diagnostic Test &amp; Specimen Target</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-blue-50/40 p-3.5 rounded-xl border border-blue-200/60">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Diagnostic Panel / Test</p>
                <p className="font-extrabold text-blue-800 text-sm">{testNameStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Specimen / Sample Type</p>
                <p className="font-extrabold text-slate-900 text-sm">{sampleTypeStr}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold mb-0.5">Order Date &amp; Time</p>
                <p className="font-bold text-slate-800">{orderDateStr}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Test Parameters Checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Parameters Included for Pathology Analysis</span>
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Array.isArray(test.parameters) && test.parameters.length > 0 ? (
                test.parameters.map((p, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold">
                    {p}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold">
                  {testNameStr}
                </span>
              )}
            </div>
            {clinicalNotesStr !== "N/A" && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-extrabold text-slate-700">Clinical History &amp; Physician Notes:</span>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">{clinicalNotesStr}</p>
              </div>
            )}
          </div>

          {/* Section 4: Signatures */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-0.5 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Statutory Notice:</p>
              <p>• Laboratory requisition computer-generated via CityCare Hospital EMR System.</p>
              <p>• Printed on {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                {doctorName}
              </div>
              <p className="font-extrabold text-slate-900 text-[10px]">Ordering Doctor Signature</p>
              <p className="text-[10px] font-semibold text-slate-500">CityCare Laboratory Counter</p>
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
