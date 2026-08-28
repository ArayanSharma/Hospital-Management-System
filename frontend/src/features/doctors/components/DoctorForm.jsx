import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Calendar,
  Camera,
  Stethoscope,
  FileText,
  Eye,
  EyeOff,
  Plus,
  Clock,
  Upload,
} from "lucide-react";
import { createDoctorSchema, updateDoctorSchema } from "../validation/doctor.schema.js";
import { useDepartmentOptions } from "../../../hooks/useDepartmentOptions.js";

const DEFAULT_DAYS = [
  { day: "Monday", active: true, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Tuesday", active: true, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Wednesday", active: true, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Thursday", active: true, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Friday", active: true, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Saturday", active: true, startTime: "09:00 AM", endTime: "01:00 PM" },
  { day: "Sunday", active: false, startTime: "--:-- --", endTime: "--:-- --" },
];

export default function DoctorForm({ defaultValues, isEdit, onSubmit, onCancel, submitting }) {
  const { departments, loading: loadingDepts } = useDepartmentOptions();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [schedule, setSchedule] = useState(DEFAULT_DAYS);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateDoctorSchema : createDoctorSchema),
    defaultValues: defaultValues || {
      departmentId: "",
      specialization: "",
      qualification: "",
      experience: 5,
      consultationFee: 650,
    },
  });

  const toggleDayActive = (index) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, active: !item.active } : item
      )
    );
  };

  const handleFormSubmit = (data) => {
    const activeDays = schedule.filter((s) => s.active);
    const dayRange = activeDays.length > 0
      ? `${activeDays[0].day.slice(0, 3)} - ${activeDays[activeDays.length - 1].day.slice(0, 3)}`
      : "Mon - Sat";
    const startTime = activeDays[0]?.startTime || "09:00 AM";
    const endTime = activeDays[0]?.endTime || "05:00 PM";

    const payload = {
      ...data,
      availability: [
        {
          day: dayRange,
          startTime,
          endTime,
        },
      ],
    };
    delete payload.confirmPassword;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: User Account Info & Availability Schedule (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* User Account Information Box */}
          {!isEdit && (
            <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                <User className="w-4 h-4 text-blue-600" />
                <span>User Account Information</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="Enter full name"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  {...register("email")}
                  placeholder="Enter email address"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.email && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-2 py-2 rounded-xl">
                    <option value="+91">+91</option>
                  </select>
                  <input
                    {...register("phone")}
                    placeholder="Enter phone number"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.phone.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter password"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-rose-500 mt-0.5">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="Confirm password"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-rose-500 mt-0.5">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-blue-100/60 border border-blue-200 rounded-xl text-[11px] text-blue-800 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>A user account will be created and assigned the role: <strong>DOCTOR</strong></span>
              </div>
            </div>
          )}

          {/* Availability Schedule Box */}
          <div className="bg-purple-50/30 border border-purple-100 rounded-2xl p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Availability Schedule</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Set doctor's weekly OPD availability slots
              </p>
            </div>

            <div className="space-y-2">
              {schedule.map((item, idx) => (
                <div
                  key={item.day}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs transition ${
                    item.active ? "bg-white border-slate-200" : "bg-slate-50/70 border-slate-100 opacity-60"
                  }`}
                >
                  <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer min-w-[90px]">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={() => toggleDayActive(idx)}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>{item.day}</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-700">
                      <span>{item.startTime}</span>
                      <Clock className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-slate-400 text-[10px]">to</span>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-700">
                      <span>{item.endTime}</span>
                      <Clock className="w-3 h-3 text-slate-400" />
                    </div>
                    <button
                      type="button"
                      className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Profile Photo, Professional Info & Additional Info (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Profile Photo Box */}
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Profile Photo</span>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-white hover:border-emerald-300 transition">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-2">
                <Upload className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-slate-800">Upload Photo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or WEBP (Max: 2MB)</p>
              <button
                type="button"
                className="mt-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-1.5 rounded-xl shadow-2xs transition cursor-pointer"
              >
                Choose File
              </button>
            </div>
          </div>

          {/* Professional Information Box */}
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Professional Information</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("departmentId")}
                disabled={loadingDepts}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="text-[10px] text-rose-500 mt-0.5">{errors.departmentId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Specialization <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("specialization")}
                placeholder="Enter specialization"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.specialization && (
                <p className="text-[10px] text-rose-500 mt-0.5">{errors.specialization.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Qualification <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("qualification")}
                placeholder="Enter qualifications e.g. MBBS, MD (Medicine), DM (Cardiology)"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.qualification && (
                <p className="text-[10px] text-rose-500 mt-0.5">{errors.qualification.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Experience (Years) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("experience")}
                  placeholder="Enter experience in years"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                {errors.experience && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.experience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Consultation Fee (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    {...register("consultationFee")}
                    placeholder="Enter consultation fee"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                {errors.consultationFee && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.consultationFee.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information (Optional) Box */}
          <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Additional Information (Optional)</span>
            </div>

            <textarea
              rows={2}
              {...register("additionalInfo")}
              placeholder="Enter additional information about the doctor..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
            />
            <p className="text-[10px] text-slate-400">
              e.g. Awards, Memberships, Languages known, etc.
            </p>
          </div>
        </div>
      </div>

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
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Update Doctor" : "Save Doctor"}
        </button>
      </div>
    </form>
  );
}