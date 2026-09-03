import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";

export default function PatientViewModal({ viewingPatient, onClose }) {
  return (
    <Modal
      isOpen={!!viewingPatient}
      onClose={onClose}
      title="Patient Profile & Medical Details"
      subtitle={`Viewing record for ${viewingPatient?.name || "Patient"}`}
      maxWidth="max-w-xl"
    >
      {viewingPatient && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
              {viewingPatient.name ? viewingPatient.name.substring(0, 2).toUpperCase() : "PT"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-extrabold text-slate-900">{viewingPatient.name}</h3>
              <p className="text-slate-500 font-mono text-[11px] mt-0.5">{viewingPatient.patientId || viewingPatient._id}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${viewingPatient.status === 'inactive' ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                  {viewingPatient.status === 'inactive' ? 'Inactive' : 'Active Patient'}
                </span>
                <span className="px-2 py-0.5 rounded-md font-extrabold text-[10px] bg-rose-50 text-rose-600 border border-rose-200">
                  Blood: {viewingPatient.bloodGroup || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</span>
              <p className="font-extrabold text-slate-800 capitalize mt-0.5">{viewingPatient.gender || "N/A"}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</span>
              <p className="font-extrabold text-slate-800 mt-0.5">{viewingPatient.phone || "N/A"}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</span>
              <p className="font-extrabold text-slate-800 mt-0.5">{viewingPatient.dateOfBirth ? new Date(viewingPatient.dateOfBirth).toISOString().split("T")[0] : "N/A"}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registration Date</span>
              <p className="font-extrabold text-slate-800 mt-0.5">{viewingPatient.createdAt ? new Date(viewingPatient.createdAt).toISOString().split("T")[0] : "N/A"}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residential Address</span>
            <p className="font-bold text-slate-800 mt-1">{viewingPatient.address || "No address details specified."}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
