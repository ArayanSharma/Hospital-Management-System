import React from "react";
import FileUploadBox from "../../../../components/common/FileUploadBox.jsx";

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
        <FileUploadBox fileName={fileName} setFileName={setFileName} />
      </div>
    </div>
  );
}
