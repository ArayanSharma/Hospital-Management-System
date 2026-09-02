import React from "react";
import { UploadCloud } from "lucide-react";

export default function RadiologyOrderAttachmentsSection({ fileName, setFileName }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-extrabold">
          5
        </div>
        <span>Attachments (Optional)</span>
      </div>

      <div className="pl-1">
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer flex flex-col items-center justify-center space-y-1">
          <UploadCloud className="w-6 h-6 text-blue-600" />
          <p className="text-xs font-bold text-slate-800">
            <span className="text-blue-600 underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-[10px] text-slate-400 font-medium">PDF, JPG, PNG (Max. 5MB each)</p>
          {fileName && <p className="text-[10px] font-bold text-emerald-600 truncate mt-1">{fileName}</p>}
        </div>
      </div>
    </div>
  );
}
