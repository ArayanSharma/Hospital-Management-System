import React from "react";
import { FileCheck } from "lucide-react";
import { formatRupee } from "../../../billing/helpers/invoiceCalculations.js";

export default function ClaimInvoiceDetailsSection({
  invoiceNumber,
  invoiceDate,
  invoiceTotal,
  invoicesList = [],
  admissionType,
  setAdmissionType,
  treatmentDate,
  setTreatmentDate,
  claimType,
  setClaimType,
  claimAmount,
  setClaimAmount,
  approvedAmount,
  patientPayable,
  preAuthNumber,
  setPreAuthNumber,
  onInvoiceSelect,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
        <FileCheck className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">
          2. Claim & Invoice Details
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Invoice Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Invoice <span className="text-rose-500">*</span>
          </label>
          <select
            value={invoiceNumber}
            onChange={(e) => onInvoiceSelect(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-blue-600 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="">-- Select Invoice --</option>
            {invoicesList.map((inv) => (
              <option key={inv._id || inv.invoiceNumber} value={inv.invoiceNumber}>
                {inv.invoiceNumber} (₹ {inv.netTotal || inv.totalAmount || 0})
              </option>
            ))}
          </select>
          {invoiceDate && (
            <p className="text-[10px] text-slate-400 font-medium">
              Invoice Date: {invoiceDate} | Total: {formatRupee(invoiceTotal)}
            </p>
          )}
        </div>

        {/* Admission Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Admission Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={admissionType}
            onChange={(e) => setAdmissionType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="Outpatient (OPD)">Outpatient (OPD)</option>
            <option value="Inpatient (IPD)">Inpatient (IPD)</option>
            <option value="Day Care">Day Care</option>
          </select>
        </div>

        {/* Date of Treatment */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Date of Treatment <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={treatmentDate}
            onChange={(e) => setTreatmentDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Claim Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Claim Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={claimType}
            onChange={(e) => setClaimType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="Cashless">Cashless</option>
            <option value="Reimbursement">Reimbursement</option>
          </select>
        </div>

        {/* Claim Amount */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Claim Amount (₹) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            required
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            placeholder="Enter amount..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-blue-500"
          />
          <p className="text-[10px] text-slate-400 font-medium">Amount requested from TPA</p>
        </div>

        {/* Approved Amount */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Approved Amount (₹)</label>
          <input
            type="text"
            readOnly
            value={approvedAmount}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 cursor-not-allowed"
          />
          <p className="text-[10px] text-slate-400 font-medium">To be filled by TPA</p>
        </div>

        {/* Patient Payable */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Patient Payable (₹)</label>
          <input
            type="text"
            readOnly
            value={patientPayable}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 cursor-not-allowed"
          />
          <p className="text-[10px] text-slate-400 font-medium">To be filled after approval</p>
        </div>

        {/* Pre-Authorization No */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Pre-Authorization No.</label>
          <input
            type="text"
            value={preAuthNumber}
            onChange={(e) => setPreAuthNumber(e.target.value)}
            placeholder="Enter pre-auth number (if any)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
