import React from "react";
import { AlertCircle, FlaskConical } from "lucide-react";
import { formatDate, formatTime, formatGenderAge, getInitials } from "../../../utils/formatters.js";
import LabResultsEntryForm from "./LabResultsEntryForm.jsx";

export default function FullResultsEntryView({
  test,
  onSaveResults,
  onFinalizeReport,
  onCollectSample,
  submitting,
}) {
  if (!test) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400 text-xs">
        Select a laboratory test order to enter results.
      </div>
    );
  }

  const patient = test.patientId;
  const patientName = patient?.name || "Unregistered Patient";
  const patientUhid = patient?.patientId || "N/A";
  const genderAge = formatGenderAge(patient?.dateOfBirth, patient?.gender) || "N/A";
  const orderIdDisplay = test.orderId || "N/A";
  const testName = test.testName || "Laboratory Test";
  const sampleType = test.sampleType || "Blood";
  const isPending = test.status === "pending";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* Title Header & Status Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900">Enter Test Results</h3>
      </div>

      {/* Patient & Order Header Summary Bar */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          {patient?.photoUrl ? (
            <img
              src={patient.photoUrl}
              alt={patientName}
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
              {getInitials(patientName)}
            </div>
          )}
          <div className="leading-tight">
            <p className="font-bold text-slate-900 text-sm">{patientName}</p>
            <p className="text-[11px] text-slate-400 font-medium">{patientUhid} | {genderAge}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-semibold">
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Order ID</p>
            <p className="font-mono font-bold text-slate-900">{orderIdDisplay}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Test Name</p>
            <p className="font-bold text-slate-900">{testName}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Sample Type</p>
            <p className="font-bold text-slate-900">{sampleType}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Priority</p>
            {test.priority === "emergency" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">Emergency</span>
            ) : test.priority === "urgent" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">Urgent</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Routine</span>
            )}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium">Order Date</p>
            <p className="font-bold text-slate-900">{formatDate(test.requestedAt || test.createdAt)}</p>
            <p className="text-[10px] text-slate-400 font-normal">{formatTime(test.requestedAt || test.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Warning for Pending Sample Collection */}
      {isPending && (
        <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-xl flex items-center justify-between gap-3 text-amber-800 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Sample collection is pending for this order. Please collect the sample before entering results.</span>
          </div>
          <button
            type="button"
            onClick={() => onCollectSample(test._id)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs cursor-pointer flex items-center gap-1 shrink-0"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Collect Sample Now</span>
          </button>
        </div>
      )}

      {/* Reusable Form */}
      <LabResultsEntryForm
        test={test}
        onSaveResults={onSaveResults}
        onFinalizeReport={onFinalizeReport}
        submitting={submitting}
      />
    </div>
  );
}
