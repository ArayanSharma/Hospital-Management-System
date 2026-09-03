import React, { useState } from "react";
import { Plus, ChevronRight, Printer, Download, FlaskConical, FileText, History } from "lucide-react";
import { useLabTests } from "../hooks/useLabTests.js";
import LabStatCards from "../components/LabStatCards.jsx";
import LabFiltersBar from "../components/LabFiltersBar.jsx";
import LabOrdersTable from "../components/LabOrdersTable.jsx";
import LabTestDetailsPanel from "../components/LabTestDetailsPanel.jsx";
import LabResultsEntryPanel from "../components/LabResultsEntryPanel.jsx";
import LabReportPreviewPanel from "../components/LabReportPreviewPanel.jsx";
import FullResultsEntryView from "../components/FullResultsEntryView.jsx";
import OrderPatientDetailsSidebar from "../components/OrderPatientDetailsSidebar.jsx";
import ReportHistoryView from "../components/ReportHistoryView.jsx";
import LabTestOrderModal from "../components/LabTestOrderModal.jsx";
import LabViewOrderModal from "../components/modals/LabViewOrderModal.jsx";
import LabEditOrderModal from "../components/modals/LabEditOrderModal.jsx";
import LabCancelOrderModal from "../components/modals/LabCancelOrderModal.jsx";
import LabViewSampleModal from "../components/modals/LabViewSampleModal.jsx";
import LabUploadReportModal from "../components/modals/LabUploadReportModal.jsx";
import LabCancellationDetailsModal from "../components/modals/LabCancellationDetailsModal.jsx";
import { updateLabTestStatusApi } from "../services/labTest.api.js";
import { createLabReportApi, finalizeLabReportApi } from "../services/labReport.api.js";

