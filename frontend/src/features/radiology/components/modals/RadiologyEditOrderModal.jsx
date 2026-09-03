import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";
import { Edit2, AlertCircle } from "lucide-react";
import api from "../../../../lib/axios.js";

export default function RadiologyEditOrderModal({ order, isOpen, onClose, onSuccess }) {
  const [modality, setModality] = useState("X-Ray");
  const [bodyRegion, setBodyRegion] = useState("Chest");
  const [priority, setPriority] = useState("routine");
  const [clinicalHistory, setClinicalHistory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const modalityOptions = [
    { value: "X-Ray", label: "X-Ray Radiograph" },
    { value: "MRI", label: "MRI Scan" },
    { value: "CT Scan", label: "CT Scan" },
    { value: "Ultrasound", label: "Ultrasound (USG)" },
    { value: "Mammography", label: "Mammography" },
  ];

  const bodyRegionOptions = [
    { value: "Chest", label: "Chest / Thorax" },
    { value: "Abdomen", label: "Abdomen & Pelvis" },
    { value: "Brain", label: "Head / Brain" },
    { value: "Spine", label: "Lumbar / Cervical Spine" },
    { value: "Extremity", label: "Upper / Lower Limb" },
  ];

  const priorityOptions = [
    { value: "routine", label: "Routine" },
    { value: "urgent", label: "Urgent" },
    { value: "emergency", label: "Emergency" },
  ];

  useEffect(() => {
    if (order) {
      setModality(order.modality || order.testType || "X-Ray");
      setBodyRegion(order.bodyRegion || order.bodyPart || "Chest");
      setPriority(order.priority || "routine");
      setClinicalHistory(order.clinicalHistory || "");
    }
  }, [order]);

  if (!order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      await api.patch(`/radiology-tests/${order._id}`, {
        modality,
        bodyRegion,
        priority,
        clinicalHistory,
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update radiology scan order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Radiology Scan Order"
      subtitle={`Order #${order.orderId || order._id}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <CustomDropdown
          label="Modality"
          value={modality}
          options={modalityOptions}
          onChange={setModality}
          fullWidth
        />

        <CustomDropdown
          label="Body Region"
          value={bodyRegion}
          options={bodyRegionOptions}
          onChange={setBodyRegion}
          fullWidth
        />

        <CustomDropdown
          label="Priority Level"
          value={priority}
          options={priorityOptions}
          onChange={setPriority}
          fullWidth
        />

        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700">Clinical History / Indications</label>
          <textarea
            rows={3}
            value={clinicalHistory}
            onChange={(e) => setClinicalHistory(e.target.value)}
            placeholder="Add relevant clinical history..."
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
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Edit2 className="w-4 h-4" />
            <span>{submitting ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
