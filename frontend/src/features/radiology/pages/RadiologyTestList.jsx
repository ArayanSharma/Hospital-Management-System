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

export default function RadiologyTestList() {
  const [modalOpen, setModalOpen] = useState(false);

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
                onDeleteOrder={deleteOrder}
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
    </div>
  );
}
