import React, { useState, useRef, useEffect } from "react";
import {
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  History,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Ban,
  MessageSquarePlus,
  Printer,
  PlusCircle,
  XCircle,
} from "lucide-react";
import { formatRupee, formatReportDate } from "../../billing/helpers/invoiceCalculations.js";
import { CLAIM_STATUSES } from "../constants/insurance.constants.js";
import TableControls from "./common/TableControls.jsx";
import InsuranceStatusBadge from "./common/InsuranceStatusBadge.jsx";

export default function ClaimTable({
  claims = [],
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  onOpenSubmitClaim,
  onViewClaim,
  onEditClaim,
  onUploadDoc,
  onAddNote,
  onViewSettlement,
  onViewRejection,
  onViewHistory,
  onUpdateStatus,
  onPrintClaim,
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
      {/* Table Controls */}
      <TableControls
        title="Insurance Claims"
        subtitle="Process and track patient insurance claims & pre-auth"
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        statusOptions={CLAIM_STATUSES}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search by claim no, patient, policy..."
        actionButtonText="Submit New Claim"
        onActionButtonClick={onOpenSubmitClaim}
      />

      {/* Claims Table */}
      <div className="border border-slate-200/80 rounded-xl overflow-visible">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase">
              <th className="py-3 px-3 w-8 text-center">#</th>
              <th className="py-3 px-3">Claim No</th>
              <th className="py-3 px-3">Patient (UHID)</th>
              <th className="py-3 px-3">Policy Number</th>
              <th className="py-3 px-4 text-right">Claim Amount (₹)</th>
              <th className="py-3 px-4 text-right">Approved (₹)</th>
              <th className="py-3 px-3">Submitted Date</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                  Loading insurance claims from database...
                </td>
              </tr>
            ) : claims.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                  No claims found matching filters.
                </td>
              </tr>
            ) : (
              claims.map((c, idx) => {
                const rowId = c._id || c.claimNumber || idx;
                const rawStatus = (c.status || "Submitted").toLowerCase();

                const isSubmitted = rawStatus === "submitted" || rawStatus === "draft";
                const isUnderReview = rawStatus === "under review";
                const isApproved = rawStatus === "approved" || rawStatus === "partially approved";
                const isSettled = rawStatus === "settled";
                const isRejected = rawStatus === "rejected";

                const isDropdownOpen = activeDropdownId === rowId;

                return (
                  <tr key={rowId} className="hover:bg-slate-50/50 transition-colors">
                    {/* # */}
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>

                    {/* Claim No */}
                    <td className="py-3 px-3 font-mono font-bold text-purple-700">
                      {c.claimNumber}
                    </td>

                    {/* Patient (UHID) */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">{c.patientName}</span>{" "}
                      <span className="font-medium text-slate-500">({c.uhid || "UHID12346"})</span>
                    </td>

                    {/* Policy Number */}
                    <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-700">
                      {c.policyNumber}
                    </td>

                    {/* Claim Amount */}
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatRupee(c.claimAmount)}
                    </td>

                    {/* Approved Amount */}
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-600">
                      {c.approvedAmount ? formatRupee(c.approvedAmount) : "—"}
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {c.submittedDate || "Today"}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      <InsuranceStatusBadge status={c.status || "Submitted"} />
                    </td>

                    {/* Actions Column: [ 👁 ] [ ⋮ ] */}
                    <td className="py-3 px-3 text-right whitespace-nowrap relative">
                      <div className="flex items-center justify-end gap-1">
                        {/* 1. Standalone View Claim */}
                        <button
                          type="button"
                          onClick={() => onViewClaim(c)}
                          className="p-1.5 rounded-lg border border-slate-200 text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                          title="View Claim Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* 2. Dropdown Menu Trigger */}
                        <div className="relative inline-block text-left" ref={isDropdownOpen ? dropdownRef : null}>
                          <button
                            type="button"
                            onClick={() => setActiveDropdownId(isDropdownOpen ? null : rowId)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isDropdownOpen
                                ? "bg-purple-50 border-purple-300 text-purple-600"
                                : "border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            }`}
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {/* Status-Based Dropdown Options */}
                          {isDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200/90 rounded-xl shadow-xl z-50 p-1 text-xs space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ease-out">
                              {/* 1. View Claim Details (All Statuses) */}
                              <button
                                type="button"
                                onClick={() => {
                                  onViewClaim(c);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                <span>View Claim Details</span>
                              </button>

                              {/* SUBMITTED STATUS ACTIONS */}
                              {isSubmitted && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onEditClaim?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                    <span>Edit Claim Information</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUploadDoc?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    <Upload className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    <span>Upload Documents</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUpdateStatus?.(c._id || c.claimNumber, "Under Review");
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                                    <span>Submit to TPA Review</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUpdateStatus?.(c._id || c.claimNumber, "Withdrawn");
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  >
                                    <Ban className="w-3.5 h-3.5 shrink-0" />
                                    <span>Withdraw Claim</span>
                                  </button>
                                </>
                              )}

                              {/* UNDER REVIEW STATUS ACTIONS */}
                              {isUnderReview && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUploadDoc?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    <Upload className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    <span>View / Add Documents</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onEditClaim?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                    <span>Update Claim Information</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onAddNote?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    <MessageSquarePlus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span>Add Internal Note</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUpdateStatus?.(c._id || c.claimNumber, "Withdrawn");
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  >
                                    <Ban className="w-3.5 h-3.5 shrink-0" />
                                    <span>Withdraw Claim</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUpdateStatus?.(c._id || c.claimNumber, "Cancelled");
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>Cancel Claim</span>
                                  </button>
                                </>
                              )}

                              {/* APPROVED STATUS ACTIONS */}
                              {isApproved && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onViewSettlement?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-semibold text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                    <span>View / Process Settlement</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUploadDoc?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    <Upload className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    <span>View Documents</span>
                                  </button>
                                </>
                              )}

                              {/* SETTLED STATUS ACTIONS */}
                              {isSettled && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onViewSettlement?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-semibold text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                    <span>View Settlement Details</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onPrintClaim?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                    <span>Print / Download Claim</span>
                                  </button>
                                </>
                              )}

                              {/* REJECTED STATUS ACTIONS */}
                              {isRejected && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onViewRejection?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                    <span>View Rejection Reason</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onViewRejection?.(c);
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-semibold text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                                    <span>Appeal / Resubmit</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onOpenSubmitClaim();
                                      setActiveDropdownId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                  >
                                    <PlusCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                    <span>Create New Claim</span>
                                  </button>
                                </>
                              )}

                              {/* VIEW CLAIM HISTORY (ALL STATUSES) */}
                              <div className="pt-1 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onViewHistory?.(c);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                >
                                  <History className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span>View Claim History</span>
                                </button>
                              </div>
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

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>Showing 1 to {claims.length} of {claims.length} entries</span>
        <div className="flex items-center gap-1">
          <button type="button" disabled className="p-1 border border-slate-200 rounded-lg text-slate-300 cursor-not-allowed">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 border border-slate-200 rounded-lg text-xs font-bold bg-white text-slate-800">
            1
          </span>
          <button type="button" disabled className="p-1 border border-slate-200 rounded-lg text-slate-300 cursor-not-allowed">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
