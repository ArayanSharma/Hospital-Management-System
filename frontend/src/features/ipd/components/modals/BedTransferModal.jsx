import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import { ArrowRightLeft, BedDouble, AlertCircle } from "lucide-react";
import api from "../../../../lib/axios.js";

export default function BedTransferModal({ isOpen, onClose, onSuccess, admissions = [] }) {
  const [selectedAdmissionId, setSelectedAdmissionId] = useState("");
  const [targetWardId, setTargetWardId] = useState("");
  const [targetBedId, setTargetBedId] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [wards, setWards] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const activeAdmissions = admissions.filter((a) => a.status === "admitted");

  // Fetch Wards
  useEffect(() => {
    if (isOpen) {
      api.get("/wards").then((res) => {
        setWards(Array.isArray(res.data.data) ? res.data.data : res.data.data?.wards || []);
      }).catch(() => setWards([]));
    }
  }, [isOpen]);

  // Fetch Beds when target Ward changes
  useEffect(() => {
    if (targetWardId) {
      api.get(`/beds?wardId=${targetWardId}&status=available`).then((res) => {
        setAvailableBeds(Array.isArray(res.data.data) ? res.data.data : res.data.data?.beds || []);
      }).catch(() => setAvailableBeds([]));
    } else {
      setAvailableBeds([]);
    }
  }, [targetWardId]);

  const currentAdmission = activeAdmissions.find((a) => a._id === selectedAdmissionId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdmissionId || !targetBedId) {
      setErrorMsg("Please select patient admission and target bed.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await api.patch(`/ipd/admissions/${selectedAdmissionId}/transfer`, {
        newWardId: targetWardId,
        newBedId: targetBedId,
        transferReason: transferReason || "Patient transferred to another bed/ward",
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to transfer bed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Patient / Bed Transfer"
      subtitle="Transfer an admitted patient to another ward or bed slot"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* 1. Select Admitted Patient */}
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">
            Select Admitted Patient <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedAdmissionId}
            onChange={(e) => {
              setSelectedAdmissionId(e.target.value);
              setErrorMsg("");
            }}
            className="w-full bg-white border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
          >
            <option value="">Select Patient Admission</option>
            {activeAdmissions.map((adm) => (
              <option key={adm._id} value={adm._id}>
                {adm.patientId?.name || "Patient"} ({adm.admissionId}) — Current: {adm.wardId?.name || "Ward"} / Bed {adm.bedId?.bedNumber || "N/A"}
              </option>
            ))}
          </select>
        </div>

        {/* Current Bed Info Banner */}
        {currentAdmission && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between text-purple-900">
            <div>
              <p className="font-bold text-xs">{currentAdmission.patientId?.name}</p>
              <p className="text-[11px] text-purple-700 mt-0.5">
                Current Ward: <span className="font-bold">{currentAdmission.wardId?.name}</span> | Bed: <span className="font-bold">{currentAdmission.bedId?.bedNumber}</span>
              </p>
            </div>
            <BedDouble className="w-5 h-5 text-purple-600 shrink-0" />
          </div>
        )}

        {/* 2. Target Ward */}
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">
            Target Ward <span className="text-rose-500">*</span>
          </label>
          <select
            value={targetWardId}
            onChange={(e) => {
              setTargetWardId(e.target.value);
              setTargetBedId("");
            }}
            className="w-full bg-white border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="">Select Destination Ward</option>
            {wards.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name} ({w.floor || "Floor 1"}) — {w.type}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Target Bed */}
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">
            Target Available Bed <span className="text-rose-500">*</span>
          </label>
          <select
            value={targetBedId}
            onChange={(e) => setTargetBedId(e.target.value)}
            disabled={!targetWardId}
            className="w-full bg-white border border-slate-200 text-slate-800 font-semibold p-2.5 rounded-xl focus:outline-none cursor-pointer disabled:bg-slate-100"
          >
            <option value="">Select Target Bed</option>
            {availableBeds.map((b) => (
              <option key={b._id} value={b._id}>
                Bed {b.bedNumber} ({b.type || "Standard Bed"})
              </option>
            ))}
          </select>
        </div>

        {/* 4. Reason */}
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">Transfer Reason</label>
          <textarea
            rows={2}
            value={transferReason}
            onChange={(e) => setTransferReason(e.target.value)}
            placeholder="e.g. Shifted to ICU for critical care, Upgrade to Private Deluxe Ward..."
            className="w-full bg-white border border-slate-200 text-slate-800 p-2.5 rounded-xl focus:outline-none resize-none"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !selectedAdmissionId || !targetBedId}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{submitting ? "Transferring..." : "Confirm Bed Transfer"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
