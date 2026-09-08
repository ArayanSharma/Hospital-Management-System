import React from "react";
import { FlaskConical, X } from "lucide-react";
import { useLabTestOrder } from "../hooks/useLabTestOrder.js";

import OrderPatientSection from "./order-modal/OrderPatientSection.jsx";
import OrderInfoSection from "./order-modal/OrderInfoSection.jsx";
import OrderTestDetailsSection from "./order-modal/OrderTestDetailsSection.jsx";
import OrderAdditionalSection from "./order-modal/OrderAdditionalSection.jsx";

export default function LabTestOrderModal({ isOpen, onClose, onSuccess }) {
  const {
    submitting,
    errorMsg,
    selectedPatientId,
    patientDetails,
    orderDateTime,
    setOrderDateTime,
    doctorId,
    setDoctorId,
    priority,
    setPriority,
    visitType,
    setVisitType,
    testName,
    setTestName,
    sampleType,
    setSampleType,
    checkedTests,
    otherTestText,
    setOtherTestText,
    clinicalNotes,
    setClinicalNotes,
    fileName,
    setFileName,
    doctorList,
    loadingDoctors,
    handlePatientSelect,
    handleCheckboxChange,
    handleNewPatientClick,
    handleFormSubmit,
  } = useLabTestOrder({ onClose, onSuccess });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">Order Test</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
          {/* SECTION 1: Patient Information */}
          <OrderPatientSection
            selectedPatientId={selectedPatientId}
            onPatientSelect={handlePatientSelect}
            patientDetails={patientDetails}
            onNewPatientClick={handleNewPatientClick}
          />

          <hr className="border-slate-100" />

          {/* SECTION 2: Order Information */}
          <OrderInfoSection
            orderDateTime={orderDateTime}
            setOrderDateTime={setOrderDateTime}
            doctorId={doctorId}
            setDoctorId={setDoctorId}
            doctorList={doctorList}
            loadingDoctors={loadingDoctors}
            priority={priority}
            setPriority={setPriority}
            visitType={visitType}
            setVisitType={setVisitType}
          />

          <hr className="border-slate-100" />

          {/* SECTION 3: Test Details */}
          <OrderTestDetailsSection
            testName={testName}
            setTestName={setTestName}
            sampleType={sampleType}
            setSampleType={setSampleType}
            checkedTests={checkedTests}
            handleCheckboxChange={handleCheckboxChange}
            otherTestText={otherTestText}
            setOtherTestText={setOtherTestText}
          />

          <hr className="border-slate-100" />

          {/* SECTION 4: Additional Information */}
          <OrderAdditionalSection
            clinicalNotes={clinicalNotes}
            setClinicalNotes={setClinicalNotes}
            fileName={fileName}
            setFileName={setFileName}
          />

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
              {errorMsg}
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
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
              <FlaskConical className="w-4 h-4" />
              <span>{submitting ? "Placing Order..." : "Place Order"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
