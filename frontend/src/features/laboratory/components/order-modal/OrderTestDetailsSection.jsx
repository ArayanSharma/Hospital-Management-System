import React from "react";
import { FlaskConical, ChevronDown } from "lucide-react";

export default function OrderTestDetailsSection({
  testName,
  setTestName,
  sampleType,
  setSampleType,
  checkedTests,
  handleCheckboxChange,
  otherTestText,
  setOtherTestText,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
        <FlaskConical className="w-4 h-4 text-blue-600" />
        <span>Test Details</span>
      </div>

      <div className="space-y-3 pl-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Test Name / Profile */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Test Name / Profile <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-800 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Lipid Profile">Lipid Profile</option>
                <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                <option value="Thyroid Profile (T3, T4, TSH)">Thyroid Profile (T3, T4, TSH)</option>
                <option value="Urine Routine Examination">Urine Routine Examination</option>
                <option value="Blood Sugar Fasting & PP">Blood Sugar Fasting &amp; PP</option>
                <option value="Kidney Function Test (KFT)">Kidney Function Test (KFT)</option>
                <option value="Liver Function Test (LFT)">Liver Function Test (LFT)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Sample Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Sample Type <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-800 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="Blood">Blood</option>
                <option value="Urine">Urine</option>
                <option value="Stool">Stool</option>
                <option value="Swab">Swab</option>
                <option value="Sputum">Sputum</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Additional Tests Checkboxes */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Additional Tests</label>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-medium text-slate-800 text-xs">
            {Object.keys(checkedTests).map((item) => (
              <label key={item} className="flex items-center gap-1.5 cursor-pointer font-bold">
                <input
                  type="checkbox"
                  checked={checkedTests[item]}
                  onChange={() => handleCheckboxChange(item)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          {checkedTests.Other && (
            <div className="mt-2 w-72">
              <input
                type="text"
                placeholder="Specify test"
                value={otherTestText}
                onChange={(e) => setOtherTestText(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
