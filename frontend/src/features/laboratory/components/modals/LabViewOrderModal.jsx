import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { FlaskConical, User, Stethoscope, FileText } from "lucide-react";
import { formatDate, formatTime } from "../../../../utils/formatters.js";
import LabStatusBadge from "../LabStatusBadge.jsx";

export default function LabViewOrderModal({ test, isOpen, onClose }) {
  if (!test) return null;

  const patient = test.patientId;
  const doctor = test.doctorId;
  const doctorName = doctor?.userId?.name || doctor?.name || "N/A";
  const patientUhid = patient?.patientId || patient?._id || "N/A";
  const doctorSpec = doctor?.specialization || doctor?.departmentId?.name || "General Practitioner";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Laboratory Test Order Overview"
      subtitle={`Order Reference #${test.orderId || test._id}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Top Header Card */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">{test.testName}</h4>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Sample Type: <span className="text-slate-800 font-bold">{test.sampleType || "Blood"}</span> | Priority:{" "}
                <span className="capitalize font-bold text-slate-900">{test.priority || "routine"}</span>
              </p>
            </div>
          </div>
          <LabStatusBadge status={test.status} />
        </div>

        {/* Patient & Doctor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Patient Information</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">{patient?.name || "N/A"}</p>
            <p className="text-[11px] font-mono text-slate-500">UHID: {patientUhid}</p>
            <p className="text-[11px] text-slate-400">Phone: {patient?.phone || "N/A"}</p>
          </div>

          <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
              <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
              <span>Ordering Doctor</span>
            </div>
            <p className="font-bold text-slate-900 text-sm">
              {doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`}
            </p>
            <p className="text-[11px] font-semibold text-purple-700">{doctorSpec}</p>
            <p className="text-[11px] text-slate-400">Order Date: {formatDate(test.requestedAt || test.createdAt)} ({formatTime(test.requestedAt || test.createdAt)})</p>
          </div>
        </div>

        {/* Parameters Checklist */}
        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Test Parameters to Analyze</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {Array.isArray(test.parameters) && test.parameters.length > 0 ? (
              test.parameters.map((p, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold">
                  {p}
                </span>
              ))
            ) : (
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold">
                {test.testName}
              </span>
            )}
          </div>
          {test.clinicalNotes && (
            <p className="text-slate-600 text-[11px] pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-700">Doctor Notes:</span> {test.clinicalNotes}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
