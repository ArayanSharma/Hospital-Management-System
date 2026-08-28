import React, { useState, useEffect } from "react";
import { UserCheck, CheckCircle2, User, Bed as BedIcon, AlertCircle } from "lucide-react";
import { dischargePatientApi } from "../../admissions/services/admission.api.js";

export default function DischargePatientModal({ isOpen, onClose, onSuccess, admissions = [], selectedAdmission }) {
  const [selectedAdmId, setSelectedAdmId] = useState("");
  const [dischargeSummary, setDischargeSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Filter ONLY currently admitted patients
  const activeAdmittedList = admissions.filter((adm) => adm.status === "admitted");

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setDischargeSummary("");
      if (selectedAdmission?._id && selectedAdmission.status === "admitted") {
        setSelectedAdmId(selectedAdmission._id);
      } else if (activeAdmittedList.length > 0) {
        setSelectedAdmId(activeAdmittedList[0]._id);
      } else {
        setSelectedAdmId("");
      }
    }
  }, [isOpen, selectedAdmission]);

  if (!isOpen) return null;

  const currentSelectedAdm = activeAdmittedList.find((adm) => adm._id === selectedAdmId);

  const handleDischarge = async (e) => {
    e.preventDefault();
    if (!selectedAdmId) {
      setErrorMsg("Please select an admitted patient to discharge.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await dischargePatientApi(selectedAdmId, {
        dischargeSummary: dischargeSummary.trim() || "Discharged in stable condition.",
      });
      setSelectedAdmId("");
      setDischargeSummary("");
      onClose();
      if (onSuccess) onSuccess();
      alert("Patient discharged successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to discharge patient");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-md w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Discharge Patient</h3>
              <p className="text-xs text-slate-400 mt-0.5">Complete patient IPD stay &amp; release bed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleDischarge} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Admitted Patient <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedAdmId}
              onChange={(e) => setSelectedAdmId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {activeAdmittedList.length === 0 ? (
                <option value="">No currently admitted patients to discharge</option>
              ) : (
                activeAdmittedList.map((adm) => (
                  <option key={adm._id} value={adm._id}>
                    {adm.patientId?.name || "Patient"} ({adm.bedId?.bedNumber || "Bed"}) — {adm.wardId?.name || "Ward"}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Patient Card Preview */}
          {currentSelectedAdm && (
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>{currentSelectedAdm.patientId?.name || "Patient"}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  {currentSelectedAdm.patientId?.patientId || "PAT-0001"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400">Ward &amp; Bed:</span>{" "}
                  <span className="font-semibold text-slate-800">
                    {currentSelectedAdm.wardId?.name} ({currentSelectedAdm.bedId?.bedNumber})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Doctor:</span>{" "}
                  <span className="font-semibold text-slate-800">
                    Dr. {currentSelectedAdm.doctorId?.userId?.name || currentSelectedAdm.doctorId?.name || "Doctor"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Discharge Summary / Instructions
            </label>
            <textarea
              rows={3}
              value={dischargeSummary}
              onChange={(e) => setDischargeSummary(e.target.value)}
              placeholder="e.g. Patient recovered well. Discharged in stable condition with 7 days medication..."
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedAdmId}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? "Discharging..." : "Complete Discharge"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
