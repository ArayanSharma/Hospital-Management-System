import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";
import { UserCheck } from "lucide-react";

export default function OpdAssignDoctorModal({ visit, doctorList = [], isOpen, onClose, onAssign, submitting }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  useEffect(() => {
    if (visit) {
      setSelectedDoctorId(visit.doctorId?._id || "");
    }
  }, [visit]);

  if (!visit) return null;

  const doctorOptions = doctorList.map((doc) => ({
    value: doc._id,
    label: `Dr. ${doc.userId?.name || doc.name} - ${doc.specialization || "General Physician"}`,
  }));

  const handleSave = () => {
    onAssign(visit._id, selectedDoctorId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Doctor to OPD Visit"
      subtitle={`Select consulting doctor for patient ${visit.patientId?.name || "Patient"}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3 text-purple-800">
          <UserCheck className="w-5 h-5 text-purple-600 shrink-0" />
          <p className="font-semibold leading-tight">
            Assigning a doctor will move patient to the doctor's live OPD consultation queue.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Select Doctor</label>
          <CustomDropdown
            label="Doctor"
            value={selectedDoctorId}
            options={doctorOptions}
            onChange={setSelectedDoctorId}
            minWidth="100%"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={submitting || !selectedDoctorId}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Assigning..." : "Confirm Assign Doctor"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
