import React from "react";
import { useInvoices } from "../hooks/useInvoices.js";
import InvoicesHeader from "../components/InvoicesHeader.jsx";
import InvoiceKpiCards from "../components/InvoiceKpiCards.jsx";
import InvoiceFiltersBar from "../components/InvoiceFiltersBar.jsx";
import InvoiceTable from "../components/InvoiceTable.jsx";
import CollectPaymentPanel from "../components/CollectPaymentPanel.jsx";
import PaymentReceiptPanel from "../components/PaymentReceiptPanel.jsx";
import InvoiceStatusSummaryCard from "../components/InvoiceStatusSummaryCard.jsx";
import QuickActionsCard from "../components/QuickActionsCard.jsx";
import RecentPaymentsCard from "../components/RecentPaymentsCard.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import InvoiceForm from "../components/InvoiceForm.jsx";
import { createInvoiceApi } from "../services/invoice.api.js";
import { downloadRadiologyReportPdf } from "../../radiology/helpers/radiologyPdfHelper.js";

export default function InvoiceList() {
  const {
    invoices,
    stats,
    statusSummary,
    recentPayments,
    loading,
    error,
    page,
    setPage,
    limit,
    setLimit,
    pagination,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    dateRange,
    setDateRange,
    collectingInvoice,
    activeReceipt,
    newInvoiceOpen,
    setNewInvoiceOpen,
    handleOpenCollectPayment,
    handleCloseCollectPayment,
    handlePaymentSuccess,
    handleCloseReceipt,
    refreshData,
  } = useInvoices();

  const [submittingInvoice, setSubmittingInvoice] = React.useState(false);

  const handleCreateInvoiceSubmit = async (formData) => {
    setSubmittingInvoice(true);
    try {
      await createInvoiceApi(formData);
      setNewInvoiceOpen(false);
      refreshData();
      alert("Invoice created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setSubmittingInvoice(false);
    }
  };

  const handleViewInvoice = (invoice) => {
    handleOpenCollectPayment(invoice);
  };

  const handlePrintInvoice = (invoice) => {
    downloadRadiologyReportPdf("invoice-table-container", `${invoice.invoiceNumber}_Invoice.pdf`);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Page Title & Top Header Actions */}
      <InvoicesHeader
        onNewInvoice={() => setNewInvoiceOpen(true)}
        onExport={() => alert("Exporting billing invoices list...")}
      />

      {/* 2. 4 Soft Medical KPI Statistics Cards */}
      <InvoiceKpiCards stats={stats} />

      {/* 3. Main Content 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT / CENTER COLUMN: Filters, Invoices Table, Collect Payment Panel, Payment Receipt Panel */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-5">
          {/* 4. Search and Filters Bar */}
          <InvoiceFiltersBar
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onApplyFilters={refreshData}
          />

          {/* 5. Main Invoices Table */}
          <div id="invoice-table-container">
            {loading ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500 font-medium text-xs shadow-2xs">
                Loading billing invoices from database...
              </div>
            ) : error ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-rose-500 font-semibold text-xs shadow-2xs">
                {error}
              </div>
            ) : (
              <InvoiceTable
                invoices={invoices}
                pagination={pagination}
                page={page}
                onPageChange={setPage}
                limit={limit}
                onLimitChange={setLimit}
                onViewInvoice={handleViewInvoice}
                onCollectPayment={handleOpenCollectPayment}
                onPrintInvoice={handlePrintInvoice}
              />
            )}
          </div>

          {/* 6. Collect Payment Panel (Appears when user clicks Collect Payment on any invoice) */}
          {collectingInvoice && (
            <CollectPaymentPanel
              invoice={collectingInvoice}
              onClose={handleCloseCollectPayment}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {/* 7. Payment Receipt Panel (Appears immediately after payment is collected) */}
          {activeReceipt && (
            <PaymentReceiptPanel
              receipt={activeReceipt}
              onClose={handleCloseReceipt}
            />
          )}
        </div>

        {/* RIGHT SIDEBAR COLUMN: Status Summary Donut Chart, Quick Actions, Recent Payments */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">
          {/* 8. Invoice Status Summary Card (Interactive Donut Chart) */}
          <InvoiceStatusSummaryCard statusSummary={statusSummary} />

          {/* 9. Quick Actions Card */}
          <QuickActionsCard
            onNewInvoice={() => setNewInvoiceOpen(true)}
            onOpenCollectPayment={() => {
              if (invoices.length > 0) handleOpenCollectPayment(invoices[0]);
            }}
          />

          {/* 10. Recent Payments Card with Today's Collection */}
          <RecentPaymentsCard recentPayments={recentPayments} />
        </div>
      </div>

      {/* Slide-Over Modal for Creating New Invoice */}
      <Modal
        isOpen={newInvoiceOpen}
        onClose={() => setNewInvoiceOpen(false)}
        title="New Invoice"
        maxWidth="max-w-6xl"
      >
        <InvoiceForm
          onSubmit={handleCreateInvoiceSubmit}
          onCancel={() => setNewInvoiceOpen(false)}
          submitting={submittingInvoice}
        />
      </Modal>
    </div>
  );
}