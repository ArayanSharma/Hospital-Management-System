import React, { useState, useEffect } from "react";
import { Download, FileText, Building2 } from "lucide-react";
import { formatGenderAge } from "../../../utils/formatters.js";
import { getLabReportByTestIdApi } from "../services/labReport.api.js";

export default function LabReportPreviewPanel({ test, report }) {
  const [fetchedReport, setFetchedReport] = useState(null);

  useEffect(() => {
    if (report) {
      setFetchedReport(report);
      return;
    }
    if (!test?._id) return;

    const loadReport = async () => {
      try {
        const { data } = await getLabReportByTestIdApi(test._id);
        if (data.data) {
          setFetchedReport(data.data);
        }
      } catch {
        setFetchedReport(null);
      }
    };
    loadReport();
  }, [test, report]);

  if (!test) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-slate-400 text-xs">
        Select a laboratory test order to preview report.
      </div>
    );
  }

  const activeReport = report || fetchedReport;
  const patient = test.patientId;
  const patientName = patient?.name || "Unregistered Patient";
  const patientUhid = patient?.patientId || "N/A";
  const genderAge = formatGenderAge(patient?.dateOfBirth, patient?.gender) || "N/A";

  const doctor = test.doctorId;
  const doctorName = doctor?.userId?.name || doctor?.name || "Unassigned";
  const testName = test.testName || "Laboratory Test";

  const isFinalized = test.status === "completed" || activeReport?.status === "finalized";
  const statusLabel = isFinalized ? "Report Finalized" : "Report not finalized";

  const getPreviewResults = () => {
    if (activeReport?.results && typeof activeReport.results === "object" && Object.keys(activeReport.results).length > 0) {
      return activeReport.results;
    }
    const emptyObj = {};
    const paramsList = Array.isArray(test.parameters) && test.parameters.length > 0
      ? test.parameters
      : ["Diagnostic Parameter 1", "Diagnostic Parameter 2"];
    
    paramsList.forEach((p) => {
      emptyObj[p] = "--";
    });
    return emptyObj;
  };

  const resultsObj = getPreviewResults();
  const interpretationText = activeReport?.interpretation || "Results pending entry by lab technician.";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      {/* Header & Status */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
          <FileText className="w-4 h-4 text-rose-500" />
          <span>Report Preview</span>
        </div>
        <span
          className={`text-[10px] font-semibold ${
            isFinalized ? "text-emerald-600 font-bold" : "text-slate-400 italic"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Realistic Miniature Printable Laboratory Report Card */}
      <div className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-3 space-y-2 text-[10px]">
        {/* CityCare Hospital Branding */}
        <div className="text-center border-b border-slate-200 pb-1.5 space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-blue-600 font-extrabold text-xs">
            <Building2 className="w-3.5 h-3.5" />
            <span>CityCare Hospital</span>
          </div>
          <p className="font-extrabold text-slate-900 tracking-wider uppercase text-[9px]">
            LABORATORY REPORT
          </p>
        </div>

        {/* Patient Details Grid */}
        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-slate-700 font-medium py-1 border-b border-slate-200/70">
          <div>
            <span className="text-slate-400 font-normal">Patient Name:</span>{" "}
            <span className="font-bold text-slate-900">{patientName}</span>
          </div>
          <div>
            <span className="text-slate-400 font-normal">Patient ID:</span>{" "}
            <span className="font-mono font-bold text-slate-900">{patientUhid}</span>
          </div>
          <div>
            <span className="text-slate-400 font-normal">Age / Gender:</span>{" "}
            <span className="font-semibold text-slate-800">{genderAge}</span>
          </div>
          <div>
            <span className="text-slate-400 font-normal">Doctor:</span>{" "}
            <span className="font-semibold text-slate-800">Dr. {doctorName.replace(/^Dr\.\s*/i, "")}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400 font-normal">Test:</span>{" "}
            <span className="font-bold text-slate-900">{testName}</span>
          </div>
        </div>

        {/* Mini Parameter Table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left border-collapse text-[9px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-1 px-1">Parameter</th>
                <th className="py-1 px-1 text-center font-extrabold text-slate-900">Result</th>
                <th className="py-1 px-1">Unit</th>
                <th className="py-1 px-1">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {Object.entries(resultsObj).map(([paramKey, resValue]) => (
                <tr key={paramKey}>
                  <td className="py-1 px-1 font-semibold text-slate-800">{paramKey}</td>
                  <td className="py-1 px-1 text-center font-bold text-slate-900">{resValue}</td>
                  <td className="py-1 px-1 text-slate-500">
                    {paramKey.toLowerCase().includes("count") ? "10^3/uL" : paramKey.toLowerCase().includes("hemoglobin") ? "g/dL" : "mg/dL"}
                  </td>
                  <td className="py-1 px-1 text-slate-500">Normal Range</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interpretation / Remarks */}
        <div className="pt-1.5 border-t border-slate-200 text-[10px]">
          <span className="font-bold text-slate-800">Interpretation / Remarks:</span>
          <p className="text-slate-600 italic mt-0.5">{interpretationText}</p>
        </div>
      </div>

      {/* Download PDF Button */}
      <button
        type="button"
        onClick={() => alert("Downloading official PDF Laboratory Report...")}
        className="w-full text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl py-2 font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Download (PDF)</span>
      </button>
    </div>
  );
}
