import React from "react";
import { useRadiologyReport } from "../hooks/useRadiologyReport.js";

import RadiologyReportHeader from "./report/RadiologyReportHeader.jsx";
import RadiologyStudyDetailsSidebar from "./report/RadiologyStudyDetailsSidebar.jsx";
import RadiologyReportForm from "./report/RadiologyReportForm.jsx";
import RadiologyReportPreviewCard from "./report/RadiologyReportPreviewCard.jsx";
import RadiologyStudyDetailsTab from "./report/RadiologyStudyDetailsTab.jsx";
import RadiologyReportHistoryTab from "./report/RadiologyReportHistoryTab.jsx";

export default function RadiologyReportSection({ selectedOrder, onReportUpdated }) {
  const {
    activeTab,
    setActiveTab,
    reportStatus,
    saving,
    formData,
    setFormData,
    historyLogs,
    handleChange,
    handleSaveDraft,
    handleFinalizeReport,
  } = useRadiologyReport(selectedOrder, onReportUpdated);

  if (!selectedOrder) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-8 text-center mt-6">
        <p className="text-sm font-bold text-slate-700">No Radiology Order Selected</p>
        <p className="text-xs text-slate-400 mt-1">Select an order from the table above to enter findings or view report details.</p>
      </div>
    );
  }

  const patientName = selectedOrder.patientName || selectedOrder.patientId?.name || formData.patientName;
  const patientId = selectedOrder.patientId?.patientId || selectedOrder.patientId?._id || selectedOrder.patientId || formData.patientId;
  const orderId = selectedOrder.orderId || formData.orderId;
  const modality = selectedOrder.modality || selectedOrder.testType || formData.modality;
  const testName = selectedOrder.testType || formData.testName;
  const bodyRegion = selectedOrder.bodyRegion || formData.bodyRegion;
  const studyDate = formData.studyDate;
  const priority = selectedOrder.priority || formData.priority;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden mt-6">
      {/* 1. Header Bar with Tabs */}
      <RadiologyReportHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orderId={orderId}
        historyCount={historyLogs.length}
      />

      {/* 2. TAB VIEW 1: STUDY DETAILS */}
      {activeTab === "study-details" && (
        <RadiologyStudyDetailsTab
          testName={testName}
          modality={modality}
          priority={priority}
          orderId={orderId}
          studyDate={studyDate}
          patientName={patientName}
          patientId={patientId}
          formData={formData}
          setActiveTab={setActiveTab}
        />
      )}

      {/* 3. TAB VIEW 2: REPORT ENTRY (3-Column Layout) */}
      {activeTab === "report-entry" && (
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-50/40">
          <RadiologyStudyDetailsSidebar
            testName={testName}
            modality={modality}
            bodyRegion={bodyRegion}
            patientName={patientName}
            patientId={patientId}
            orderId={orderId}
            studyDate={studyDate}
            priority={priority}
            formData={formData}
            handleChange={handleChange}
          />

          <RadiologyReportForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            reportStatus={reportStatus}
            saving={saving}
            handleSaveDraft={handleSaveDraft}
            handleFinalizeReport={handleFinalizeReport}
          />

          <RadiologyReportPreviewCard
            reportStatus={reportStatus}
            patientName={patientName}
            patientId={patientId}
            testName={testName}
            modality={modality}
            bodyRegion={bodyRegion}
            studyDate={studyDate}
            orderId={orderId}
            formData={formData}
            selectedOrder={selectedOrder}
          />
        </div>
      )}

      {/* 4. TAB VIEW 3: REPORT HISTORY */}
      {activeTab === "report-history" && (
        <RadiologyReportHistoryTab
          orderId={orderId}
          patientName={patientName}
          historyLogs={historyLogs}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}
