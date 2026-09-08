import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { CheckCircle2 } from "lucide-react";
import { formatRupee } from "../../../billing/helpers/invoiceCalculations.js";

export default function ClaimSettlementDetailsModal({ isOpen, onClose, claim, onSuccess }) {
  const [utrNumber, setUtrNumber] = useState(claim?.settlementDetails?.utrNumber || "");
  const [bankName, setBankName] = useState(claim?.settlementDetails?.bankName || "");
  const [settledAmount, setSettledAmount] = useState(claim?.settledAmount || claim?.approvedAmount || claim?.claimAmount || 0);
  const [paymentMode, setPaymentMode] = useState(claim?.settlementDetails?.paymentMode || "NEFT/RTGS");
  const [settlementDate, setSettlementDate] = useState(claim?.settlementDetails?.settlementDate || new Date().toISOString().split("T")[0]);

  if (!claim) return null;

  const isAlreadySettled = (claim.status || "").toLowerCase() === "settled";

  const handleSettleSubmit = (e) => {
    e.preventDefault();
    onSuccess?.(claim._id || claim.claimNumber, {
      status: "Settled",
      approvedAmount: Number(settledAmount),
      settlementDetails: {
        utrNumber,
        bankName,
        settlementDate,
        settledAmount: Number(settledAmount),
        paymentMode,
      },
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAlreadySettled ? "Claim Disbursal & Settlement Receipt" : "Process Claim Disbursal & Settlement"}
      subtitle={`Claim No: ${claim.claimNumber} — Patient: ${claim.patientName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSettleSubmit} className="space-y-4 text-xs font-medium">
        <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-700">Approved Amount</span>
            <p className="font-extrabold text-emerald-950 text-base">{formatRupee(claim.approvedAmount || claim.claimAmount)}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* UTR / Reference Number */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Bank UTR / Transaction Ref No.</label>
            <input
              type="text"
              disabled={isAlreadySettled}
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="Enter Bank UTR Ref No."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Settled Amount */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Final Settled Amount (INR)</label>
            <input
              type="number"
              disabled={isAlreadySettled}
              value={settledAmount}
              onChange={(e) => setSettledAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-emerald-700 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">TPA / Insurance Remitter Bank Name</label>
            <input
              type="text"
              disabled={isAlreadySettled}
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. HDFC Bank / ICICI Bank"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Payment Mode & Date */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Payment Mode</label>
              <select
                disabled={isAlreadySettled}
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="NEFT/RTGS">NEFT / RTGS</option>
                <option value="Direct Bank Transfer">Direct Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Disbursed Date</label>
              <input
                type="date"
                disabled={isAlreadySettled}
                value={settlementDate}
                onChange={(e) => setSettlementDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>
          {!isAlreadySettled && (
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & Mark Settled</span>
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
