import React from "react";
import { Paperclip } from "lucide-react";
import FileUploadBox from "../../../../components/common/FileUploadBox.jsx";

export default function OrderAdditionalSection({
  clinicalNotes,
  setClinicalNotes,
  fileName,
  setFileName,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
        <Paperclip className="w-4 h-4 text-blue-600" />
        <span>Additional Information</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-1">
        {/* Clinical Notes / Remarks */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Clinical Notes / Remarks</label>
          <div className="relative">
            <textarea
              rows={3}
              maxLength={200}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Enter any clinical notes or remarks..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none resize-none font-medium"
            />
            <span className="text-[10px] text-slate-400 absolute right-2.5 bottom-2 font-mono">
              {clinicalNotes.length}/200
            </span>
          </div>
        </div>

        {/* Attach Documents (Optional) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Attach Documents (Optional)</label>
          <FileUploadBox fileName={fileName} setFileName={setFileName} compact={true} />
        </div>
      </div>
    </div>
  );
}
