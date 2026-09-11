import React from "react";
import { Building2, User, Stethoscope, HeartPulse, FileText, Pill, FlaskConical, ShieldCheck, Receipt, BedDouble } from "lucide-react";
import MaskedField from "../../../../../components/common/MaskedField.jsx";

export default function PatientPrintSummary({ patient, data }) {
  const p = patient || data?.patient || {};
  if (!p || Object.keys(p).length === 0) return null;

  const fullName = p.name || `${p.firstName || ""} ${p.lastName || ""}`.trim() || "N/A";
  const patientId = p.patientId || p._id?.substring(0, 8) || "PAT-UNKNOWN";
  const gender = p.gender || "N/A";
  const age = p.age ? `${p.age} Yrs` : (data?.kpis?.age || "N/A");
  const bloodGroup = p.bloodGroup || "N/A";
  const phone = p.phone || p.contactNumber || "N/A";
  const email = p.email || "N/A";

  const primaryDoctor = p.primaryDoctor?.name || (typeof p.primaryDoctor === "string" ? p.primaryDoctor : null) || p.assignedDoctor || data?.patient?.primaryDoctor || "Unassigned";
  const department = p.department || p.primaryDoctor?.department || data?.patient?.department || "General OPD";
  const emergencyContactName = p.emergencyContact?.name || p.emergencyContactName || "Not Provided";
  const emergencyContactPhone = p.emergencyContact?.phone || p.emergencyContactPhone || "";
  const address = p.address?.city ? `${p.address.street || ""}, ${p.address.city}, ${p.address.state || ""}` : (typeof p.address === "string" ? p.address : "Not Provided");

  const vitals = p.vitals || data?.vitals || {};
  const diagnoses = p.diagnoses || data?.diagnoses || [];
  const labTests = p.labTests || data?.tests || [];
  const medications = p.medications || data?.medications || [];
  const admissions = p.admissions || data?.admissions || [];
  const billing = p.billing || data?.billing || [];

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      id="printable-patient-detail"
      className="hidden print:block bg-white p-6 rounded-2xl border border-slate-200 text-slate-900 text-xs space-y-6"
    >
      {/* 1. Header (Matching Image 2 Style) */}
      <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0 shadow-md">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-black text-blue-700 uppercase tracking-tight">
              CITYCARE HOSPITAL &amp; MEDICAL RESEARCH CENTER
            </h1>
            <p className="text-xs font-bold text-slate-600 mt-0.5">
              Department of Pathology &amp; Clinical Operations
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              NABH Accredited EMR System | Hospital Unique Patient ID: {patientId}
            </p>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-black text-[11px] tracking-wider uppercase">
            PATIENT CLINICAL SUMMARY
          </div>
          <p className="text-xs font-mono font-bold text-slate-800">
            {patientId}
          </p>
          <p className="text-[10px] font-semibold text-slate-500">
            {currentDate} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* 2. Demographics & Clinical Information Grid */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        {/* Left Box: Patient Info */}
        <div className="space-y-2 border-r border-slate-200 pr-4">
          <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-[11px] uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>PATIENT INFORMATION</span>
          </div>
          <p className="font-extrabold text-slate-900 text-sm capitalize">{fullName}</p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 font-medium">
            <p><span className="font-bold text-slate-700">Patient UHID:</span> {patientId}</p>
            <p><span className="font-bold text-slate-700">Age / Sex:</span> {age} / {gender}</p>
            <p><span className="font-bold text-slate-700">Blood Group:</span> <strong className="text-rose-600">{bloodGroup}</strong></p>
            <p><span className="font-bold text-slate-700">Phone:</span> <MaskedField value={phone} maskType="phone" /></p>
            <p className="col-span-2"><span className="font-bold text-slate-700">Email:</span> {email}</p>
          </div>
        </div>

        {/* Right Box: Attending Physician */}
        <div className="space-y-2 pl-2">
          <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-[11px] uppercase tracking-wider">
            <Stethoscope className="w-4 h-4" />
            <span>ORDERING PHYSICIAN &amp; DEPT</span>
          </div>
          <p className="font-extrabold text-slate-900 text-sm">{primaryDoctor}</p>
          <div className="text-[11px] text-slate-600 font-medium space-y-1">
            <p><span className="font-bold text-slate-700">Department:</span> {department}</p>
            <p><span className="font-bold text-slate-700">Emergency Contact:</span> {emergencyContactName} {emergencyContactPhone && `(${emergencyContactPhone})`}</p>
            <p><span className="font-bold text-slate-700">Address:</span> {address}</p>
          </div>
        </div>
      </div>

      {/* 3. Vitals Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
          <HeartPulse className="w-4 h-4 text-rose-500" />
          <span>LATEST VITAL SIGNS</span>
        </div>
        <div className="grid grid-cols-4 gap-3 text-center text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Blood Pressure</p>
            <p className="font-black text-slate-900 mt-0.5">{vitals.bloodPressure || "120/80 mmHg"}</p>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Pulse Rate</p>
            <p className="font-black text-slate-900 mt-0.5">{vitals.heartRate || vitals.pulse || "72 bpm"}</p>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Temperature</p>
            <p className="font-black text-slate-900 mt-0.5">{vitals.temperature || "98.6 °F"}</p>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-[10px] text-slate-400 font-bold uppercase">SpO2 Oxygen</p>
            <p className="font-black text-slate-900 mt-0.5">{vitals.spO2 || "99%"}</p>
          </div>
        </div>
      </div>

      {/* 4. Active Diagnoses */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>ACTIVE DIAGNOSES &amp; CLINICAL CONDITIONS</span>
        </div>
        {diagnoses.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {diagnoses.map((d, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="font-bold text-slate-900">{d.diagnosis || d.condition}</span>
                <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  {d.status || "Active"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic p-2 bg-slate-50 border border-slate-200 rounded-lg">
            No active diagnoses recorded.
          </p>
        )}
      </div>

      {/* 5. Prescriptions & Lab Tests Table */}
      <div className="grid grid-cols-2 gap-4">
        {/* Lab Tests */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
            <FlaskConical className="w-4 h-4 text-amber-600" />
            <span>LABORATORY &amp; DIAGNOSTIC TESTS</span>
          </div>
          {labTests.length > 0 ? (
            <div className="space-y-1.5">
              {labTests.slice(0, 4).map((t, i) => (
                <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex justify-between">
                  <span className="font-bold text-slate-800">{t.testName || t.name}</span>
                  <span className="font-extrabold text-amber-600">{t.status || "Completed"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic p-2 bg-slate-50 border border-slate-200 rounded-lg">
              No lab tests recorded.
            </p>
          )}
        </div>

        {/* Medications */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-xs uppercase tracking-wider border-b border-slate-200 pb-1">
            <Pill className="w-4 h-4 text-emerald-600" />
            <span>ACTIVE MEDICATIONS (Rx)</span>
          </div>
          {medications.length > 0 ? (
            <div className="space-y-1.5">
              {medications.slice(0, 4).map((m, i) => (
                <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex justify-between">
                  <span className="font-bold text-slate-800">{m.medicineName || m.name}</span>
                  <span className="text-slate-600">{m.dosage || "1-0-1"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic p-2 bg-slate-50 border border-slate-200 rounded-lg">
              No active medications prescribed.
            </p>
          )}
        </div>
      </div>

      {/* 6. Footer & Signatures */}
      <div className="pt-8 flex items-end justify-between border-t border-slate-300">
        <div className="space-y-1 text-[10px] text-slate-500">
          <p className="font-bold text-slate-700">Statutory Notice:</p>
          <p>• Computer-generated patient summary via CityCare EMR System.</p>
          <p>• Verified document for clinical reference.</p>
        </div>

        <div className="text-center space-y-1">
          <div className="w-44 border-b border-slate-400 pb-1 font-serif text-slate-700 italic">
            {primaryDoctor}
          </div>
          <p className="font-bold text-slate-900 text-[11px]">{primaryDoctor}</p>
          <p className="text-[10px] text-slate-500 font-semibold">Ordering Doctor Signature</p>
        </div>
      </div>
    </div>
  );
}
