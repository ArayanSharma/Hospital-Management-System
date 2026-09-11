import React from "react";
import { User, Edit, Printer, Phone, Mail } from "lucide-react";
import MaskedField from "../../../../../components/common/MaskedField.jsx";

export default function PatientDetailHeader({ patient, currentPatient: propCurrentPatient, data, onEdit, onEditPatient, onPrintSummary }) {
  const p = patient || propCurrentPatient || data?.patient || {};

  if (!p || Object.keys(p).length === 0) return null;

  const fullName = p.name || `${p.firstName || ""} ${p.lastName || ""}`.trim() || "N/A";
  const patientId = p.patientId || p._id?.substring(0, 8) || "PAT-UNKNOWN";
  const gender = p.gender || "Gender N/A";
  const age = p.age ? `${p.age} Yrs` : (data?.kpis?.age || "N/A");
  const bloodGroup = p.bloodGroup || "N/A";
  const phone = p.phone || p.contactNumber || "N/A";
  const email = p.email || "N/A";

  const primaryDoctor = p.primaryDoctor?.name || (typeof p.primaryDoctor === "string" ? p.primaryDoctor : null) || p.assignedDoctor || data?.patient?.primaryDoctor || "Unassigned";
  const department = p.department || p.primaryDoctor?.department || data?.patient?.department || "General OPD";
  const emergencyContactName = p.emergencyContact?.name || p.emergencyContactName || "Not Provided";
  const emergencyContactPhone = p.emergencyContact?.phone || p.emergencyContactPhone || "";
  const address = p.address?.city ? `${p.address.street || ""}, ${p.address.city}, ${p.address.state || ""}` : (typeof p.address === "string" ? p.address : "Not Provided");

  const handleEdit = () => {
    if (onEdit) onEdit(p);
    else if (onEditPatient) onEditPatient(p);
  };

  const handlePrint = () => {
    if (onPrintSummary) onPrintSummary();
    else window.print();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
      {/* Top Row: Avatar, Info & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar Icon */}
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <User className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-extrabold text-slate-900 capitalize tracking-tight">
                {fullName}
              </h2>
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-md border border-slate-200">
                {patientId}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Patient
              </span>
              {data?.patient?.hospitalStatus === "Admitted" && (
                <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                  Admitted (IPD)
                </span>
              )}
            </div>

            {/* Dot Separated Line */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1.5 flex-wrap">
              <span className="capitalize">{gender}</span>
              <span>•</span>
              <span>{age}</span>
              <span>•</span>
              <span>Blood:</span>
              <span className="bg-rose-50 text-rose-600 font-extrabold px-2 py-0.5 rounded-md border border-rose-200/80 text-[11px]">
                {bloodGroup}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-700 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <MaskedField value={phone} maskType="phone" />
              </span>
              {email !== "N/A" && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {email}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Patient</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Grid Row: Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            PRIMARY DOCTOR
          </div>
          <div className="text-sm font-bold text-slate-800 mt-0.5 truncate">
            {primaryDoctor}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            DEPARTMENT
          </div>
          <div className="text-sm font-bold text-slate-800 mt-0.5 truncate">
            {department}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            EMERGENCY CONTACT
          </div>
          <div className="text-sm font-bold text-slate-800 mt-0.5 truncate">
            {emergencyContactName} {emergencyContactPhone && `(${emergencyContactPhone})`}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            ADDRESS
          </div>
          <div className="text-sm font-bold text-slate-800 mt-0.5 truncate" title={address}>
            {address}
          </div>
        </div>
      </div>
    </div>
  );
}
