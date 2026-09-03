import React, { useState } from "react";
import { useRadiologyOrders } from "../hooks/useRadiologyOrders.js";
import { calculateRadiologyStats } from "../helpers/radiologyCalculations.js";
import RadiologyHeader from "../components/RadiologyHeader.jsx";
import RadiologyStatCards from "../components/RadiologyStatCards.jsx";
import RadiologyFiltersBar from "../components/RadiologyFiltersBar.jsx";
import RadiologyOrderTabs from "../components/RadiologyOrderTabs.jsx";
import RadiologyOrdersTable from "../components/RadiologyOrdersTable.jsx";
import RadiologyModalityDistributionCard from "../components/RadiologyModalityDistributionCard.jsx";
import RadiologyStatusWorkflowCard from "../components/RadiologyStatusWorkflowCard.jsx";
import RadiologyTodayScheduleCard from "../components/RadiologyTodayScheduleCard.jsx";
import RadiologyTestOrderModal from "../components/RadiologyTestOrderModal.jsx";
import RadiologyReportSection from "../components/RadiologyReportSection.jsx";

// Import 8 Radiology Action Modals
import RadiologyViewOrderModal from "../components/modals/RadiologyViewOrderModal.jsx";
import RadiologyEditOrderModal from "../components/modals/RadiologyEditOrderModal.jsx";
import RadiologyScheduleModal from "../components/modals/RadiologyScheduleModal.jsx";
import RadiologyCancelModal from "../components/modals/RadiologyCancelModal.jsx";
import RadiologyStudyDetailsModal from "../components/modals/RadiologyStudyDetailsModal.jsx";
import RadiologyUploadImagesModal from "../components/modals/RadiologyUploadImagesModal.jsx";
import RadiologyFindingsModal from "../components/modals/RadiologyFindingsModal.jsx";
import RadiologyCancellationDetailsModal from "../components/modals/RadiologyCancellationDetailsModal.jsx";

