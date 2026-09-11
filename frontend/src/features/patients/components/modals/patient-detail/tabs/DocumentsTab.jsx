import React from "react";
import { Upload, Eye, Download } from "lucide-react";
import EmptyState from "../common/EmptyState.jsx";

export default function DocumentsTab({ documents = [] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Patient Medical Documents ({documents.length})
        </h3>
      </div>

      {/* Drag & Drop Box */}
      <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center space-y-2 bg-slate-50 transition cursor-pointer">
        <Upload className="w-8 h-8 text-blue-600 mx-auto" />
        <p className="text-xs font-bold text-slate-700">Drag & drop files here to upload patient document</p>
        <p className="text-[10px] text-slate-400">PDF, JPG, PNG, DICOM up to 25MB</p>
      </div>

      {documents.length === 0 ? (
        <EmptyState title="No Documents Uploaded" message="No medical certificates, scans, or reports uploaded yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-bold text-xs text-slate-900 block">{doc.name}</span>
                <span className="text-[10px] text-slate-500 block">{doc.type} • {doc.fileSize}</span>
                <span className="text-[10px] text-slate-400 block font-mono">Uploaded: {doc.uploadDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-blue-600 cursor-pointer" title="View Document">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer" title="Download File">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
