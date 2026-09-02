import React from "react";
import { Building2, Download, ImageIcon, FileText } from "lucide-react";
import { downloadRadiologyReportPdf } from "../../helpers/radiologyPdfHelper.js";

export default function RadiologyReportPreviewCard({
  reportStatus,
  patientName,
  patientId,
  testName,
  modality,
  bodyRegion,
  studyDate,
  orderId,
  formData,
  selectedOrder,
}) {
  const pAge = selectedOrder?.patientId?.dateOfBirth
    ? `${new Date().getFullYear() - new Date(selectedOrder.patientId.dateOfBirth).getFullYear()} Y`
    : "N/A";
  const pGender = selectedOrder?.patientId?.gender || "N/A";
  const ageGender = selectedOrder?.ageGender || `${pAge} / ${pGender}`;

  const doctorName = selectedOrder?.doctorName || selectedOrder?.doctorId?.userId?.name || selectedOrder?.doctorId?.name || formData?.checkedByName || "Ordering Physician";

  const studyTime = selectedOrder?.scheduledAt
    ? new Date(selectedOrder.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "N/A";

  const hasReportContent = Boolean(
    formData?.findings?.trim() ||
    formData?.technique?.trim() ||
    formData?.impression?.trim() ||
    formData?.images?.length > 0
  );

  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
        {/* Preview Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">Report Preview</h2>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            {reportStatus === "finalized" ? "Report Finalized" : "Draft Preview"}
          </span>
        </div>

        {/* PRINTABLE REPORT PREVIEW CONTAINER */}
        <div
          id="radiology-report-preview-card"
          className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-4 text-[11px] leading-relaxed"
        >
          {/* Hospital Header Logo Branding */}
          <div className="text-center space-y-0.5 border-b border-slate-100 pb-3">
            <div className="flex items-center justify-center gap-1.5 text-blue-600 font-extrabold text-sm">
              <Building2 className="w-4 h-4" />
              <span>CityCare Hospital</span>
            </div>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              RADIOLOGY REPORT
            </p>
          </div>

          {/* Patient & Study Details Grid */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
            <div>
              <span className="text-slate-400">Patient Name:</span>
              <span className="font-bold text-slate-900 ml-1.5">{patientName || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-400">Patient ID:</span>
              <span className="font-semibold text-slate-800 ml-1.5">{patientId || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-400">Age / Gender:</span>
              <span className="text-slate-800 ml-1.5">{ageGender}</span>
            </div>
            <div>
              <span className="text-slate-400">Referring Doctor:</span>
              <span className="font-medium text-slate-900 ml-1.5">{doctorName}</span>
            </div>
            <div>
              <span className="text-slate-400">Study:</span>
              <span className="font-bold text-slate-900 ml-1.5">{testName || "Radiology Examination"}</span>
            </div>
            <div>
              <span className="text-slate-400">Modality:</span>
              <span className="text-slate-800 ml-1.5">{modality || "X-Ray"}</span>
            </div>
            <div>
              <span className="text-slate-400">Body Region:</span>
              <span className="text-slate-800 ml-1.5">{bodyRegion || "Chest"}</span>
            </div>
            <div>
              <span className="text-slate-400">Study Date:</span>
              <span className="text-slate-800 ml-1.5">{studyDate || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-400">Study Time:</span>
              <span className="text-slate-800 ml-1.5">{studyTime}</span>
            </div>
            <div>
              <span className="text-slate-400">Order ID:</span>
              <span className="font-semibold text-slate-800 ml-1.5">{orderId || "N/A"}</span>
            </div>
          </div>

          {/* Scan Image Preview Thumbnail - Only rendered if user attached real scan images */}
          {formData?.images && formData.images.length > 0 ? (
            <div className="bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-1 my-2">
              <img
                src={formData.images[0]}
                alt="Radiology Scan Preview"
                className="w-full h-44 object-cover rounded-lg opacity-90 hover:opacity-100 transition"
              />
            </div>
          ) : (
            <div className="py-3 px-2 rounded-xl bg-slate-50 border border-slate-100 text-center text-slate-400 text-[10px] flex items-center justify-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>No Scan Images Attached</span>
            </div>
          )}

          {/* Live Formatted Report Text Sections */}
          {!hasReportContent ? (
            <div className="py-6 text-center text-slate-400 text-xs border-t border-slate-100 mt-2">
              <FileText className="w-6 h-6 mx-auto mb-1 opacity-40" />
              <p className="font-medium text-slate-600">No Report Content Entered Yet</p>
              <p className="text-[10px] text-slate-400">Fill in findings and technique in the form to generate preview.</p>
            </div>
          ) : (
            <div className="space-y-2 text-[11px] pt-1 border-t border-slate-100">
              {formData.technique && (
                <div>
                  <p className="font-bold text-slate-900">Technique:</p>
                  <p className="text-slate-700">{formData.technique}</p>
                </div>
              )}
              {formData.findings && (
                <div>
                  <p className="font-bold text-slate-900">Findings:</p>
                  <p className="text-slate-700 whitespace-pre-line">{formData.findings}</p>
                </div>
              )}
              {formData.impression && (
                <div>
                  <p className="font-bold text-slate-900">Impression:</p>
                  <p className="text-slate-700">{formData.impression}</p>
                </div>
              )}
              {formData.recommendations && (
                <div>
                  <p className="font-bold text-slate-900">Recommendations:</p>
                  <p className="text-slate-700">{formData.recommendations}</p>
                </div>
              )}
              {formData.additionalNotes && (
                <div>
                  <p className="font-bold text-slate-900">Additional Notes:</p>
                  <p className="text-slate-700">{formData.additionalNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Download Report (PDF) Action Button */}
        <button
          type="button"
          onClick={() => downloadRadiologyReportPdf("radiology-report-preview-card", `${orderId}_Radiology_Report.pdf`)}
          className="w-full py-2.5 px-4 bg-white border border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 flex items-center justify-center gap-2 transition shadow-2xs text-xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Download Report (PDF)</span>
        </button>
      </div>
    </div>
  );
}