export default function LabTestList() {
  const {
    tests,
    stats,
    pagination,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedTest,
    setSelectedTest,
    refetch,
  } = useLabTests();

  const [activeTab, setActiveTab] = useState("details");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeReport, setActiveReport] = useState(null);

  // Modal target test states
  const [viewModalTest, setViewModalTest] = useState(null);
  const [editModalTest, setEditModalTest] = useState(null);
  const [cancelModalTest, setCancelModalTest] = useState(null);
  const [viewSampleTest, setViewSampleTest] = useState(null);
  const [uploadReportTest, setUploadReportTest] = useState(null);
  const [cancellationDetailsTest, setCancellationDetailsTest] = useState(null);

  // Sample Collection Action
  const handleCollectSample = async (testId) => {
    setSubmitting(true);
    try {
      await updateLabTestStatusApi(testId, { status: "sample-collected" });
      refetch();
      alert("Sample collected successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to collect sample.");
    } finally {
      setSubmitting(false);
    }
  };

  // Save Results Action
  const handleSaveResults = async (resultData) => {
    if (!selectedTest?._id) return;
    setSubmitting(true);
    try {
      const { data } = await createLabReportApi({
        labTestId: selectedTest._id,
        results: resultData.results,
        interpretation: resultData.interpretation,
      });
      setActiveReport(data.data);
      refetch();
      alert("Draft results saved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save draft results.");
    } finally {
      setSubmitting(false);
    }
  };

  // Finalize Report Action
  const handleFinalizeReport = async (resultData) => {
    if (!selectedTest?._id) return;
    setSubmitting(true);
    try {
      let reportData = activeReport;
      if (!reportData?._id) {
        const { data } = await createLabReportApi({
          labTestId: selectedTest._id,
          results: resultData?.results || {},
          interpretation: resultData?.interpretation || "",
        });
        reportData = data.data;
      }
      const { data: finData } = await finalizeLabReportApi(reportData._id);
      setActiveReport(finData.data);
      refetch();
      alert("Report finalized and locked successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to finalize report.");
    } finally {
      setSubmitting(false);
    }
  };

  // Action Dispatcher for Table Dropdown Items
  const handleTableAction = (actionKey, testItem) => {
    setSelectedTest(testItem);
    switch (actionKey) {
      case "view-order":
        setViewModalTest(testItem);
        break;
      case "edit-order":
        setEditModalTest(testItem);
        break;
      case "collect-sample":
      case "mark-collected":
        handleCollectSample(testItem._id);
        break;
      case "cancel-order":
        setCancelModalTest(testItem);
        break;
      case "view-sample":
        setViewSampleTest(testItem);
        break;
      case "enter-result":
      case "verify-result":
        setActiveTab("entry");
        break;
      case "upload-report":
        setUploadReportTest(testItem);
        break;
      case "complete-order":
        handleFinalizeReport({ results: {} });
        break;
      case "view-report":
        setActiveTab("details");
        break;
      case "print-report":
        window.print();
        break;
      case "view-history":
        setActiveTab("history");
        break;
      case "view-cancellation":
        setCancellationDetailsTest(testItem);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Breadcrumb & Header Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <span className="text-slate-400">Laboratory</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-blue-600 font-bold">Lab Orders</span>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 cursor-pointer flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Order Test</span>
        </button>
      </div>

      {/* 5 Laboratory Statistics Cards */}
      <LabStatCards stats={stats} />

      {/* Search & Filter Panel */}
      <LabFiltersBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />

      {/* Master Lab Orders Table */}
      <LabOrdersTable
        tests={tests}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        pagination={pagination}
        selectedTest={selectedTest}
        onSelectTest={(t) => {
          setSelectedTest(t);
          setActiveReport(null);
        }}
        onAction={handleTableAction}
      />

      {/* Lower Workspace Top Tab Navigation (ALWAYS visible with Test Details selected by default) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-6 font-semibold">
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-1 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "details"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Test Details</span>
          </button>

          <button
            onClick={() => setActiveTab("entry")}
            className={`pb-1 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "entry"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Results Entry</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`pb-1 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "history"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Report History</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>Print Order</span>
          </button>
          <button
            type="button"
            onClick={() => alert("Downloading order PDF...")}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Order</span>
          </button>
        </div>
      </div>

      {/* Dynamic Lower Laboratory Workspace */}
      {activeTab === "details" ? (
        /* 3-Column Split Panel View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5">
            <LabTestDetailsPanel
              test={selectedTest}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onCollectSample={handleCollectSample}
              submitting={submitting}
            />
          </div>
          <div className="lg:col-span-4">
            <LabResultsEntryPanel
              test={selectedTest}
              onSaveResults={handleSaveResults}
              onFinalizeReport={handleFinalizeReport}
              submitting={submitting}
            />
          </div>
          <div className="lg:col-span-3">
            <LabReportPreviewPanel test={selectedTest} report={activeReport} />
          </div>
        </div>
      ) : activeTab === "entry" ? (
        /* Full Results Entry 2-Column View (Matching user's screenshot!) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <FullResultsEntryView
              test={selectedTest}
              onSaveResults={handleSaveResults}
              onFinalizeReport={handleFinalizeReport}
              onCollectSample={handleCollectSample}
              submitting={submitting}
            />
          </div>
          <div className="lg:col-span-4">
            <OrderPatientDetailsSidebar test={selectedTest} />
          </div>
        </div>
      ) : (
        /* Report History View */
        <ReportHistoryView test={selectedTest} />
      )}

      {/* Order Lab Test Modal */}
      <LabTestOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refetch}
      />

      {/* Action Modals */}
      <LabViewOrderModal
        test={viewModalTest}
        isOpen={!!viewModalTest}
        onClose={() => setViewModalTest(null)}
      />

      <LabEditOrderModal
        test={editModalTest}
        isOpen={!!editModalTest}
        onClose={() => setEditModalTest(null)}
        onSuccess={refetch}
      />

      <LabCancelOrderModal
        test={cancelModalTest}
        isOpen={!!cancelModalTest}
        onClose={() => setCancelModalTest(null)}
        onSuccess={refetch}
      />

      <LabViewSampleModal
        test={viewSampleTest}
        isOpen={!!viewSampleTest}
        onClose={() => setViewSampleTest(null)}
      />

      <LabUploadReportModal
        test={uploadReportTest}
        isOpen={!!uploadReportTest}
        onClose={() => setUploadReportTest(null)}
        onSuccess={refetch}
      />

      <LabCancellationDetailsModal
        test={cancellationDetailsTest}
        isOpen={!!cancellationDetailsTest}
        onClose={() => setCancellationDetailsTest(null)}
      />
    </div>
  );
}
