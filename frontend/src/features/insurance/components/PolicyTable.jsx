import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  ArrowUpRight,
  Upload,
  History,
  Ban,
  Archive,
  RotateCcw,
} from "lucide-react";
import { formatRupee, formatReportDate } from "../../billing/helpers/invoiceCalculations.js";
import { POLICY_STATUSES } from "../constants/insurance.constants.js";
import TableControls from "./common/TableControls.jsx";
import InsuranceStatusBadge from "./common/InsuranceStatusBadge.jsx";

export default function PolicyTable({
  policies = [],
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  onOpenAddPolicy,
  onViewPolicy,
  onEditPolicy,
  onToggleStatus,
  onToggleArchive,
  onSubmitClaim,
  onUploadDoc,
  onViewClaimsHistory,
  loading,
}) {
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
      {/* Shared Table Controls Bar */}
      <TableControls
        title="Insurance Policies"
        subtitle="Manage patient insurance policies & claims"
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        statusOptions={POLICY_STATUSES}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search by patient name, policy no..."
        actionButtonText="Add New Policy"
        onActionButtonClick={onOpenAddPolicy}
      />

      {/* Policies Table */}
      <div className="border border-slate-200/80 rounded-xl overflow-visible">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase">
              <th className="py-3 px-3 w-8 text-center">#</th>
              <th className="py-3 px-3">Patient (UHID)</th>
              <th className="py-3 px-3">Provider Name</th>
              <th className="py-3 px-3">Policy Number</th>
              <th className="py-3 px-4 text-right">Coverage Amount (₹)</th>
              <th className="py-3 px-3">Valid From</th>
              <th className="py-3 px-3">Valid Until</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                  Loading policies from database...
                </td>
              </tr>
            ) : policies.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                  No insurance policies found.
                </td>
              </tr>
            ) : (
              policies.map((p, idx) => {
                const rowId = p._id || p.policyNumber || idx;
                const rawStatus = (p.status || "active").toLowerCase();
                const isActive = rawStatus === "active";
                const isExpired = rawStatus === "expired";
                const isInactive = rawStatus === "inactive";
                const isArchived = rawStatus === "archived";

                const pName = p.patientName || "Patient";
                const pUhid = p.uhid ? `(${p.uhid})` : "(UHID12345)";
                const isDropdownOpen = activeDropdownId === rowId;

                return (
                  <tr key={rowId} className="hover:bg-slate-50/50 transition-colors">
                    {/* # */}
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>

                    {/* Patient (UHID) */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">{pName}</span>{" "}
                      <span className="font-medium text-slate-500">{pUhid}</span>
                    </td>

                    {/* Provider Name */}
                    <td className="py-3 px-3 font-semibold text-slate-800">{p.providerName || "Star Health"}</td>

                    {/* Policy Number */}
                    <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-800">
                      {p.policyNumber}
                    </td>

                    {/* Coverage Amount */}
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatRupee(p.coverageAmount || p.sumInsured || 0)}
                    </td>

                    {/* Valid From */}
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {formatReportDate(p.validFrom)}
                    </td>

                    {/* Valid Until */}
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {formatReportDate(p.validUntil)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      <InsuranceStatusBadge status={p.status || "Active"} />
                    </td>

                    {/* Standalone Actions Matrix: [ 👁 ] [ ✏️ ] [ ⋮ ] */}
                    <td className="py-3 px-3 text-right whitespace-nowrap relative">
                      <div className="flex items-center justify-end gap-1">
                        {/* 1. Standalone View Policy */}
                        <button
                          type="button"
                          onClick={() => onViewPolicy(p)}
                          className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Policy Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* 2. Standalone Edit Policy */}
                        <button
                          type="button"
                          onClick={() => onEditPolicy(p)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                          title="Edit Policy"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* 3. Three Dots Options Dropdown */}
                        <div className="relative inline-block text-left" ref={isDropdownOpen ? dropdownRef : null}>
                          <button
                            type="button"
                            onClick={() => setActiveDropdownId(isDropdownOpen ? null : rowId)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isDropdownOpen
                                ? "bg-blue-50 border-blue-300 text-blue-600"
                                : "border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            }`}
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {/* Status-Based Dropdown Menu */}
                          {isDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200/90 rounded-xl shadow-xl z-50 p-1 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out">
                              {/* 1. View Policy */}
                              <button
                                type="button"
                                onClick={() => {
                                  onViewPolicy(p);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>View Policy</span>
                              </button>

                              {/* 2. Edit Policy (Active or Inactive) */}
                              {(isActive || isInactive) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onEditPolicy(p);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                  <span>Edit Policy</span>
                                </button>
                              )}

                              {/* 3. View Claims (Active or Expired) */}
                              {(isActive || isExpired) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onViewClaimsHistory?.(p);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                  <span>View Claims</span>
                                </button>
                              )}

                              {/* 4. Submit Claim (Active Only) */}
                              {isActive && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSubmitClaim?.(p);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                                >
                                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>Submit Claim</span>
                                </button>
                              )}

                              {/* 5. Upload Documents (Active Only) */}
                              {isActive && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onUploadDoc?.(p);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                                >
                                  <Upload className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span>Upload Documents</span>
                                </button>
                              )}

                              {/* 6. View Claim History (All Statuses) */}
                              <button
                                type="button"
                                onClick={() => {
                                  onViewClaimsHistory?.(p);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
                              >
                                <History className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>View Claim History</span>
                              </button>

                              {/* 7. Deactivate / Activate Policy */}
                              {(isActive || isInactive) && (
                                <div className="pt-1 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onToggleStatus?.(p);
                                      setActiveDropdownId(null);
                                    }}
                                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-semibold transition cursor-pointer ${
                                      isActive ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                  >
                                    <Ban className="w-3.5 h-3.5 shrink-0" />
                                    <span>{isActive ? "Deactivate Policy" : "Activate Policy"}</span>
                                  </button>
                                </div>
                              )}

                              {/* 8. Archive / Restore Policy */}
                              {(isExpired || isInactive || isArchived) && (
                                <div className="pt-1 border-t border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onToggleArchive?.(p);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                                  >
                                    {isArchived ? (
                                      <>
                                        <RotateCcw className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                        <span>Restore Policy</span>
                                      </>
                                    ) : (
                                      <>
                                        <Archive className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                        <span>Archive Policy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>Showing 1 to {policies.length} of {policies.length} entries</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="p-1 border border-slate-200 rounded-lg text-slate-300 cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 border border-slate-200 rounded-lg text-xs font-bold bg-white text-slate-800">
            1
          </span>
          <button
            type="button"
            disabled
            className="p-1 border border-slate-200 rounded-lg text-slate-300 cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
