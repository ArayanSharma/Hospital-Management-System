import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  UserPlus,
  Stethoscope,
  Bed as BedIcon,
  Plus,
  CheckCircle2,
  Info,
  ChevronDown,
} from "lucide-react";
import { createAdmissionApi } from "../../admissions/services/admission.api.js";
import { useDoctorOptions } from "../../../hooks/useDoctorOptions.js";
import { useDepartmentOptions } from "../../../hooks/useDepartmentOptions.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/axios.js";

export default function AdmitPatientModal({ isOpen, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  // Dynamic Wards & Beds State
  const [wards, setWards] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState("");
  const [selectedWardObj, setSelectedWardObj] = useState(null);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingBeds, setLoadingBeds] = useState(false);

  const { departments: rawDepts } = useDepartmentOptions();
  const deptList = Array.isArray(rawDepts) ? rawDepts : rawDepts?.departments || [];

  const { doctors: rawDoctors, loading: loadingDoctors } = useDoctorOptions(selectedDept);
  const doctorList = Array.isArray(rawDoctors) ? rawDoctors : rawDoctors?.doctors || [];

  const defaultDateTime = new Date().toISOString().slice(0, 16);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientId: "",
      departmentId: "",
      doctorId: "",
      wardId: "",
      bedId: "",
      reason: "",
      provisionalDiagnosis: "",
      allergies: "",
      medicalHistory: "",
      notes: "",
      admissionDate: defaultDateTime,
      dailyRent: 1500,
      bedType: "Standard Bed",
    },
  });

  // Fetch Wards from MongoDB API
  useEffect(() => {
    if (!isOpen) return;

    const fetchWards = async () => {
      setLoadingWards(true);
      try {
        const { data } = await api.get("/wards");
        const wardList = Array.isArray(data.data) ? data.data : data.data?.wards || [];
        setWards(wardList);
        if (wardList.length > 0) {
          const firstWard = wardList[0];
          setSelectedWardId(firstWard._id);
          setSelectedWardObj(firstWard);
          setValue("wardId", firstWard._id);
        }
      } catch (err) {
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [isOpen, setValue]);

  // Fetch Available Beds when selected Ward changes
  useEffect(() => {
    if (!selectedWardId) {
      setAvailableBeds([]);
      return;
    }

    const fetchBeds = async () => {
      setLoadingBeds(true);
      try {
        const { data } = await api.get(`/beds/available?wardId=${selectedWardId}`);
        const bedList = Array.isArray(data.data) ? data.data : data.data?.beds || [];
        setAvailableBeds(bedList);
        if (bedList.length > 0) {
          setValue("bedId", bedList[0]._id);
        } else {
          setValue("bedId", "");
        }
      } catch (err) {
        setAvailableBeds([]);
      } finally {
        setLoadingBeds(false);
      }
    };

    fetchBeds();
  }, [selectedWardId, setValue]);

  if (!isOpen) return null;

  const handleFormSubmit = async (formData) => {
    if (!formData.wardId) {
      setErrorMsg("Please select a ward.");
      return;
    }
    if (!formData.bedId) {
      setErrorMsg("Please select an available bed.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await createAdmissionApi({
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        wardId: formData.wardId,
        bedId: formData.bedId,
        reason: formData.reason || "IPD Admission",
        provisionalDiagnosis: formData.provisionalDiagnosis || "",
        allergies: formData.allergies || "",
        medicalHistory: formData.medicalHistory || "",
        notes: formData.notes || "",
        admissionDate: formData.admissionDate,
        dailyRent: Number(formData.dailyRent) || 1500,
        bedType: formData.bedType || "Standard Bed",
      });
      reset();
      onClose();
      if (onSuccess) onSuccess();
      alert("Patient admitted successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to admit patient");
    } finally {
      setSubmitting(false);
    }
  };

  // Ward Capacity Metrics Calculation
  const wardCapacity = selectedWardObj?.capacity || selectedWardObj?.total || 30;
  const availCount = selectedWardObj?.available ?? availableBeds.length;
  const occCount = Math.max(0, wardCapacity - availCount);
  const occPct = wardCapacity > 0 ? Math.round((occCount / wardCapacity) * 100) : 0;
  const availPct = 100 - occPct;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-2xl w-full p-5 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Admit New Patient
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Section 1: Patient Information */}
          <div className="space-y-1.5 relative z-30">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-800">
                Patient Information
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/patients");
                }}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Patient</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Select Patient <span className="text-rose-500">*</span>
              </label>
              <Controller
                name="patientId"
                control={control}
                rules={{ required: "Patient is required" }}
                render={({ field }) => (
                  <PatientAutocomplete
                    value={field.value}
                    onChange={(id) => field.onChange(id)}
                    error={errors.patientId?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Section 2: Admission Details */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-3.5 relative z-20">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              Admission Details
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Attending Doctor <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("doctorId", { required: "Doctor is required" })}
                    disabled={loadingDoctors}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Doctor</option>
                    {doctorList.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        Dr. {doc.userId?.name || doc.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {errors.doctorId && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.doctorId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(e.target.value);
                      setValue("departmentId", e.target.value);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select Department</option>
                    {deptList.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Admission Date &amp; Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("admissionDate")}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Reason for Admission <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("reason", { required: "Reason is required" })}
                  placeholder="Enter reason for admission"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none font-medium"
                />
                {errors.reason && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.reason.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Provisional Diagnosis
                </label>
                <input
                  type="text"
                  {...register("provisionalDiagnosis")}
                  placeholder="Enter provisional diagnosis"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Ward & Bed Allocation */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-3.5 relative z-10">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <BedIcon className="w-3.5 h-3.5" />
              Ward &amp; Bed Allocation
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ward <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedWardId}
                    disabled={loadingWards}
                    onChange={(e) => {
                      const wId = e.target.value;
                      setSelectedWardId(wId);
                      setValue("wardId", wId);
                      const found = wards.find((w) => w._id === wId);
                      setSelectedWardObj(found || null);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer"
                  >
                    {wards.length === 0 && <option value="">No wards available</option>}
                    {wards.map((w) => (
                      <option key={w._id} value={w._id}>
                        {w.name} ({w.floor || "Floor 1"})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Bed <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("bedId", { required: "Bed is required" })}
                    disabled={loadingBeds}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer"
                  >
                    {availableBeds.length === 0 ? (
                      <option value="">No available beds in ward</option>
                    ) : (
                      availableBeds.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.bedNumber} (Available)
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Bed Type
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedWardObj?.type || "Standard Bed"}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Daily Rent (₹)
                </label>
                <input
                  type="text"
                  readOnly
                  value="₹ 2,500"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Ward Occupancy Summary Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <BedIcon className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">Ward Capacity</span>
                <span className="font-bold text-slate-900">{wardCapacity} Beds</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-rose-600 font-bold">
                  Occupied Beds: {occCount} Beds ({occPct}%)
                </span>
                <span className="text-emerald-600 font-bold">
                  Available Beds: {availCount} Beds ({availPct}%)
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Additional Information */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-3 relative z-0">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Additional Information
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Allergies (if any)
                </label>
                <input
                  type="text"
                  {...register("allergies")}
                  placeholder="Enter known allergies"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Medical History (if any)
                </label>
                <input
                  type="text"
                  {...register("medicalHistory")}
                  placeholder="Enter medical history"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Special Instructions / Notes
              </label>
              <textarea
                rows={2}
                {...register("notes")}
                placeholder="Enter any special instructions or notes"
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none resize-none"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || availableBeds.length === 0}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? "Admitting..." : "Admit Patient"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
