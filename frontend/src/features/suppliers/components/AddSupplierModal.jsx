import React from "react";
import { X } from "lucide-react";
import SupplierForm from "./SupplierForm.jsx";

export default function AddSupplierModal({ isOpen, onClose, onSubmit, submitting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-base font-bold text-slate-900">Add Supplier</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto">
          <SupplierForm
            onSubmit={(formData) => {
              onSubmit?.(formData);
              if (!formData.addAnother) {
                onClose();
              }
            }}
            onCancel={onClose}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}
