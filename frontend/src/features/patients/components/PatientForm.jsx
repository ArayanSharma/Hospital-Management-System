import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, FileText, Info } from "lucide-react";
import { patientSchema } from "../validation/patient.schema.js";

export default function PatientForm({ defaultValues, onSubmit, onCancel, submitting }) {
  const formattedDefaultValues = defaultValues
    ? {
        ...defaultValues,
        dateOfBirth: defaultValues.dateOfBirth
          ? new Date(defaultValues.dateOfBirth).toISOString().split("T")[0]
          : "",
        emergencyContact: defaultValues.emergencyContact || { name: "", relation: "Spouse", phone: "" },
      }
    : {
        gender: "male",
        maritalStatus: "single",
        nationality: "Indian",
        emergencyContact: { name: "", relation: "Spouse", phone: "" },
      };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: formattedDefaultValues,
  });

  const dobWatch = watch("dateOfBirth");

  // Real-time Age calculation from Date of Birth
  useEffect(() => {
    if (dobWatch) {
      const birthDate = new Date(dobWatch);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        setValue("computedAge", age > 0 ? `${age} Years` : "0 Years");
      }
    }
  }, [dobWatch, setValue]);

  const handleFormSubmit = (data) => {
    const cleanedData = {
      ...data,
      email: data.email?.trim() || undefined,
      address: data.address?.trim() || undefined,
      bloodGroup: data.bloodGroup || undefined,
      maritalStatus: data.maritalStatus || undefined,
      occupation: data.occupation?.trim() || undefined,
      nationality: data.nationality || undefined,
      notes: data.notes?.trim() || undefined,
      emergencyContact: data.emergencyContact
        ? {
            name: data.emergencyContact.name?.trim() || undefined,
            relation: data.emergencyContact.relation?.trim() || undefined,
            phone: data.emergencyContact.phone?.trim() || undefined,
          }
        : undefined,
    };
    delete cleanedData.computedAge;
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Personal Information (Span 7) */}
        <div className="lg:col-span-7 bg-blue-50/30 border border-blue-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <User className="w-4 h-4 text-blue-600" />
            <span>Personal Information</span>
          </div>

          {/* Row 1: UHID & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Patient ID (UHID)
              </label>
              <input
                type="text"
                disabled
                value={defaultValues?.patientId || "Auto Generated"}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 font-mono font-semibold"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Unique ID will be generated automatically
              </p>
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
          </div>

          {/* Row 2: DOB, Age & Gender */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.dateOfBirth && (
                <p className="text-[10px] text-rose-500 mt-0.5">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Age
              </label>
              <input
                type="text"
                disabled
                {...register("computedAge")}
                placeholder="-- Years"
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("gender")}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 3: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="Enter email (optional)"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {errors.email && (
                <p className="text-[10px] text-rose-500 mt-0.5">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Row 4: Blood Group & Marital Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                {...register("bloodGroup")}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Marital Status
              </label>
              <select
                {...register("maritalStatus")}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </div>

          {/* Row 5: Address */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              {...register("address")}
              placeholder="Enter full address"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              House No., Street, Area, City, State, Pincode
            </p>
            {errors.address && (
              <p className="text-[10px] text-rose-500 mt-0.5">{errors.address.message}</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Emergency Contact & Additional Info (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Emergency Contact Box */}
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Emergency Contact</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Contact Name <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("emergencyContact.name")}
                placeholder="Enter contact person name"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.emergencyContact?.name && (
                <p className="text-[10px] text-rose-500 mt-0.5">
                  {errors.emergencyContact.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Relationship <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("emergencyContact.relation")}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                <option value="">Select Relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
              {errors.emergencyContact?.relation && (
                <p className="text-[10px] text-rose-500 mt-0.5">
                  {errors.emergencyContact.relation.message}
                </p>
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
                  {...register("emergencyContact.phone")}
                  placeholder="Enter phone number"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              {errors.emergencyContact?.phone && (
                <p className="text-[10px] text-rose-500 mt-0.5">
                  {errors.emergencyContact.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Additional Information Box */}
          <div className="bg-amber-50/30 border border-amber-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Additional Information</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Occupation
              </label>
              <input
                {...register("occupation")}
                placeholder="Enter occupation"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nationality
              </label>
              <select
                {...register("nationality")}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
              >
                <option value="Indian">Indian</option>
                <option value="NRI">NRI</option>
                <option value="Foreigner">Foreigner</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                rows={2}
                {...register("notes")}
                placeholder="Add any notes about the patient"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CALLOUT & ACTIONS */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="p-2.5 bg-blue-50/80 border border-blue-100 rounded-xl flex items-center gap-2 text-[11px] text-blue-700 font-medium w-full sm:w-auto">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Note: All fields marked with * are required.</span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
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
            {submitting ? "Saving..." : "Save Patient"}
          </button>
        </div>
      </div>
    </form>
  );
}