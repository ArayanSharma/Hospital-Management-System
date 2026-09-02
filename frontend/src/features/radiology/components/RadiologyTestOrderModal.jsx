import React from "react";
import { X, Layers } from "lucide-react";
import { useRadiologyTestOrder } from "../hooks/useRadiologyTestOrder.js";

import RadiologyOrderPatientSection from "./order-modal/RadiologyOrderPatientSection.jsx";
import RadiologyOrderInfoSection from "./order-modal/RadiologyOrderInfoSection.jsx";
import RadiologyOrderScanSection from "./order-modal/RadiologyOrderScanSection.jsx";
import RadiologyOrderScheduleSection from "./order-modal/RadiologyOrderScheduleSection.jsx";
import RadiologyOrderAttachmentsSection from "./order-modal/RadiologyOrderAttachmentsSection.jsx";

export default function RadiologyTestOrderModal({ isOpen, onClose, onSuccess }) {
  const {
    submitting,
    errorMsg,
    selectedPatientId,
    patientDetails,
    doctorId,
    setDoctorId,
    doctorList,
    loadingDoctors,
    visitType,
    setVisitType,
    orderDateTime,
    setOrderDateTime,
    priority,
    setPriority,
    modality,
    setModality,
    bodyRegion,
    setBodyRegion,
    clinicalInstructions,
    setClinicalInstructions,
    checkedTests,
    otherTestText,
    setOtherTestText,
    scheduledDateTime,
    setScheduledDateTime,
    locationRoom,
    setLocationRoom,
    fileName,
    setFileName,
    handlePatientSelect,
    handleCheckboxChange,
    handleNewPatientClick,
    handleFormSubmit,
  } = useRadiologyTestOrder({ onClose, onSuccess });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Centered Modal Card Container matching user image */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">Order Test (Radiology)</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* SECTION 1: Patient Information */}
          <RadiologyOrderPatientSection
            selectedPatientId={selectedPatientId}
            onPatientSelect={handlePatientSelect}
            patientDetails={patientDetails}
            onNewPatientClick={handleNewPatientClick}
          />

          <hr className="border-slate-100" />

          {/* SECTION 2: Order Information */}
          <RadiologyOrderInfoSection
            doctorId={doctorId}
            setDoctorId={setDoctorId}
            doctorList={doctorList}
            loadingDoctors={loadingDoctors}
            visitType={visitType}
            setVisitType={setVisitType}
            orderDateTime={orderDateTime}
            setOrderDateTime={setOrderDateTime}
            priority={priority}
            setPriority={setPriority}
          />

          <hr className="border-slate-100" />

          {/* SECTION 3: Test / Scan Details */}
          <RadiologyOrderScanSection
            modality={modality}
            setModality={setModality}
            bodyRegion={bodyRegion}
            setBodyRegion={setBodyRegion}
            clinicalInstructions={clinicalInstructions}
            setClinicalInstructions={setClinicalInstructions}
            checkedTests={checkedTests}
            handleCheckboxChange={handleCheckboxChange}
            otherTestText={otherTestText}
            setOtherTestText={setOtherTestText}
          />

          <hr className="border-slate-100" />

          {/* SECTION 4: Schedule */}
          <RadiologyOrderScheduleSection
            scheduledDateTime={scheduledDateTime}
            setScheduledDateTime={setScheduledDateTime}
            locationRoom={locationRoom}
            setLocationRoom={setLocationRoom}
          />

          <hr className="border-slate-100" />

          {/* SECTION 5: Attachments (Optional) */}
          <RadiologyOrderAttachmentsSection
            fileName={fileName}
            setFileName={setFileName}
          />

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
              {errorMsg}
            </div>
          )}

          {/* Sticky Bottom Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 cursor-pointer flex items-center gap-2 transition disabled:opacity-50"
            >
              <Layers className="w-4 h-4" />
              <span>{submitting ? "Placing Order..." : "Place Order"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
