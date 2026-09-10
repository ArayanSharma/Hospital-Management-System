import React, { useRef, useState } from "react";
import { UploadCloud, FileText, X, CheckCircle } from "lucide-react";

/**
 * Reusable File Upload Dropzone Box
 * Handles file click upload, drag & drop, size validation, and file removal.
 */
export default function FileUploadBox({
  fileName,
  setFileName,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMb = 5,
  label = "Click to upload",
  sublabel = "or drag and drop",
  hint = "PDF, JPG, PNG (Max. 5MB each)",
  compact = false,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File size exceeds maximum ${maxSizeMb}MB limit.`);
      return;
    }
    setFileName(file.name);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept={accept}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl transition cursor-pointer flex flex-col items-center justify-center text-center ${
          compact ? "p-3.5 space-y-1" : "p-5 space-y-1.5"
        } ${
          isDragging
            ? "border-blue-500 bg-blue-50/80 scale-[1.01]"
            : fileName
            ? "border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70"
            : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
        }`}
      >
        {fileName ? (
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{fileName}</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 ml-1">
              <CheckCircle className="w-3 h-3" /> Attached
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition ml-1 cursor-pointer"
              title="Remove attachment"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="w-6 h-6 text-blue-600" />
            <p className="text-xs font-bold text-slate-800">
              <span className="text-blue-600 underline">{label}</span> {sublabel}
            </p>
            {hint && <p className="text-[10px] text-slate-400 font-medium">{hint}</p>}
          </>
        )}
      </div>
    </div>
  );
}
