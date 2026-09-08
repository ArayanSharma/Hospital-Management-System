import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { Receipt, Printer, ExternalLink, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function IpdBillingModal({ isOpen, onClose, admissions = [] }) {
  const navigate = useNavigate();
  const [selectedAdmissionId, setSelectedAdmissionId] = useState("");

  const activeAdmissions = admissions.filter((a) => a.status === "admitted");
  const selectedAdmission = activeAdmissions.find((a) => a._id === selectedAdmissionId);

  // Bill calculation mock/live numbers
  const dailyRent = selectedAdmission?.dailyRent || 1500;
  const admissionDate = selectedAdmission?.admissionDate ? new Date(selectedAdmission.admissionDate) : new Date();
  const diffDays = Math.max(1, Math.ceil((new Date() - admissionDate) / (1000 * 60 * 60 * 24)));

  const roomCharges = dailyRent * diffDays;
  const doctorCharges = 800 * diffDays;
  const nursingCharges = 350 * diffDays;
  const labCharges = 1200;
  const medicineCharges = 1850;

  const subtotal = roomCharges + doctorCharges + nursingCharges + labCharges + medicineCharges;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const advancePaid = 3000;
  const totalBalance = Math.max(0, subtotal + tax - advancePaid);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="IPD Live Billing Calculator & Estimate"
      subtitle="View itemized billing charges and live balance for admitted patients"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        {/* Select Admission */}
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">Select Admitted Patient</label>
          <select
            value={selectedAdmissionId}
            onChange={(e) => setSelectedAdmissionId(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="">Select Admitted Patient</option>
            {activeAdmissions.map((adm) => (
              <option key={adm._id} value={adm._id}>
                {adm.patientId?.name || "Patient"} ({adm.admissionId}) — Bed: {adm.bedId?.bedNumber || "N/A"}
              </option>
            ))}
          </select>
        </div>

        {selectedAdmission ? (
          <div className="space-y-3">
            {/* Patient Header Banner */}
            <div className="p-3 bg-teal-50/60 border border-teal-200/80 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{selectedAdmission.patientId?.name}</h4>
                <p className="text-[11px] text-teal-800 font-semibold mt-0.5">
                  Admitted Days: <span className="font-bold text-slate-900">{diffDays} Days</span> | Ward: {selectedAdmission.wardId?.name}
                </p>
              </div>
              <Calculator className="w-6 h-6 text-teal-600 shrink-0" />
            </div>

            {/* Itemized Billing Breakdown Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Service Particulars</th>
                    <th className="p-2.5 text-center">Qty / Days</th>
                    <th className="p-2.5 text-right">Rate (₹)</th>
                    <th className="p-2.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="p-2.5">Bed / Room Rent ({selectedAdmission.bedType || "Standard"})</td>
                    <td className="p-2.5 text-center">{diffDays} Days</td>
                    <td className="p-2.5 text-right">₹{dailyRent}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">₹{roomCharges.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Doctor Consultation Fees</td>
                    <td className="p-2.5 text-center">{diffDays} Visits</td>
                    <td className="p-2.5 text-right">₹800</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">₹{doctorCharges.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Nursing &amp; Care Services</td>
                    <td className="p-2.5 text-center">{diffDays} Days</td>
                    <td className="p-2.5 text-right">₹350</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">₹{nursingCharges.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Laboratory Test Orders</td>
                    <td className="p-2.5 text-center">3 Tests</td>
                    <td className="p-2.5 text-right">—</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">₹{labCharges.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Pharmacy / Medicines Dispersed</td>
                    <td className="p-2.5 text-center">5 Items</td>
                    <td className="p-2.5 text-right">—</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">₹{medicineCharges.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs border border-slate-200">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal Charges:</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>GST Tax (5%):</span>
                <span className="font-semibold">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700">
                <span>Advance Deposit Paid:</span>
                <span className="font-semibold">- ₹{advancePaid.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                <span>Net Payable Balance:</span>
                <span className="text-teal-700">₹{totalBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 border border-dashed rounded-xl">
            Select an admitted patient above to view live IPD bill estimate.
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/billing");
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Main Billing Module</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!selectedAdmission}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Bill</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
