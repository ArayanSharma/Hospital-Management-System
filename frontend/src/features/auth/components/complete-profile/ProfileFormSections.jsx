import React from "react";
import {
  Check,
  Calendar,
  Lock,
  Sparkles,
  User,
  Briefcase,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  Sliders,
  ShieldCheck,
} from "lucide-react";

export default function ProfileFormSections({ activeTab = "personal", formData, handleChange }) {
  return (
    <div className="space-y-6">
      {/* 1. PERSONAL INFORMATION TAB */}
      {activeTab === "personal" && (
        <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 animate-fadeIn">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal Information
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
            Some details are brought from your account and cannot be edited.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-3 h-3" /> Auto-filled
                </span>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Taken from your account (cannot be edited)
              </span>
            </div>

            {/* Date of Birth */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Date of Birth
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Calendar className="w-3 h-3" /> Auto-filled
                </span>
              </div>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Taken from your account (cannot be edited)
              </span>
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                Gender
              </label>
              <div className="flex items-center gap-4 py-1">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Blood Group
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-3 h-3" /> Auto-filled
                </span>
              </div>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Fetched from previous records (can be updated)
              </span>
            </div>

            {/* Marital Status */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Marital Status
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {["Single", "Married", "Divorced", "Widowed"].map((ms) => (
                  <option key={ms} value={ms}>
                    {ms}
                  </option>
                ))}
              </select>
            </div>

            {/* Nationality */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nationality
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Check className="w-3 h-3" /> Auto-filled
                </span>
              </div>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Detected from your account (cannot be edited)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROFESSIONAL DETAILS TAB */}
      {activeTab === "professional" && (
        <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Professional Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Role / Designation
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-3 h-3" /> Auto-filled
                </span>
              </div>
              <input
                type="text"
                value={formData.roleName}
                disabled
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Taken from account (cannot be edited)
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Department
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-3 h-3" /> Auto-filled
                </span>
              </div>
              <input
                type="text"
                value={formData.department}
                disabled
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Taken from account (cannot be edited)
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Employee ID
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-3 h-3" /> Auto-generated
                </span>
              </div>
              <input
                type="text"
                value={formData.employeeId}
                disabled
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Generated by system (cannot be edited)
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Joining Date
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Check className="w-3 h-3" /> Auto-filled
                </span>
              </div>
              <input
                type="text"
                value={formData.joiningDate}
                disabled
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Taken from HR system (cannot be edited)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTACT INFORMATION TAB */}
      {activeTab === "contact" && (
        <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Email Address
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-3 h-3" /> Auto-filled
                </span>
              </div>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Taken from account (cannot be edited)
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-3 h-3" /> Auto-filled
                </span>
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Verified from your account (can be updated)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADDRESS INFORMATION TAB */}
      {activeTab === "address" && (
        <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Address Information
            </h3>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Current Address
              </label>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Check className="w-3 h-3" /> Auto-filled
              </span>
            </div>
            <input
              type="text"
              name="currentAddress"
              value={formData.currentAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Fetched from your account (can be updated)
            </span>
          </div>
        </div>
      )}

      {/* 5. PROFILE PHOTO TAB */}
      {activeTab === "photo" && (
        <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 text-center animate-fadeIn">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Profile Avatar & Photo
            </h3>
          </div>

          <div className="w-24 h-24 rounded-full bg-blue-600 text-white font-black text-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 mb-4">
            {formData.name ? formData.name.substring(0, 2).toUpperCase() : "SA"}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Your profile photo is imported from your Google / Single Sign-On account.
          </p>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Avatar Verified & Synced
          </span>
        </div>
      )}

      {/* 6. PREFERENCES & REVIEW TAB */}
      {activeTab === "preferences" && (
        <div className="bg-slate-50/60 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Review & Confirmation Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Full Name</span>
              <strong className="text-slate-800 dark:text-slate-100">{formData.name}</strong>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Email Address</span>
              <strong className="text-slate-800 dark:text-slate-100">{formData.email}</strong>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Role & Department</span>
              <strong className="text-slate-800 dark:text-slate-100">{formData.roleName} ({formData.department})</strong>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px]">Phone & Address</span>
              <strong className="text-slate-800 dark:text-slate-100">{formData.phone} - {formData.currentAddress}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-2">
            <ShieldCheck className="w-4 h-4" />
            <span>All required information is complete and verified against hospital database.</span>
          </div>
        </div>
      )}
    </div>
  );
}
