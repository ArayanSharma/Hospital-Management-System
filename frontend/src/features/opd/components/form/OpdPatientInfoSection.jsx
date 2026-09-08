import React from "react";
import { Controller } from "react-hook-form";
import PatientAutocomplete from "../../../../components/common/PatientAutocomplete.jsx";

export default function OpdPatientInfoSection({ control, errors, selectedPatientDetails }) {
  return (
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
  );
}
