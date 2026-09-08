import React from "react";
import { Upload, Image as ImageIcon, Trash2, Save, CheckSquare, CheckCircle2 } from "lucide-react";
import { CHARACTER_LIMITS, getCharacterCounter } from "../../helpers/radiologyReportFormatter.js";

// Helper function to compress uploaded image files to compact base64 strings
const compressImageFile = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target?.result);
      img.src = e.target?.result;
    };
    reader.readAsDataURL(file);
  });
};

export default function RadiologyReportForm({
  formData,
  setFormData,
  handleChange,
  reportStatus,
  saving,
  handleSaveDraft,
  handleFinalizeReport,
}) {
  const isFinalized = reportStatus === "finalized";
  const isDisabled = isFinalized || saving;

  return (
    <div className="lg:col-span-5 space-y-4">
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs space-y-4">
        {/* Form Title Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Enter Radiology Report</h2>
          <span
            className={`px-2.5 py-0.5 font-bold rounded-md text-[11px] border ${
              isFinalized
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            {isFinalized ? "Finalized & Locked" : "Draft"}
          </span>
        </div>

        {/* 1. Technique */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800">
            Technique <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              disabled={isDisabled}
              value={formData.technique}
              onChange={(e) => handleChange("technique", e.target.value)}
              maxLength={CHARACTER_LIMITS.technique}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              placeholder="Enter technique details..."
            />
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono">
              {getCharacterCounter(formData.technique, CHARACTER_LIMITS.technique)}
            </span>
          </div>
        </div>

        {/* 2. Findings */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800">
            Findings <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              rows={4}
              disabled={isDisabled}
              value={formData.findings}
              onChange={(e) => handleChange("findings", e.target.value)}
              maxLength={CHARACTER_LIMITS.findings}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              placeholder="Enter radiology findings..."
            />
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono">
              {getCharacterCounter(formData.findings, CHARACTER_LIMITS.findings)}
            </span>
          </div>
        </div>

        {/* 3. Impression */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800">
            Impression <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              rows={3}
              disabled={isDisabled}
              value={formData.impression}
              onChange={(e) => handleChange("impression", e.target.value)}
              maxLength={CHARACTER_LIMITS.impression}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              placeholder="Enter primary impression summary..."
            />
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono">
              {getCharacterCounter(formData.impression, CHARACTER_LIMITS.impression)}
            </span>
          </div>
        </div>

        {/* 4. Recommendations */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800">Recommendations</label>
          <div className="relative">
            <textarea
              rows={3}
              disabled={isDisabled}
              value={formData.recommendations}
              onChange={(e) => handleChange("recommendations", e.target.value)}
              maxLength={CHARACTER_LIMITS.recommendations}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              placeholder="Enter clinical recommendations..."
            />
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono">
              {getCharacterCounter(formData.recommendations, CHARACTER_LIMITS.recommendations)}
            </span>
          </div>
        </div>

        {/* 5. Additional Notes */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800">Additional Notes</label>
          <div className="relative">
            <textarea
              rows={3}
              disabled={isDisabled}
              value={formData.additionalNotes}
              onChange={(e) => handleChange("additionalNotes", e.target.value)}
              maxLength={CHARACTER_LIMITS.additionalNotes}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
              placeholder="Enter additional notes..."
            />
            <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-mono">
              {getCharacterCounter(formData.additionalNotes, CHARACTER_LIMITS.additionalNotes)}
            </span>
          </div>
        </div>

        {/* 6. Radiology Scan & DICOM Image Upload Section */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Radiology Scan Images / DICOM Files</span>
            </label>
            <span className="text-[10px] text-slate-400 font-medium">
              {formData.images.length} Image(s) Attached
            </span>
          </div>

          {/* Upload Box Dropzone */}
          {!isFinalized && (
            <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-3 text-center bg-slate-50/60 transition group cursor-pointer">
              <input
                type="file"
                accept="image/*,.dcm,.dicom"
                disabled={isDisabled}
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  for (const file of files) {
                    const compressed = await compressImageFile(file);
                    setFormData((prev) => ({
                      ...prev,
                      images: [compressed, ...prev.images],
                    }));
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  Click or drag &amp; drop to upload scan images
                </p>
                <p className="text-[10px] text-slate-400">
                  Supports JPEG, PNG, DICOM (.dcm) up to 25MB
                </p>
              </div>
            </div>
          )}

          {/* Uploaded Thumbnails Grid */}
          {formData.images.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.images.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 group bg-slate-950 shrink-0"
                >
                  <img
                    src={imgUrl}
                    alt={`Scan ${index + 1}`}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                  />
                  {!isFinalized && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }));
                      }}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-xs cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technician / Radiographer & Checked By Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-800">
              Technician / Radiographer <span className="text-rose-500">*</span>
            </label>
            <select
              disabled={isDisabled}
              value={formData.technicianName}
              onChange={(e) => handleChange("technicianName", e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 h-[38px] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              <option value="Rakesh Kumar">Rakesh Kumar</option>
              <option value="Suresh Verma">Suresh Verma</option>
              <option value="Amit Sharma">Amit Sharma</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-800">Checked By (Optional)</label>
            <select
              disabled={isDisabled}
              value={formData.checkedByName}
              onChange={(e) => handleChange("checkedByName", e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 h-[38px] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              <option value="">Select</option>
              <option value="Dr. Neha Sharma">Dr. Neha Sharma</option>
              <option value="Dr. Rajesh Gupta">Dr. Rajesh Gupta</option>
            </select>
          </div>
        </div>

        {/* Form Action Buttons: Save as Draft & Finalize Report */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          {!isFinalized ? (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition shadow-2xs text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save as Draft</span>
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleFinalizeReport}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-xs text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Finalize Report</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled
              className="flex items-center gap-2 px-5 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold rounded-xl text-xs cursor-not-allowed shadow-2xs opacity-90"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Report Finalized &amp; Approved</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
