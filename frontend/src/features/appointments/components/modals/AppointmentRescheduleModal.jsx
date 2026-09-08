import React, { useState, useEffect } from "react";
import Modal from "../../../../components/ui/Modal.jsx";
import CustomDropdown from "../../../../components/ui/CustomDropdown.jsx";
import { RefreshCw } from "lucide-react";

export default function AppointmentRescheduleModal({ appointment, isOpen, onClose, onReschedule, submitting }) {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("09:30 AM");

  useEffect(() => {
    if (appointment) {
      const dateVal = appointment.appointmentDate
        ? new Date(appointment.appointmentDate).toISOString().split("T")[0]
        : "";
      setAppointmentDate(dateVal);
      setStartTime(appointment.startTime || "09:00 AM");
      setEndTime(appointment.endTime || "09:30 AM");
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onReschedule(appointment._id, {
      appointmentDate,
      startTime,
      endTime,
      status: "scheduled",
    });
  };

  const timeOptions = [
    { value: "09:00 AM", label: "09:00 AM" },
    { value: "09:30 AM", label: "09:30 AM" },
    { value: "10:00 AM", label: "10:00 AM" },
    { value: "10:30 AM", label: "10:30 AM" },
    { value: "11:00 AM", label: "11:00 AM" },
    { value: "11:30 AM", label: "11:30 AM" },
    { value: "02:00 PM", label: "02:00 PM" },
    { value: "02:30 PM", label: "02:30 PM" },
    { value: "03:00 PM", label: "03:00 PM" },
    { value: "03:30 PM", label: "03:30 PM" },
    { value: "04:00 PM", label: "04:00 PM" },
    { value: "04:30 PM", label: "04:30 PM" },
    { value: "05:00 PM", label: "05:00 PM" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reschedule Appointment"
      subtitle={`Change Date & Slot for ${appointment.patientId?.name || "Patient"}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3 text-purple-800">
          <RefreshCw className="w-5 h-5 text-purple-600 shrink-0" />
          <p className="font-semibold leading-tight">
            Rescheduling will update doctor slot allocation and notify patient.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">New Appointment Date</label>
          <input
            type="date"
            required
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Start Time</label>
            <CustomDropdown
              label="Start Time"
              value={startTime}
              options={timeOptions}
              onChange={setStartTime}
              minWidth="100%"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">End Time</label>
            <CustomDropdown
              label="End Time"
              value={endTime}
              options={timeOptions}
              onChange={setEndTime}
              minWidth="100%"
            />
          </div>
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
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Rescheduling..." : "Confirm Reschedule"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
