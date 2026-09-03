import React, { useState } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";
import { UserCheck } from "lucide-react";

export default function DepartmentAssignHodModal({ department, doctorList = [], isOpen, onClose, onAssign, submitting }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(department?.headDoctorId?._id || "");

  React.useEffect(() => {
    if (department) {
      setSelectedDoctorId(department?.headDoctorId?._id || "");
    }
  }, [department]);

  if (!department) return null;

  const hodOptions = [
    { value: "", label: "No HOD (Unassign)" },
    ...doctorList.map((doc) => ({
      value: doc._id,
      label: `Dr. ${doc.userId?.name || doc.name || "Doctor"} - (${doc.specialization || "General"})`,
    })),
  ];

  const handleSave = () => {
    onAssign(department._id, selectedDoctorId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign / Change Head of Department (HOD)"
      subtitle={`Select a senior doctor to head ${department.name}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-blue-800">
          <UserCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <p className="font-semibold leading-tight">
            Assigning an HOD grants administrative oversight for medical decisions in {department.name}.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Select HOD Doctor</label>
          <CustomDropdown
            label="HOD Doctor"
            value={selectedDoctorId}
            options={hodOptions}
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
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save HOD Assignment"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
