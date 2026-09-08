import React, { useState, useEffect } from "react";
import { CheckCircle2, Save, ChevronDown } from "lucide-react";
import { getLabReportByTestIdApi } from "../services/labReport.api.js";
import { TECHNICIAN_OPTIONS, CHECKED_BY_OPTIONS, TEST_PARAMETER_MAP } from "../constants/labConstants.js";
import LabStatusBadge from "./LabStatusBadge.jsx";

export default function LabResultsEntryForm({
  test,
  onSaveResults,
  onFinalizeReport,
  submitting,
  compact = false,
}) {
  const [paramRows, setParamRows] = useState([]);
  const [interpretation, setInterpretation] = useState("");
  const [technician, setTechnician] = useState(TECHNICIAN_OPTIONS[0]);
  const [checkedBy, setCheckedBy] = useState("");
  const [reportStatus, setReportStatus] = useState("draft");
  const [validationErr, setValidationErr] = useState("");

  useEffect(() => {
    if (!test?._id) return;

    const buildDynamicDefaultParams = () => {
      const pList = Array.isArray(test.parameters) && test.parameters.length > 0
        ? test.parameters
        : TEST_PARAMETER_MAP[test.testName] || TEST_PARAMETER_MAP["Lipid Profile"];

      return pList.map((param) => ({
        parameter: param,
        result: "",
        unit: param.toLowerCase().includes("count") ? "10^3/uL" : param.toLowerCase().includes("hemoglobin") ? "g/dL" : "mg/dL",
        reference: "Normal Range",
      }));
    };

    const fetchExistingReport = async () => {
      try {
        const { data } = await getLabReportByTestIdApi(test._id);
        const r = data.data;
        if (r) {
          setReportStatus(r.status || "draft");
          if (r.interpretation) setInterpretation(r.interpretation);
          if (r.results && typeof r.results === "object") {
            const keys = Object.keys(r.results);
            if (keys.length > 0) {
              const mapped = keys.map((k) => ({
                parameter: k,
                result: r.results[k],
                unit: "mg/dL",
                reference: "Normal Range",
              }));
              setParamRows(mapped);
              return;
            }
          }
        }
        setParamRows(buildDynamicDefaultParams());
        setInterpretation("");
        setReportStatus("draft");
      } catch {
        setParamRows(buildDynamicDefaultParams());
        setInterpretation("");
        setReportStatus("draft");
      }
    };

    fetchExistingReport();
  }, [test]);

  if (!test) return null;

  const isFinalized = reportStatus === "finalized";

  const handleParamChange = (index, value) => {
    const updated = [...paramRows];
    updated[index].result = value;
    setParamRows(updated);
    setValidationErr("");
  };

  const handleSave = (statusToSet = "draft") => {
    if (statusToSet === "finalized") {
      const hasEmpty = paramRows.some((r) => !String(r.result).trim());
      if (hasEmpty) {
        setValidationErr("All test parameter result values are required before finalizing the report.");
        return;
      }
    }

    const resultsObj = {};
    paramRows.forEach((row) => {
      resultsObj[row.parameter] = row.result;
    });

    if (statusToSet === "finalized") {
      onFinalizeReport({ results: resultsObj, interpretation, technician, checkedBy });
    } else {
      onSaveResults({ results: resultsObj, interpretation, technician, checkedBy });
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Parameter Inputs Table */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-2 px-3">Parameter</th>
              <th className="py-2 px-3 w-32">Result</th>
              <th className="py-2 px-3">Unit</th>
              <th className="py-2 px-3">Reference Range</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
            {paramRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="py-2.5 px-3 font-bold text-slate-900">{row.parameter}</td>
                <td className="py-1.5 px-3">
                  <input
                    type="text"
                    value={row.result}
                    placeholder="Enter result"
                    disabled={isFinalized}
                    onChange={(e) => handleParamChange(idx, e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500 text-center shadow-2xs disabled:bg-slate-50"
                  />
                </td>
                <td className="py-2.5 px-3 text-slate-500 font-medium">{row.unit}</td>
                <td className="py-2.5 px-3 text-slate-500 font-medium">{row.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interpretation / Remarks */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-800">Interpretation / Remarks</label>
        <textarea
          rows={compact ? 2 : 3}
          value={interpretation}
          disabled={isFinalized}
          onChange={(e) => setInterpretation(e.target.value)}
          placeholder="Enter detailed test result interpretation and clinical observation notes..."
          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none resize-none font-medium disabled:bg-slate-50"
        />
      </div>

      {/* Technician & Checked By Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Technician <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={technician}
              disabled={isFinalized}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-semibold pl-3 pr-8 py-1.5 rounded-xl focus:outline-none appearance-none cursor-pointer text-xs disabled:bg-slate-50"
            >
              {TECHNICIAN_OPTIONS.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Checked By (Optional)</label>
          <div className="relative">
            <select
              value={checkedBy}
              disabled={isFinalized}
              onChange={(e) => setCheckedBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-semibold pl-3 pr-8 py-1.5 rounded-xl focus:outline-none appearance-none cursor-pointer text-xs disabled:bg-slate-50"
            >
              <option value="">Select</option>
              {CHECKED_BY_OPTIONS.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {validationErr && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
          {validationErr}
        </div>
      )}

      {/* Result Action Buttons */}
      <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
        <button
          type="button"
          disabled={submitting || isFinalized}
          onClick={() => handleSave("draft")}
          className="px-4 py-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5 text-blue-600" />
          <span>Save as Draft</span>
        </button>

        <button
          type="button"
          disabled={submitting || isFinalized}
          onClick={() => handleSave("finalized")}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{submitting ? "Finalizing..." : "Finalize Report"}</span>
        </button>
      </div>
    </div>
  );
}
