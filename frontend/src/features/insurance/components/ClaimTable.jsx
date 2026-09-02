import React, { useState } from "react";
import { Eye, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { formatRupee } from "../../billing/helpers/invoiceCalculations.js";
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
  onUpdateStatus,
  loading,
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
      {/* Shared Table Controls Bar */}
      <TableControls
        title="Insurance Claims"
        subtitle="Track and manage insurance claims"
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        statusOptions={CLAIM_STATUSES}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search by patient name, invoice ID, claim no..."
        actionButtonText="+ Submit New Claim"
        onActionButtonClick={onOpenSubmitClaim}
      />

      {/* Claims Table */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold text-slate-500 uppercase">
              <th className="py-3 px-3 w-8 text-center">#</th>
              <th className="py-3 px-3">Claim No.</th>
              <th className="py-3 px-3">Patient (UHID)</th>
              <th className="py-3 px-3">Policy Number</th>
              <th className="py-3 px-3">Invoice ID</th>
              <th className="py-3 px-4 text-right">Claim Amount (₹)</th>
              <th className="py-3 px-4 text-right">Approved Amount (₹)</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3">Last Updated</th>
              <th className="py-3 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {loading ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400 font-medium">
                  Loading claims from database...
                </td>
              </tr>
            ) : claims.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400 font-medium">
                  No insurance claims found.
                </td>
              </tr>
            ) : (
              claims.map((c, idx) => {
                const cName = c.patientName || "Patient";
                const cUhid = c.uhid ? `(${c.uhid})` : "(UHID12345)";

                return (
                  <tr key={c._id || idx} className="hover:bg-slate-50/50 transition-colors">
                    {/* # */}
                    <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>

                    {/* Claim No */}
                    <td className="py-3 px-3 font-mono text-[11px] font-bold text-slate-800">
                      {c.claimNumber}
                    </td>

                    {/* Patient (UHID) */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">{cName}</span>{" "}
                      <span className="font-medium text-slate-500">{cUhid}</span>
                    </td>

                    {/* Policy Number */}
                    <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-700">
                      {c.policyNumber}
                    </td>

                    {/* Invoice ID */}
                    <td className="py-3 px-3 font-mono text-[11px] font-bold text-blue-600">
                      {c.invoiceNumber}
                    </td>

                    {/* Claim Amount */}
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatRupee(c.claimAmount)}
                    </td>

                    {/* Approved Amount */}
                    <td className="py-3 px-4 text-right font-bold">
                      {c.approvedAmount !== null && c.approvedAmount !== undefined ? (
                        <span className="text-emerald-700">{formatRupee(c.approvedAmount)}</span>
                      ) : (
                        <span className="text-slate-400 font-normal">—</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      <InsuranceStatusBadge status={c.status} />
                    </td>

                    {/* Last Updated */}
                    <td className="py-3 px-3 text-slate-600 font-medium text-[11px]">
                      {c.lastUpdatedDate || "31 May 2025"}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center relative">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onViewClaim(c)}
                          className="p-1 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(activeMenuId === c._id ? null : c._id)
                          }
                          className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Popup Action Menu */}
                      {activeMenuId === c._id && (
                        <div className="absolute right-3 top-10 bg-white border border-slate-200 rounded-xl shadow-xl z-30 w-44 p-1 text-left text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              onViewClaim(c);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-bold text-slate-800 rounded-lg"
                          >
                            View Details
                          </button>
                          {c.status !== "Approved" && c.status !== "Settled" && (
                            <button
                              type="button"
                              onClick={() => {
                                const appAmt = prompt("Enter Approved Amount (₹):", c.claimAmount);
                                if (appAmt) {
                                  onUpdateStatus(c._id, "Approved", { approvedAmount: Number(appAmt) });
                                }
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 font-bold text-emerald-700 rounded-lg"
                            >
                              Mark Approved
                            </button>
                          )}
                          {c.status === "Approved" && (
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateStatus(c._id, "Settled");
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-blue-50 font-bold text-blue-700 rounded-lg"
                            >
                              Mark Settled
                            </button>
                          )}
                          {c.status !== "Rejected" && c.status !== "Settled" && (
                            <button
                              type="button"
                              onClick={() => {
                                const reason = prompt("Enter Rejection Reason:");
                                if (reason) {
                                  onUpdateStatus(c._id, "Rejected", { rejectionReason: reason });
                                }
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-rose-50 font-bold text-rose-600 rounded-lg"
                            >
                              Reject Claim
                            </button>
                          )}
                        </div>
                      )}
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
        <span>Showing 1 to {claims.length} of {claims.length} entries</span>
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
