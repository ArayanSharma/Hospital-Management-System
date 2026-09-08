import React from "react";
import { Upload, Info, FileCheck } from "lucide-react";

export default function DocumentUploadGrid({
  sectionTitle = "3. Supporting Documents",
  subTitle = "Upload scanned copy of policy / insurance card (JPG, PNG, PDF. Max 5MB each)",
  items = [],
  documents = {},
  onFileUpload,
  infoBannerText = "Uploaded documents will be securely stored and can be used while raising insurance claims.",
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
        <FileCheck className="w-4 h-4 text-blue-600" />
        <div>
          <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">{sectionTitle}</h3>
          <p className="text-[10px] text-slate-400 font-medium">{subTitle}</p>
        </div>
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-${items.length} gap-3`}>
        {items.map((item) => {
          const fileName = documents[item.key];
          return (
            <div
              key={item.key}
              className="border border-dashed border-slate-200 rounded-xl p-2.5 bg-slate-50/50 flex flex-col items-center justify-center text-center gap-1 hover:bg-blue-50/40 transition relative"
            >
              <Upload className="w-4 h-4 text-slate-400" />
              <p className="font-bold text-[10px] text-slate-800">{item.label}</p>
              <p className="text-[8px] text-slate-400">{item.subText}</p>
              <label className="px-2.5 py-0.5 bg-white border border-slate-200 text-blue-600 font-bold text-[9px] rounded shadow-2xs cursor-pointer hover:bg-slate-50">
                Upload
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => onFileUpload(item.key, e)}
                  className="hidden"
                />
              </label>
              <span className="text-[8px] text-slate-400">or drag & drop</span>
              {fileName && (
                <span className="text-[8px] font-bold text-emerald-600 truncate max-w-full">
                  ✓ {fileName}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl text-[11px] font-semibold text-blue-700 flex items-center gap-2">
        <Info className="w-4 h-4 shrink-0 text-blue-600" />
        <span>{infoBannerText}</span>
      </div>
    </div>
  );
}
