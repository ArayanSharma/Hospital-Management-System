import React, { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  User,
  Building2,
  Stethoscope,
  Calendar,
  Activity,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { createOPDVisitApi } from "../services/opdVisit.api.js";
import { useDoctorOptions } from "../../../hooks/useDoctorOptions.js";
import { useDepartmentOptions } from "../../../hooks/useDepartmentOptions.js";
import { getAppointmentsApi } from "../../appointments/services/appointment.api.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import api from "../../../lib/axios.js";

export default function OpdVisitFormModal({ isOpen, onClose, onSuccess }) {
  const [visitType, setVisitType] = useState("walk-in"); // "walk-in" | "appointment"
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientId: "",
      departmentId: "",
      doctorId: "",
      appointmentId: "",
      symptoms: "",
      notes: "",
      visitDate: defaultDateTime,
      temp: "98.6",
      bp: "120/80",
      pulse: "78",
      weight: "65.2",
      height: "165",
      spO2: "98",
    },
  });

  const watchPatientId = useWatch({ control, name: "patientId" });
  const watchSymptoms = watch("symptoms") || "";
  const watchNotes = watch("notes") || "";

  // Fetch Patient Details for Preview Card
  useEffect(() => {
    if (!watchPatientId) {
      setSelectedPatientDetails(null);
      return;
    }
    const fetchPatient = async () => {
      try {
        const { data } = await api.get(`/patients/${watchPatientId}`);
        setSelectedPatientDetails(data.data);
      } catch (err) {
        setSelectedPatientDetails(null);
      }
    };
    fetchPatient();
  }, [watchPatientId]);

  // Fetch Appointments if "From Appointment" is selected
  useEffect(() => {
    if (visitType === "appointment") {
      const fetchAppts = async () => {
        try {
          const { data } = await getAppointmentsApi({ status: "scheduled", limit: 20 });
          setAppointmentsList(data.data?.appointments || []);
        } catch (err) {
          setAppointmentsList([]);
        }
      };
      fetchAppts();
    }
  }, [visitType]);

  if (!isOpen) return null;

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    setErrorMsg("");
    try {
      await createOPDVisitApi({
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        appointmentId: formData.appointmentId || null,
        visitType: visitType,
        symptoms: formData.symptoms || "Routine OPD Consultation",
        notes: formData.notes || "",
        visitDate: formData.visitDate,
        vitals: {
          temperature: parseFloat(formData.temp) || 98.6,
          bloodPressure: formData.bp || "120/80",
          pulse: parseInt(formData.pulse, 10) || 78,
          weight: parseFloat(formData.weight) || 65.2,
          height: parseFloat(formData.height) || 165,
          spO2: parseInt(formData.spO2, 10) || 98,
        },
      });
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to create OPD Visit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-2xl w-full p-5 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              New OPD Visit (Walk-in / Appointment)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Create a new OPD visit for the patient
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-semibold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* 1. Visit Type Selector */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              1. Visit Type
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setVisitType("walk-in")}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                  visitType === "walk-in"
                    ? "bg-blue-50/50 border-blue-600 shadow-2xs"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    visitType === "walk-in"
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300"
                  }`}
                >
                  {visitType === "walk-in" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Walk-in Patient</h4>
                  <p className="text-[10px] text-slate-400">Create visit for a walk-in patient</p>
                </div>
              </div>

              <div
                onClick={() => setVisitType("appointment")}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                  visitType === "appointment"
                    ? "bg-blue-50/50 border-blue-600 shadow-2xs"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    visitType === "appointment"
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300"
                  }`}
                >
                  {visitType === "appointment" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">From Appointment</h4>
                  <p className="text-[10px] text-slate-400">Convert scheduled appointment to OPD visit</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Patient Information */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              2. Patient Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-6">
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

              {/* Preview Card */}
              <div className="md:col-span-6">
                {selectedPatientDetails ? (
                  <div className="bg-white border border-blue-200 rounded-xl p-2.5 shadow-2xs flex items-center gap-2.5">
                    {selectedPatientDetails.photoUrl ? (
                      <img
                        src={selectedPatientDetails.photoUrl}
                        alt={selectedPatientDetails.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {selectedPatientDetails.name?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="leading-tight">
                      <h5 className="text-xs font-bold text-slate-900">
                        {selectedPatientDetails.name}{" "}
                        <span className="text-[10px] font-normal text-slate-400">
                          ({selectedPatientDetails.patientId})
                        </span>
                      </h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        28 Years | {selectedPatientDetails.gender} | {selectedPatientDetails.bloodGroup || "A+"}
                      </p>
                      <p className="text-[10px] text-slate-500">{selectedPatientDetails.phone}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/60 border border-dashed border-slate-200 rounded-xl p-2.5 text-center text-[10px] text-slate-400">
                    Select a patient to preview profile
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Doctor & Department */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              3. Doctor &amp; Department
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Doctor <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("doctorId", { required: "Doctor is required" })}
                    disabled={loadingDoctors}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Doctor</option>
                    {doctorList.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        Dr. {doc.userId?.name || doc.name}
                      </option>
                    ))}
                  </select>
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Department</option>
                    {deptList.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Consultation Type <span className="text-rose-500">*</span>
                </label>
                <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer">
                  <option value="OPD">OPD</option>
                  <option value="Specialist">Specialist</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Visit Information */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              4. Visit Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Visit Date &amp; Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("visitDate")}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Source
                </label>
                <select
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="walk-in">Walk-in</option>
                  <option value="appointment">Appointment</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Appointment (optional)
                </label>
                <select
                  {...register("appointmentId")}
                  disabled={visitType !== "appointment"}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none cursor-pointer disabled:bg-slate-100"
                >
                  <option value="">Select Appointment (if any)</option>
                  {appointmentsList.map((appt) => (
                    <option key={appt._id} value={appt._id}>
                      {appt.appointmentId || appt._id} — {appt.patientId?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 5. Chief Complaints / Symptoms */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                5. Chief Complaints / Symptoms
              </p>
              <span className="text-[10px] text-slate-400">
                {watchSymptoms.length}/500
              </span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Symptoms <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                maxLength={500}
                {...register("symptoms")}
                placeholder="Enter patient chief complaints / symptoms..."
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none resize-none"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                e.g. High fever, Dry cough for 3 days, Body ache
              </p>
            </div>
          </div>

          {/* 6. Initial Vitals (Optional) */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              6. Initial Vitals (Optional - can be updated later)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Temperature (°C)
                </label>
                <input
                  type="text"
                  {...register("temp")}
                  placeholder="e.g. 98.6"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  {...register("bp")}
                  placeholder="e.g. 120/80"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Pulse Rate (BPM)
                </label>
                <input
                  type="text"
                  {...register("pulse")}
                  placeholder="e.g. 78"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  SpO2 (%)
                </label>
                <input
                  type="text"
                  {...register("spO2")}
                  placeholder="e.g. 98"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  {...register("weight")}
                  placeholder="e.g. 65.2"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                  Height (cm)
                </label>
                <input
                  type="text"
                  {...register("height")}
                  placeholder="e.g. 165"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 7. Notes (Optional) */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                7. Notes (Optional)
              </p>
              <span className="text-[10px] text-slate-400">
                {watchNotes.length}/300
              </span>
            </div>
            <textarea
              rows={2}
              maxLength={300}
              {...register("notes")}
              placeholder="Any additional notes..."
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? "Creating..." : "Create OPD Visit"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
