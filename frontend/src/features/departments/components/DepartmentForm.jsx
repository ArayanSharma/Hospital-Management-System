import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MinusCircle, Search, Save } from "lucide-react";
import { createDepartmentSchema, updateDepartmentSchema } from "../validation/department.schema.js";
import { useDoctors } from "../../doctors/hooks/useDoctors.js";

export default function DepartmentForm({ defaultValues, isEdit, onSubmit, onCancel, submitting }) {
  const { doctors } = useDoctors();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateDepartmentSchema : createDepartmentSchema),
    defaultValues: defaultValues || {
      name: "",
      code: "",
      description: "",
      headDoctorId: "",
      status: "active",
    },
  });

  const watchCode = useWatch({ control, name: "code" }) || "";
  const watchDescription = useWatch({ control, name: "description" }) || "";
  const watchStatus = useWatch({ control, name: "status" }) || "active";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. Department Name & Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-1">
            Department Name <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("name")}
            placeholder="Enter department name"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="text-[10px] text-slate-400 mt-1">e.g. Cardiology</p>
          {errors.name && (
            <p className="text-[10px] text-rose-500 mt-0.5">{errors.name.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-900">
              Department Code <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {watchCode.length}/10
            </span>
          </div>
          <input
            {...register("code")}
            maxLength={10}
            placeholder="Enter short code"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="text-[10px] text-slate-400 mt-1">e.g. CARD (2-10 uppercase letters)</p>
          {errors.code && (
            <p className="text-[10px] text-rose-500 mt-0.5">{errors.code.message}</p>
          )}
        </div>
      </div>

      {/* 2. Description */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-900">
            Description <span className="text-rose-500">*</span>
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            {watchDescription.length}/500
          </span>
        </div>
        <textarea
          rows={3}
          maxLength={500}
          {...register("description")}
          placeholder="Enter department description and scope of services..."
          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Provide a brief overview of the department and services offered.
        </p>
        {errors.description && (
          <p className="text-[10px] text-rose-500 mt-0.5">{errors.description.message}</p>
        )}
      </div>

      {/* 3. Head of Department (HOD) */}
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-1">
          Head of Department (HOD)
        </label>
        <div className="relative">
          <select
            {...register("headDoctorId")}
            className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer appearance-none"
          >
            <option value="">Select head doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.userId?.name || doc.name} ({doc.specialization || "Doctor"})
              </option>
            ))}
          </select>
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Choose the Head of Department</p>
      </div>

      {/* 4. Status (Radio Cards) */}
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-2">
          Status <span className="text-rose-500">*</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* Active Card */}
          <div
            onClick={() => setValue("status", "active")}
            className={`p-3 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3 ${
              watchStatus === "active"
                ? "border-emerald-500 bg-emerald-50/40 text-emerald-900"
                : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
            }`}
          >
            <CheckCircle2
              className={`w-5 h-5 shrink-0 ${
                watchStatus === "active" ? "text-emerald-600" : "text-slate-400"
              }`}
            />
            <div>
              <p className="text-xs font-bold">Active</p>
              <p className="text-[10px] opacity-75 leading-tight">
                Department is active and operational
              </p>
            </div>
          </div>

          {/* Inactive Card */}
          <div
            onClick={() => setValue("status", "inactive")}
            className={`p-3 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3 ${
              watchStatus === "inactive"
                ? "border-slate-400 bg-slate-100 text-slate-900"
                : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
            }`}
          >
            <MinusCircle
              className={`w-5 h-5 shrink-0 ${
                watchStatus === "inactive" ? "text-slate-600" : "text-slate-400"
              }`}
            />
            <div>
              <p className="text-xs font-bold">Inactive</p>
              <p className="text-[10px] opacity-75 leading-tight">
                Department is inactive
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
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
          <Save className="w-3.5 h-3.5" />
          <span>{submitting ? "Saving..." : isEdit ? "Update Department" : "Save Department"}</span>
        </button>
      </div>
    </form>
  );
}