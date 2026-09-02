import React from "react";
import { Calendar, ChevronDown } from "lucide-react";

export default function RadiologyOrderScheduleSection({
  scheduledDateTime,
  setScheduledDateTime,
  locationRoom,
  setLocationRoom,
}) {
  const roomOptions = [
    "Radiology Room 1",
    "MRI Suite 2",
    "CT Scan Room A",
    "X-Ray Room B",
    "Ultrasound Room 3",
    "Mammography Suite",
    "ECG Room 4",
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-extrabold">
          4
        </div>
        <span>Schedule</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
        {/* Preferred Date & Time */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Preferred Date &amp; Time <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Location / Room */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Location / Room
          </label>
          <div className="relative">
            <select
              value={locationRoom}
              onChange={(e) => setLocationRoom(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">Select Location / Room</option>
              {roomOptions.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
