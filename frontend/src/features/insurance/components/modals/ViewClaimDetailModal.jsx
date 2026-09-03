import React from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { formatRupee } from "../../../billing/helpers/invoiceCalculations.js";
import InsuranceStatusBadge from "../common/InsuranceStatusBadge.jsx";

export default function ViewClaimDetailModal({ isOpen, onClose, claim, onOpenSettlement, onOpenRejection, onOpenAddNote }) {
  if (!claim) return null;

  const rawStatus = (claim.status || "Submitted").toLowerCase();
  const isSettled = rawStatus === "settled";
  const isRejected = rawStatus === "rejected";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Insurance Claim Master Details"
      subtitle={`Claim No: ${claim.claimNumber} — Patient: ${claim.patientName} (${claim.uhid})`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5 text-xs font-medium">
        {/* Top Header Card */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50/50 border border-purple-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{claim.claimNumber}</h3>
                <InsuranceStatusBadge status={claim.status || "Submitted"} />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Policy No: <span className="font-mono text-slate-700 font-bold">{claim.policyNumber}</span> | Provider: <span className="font-semibold text-slate-700">{claim.providerName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSettled && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettlement?.(claim);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>View Settlement</span>
              </button>
            )}

            {isRejected && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRejection?.(claim);
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Rejection Reason</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAddNote?.(claim);
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Add Note</span>
            </button>
          </div>
        </div>

        {/* Financial Amounts Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Claimed Amount</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{formatRupee(claim.claimAmount)}</span>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
            <span className="text-[10px] font-bold text-emerald-600 uppercase block">Approved Amount</span>
            <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">{formatRupee(claim.approvedAmount || 0)}</span>
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl">
            <span className="text-[10px] font-bold text-blue-600 uppercase block">Settled Disbursed</span>
            <span className="font-extrabold text-blue-700 text-sm mt-0.5 block">{formatRupee(claim.settledAmount || 0)}</span>
          </div>

          <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-2xl">
            <span className="text-[10px] font-bold text-rose-600 uppercase block">Patient Co-Pay Balance</span>
            <span className="font-extrabold text-rose-700 text-sm mt-0.5 block">{formatRupee(claim.patientPayable || 0)}</span>
          </div>
        </div>

        {/* Patient & Treatment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200/60 pb-1.5">Admission & Patient Information</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Patient Name:</span>
                <span className="font-bold text-slate-800">{claim.patientName} ({claim.uhid || "N/A"})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Admission Type:</span>
                <span className="font-semibold text-slate-800">{claim.admissionType || "OPD/IPD"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Treatment Date:</span>
                <span className="font-semibold text-slate-800">{claim.treatmentDate || claim.submittedDate || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Linked Invoice:</span>
                <span className="font-mono font-bold text-blue-600">{claim.invoiceNumber || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs border-b border-slate-200/60 pb-1.5">Clinical Diagnosis & Remarks</h4>
            <div className="space-y-1.5 text-[11px]">
              <div>
                <span className="text-slate-400 block">Primary Diagnosis:</span>
                <span className="font-bold text-slate-800 block mt-0.5">{claim.diagnosis || "Clinical Diagnosis Pending"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Treatment Summary / Remarks:</span>
                <span className="font-medium text-slate-600 block mt-0.5">{claim.treatmentSummary || claim.remarks || "No additional remarks logged."}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settlement Info if Settled */}
        {claim.settlementDetails && claim.settlementDetails.utrNumber && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
            <h5 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settlement Disbursal Details</span>
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-emerald-700 block">UTR Number</span>
                <span className="font-mono font-bold text-emerald-950">{claim.settlementDetails.utrNumber}</span>
              </div>
              <div>
                <span className="text-emerald-700 block">Bank Name</span>
                <span className="font-bold text-emerald-950">{claim.settlementDetails.bankName || "Bank Transfer"}</span>
              </div>
              <div>
                <span className="text-emerald-700 block">Disbursed Date</span>
                <span className="font-bold text-emerald-950">{claim.settlementDetails.settlementDate || "N/A"}</span>
              </div>
              <div>
                <span className="text-emerald-700 block">Payment Mode</span>
                <span className="font-bold text-emerald-950">{claim.settlementDetails.paymentMode || "NEFT"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
