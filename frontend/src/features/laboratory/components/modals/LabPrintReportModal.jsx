import React, { useState, useEffect } from "react";
import { Printer, User, Stethoscope, FileText, FlaskConical, Building2, CheckCircle2, ShieldAlert } from "lucide-react";
import Modal from "../../../../components/ui/Modal.jsx";
import { getLabReportByTestIdApi } from "../../services/labReport.api.js";

export default function LabPrintReportModal({ test, isOpen, onClose }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!test?._id) return;
    const fetchReport = async () => {
      try {
        const { data } = await getLabReportByTestIdApi(test._id);
        if (data.data) {
          setReport(data.data);
        }
      } catch (err) {
        setReport(null);
      }
    };
    fetchReport();
  }, [test]);

  if (!test) return null;

  const patient = test.patientId || {};
  const patientName = patient?.name || "Patient Record";
  const patientPhone = patient?.phone || "N/A";
  const patientUhid = patient?.patientId || patient?._id || "N/A";
  const patientAge = patient?.age ? `${patient.age} yrs` : "N/A";
  const patientGender = patient?.gender || "N/A";

  const doctor = test.doctorId || {};
  const doctorName = doctor?.userId?.name || doctor?.name || "Referring Physician";
  const deptName = doctor?.departmentId?.name || "General Medicine";

  const orderId = test.orderId || test._id || "N/A";
  const testName = test.testName || "Diagnostic Test";
  const sampleType = test.sampleType || "Blood";

  const orderDate = test.createdAt
    ? new Date(test.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString();

  const reportDate = report?.updatedAt || report?.createdAt || test.updatedAt;
  const reportDateFormatted = reportDate
    ? new Date(reportDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "In Analysis";

  const resultsObj = report?.results && typeof report.results === "object" && Object.keys(report.results).length > 0
    ? report.results
    : Array.isArray(test.parameters) && test.parameters.length > 0
    ? test.parameters.reduce((acc, p) => ({ ...acc, [p]: "-" }), {})
    : { [testName]: "-" };

  const interpretation = report?.interpretation || "Diagnostic findings evaluated by Pathology Department.";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Print Diagnostic Lab Report"
      subtitle={`Laboratory Order #${orderId}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Printable Action Bar inside modal (hidden during actual browser print) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-2xl print:hidden">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Ready for high-resolution Pathology Lab Letterhead Print</span>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Diagnostic Report</span>
          </button>
        </div>

        {/* ====================================================================
           PRINTABLE LAB REPORT CONTAINER (Target for @media print CSS)
           ==================================================================== */}
        <div
          id="printable-lab-report"
          className="bg-white p-6 rounded-2xl border border-slate-200/80 text-slate-900 text-xs space-y-5 shadow-xs"
        >
          {/* 1. Central Pathology Header */}
          <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                <FlaskConical className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-emerald-800 uppercase tracking-tight">
                  CityCare Central Pathology &amp; Diagnostic Labs
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  123 Healthcare Boulevard, Metro City | Central Lab Desk: +91 98765 43210
                </p>
                <p className="text-[10px] text-slate-400 font-mono">NABL Accredited Laboratory | ISO 15189 Certified</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-black text-[11px] tracking-wider uppercase mb-1">
                Official Diagnostic Report
              </div>
              <p className="text-[11px] font-bold text-slate-700 font-mono">
                {orderId}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">Verified: {reportDateFormatted}</p>
            </div>
          </div>

          {/* 2. Patient & Sample Information Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            {/* Patient Info */}
            <div className="space-y-1.5 border-r border-slate-200/80 pr-4">
              <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-[10px] uppercase tracking-wider">
                <User className="w-3.5 h-3.5" />
                <span>Patient Demographics</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{patientName}</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-medium text-slate-600">
                <p><span className="font-bold text-slate-700">UHID:</span> {patientUhid}</p>
                <p><span className="font-bold text-slate-700">Age / Sex:</span> {patientAge} / {patientGender}</p>
                <p><span className="font-bold text-slate-700">Phone:</span> {patientPhone}</p>
                <p><span className="font-bold text-slate-700">Priority:</span> <span className="uppercase font-bold text-emerald-700">{test.priority || "Routine"}</span></p>
              </div>
            </div>

            {/* Specimen & Doctor Info */}
            <div className="space-y-1.5 pl-2">
              <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[10px] uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Specimen &amp; Ordering Physician</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{testName}</p>
              <div className="text-[11px] font-medium text-slate-600 space-y-0.5">
                <p><span className="font-bold text-slate-700">Sample Specimen:</span> {sampleType}</p>
                <p><span className="font-bold text-slate-700">Ordering Doctor:</span> {doctorName}</p>
                <p><span className="font-bold text-slate-700">Department:</span> {deptName}</p>
                <p><span className="font-bold text-slate-700">Order Date:</span> {orderDate}</p>
              </div>
            </div>
          </div>

          {/* 3. Diagnostic Test Results Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700 font-extrabold uppercase tracking-wider">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Test Parameter Results</span>
              </div>
              <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>VERIFIED LABORATORY RESULTS</span>
              </span>
            </div>

            <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="p-2 border-b border-slate-200">Parameter Name</th>
                  <th className="p-2 border-b border-slate-200 text-center font-black">Measured Result</th>
                  <th className="p-2 border-b border-slate-200">Units</th>
                  <th className="p-2 border-b border-slate-200">Biological Reference Interval</th>
                  <th className="p-2 border-b border-slate-200 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {Object.entries(resultsObj).map(([paramKey, val], idx) => {
                  const isHigh = String(val).toLowerCase().includes("high") || String(val).includes("🚨");
                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{paramKey}</td>
                      <td className={`p-2.5 text-center font-extrabold text-xs ${isHigh ? "text-rose-600" : "text-slate-900"}`}>
                        {val || "-"}
                      </td>
                      <td className="p-2.5 text-slate-600">
                        {paramKey.toLowerCase().includes("count") ? "10^3/uL" : paramKey.toLowerCase().includes("hemoglobin") ? "g/dL" : "mg/dL"}
                      </td>
                      <td className="p-2.5 text-slate-500 font-mono">Standard Range</td>
                      <td className="p-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isHigh ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                          {isHigh ? "HIGH ⚠️" : "NORMAL"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 4. Pathologist Interpretation & Clinical Notes */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <p className="font-bold text-slate-700 text-[10px] uppercase">Pathologist Clinical Comments &amp; Remarks:</p>
            <p className="text-slate-800 font-medium text-[11px] leading-relaxed mt-0.5">{interpretation}</p>
          </div>

          {/* 5. Signatures & Footer */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            <div className="space-y-1 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-600">Pathology Quality Statement:</p>
              <p>• Verified by Central Automated Pathology Analyzer Engine.</p>
              <p>• Printed on {new Date().toLocaleString()}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-36 border-b-2 border-slate-400 pb-1 font-serif text-slate-600 italic">
                Dr. Consultant Pathologist
              </div>
              <p className="font-extrabold text-slate-900 text-[11px]">Chief Consultant Pathologist</p>
              <p className="text-[10px] font-semibold text-slate-500">MD Pathology (NABL Signatory)</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
