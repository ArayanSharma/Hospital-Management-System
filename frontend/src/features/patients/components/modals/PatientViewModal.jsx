import React from "react";
import { Printer, Building2, User, Phone, Calendar, HeartPulse, ShieldCheck, MapPin } from "lucide-react";
import Modal from "../../../../components/ui/Modal.jsx";
import MaskedField from "../../../../components/common/MaskedField.jsx";

export default function PatientViewModal({ viewingPatient, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={!!viewingPatient}
      onClose={onClose}
      title="Patient Profile & Medical Details"
      subtitle={`Viewing record for ${viewingPatient?.name || "Patient"}`}
      maxWidth="max-w-xl"
    >
      {viewingPatient && (
        <div className="space-y-4">
          {/* Print Action Bar */}
          <div className="flex justify-end print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Patient Profile</span>
            </button>
          </div>

          {/* Printable Document Container */}
          <div id="printable-patient-detail" className="space-y-4 text-xs">
            {/* Printable Letterhead Header */}
            <div className="hidden print:flex items-center justify-between border-b pb-4 mb-4 border-slate-300">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <span>CARE PULSE HOSPITAL</span>
                </h1>
                <p className="text-xs text-slate-500">Official Patient Demographic & Medical Profile</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="font-semibold text-slate-700">Patient Identification Card</p>
                <p>Printed: {new Date().toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
              </div>
            </div>

            {/* Main Header Info */}
            <div className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl print:bg-white print:border-slate-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 print:border print:border-blue-700">
                {viewingPatient.name ? viewingPatient.name.substring(0, 2).toUpperCase() : "PT"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900">{viewingPatient.name || "N/A"}</h3>
                <p className="text-slate-500 font-mono text-[11px] mt-0.5">{viewingPatient.patientId || viewingPatient._id}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${viewingPatient.status === 'inactive' ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                    {viewingPatient.status === 'inactive' ? 'Inactive' : 'Active Patient'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-extrabold text-[10px] bg-rose-50 text-rose-600 border border-rose-200 print:border-slate-300">
                    Blood: {viewingPatient.bloodGroup || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Demographics Grid */}
            <div className="grid grid-cols-2 gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs print:border-slate-300">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</span>
                <p className="font-extrabold text-slate-800 capitalize mt-0.5">{viewingPatient.gender || "N/A"}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</span>
                <div className="mt-0.5 font-extrabold text-slate-800">
                  <MaskedField value={viewingPatient.phone} type="phone" className="text-xs font-bold" />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</span>
                <p className="font-extrabold text-slate-800 mt-0.5">{viewingPatient.dateOfBirth ? new Date(viewingPatient.dateOfBirth).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "N/A"}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registration Date</span>
                <p className="font-extrabold text-slate-800 mt-0.5">{viewingPatient.createdAt ? new Date(viewingPatient.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "N/A"}</p>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 print:bg-white print:border-slate-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>Residential Address</span>
              </span>
              <p className="font-bold text-slate-800 mt-1">{viewingPatient.address || "No address details specified."}</p>
            </div>

            {/* Printable Authorization Footer */}
            <div className="hidden print:flex items-center justify-between border-t border-slate-300 pt-6 mt-8">
              <div className="text-[10px] text-slate-500">
                <p className="font-semibold text-slate-700">Care Pulse Hospital Central Patient Register</p>
                <p>Confidential Medical Record — Authorized Personnel Only</p>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1"></div>
                <p className="text-[10px] font-bold text-slate-700">Authorized Officer Signature</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
