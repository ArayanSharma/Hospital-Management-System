import React from "react";
import { Shield } from "lucide-react";

export default function PolicyDetailsSection({
  providerName,
  setProviderName,
  policyNumber,
  setPolicyNumber,
  policyType,
  setPolicyType,
  tpaName,
  setTpaName,
  sumInsured,
  setSumInsured,
  currency,
  setCurrency,
  validFrom,
  onValidFromChange,
  validUntil,
  setValidUntil,
  status,
  setStatus,
  renewalDate,
  setRenewalDate,
  employer,
  setEmployer,
  relationship,
  setRelationship,
  notes,
  setNotes,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
        <Shield className="w-4 h-4 text-blue-600" />
        <h3 className="text-xs font-extrabold text-blue-700 tracking-wide">
          2. Insurance Policy Details
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Provider */}
        <div className="space-y-1 sm:col-span-1">
          <label className="text-[11px] font-bold text-slate-700">
            Insurance Provider <span className="text-rose-500">*</span>
          </label>
          <select
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="Star Health & Allied Insurance Co. Ltd.">Star Health & Allied Insurance Co. Ltd.</option>
            <option value="HDFC ERGO Health Insurance Co. Ltd.">HDFC ERGO Health Insurance Co. Ltd.</option>
            <option value="Max Bupa Health Insurance Co. Ltd.">Max Bupa Health Insurance Co. Ltd.</option>
            <option value="Ayushman Bharat">Ayushman Bharat</option>
            <option value="ICICI Lombard General Insurance">ICICI Lombard General Insurance</option>
            <option value="Niva Bupa Health Insurance">Niva Bupa Health Insurance</option>
          </select>
        </div>

        {/* Policy Number */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Policy Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={policyNumber}
            onChange={(e) => setPolicyNumber(e.target.value)}
            placeholder="Enter Policy Number..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Policy Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Policy Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={policyType}
            onChange={(e) => setPolicyType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="Individual Health">Individual Health</option>
            <option value="Family Floater">Family Floater</option>
            <option value="Senior Citizen">Senior Citizen</option>
            <option value="Critical Illness">Critical Illness</option>
            <option value="Corporate Group Policy">Corporate Group Policy</option>
          </select>
        </div>

        {/* TPA Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">TPA Name</label>
          <select
            value={tpaName}
            onChange={(e) => setTpaName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="Health India TPA Services Pvt. Ltd.">Health India TPA Services Pvt. Ltd.</option>
            <option value="Medi Assist TPA Services">Medi Assist TPA Services</option>
            <option value="Heritage Health TPA Pvt. Ltd.">Heritage Health TPA Pvt. Ltd.</option>
            <option value="Vipul MedCorp TPA Pvt. Ltd.">Vipul MedCorp TPA Pvt. Ltd.</option>
            <option value="Direct Settlement">Direct Settlement</option>
          </select>
        </div>

        {/* Sum Insured */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Sum Insured / Coverage Amount (₹) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            required
            min={1}
            value={sumInsured}
            onChange={(e) => setSumInsured(e.target.value)}
            placeholder="e.g. 500000"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Currency */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        {/* Valid From */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Valid From <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={validFrom}
            onChange={(e) => onValidFromChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Valid Until */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Valid Until <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">
            Policy Status <span className="text-rose-500">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-extrabold text-emerald-700 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* Renewal Date */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Renewal Date</label>
          <input
            type="date"
            value={renewalDate}
            onChange={(e) => setRenewalDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Corporate / Employer */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Corporate / Employer (Optional)</label>
          <input
            type="text"
            value={employer}
            onChange={(e) => setEmployer(e.target.value)}
            placeholder="e.g. ABC Pvt. Ltd."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Relationship */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700">Relationship</label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer h-[34px]"
          >
            <option value="Self">Self</option>
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
            <option value="Parent">Parent</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-700">Policy Notes (Optional)</label>
          <span className="text-[9px] font-bold text-slate-400">{notes.length}/500</span>
        </div>
        <textarea
          rows={2}
          maxLength={500}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any additional notes..."
          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>
    </div>
  );
}
