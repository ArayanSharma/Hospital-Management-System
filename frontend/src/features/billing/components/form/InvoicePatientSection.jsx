import React from "react";
import { User, Lock, Calendar } from "lucide-react";
import PatientAutocomplete from "../../../../components/common/PatientAutocomplete.jsx";

export default function InvoicePatientSection({ form }) {
  const {
    patientId,
    uhid,
    autoInvoiceId,
    encountersList,
    visitEncounter,
    setVisitEncounter,
    visitType,
    setVisitType,
    department,
    setDepartment,
    referredBy,
    setReferredBy,
    invoiceDate,
    setInvoiceDate,
    paymentTerms,
    setPaymentTerms,
    dueDate,
    handleSelectPatient,
  } = form;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <h2 className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">
            1. Patient & Visit Information
          </h2>
        </div>
        <span className="text-[10px] font-bold text-slate-400">Locked Fields Auto-filled</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Row 1: Patient Autocomplete & Auto UHID */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Patient <span className="text-rose-500">*</span>
          </label>
          <PatientAutocomplete
            value={patientId}
            onChange={(pId, pName) => handleSelectPatient(pId, pName)}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700">UHID</label>
            <span className="text-[9px] font-bold text-blue-600">Auto-filled</span>
          </div>
          <input
            type="text"
            readOnly
            value={uhid}
            placeholder="Selected patient UHID"
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-700 cursor-not-allowed"
          />
        </div>

        {/* Row 2: Auto Invoice ID & Visit / Encounter ID */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700">Invoice ID (Auto)</label>
            <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" /> Locked
            </span>
          </div>
          <div className="w-full bg-blue-50/60 border border-blue-200/80 rounded-xl px-3 py-1.5 text-xs font-mono font-extrabold text-blue-700 flex items-center justify-between">
            <span>{autoInvoiceId}</span>
            <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">AUTO</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Visit / Encounter ID <span className="text-rose-500">*</span>
          </label>
          {encountersList.length > 0 ? (
            <select
              value={visitEncounter}
              onChange={(e) => setVisitEncounter(e.target.value)}
              className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
            >
              {encountersList.map((enc) => (
                <option key={enc.id} value={enc.id}>
                  {enc.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={visitEncounter}
              onChange={(e) => setVisitEncounter(e.target.value)}
              placeholder="e.g. VIS-2026-000001"
              className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
            />
          )}
        </div>

        {/* Row 3: Visit Type & Department */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Visit Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="OPD">OPD</option>
            <option value="IPD">IPD</option>
            <option value="Emergency">Emergency</option>
            <option value="Day Care">Day Care</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="Radiology">Radiology</option>
            <option value="OPD">OPD</option>
            <option value="IPD">IPD</option>
            <option value="Lab">Lab</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Surgery">Surgery</option>
          </select>
        </div>

        {/* Row 4: Invoice Date & Payment Terms */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Invoice Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 pr-8"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Payment Terms <span className="text-rose-500">*</span>
          </label>
          <select
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="Immediate">Immediate</option>
            <option value="7 Days">7 Days</option>
            <option value="15 Days">15 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* Row 5: Auto-Calculated Due Date & Referred By */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700">Due Date</label>
            <span className="text-[9px] font-bold text-blue-600">Calculated</span>
          </div>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={dueDate}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold cursor-not-allowed pr-8"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Referred By</label>
          <input
            type="text"
            value={referredBy}
            onChange={(e) => setReferredBy(e.target.value)}
            placeholder="e.g. Dr. Vikram Patel"
            className="w-full bg-slate-50/60 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
