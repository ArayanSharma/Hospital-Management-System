import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";
import { Edit2, AlertCircle } from "lucide-react";
import api from "../../../../lib/axios.js";
import { useDoctors } from "../../../doctors/hooks/useDoctors.js";

export default function LabEditOrderModal({ test, isOpen, onClose, onSuccess }) {
  const { doctors: rawDoctors } = useDoctors();
  const doctorList = Array.isArray(rawDoctors) ? rawDoctors : rawDoctors?.doctors || [];

  const [testName, setTestName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [priority, setPriority] = useState("routine");
  const [sampleType, setSampleType] = useState("Blood");
  const [visitType, setVisitType] = useState("OPD Visit");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sampleOptions = [
    { value: "Blood", label: "Blood (EDTA / Serum)" },
    { value: "Urine", label: "Urine Sample" },
    { value: "Swab", label: "Nasopharyngeal Swab" },
    { value: "Tissue", label: "Tissue / Biopsy" },
    { value: "Sputum", label: "Sputum Sample" },
  ];

  const priorityOptions = [
    { value: "routine", label: "Routine" },
    { value: "urgent", label: "Urgent" },
    { value: "emergency", label: "Emergency" },
  ];

  const visitOptions = [
    { value: "OPD Visit", label: "OPD Visit" },
    { value: "IPD Admission", label: "IPD Admission" },
  ];

  const doctorOptions = doctorList.map((doc) => ({
    value: doc._id,
    label: `Dr. ${doc.userId?.name || doc.name || "Doctor"} (${doc.specialization || "General"})`,
  }));

  useEffect(() => {
    if (test) {
      setTestName(test.testName || "Complete Blood Count (CBC)");
      setDoctorId(test.doctorId?._id || (typeof test.doctorId === "string" ? test.doctorId : ""));
      setPriority(test.priority || "routine");
      setSampleType(test.sampleType || "Blood");
      setVisitType(test.visitType || "OPD Visit");
      setClinicalNotes(test.clinicalNotes || "");
    }
  }, [test]);

  if (!test) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      sampleType,
      priority,
      clinicalNotes,
    };

    if (testName) payload.testName = testName;
    if (visitType) payload.visitType = visitType;
    if (doctorId && String(doctorId).length === 24) payload.doctorId = doctorId;

    try {
      await api.patch(`/lab-tests/${test._id}`, payload);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update test order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Lab Order Details"
      subtitle={`Order #${test.orderId || test._id} — Patient: ${test.patientId?.name || "Patient"}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Sample Type */}
        <CustomDropdown
          label="Sample Type"
          value={sampleType}
          options={sampleOptions}
          onChange={setSampleType}
          fullWidth
        />

        {/* Priority Level */}
        <CustomDropdown
          label="Priority Level"
          value={priority}
          options={priorityOptions}
          onChange={setPriority}
          fullWidth
        />

        {/* Doctor Select (if available) */}
        {doctorOptions.length > 0 && (
          <CustomDropdown
            label="Attending Doctor"
            value={doctorId}
            options={doctorOptions}
            onChange={setDoctorId}
            fullWidth
          />
        )}

        {/* Visit Type */}
        <CustomDropdown
          label="Visit Type"
          value={visitType}
          options={visitOptions}
          onChange={setVisitType}
          fullWidth
        />

        {/* Clinical Notes */}
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">Clinical Instructions / Notes</label>
          <textarea
            rows={3}
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Add special testing instructions..."
            className="w-full bg-white border border-slate-200 text-slate-800 p-2.5 rounded-xl focus:outline-none resize-none"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Edit2 className="w-4 h-4" />
            <span>{submitting ? "Updating..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
