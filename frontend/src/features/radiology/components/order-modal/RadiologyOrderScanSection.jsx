import React from "react";
import { ChevronDown } from "lucide-react";

export default function RadiologyOrderScanSection({
  modality,
  setModality,
  bodyRegion,
  setBodyRegion,
  clinicalInstructions,
  setClinicalInstructions,
  checkedTests,
  handleCheckboxChange,
  otherTestText,
  setOtherTestText,
}) {
  const modalityOptions = [
    "X-Ray",
    "MRI Scan",
    "CT Scan",
    "Ultrasound (USG)",
    "Mammography",
    "PET Scan",
    "ECG",
  ];

  const bodyRegionOptions = [
    "Chest",
    "Brain",
    "Abdomen",
    "Pelvis",
    "Breast",
    "Whole Body",
    "Heart",
    "Spine",
    "Musculoskeletal",
    "Head & Neck",
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-extrabold">
          3
        </div>
        <span>Test / Scan Details</span>
      </div>

      <div className="space-y-3 pl-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Modality */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Modality <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Modality</option>
                {modalityOptions.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Body Region */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Body Region <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={bodyRegion}
                onChange={(e) => setBodyRegion(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Body Region</option>
                {bodyRegionOptions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Clinical Instructions */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Clinical Instructions
          </label>
          <div className="relative">
            <textarea
              rows={3}
              maxLength={300}
              value={clinicalInstructions}
              onChange={(e) => setClinicalInstructions(e.target.value)}
              placeholder="Enter clinical instructions (e.g. symptoms, rule out, history...)"
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none resize-none font-medium"
            />
            <span className="text-[10px] text-slate-400 absolute right-2.5 bottom-2 font-mono">
              {clinicalInstructions.length}/300
            </span>
          </div>
        </div>

        {/* Additional Tests Checkboxes */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
            Additional Tests
          </label>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-semibold text-slate-800 text-xs">
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
