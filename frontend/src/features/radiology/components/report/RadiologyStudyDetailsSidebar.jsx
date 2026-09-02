import React from "react";
import { FileText, Clock, Activity, CheckCircle2, XCircle, Check } from "lucide-react";

export default function RadiologyStudyDetailsSidebar({
  testName,
  modality,
  bodyRegion,
  patientName,
  patientId,
  orderId,
  studyDate,
  priority,
  formData,
  handleChange,
}) {
  return (
    <div className="lg:col-span-3 space-y-4">
      {/* Selected Radiology Study Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-2xs">
        <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
          SELECTED RADIOLOGY STUDY
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-start gap-2">
            <span className="text-slate-500">Radiology Test:</span>
            <span className="font-bold text-slate-900 text-right">{testName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Modality:</span>
            <span className="font-medium text-slate-900">{modality}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Body Region:</span>
            <span className="font-medium text-slate-900">{bodyRegion}</span>
          </div>
          <hr className="border-slate-100 my-1" />
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Patient:</span>
            <span className="font-bold text-slate-900">{patientName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Patient ID:</span>
            <span className="font-semibold text-slate-800">{patientId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Age / Gender:</span>
            <span className="text-slate-800">32 Y / Male</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Referring Doctor:</span>
            <span className="font-medium text-slate-900">Dr. Neha Sharma</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Order ID:</span>
            <span className="font-semibold text-blue-600">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Study Date:</span>
            <span className="text-slate-800">{studyDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Study Time:</span>
            <span className="text-slate-800">10:30 AM</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500">Priority:</span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-[10px] capitalize border border-emerald-200">
              {priority}
            </span>
          </div>
        </div>
      </div>

      {/* Report Status Workflow Timeline Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 space-y-3 shadow-2xs overflow-hidden">
        <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
          REPORT STATUS
        </h3>
        <div className="grid grid-cols-5 gap-0.5 relative pt-1 text-center">
          <div className="absolute top-3.5 left-3 right-3 h-0.5 bg-slate-200 -z-0"></div>

          {/* Step 1: Ordered */}
          <div className="flex flex-col items-center gap-1 z-10 min-w-0">
            <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <FileText className="w-3 h-3" />
            </div>
            <span className="text-[8.5px] font-semibold text-slate-600 leading-tight block text-center break-words whitespace-normal w-full">
              Ordered
            </span>
          </div>

          {/* Step 2: Scheduled */}
          <div className="flex flex-col items-center gap-1 z-10 min-w-0">
            <div className="w-6 h-6 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
              <Clock className="w-3 h-3" />
            </div>
            <span className="text-[8.5px] font-semibold text-slate-600 leading-tight block text-center break-words whitespace-normal w-full">
              Scheduled
            </span>
          </div>

          {/* Step 3: In-Progress */}
          <div className="flex flex-col items-center gap-1 z-10 min-w-0">
            <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Activity className="w-3 h-3" />
            </div>
            <span className="text-[8.5px] font-semibold text-slate-600 leading-tight block text-center break-words whitespace-normal w-full">
              In-Progress
            </span>
          </div>

          {/* Step 4: Completed */}
          <div className="flex flex-col items-center gap-1 z-10 min-w-0">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[8.5px] font-extrabold text-emerald-700 leading-tight block text-center break-words whitespace-normal w-full">
              Completed
            </span>
          </div>

          {/* Step 5: Cancelled */}
          <div className="flex flex-col items-center gap-1 z-10 min-w-0">
            <div className="w-6 h-6 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shrink-0">
              <XCircle className="w-3 h-3" />
            </div>
            <span className="text-[8.5px] font-semibold text-slate-400 leading-tight block text-center break-words whitespace-normal w-full">
              Cancelled
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Information Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-2.5 shadow-2xs">
        <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
          CLINICAL INFORMATION
        </h3>
        <div className="space-y-2 text-xs">
          <div>
            <p className="font-bold text-slate-900">Clinical Indication</p>
            <p className="text-slate-600 mt-0.5">{formData.clinicalIndication}</p>
          </div>
          <div>
            <p className="font-bold text-slate-900">Relevant History</p>
            <p className="text-slate-600 mt-0.5">{formData.relevantHistory}</p>
          </div>
          <div>
            <p className="font-bold text-slate-900">Examination / Technique</p>
            <p className="text-slate-600 mt-0.5">{formData.examinationTechnique}</p>
          </div>
        </div>
      </div>

      {/* Study Information Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-2.5 shadow-2xs">
        <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
          STUDY INFORMATION
        </h3>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Modality:</span>
            <span className="font-semibold text-slate-800">{modality}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Body Part:</span>
            <span className="font-semibold text-slate-800">{formData.bodyPart}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Views:</span>
            <span className="font-semibold text-slate-800">{formData.views}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Contrast:</span>
            <span className="text-slate-800">{formData.contrast}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Image Quality:</span>
            <span className="text-slate-800">{formData.imageQuality}</span>
          </div>
        </div>

        <button
          onClick={() => handleChange("studyReviewed", !formData.studyReviewed)}
          className={`w-full mt-3 py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition text-xs cursor-pointer ${
            formData.studyReviewed
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span>Study Reviewed</span>
          {formData.studyReviewed && <Check className="w-3.5 h-3.5 text-emerald-600" />}
        </button>
      </div>
    </div>
  );
}