export default function RadiologyTestList() {
  const [modalOpen, setModalOpen] = useState(false);

  // Target modal state variables
  const [viewModalOrder, setViewModalOrder] = useState(null);
  const [editModalOrder, setEditModalOrder] = useState(null);
  const [scheduleModalOrder, setScheduleModalOrder] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [studyModalOrder, setStudyModalOrder] = useState(null);
  const [uploadImagesOrder, setUploadImagesOrder] = useState(null);
  const [findingsModalOrder, setFindingsModalOrder] = useState(null);
  const [cancellationDetailsOrder, setCancellationDetailsOrder] = useState(null);

  const {
    orders,
    filteredOrders,
    stats,
    loading,
    selectedOrder,
    setSelectedOrder,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
    filters,
  } = useRadiologyOrders();

  const dynamicCounts = calculateRadiologyStats(orders, stats);

  const handleSelectOrder = (row) => {
    setSelectedOrder(row);
    const reportElem = document.getElementById("radiology-report-entry-section");
    if (reportElem) {
      reportElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAction = (actionKey, orderItem) => {
    setSelectedOrder(orderItem);
    switch (actionKey) {
      case "view-order":
        setViewModalOrder(orderItem);
        break;
      case "edit-order":
        setEditModalOrder(orderItem);
        break;
      case "schedule-scan":
        setScheduleModalOrder(orderItem);
        break;
      case "start-scan":
        updateOrderStatus(orderItem._id, "in-progress");
        break;
      case "cancel-order":
        setCancelModalOrder(orderItem);
        break;
      case "view-study":
        setStudyModalOrder(orderItem);
        break;
      case "upload-images":
        setUploadImagesOrder(orderItem);
        break;
      case "enter-findings":
        setFindingsModalOrder(orderItem);
        break;
      case "complete-scan":
        updateOrderStatus(orderItem._id, "completed");
        break;
      case "view-report":
        const reportElem = document.getElementById("radiology-report-entry-section");
        if (reportElem) reportElem.scrollIntoView({ behavior: "smooth" });
        break;
      case "print-report":
        window.print();
        break;
      case "view-history":
        alert(`Showing history for scan #${orderItem.orderId || orderItem._id}`);
        break;
      case "view-cancellation":
        setCancellationDetailsOrder(orderItem);
        break;
      case "reorder":
        setModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Page Title & Top Header Actions */}
      <RadiologyHeader
        onOrderTest={() => setModalOpen(true)}
        onExport={() => alert("Exporting Radiology Orders list...")}
      />

      {/* 2. Dynamic Medical KPI Statistics Cards */}
      <RadiologyStatCards orders={orders} backendStats={stats} />

      {/* 3. Main Content 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT / CENTER: Search/Filters, Order Tabs, Main Radiology Orders Table */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* 4. Search and Filters Bar */}
          <RadiologyFiltersBar
            search={filters.search}
            setSearch={filters.setSearch}
            status={filters.status}
            setStatus={filters.setStatus}
            modality={filters.modality}
            setModality={filters.setModality}
            priority={filters.priority}
            setPriority={filters.setPriority}
            fromDate={filters.fromDate}
            setFromDate={filters.setFromDate}
            toDate={filters.toDate}
            setToDate={filters.setToDate}
          />

          {/* 5 & 6. Order Status Tabs & Main Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
            <RadiologyOrderTabs
              activeTab={filters.activeTab}
              setActiveTab={filters.setActiveTab}
              counts={dynamicCounts}
            />

            {loading ? (
              <div className="p-12 text-center text-slate-500 font-medium text-xs">
                Loading radiology orders from database...
              </div>
            ) : (
              <RadiologyOrdersTable
                orders={filteredOrders}
                selectedOrder={selectedOrder}
                onSelectOrder={handleSelectOrder}
                onStatusChange={updateOrderStatus}
                onAction={handleAction}
              />
            )}
          </div>

          {/* 7. Enter Radiology Report 3-Column Section */}
          <div id="radiology-report-entry-section">
            <RadiologyReportSection
              selectedOrder={selectedOrder}
              onReportUpdated={fetchOrders}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Modality Distribution, Status Workflow, Today's Schedule */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          {/* 8. Dynamic Modality Distribution Donut Chart Card */}
          <RadiologyModalityDistributionCard orders={orders} />

          {/* 9. Status Workflow Visual Diagram Card */}
          <RadiologyStatusWorkflowCard orders={orders} backendStats={stats} />

          {/* 10. Dynamic Today's Schedule Card */}
          <RadiologyTodayScheduleCard orders={orders} />
        </div>
      </div>

      {/* Order Radiology Test Slide-Over Drawer Modal */}
      <RadiologyTestOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchOrders}
      />

      {/* Action Modals */}
      <RadiologyViewOrderModal
        order={viewModalOrder}
        isOpen={!!viewModalOrder}
        onClose={() => setViewModalOrder(null)}
      />

      <RadiologyEditOrderModal
        order={editModalOrder}
        isOpen={!!editModalOrder}
        onClose={() => setEditModalOrder(null)}
        onSuccess={fetchOrders}
      />

      <RadiologyScheduleModal
        order={scheduleModalOrder}
        isOpen={!!scheduleModalOrder}
        onClose={() => setScheduleModalOrder(null)}
        onSuccess={fetchOrders}
      />

      <RadiologyCancelModal
        order={cancelModalOrder}
        isOpen={!!cancelModalOrder}
        onClose={() => setCancelModalOrder(null)}
        onSuccess={fetchOrders}
      />

      <RadiologyStudyDetailsModal
        order={studyModalOrder}
        isOpen={!!studyModalOrder}
        onClose={() => setStudyModalOrder(null)}
      />

      <RadiologyUploadImagesModal
        order={uploadImagesOrder}
        isOpen={!!uploadImagesOrder}
        onClose={() => setUploadImagesOrder(null)}
        onSuccess={fetchOrders}
      />

      <RadiologyFindingsModal
        order={findingsModalOrder}
        isOpen={!!findingsModalOrder}
        onClose={() => setFindingsModalOrder(null)}
        onSuccess={fetchOrders}
      />

      <RadiologyCancellationDetailsModal
        order={cancellationDetailsOrder}
        isOpen={!!cancellationDetailsOrder}
        onClose={() => setCancellationDetailsOrder(null)}
      />
    </div>
  );
}
