import React, { useState } from "react";
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
import InvoicePaymentHistoryModal from "../components/modals/InvoicePaymentHistoryModal.jsx";
import InvoiceRefundModal from "../components/modals/InvoiceRefundModal.jsx";
import InvoiceVoidModal from "../components/modals/InvoiceVoidModal.jsx";
import InvoiceCancellationDetailsModal from "../components/modals/InvoiceCancellationDetailsModal.jsx";
import { createInvoiceApi, voidInvoiceApi, refundInvoiceApi } from "../services/invoice.api.js";
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

  const [submittingInvoice, setSubmittingInvoice] = useState(false);

  // Active Modal States
  const [historyInvoice, setHistoryInvoice] = useState(null);
  const [refundInvoice, setRefundInvoice] = useState(null);
  const [voidInvoice, setVoidInvoice] = useState(null);
  const [cancelDetailsInvoice, setCancelDetailsInvoice] = useState(null);

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

  const handleRefundSuccess = async (inv, refundData) => {
    try {
      await refundInvoiceApi(inv._id, refundData);
      alert(`Refund of ₹ ${refundData.refundAmount} processed successfully for Invoice ${inv.invoiceNumber}.`);
      refreshData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process refund");
    }
  };

  const handleVoidSuccess = async (inv, voidData) => {
    try {
      await voidInvoiceApi(inv._id, voidData);
      alert(`Invoice ${inv.invoiceNumber} has been voided and marked as Cancelled.`);
      refreshData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to void invoice");
    }
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
                onViewPaymentDetails={(inv) => setHistoryInvoice(inv)}
                onViewPaymentHistory={(inv) => setHistoryInvoice(inv)}
                onRefundInvoice={(inv) => setRefundInvoice(inv)}
                onVoidInvoice={(inv) => setVoidInvoice(inv)}
                onViewCancellationDetails={(inv) => setCancelDetailsInvoice(inv)}
                onCreateNewInvoice={() => setNewInvoiceOpen(true)}
              />
            )}
          </div>

          {/* 6. Collect Payment Panel */}
          {collectingInvoice && (
            <CollectPaymentPanel
              invoice={collectingInvoice}
              onClose={handleCloseCollectPayment}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {/* 7. Payment Receipt Panel */}
          {activeReceipt && (
            <PaymentReceiptPanel
              receipt={activeReceipt}
              onClose={handleCloseReceipt}
            />
          )}
        </div>

        {/* RIGHT SIDEBAR COLUMN */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">
          <InvoiceStatusSummaryCard statusSummary={statusSummary} />
          <QuickActionsCard
            onNewInvoice={() => setNewInvoiceOpen(true)}
            onOpenCollectPayment={() => {
              if (invoices.length > 0) handleOpenCollectPayment(invoices[0]);
            }}
          />
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

      {/* Payment History Modal */}
      <InvoicePaymentHistoryModal
        isOpen={!!historyInvoice}
        onClose={() => setHistoryInvoice(null)}
        invoice={historyInvoice}
      />

      {/* Refund / Credit Note Modal */}
      <InvoiceRefundModal
        isOpen={!!refundInvoice}
        onClose={() => setRefundInvoice(null)}
        invoice={refundInvoice}
        onSuccess={handleRefundSuccess}
      />

      {/* Void Invoice Modal */}
      <InvoiceVoidModal
        isOpen={!!voidInvoice}
        onClose={() => setVoidInvoice(null)}
        invoice={voidInvoice}
        onSuccess={handleVoidSuccess}
      />

      {/* View Cancellation Details Modal */}
      <InvoiceCancellationDetailsModal
        isOpen={!!cancelDetailsInvoice}
        onClose={() => setCancelDetailsInvoice(null)}
        invoice={cancelDetailsInvoice}
      />
    </div>
  );
}