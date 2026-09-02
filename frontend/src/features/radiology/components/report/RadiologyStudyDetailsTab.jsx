import React from "react";
import { UserCheck, Activity } from "lucide-react";

export default function RadiologyStudyDetailsTab({
  testName,
  modality,
  priority,
  orderId,
  studyDate,
  patientName,
  patientId,
  formData,
  setActiveTab,
}) {
  return (
    <div className="p-6 bg-slate-50/40 space-y-5">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">{testName}</h2>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-md text-[11px] border border-blue-200">
              {modality}
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md text-[11px] border border-emerald-200 capitalize">
              {priority} Priority
            </span>
          </div>
          <p className="text-slate-500 text-xs">
            Order ID: <span className="font-semibold text-blue-600">{orderId}</span> | Scheduled Date:{" "}
            <span className="font-semibold text-slate-800">{studyDate}</span>
          </p>
        </div>
        <button
          onClick={() => setActiveTab("report-entry")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <span>Go to Report Entry</span>
          <Activity className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Column Detail Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Card: Patient & Clinical Information */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-4 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Patient & Clinical Details</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
            <div>
              <span className="text-slate-400">Patient Name:</span>
              <p className="font-bold text-slate-900">{patientName}</p>
            </div>
            <div>
              <span className="text-slate-400">Patient ID:</span>
              <p className="font-semibold text-slate-800">{patientId}</p>
            </div>
            <div>
              <span className="text-slate-400">Age / Gender:</span>
              <p className="text-slate-800">32 Y / Male</p>
            </div>
            <div>
              <span className="text-slate-400">Referring Doctor:</span>
              <p className="font-medium text-slate-900">Dr. Neha Sharma</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
            <div>
              <p className="font-bold text-slate-900">Clinical Indication:</p>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                {formData.clinicalIndication}
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-900">Relevant History:</p>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                {formData.relevantHistory}
              </p>
            </div>
          </div>
        </div>

        {/* Right Card: DICOM & Scan Parameters */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-4 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>DICOM & Technical Parameters</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
            <div>
              <span className="text-slate-400">Modality:</span>
              <p className="font-semibold text-slate-900">{modality}</p>
            </div>
            <div>
              <span className="text-slate-400">Body Part / Region:</span>
              <p className="font-semibold text-slate-900">{formData.bodyPart} ({formData.bodyRegion})</p>
            </div>
            <div>
              <span className="text-slate-400">Views:</span>
              <p className="text-slate-800">{formData.views}</p>
            </div>
            <div>
              <span className="text-slate-400">Contrast Used:</span>
              <p className="text-slate-800">{formData.contrast}</p>
            </div>
            <div>
              <span className="text-slate-400">Image Quality:</span>
              <p className="text-slate-800">{formData.imageQuality}</p>
            </div>
            <div>
              <span className="text-slate-400">Study Reviewed:</span>
              <p className="font-bold text-emerald-600">{formData.studyReviewed ? "Yes (Verified)" : "Pending"}</p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <p className="font-bold text-slate-900 text-xs">Workflow Timeline:</p>
            <div className="flex items-center justify-between text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-medium text-slate-700">Ordered: 10:00 AM</span>
              <span className="font-medium text-slate-700">Scheduled: 10:15 AM</span>
              <span className="font-bold text-emerald-600">Completed: 10:45 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
