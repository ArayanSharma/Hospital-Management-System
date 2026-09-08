import React, { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Calendar,
  Clock,
  Building2,
  Stethoscope,
  FileText,
  CalendarCheck,
} from "lucide-react";
import { appointmentSchema } from "../validation/appointment.schema.js";
import { useDepartmentOptions } from "../../../hooks/useDepartmentOptions.js";
import { useDoctorOptions } from "../../../hooks/useDoctorOptions.js";
import PatientAutocomplete from "../../../components/common/PatientAutocomplete.jsx";
import api from "../../../lib/axios.js";

const DEFAULT_TIME_SLOTS = [
  { start: "09:00 AM", end: "09:30 AM" },
  { start: "09:30 AM", end: "10:00 AM" },
  { start: "10:00 AM", end: "10:30 AM" },
  { start: "10:30 AM", end: "11:00 AM" },
  { start: "11:00 AM", end: "11:30 AM" },
  { start: "11:30 AM", end: "12:00 PM" },
  { start: "02:00 PM", end: "02:30 PM" },
  { start: "02:30 PM", end: "03:00 PM" },
];

export default function AppointmentForm({ onSubmit, onCancel, submitting, conflictError }) {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(DEFAULT_TIME_SLOTS[0]);

  const { departments: rawDepts } = useDepartmentOptions();
  const deptList = Array.isArray(rawDepts) ? rawDepts : rawDepts?.departments || [];

  const { doctors: rawDoctors, loading: loadingDoctors } = useDoctorOptions(selectedDepartment);
  const doctorList = Array.isArray(rawDoctors) ? rawDoctors : rawDoctors?.doctors || [];

  const defaultDateStr = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      departmentId: "",
      doctorId: "",
      appointmentDate: defaultDateStr,
      startTime: DEFAULT_TIME_SLOTS[0].start,
      endTime: DEFAULT_TIME_SLOTS[0].end,
      reason: "",
      notes: "",
      sendNotification: true,
    },
  });

  const watchPatientId = useWatch({ control, name: "patientId" });

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

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setValue("startTime", slot.start);
    setValue("endTime", slot.end);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
      {/* 1. Patient Information Box */}
      <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
          <User className="w-4 h-4 text-blue-600" />
          <span>Patient Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
          {/* Patient Autocomplete Input */}
          <div className="md:col-span-6">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Search Patient <span className="text-rose-500">*</span>
            </label>
            <Controller
              name="patientId"
              control={control}
              render={({ field }) => (
                <PatientAutocomplete
                  value={field.value}
                  onChange={(id) => field.onChange(id)}
                  error={errors.patientId?.message}
                />
              )}
            />
          </div>

          {/* Patient Preview Card */}
          <div className="md:col-span-6">
            {selectedPatientDetails ? (
              <div className="bg-white border border-blue-200/80 rounded-xl p-3 shadow-2xs flex items-start gap-3">
                {selectedPatientDetails.photoUrl ? (
                  <img
                    src={selectedPatientDetails.photoUrl}
                    alt={selectedPatientDetails.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {selectedPatientDetails.name?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {selectedPatientDetails.name}
                      <span className="text-[11px] font-normal text-slate-400 ml-1">
                        ({selectedPatientDetails.patientId})
                      </span>
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {selectedPatientDetails.age ? `${selectedPatientDetails.age} Years` : "30 Years"} | {selectedPatientDetails.gender} | {selectedPatientDetails.bloodGroup || "O+"}
                  </p>
                  <p className="text-[10px] text-slate-500">{selectedPatientDetails.phone}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/60 border border-dashed border-slate-200 rounded-xl p-3 text-center text-[11px] text-slate-400">
                Select a patient to preview profile details
              </div>
            )}
          </div>
        </div>

        {/* Department, Doctor & Visit Reason Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Department <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setValue("departmentId", e.target.value);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
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
            {errors.departmentId && (
              <p className="text-[10px] text-rose-500 mt-0.5">{errors.departmentId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Doctor <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("doctorId")}
                disabled={loadingDoctors}
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="">Select Doctor</option>
                {doctorList.map((d) => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.userId?.name || d.name}
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
              Visit Reason / Symptoms <span className="text-rose-500">*</span>
            </label>
            <input
              {...register("reason")}
              placeholder="Enter reason for visit..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              e.g. Chest pain, Routine checkup, Fever, etc.
            </p>
            {errors.reason && (
              <p className="text-[10px] text-rose-500 mt-0.5">{errors.reason.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Date & Time Slot Box */}
      <div className="bg-purple-50/30 border border-purple-100 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span>Date & Time Slot</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Doctor's Availability: 09:00 AM - 05:00 PM</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* Appointment Date Input */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Appointment Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              min={defaultDateStr}
              {...register("appointmentDate")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
            />
            {errors.appointmentDate && (
              <p className="text-[10px] text-rose-500 mt-0.5">{errors.appointmentDate.message}</p>
            )}
          </div>

          {/* Time Slot Selection Grid */}
          <div className="md:col-span-8 space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-700">
              Available Time Slots <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_TIME_SLOTS.map((slot) => {
                const isSelected = selectedSlot.start === slot.start && selectedSlot.end === slot.end;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    onClick={() => handleSelectSlot(slot)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition text-center cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    {slot.start} - {slot.end}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 pt-1">
              ℹ️ Note: Time slot is shown in your local time (Asia/Kolkata)
            </p>
          </div>
        </div>
      </div>

      {/* 3. Additional Information Box */}
      <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Additional Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              {...register("notes")}
              placeholder="Add any additional notes..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">Internal notes for staff or doctor</p>
          </div>

          <div className="md:col-span-5">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Send SMS / WhatsApp Confirmation
            </label>
            <select
              onChange={(e) => setValue("sendNotification", e.target.value === "true")}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="true">Yes, send to patient</option>
              <option value="false">No, do not send</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-0.5">Patient will receive appointment details</p>
          </div>
        </div>
      </div>

      {/* Doctor Slot Conflict Warning */}
      {conflictError && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xl font-medium flex items-center gap-2">
          <span>⚠️ {conflictError}</span>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{submitting ? "Booking..." : "Book Appointment"}</span>
        </button>
      </div>
    </form>
  );
}