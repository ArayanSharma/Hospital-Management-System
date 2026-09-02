import React from "react";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
  onDeletePolicy,
  loading,
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
      {/* Shared Table Controls Bar */}
      <TableControls
        title="Insurance Policies"
        subtitle="Manage patient insurance policies"
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        statusOptions={POLICY_STATUSES}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search by patient name, policy no..."
        actionButtonText="+ Add New Policy"
        onActionButtonClick={onOpenAddPolicy}
      />

      {/* Policies Table */}
      <div className="border border-slate-200/80 rounded-xl overflow-hidden">
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
              <th className="py-3 px-3 text-center">Actions</th>
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
                const pName = p.patientName || "Patient";
                const pUhid = p.uhid ? `(${p.uhid})` : "(UHID12345)";

                return (
                  <tr key={p._id || idx} className="hover:bg-slate-50/50 transition-colors">
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

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onViewPolicy(p)}
                          className="p-1 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditPolicy(p)}
                          className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                          title="Edit Policy"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeletePolicy(p._id)}
                          className="p-1 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                          title="Deactivate Policy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
