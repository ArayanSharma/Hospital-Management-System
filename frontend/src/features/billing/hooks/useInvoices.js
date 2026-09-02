import { useState, useEffect, useCallback } from "react";
import { getInvoicesApi } from "../services/invoice.api.js";
import { getAllPaymentsApi } from "../services/payment.api.js";

export function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalBilledAmount: 0,
    totalPaidAmount: 0,
    totalOutstandingAmount: 0,
  });
  const [statusSummary, setStatusSummary] = useState({
    paid: { count: 0, percentage: 0 },
    partiallyPaid: { count: 0, percentage: 0 },
    unpaid: { count: 0, percentage: 0 },
    cancelled: { count: 0, percentage: 0 },
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [dateRange, setDateRange] = useState("01 Aug 2026 - 31 Aug 2026");

  // Panel state
  const [collectingInvoice, setCollectingInvoice] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);

  const fetchInvoicesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [invoicesRes, paymentsRes] = await Promise.all([
        getInvoicesApi({
          page,
          limit,
          status: statusFilter,
          department: departmentFilter,
          search,
        }),
        getAllPaymentsApi({ page: 1, limit: 5 }),
      ]);

      const data = invoicesRes.data?.data;
      if (data?.invoices) {
        setInvoices(data.invoices);
        if (data.stats) setStats(data.stats);
        if (data.statusSummary) setStatusSummary(data.statusSummary);
        if (data.pagination) setPagination(data.pagination);
      }

      if (paymentsRes.data?.data?.payments) {
        setRecentPayments(paymentsRes.data.data.payments);
      }
    } catch (err) {
      console.error("Error fetching billing data:", err);
      setError("Failed to load invoices from server.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, departmentFilter, search]);

  useEffect(() => {
    fetchInvoicesData();
  }, [fetchInvoicesData]);

  const handleOpenCollectPayment = (invoice) => {
    setCollectingInvoice(invoice);
    const elem = document.getElementById("collect-payment-panel-section");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  const handleCloseCollectPayment = () => {
    setCollectingInvoice(null);
  };

  const handlePaymentSuccess = (receiptData) => {
    setCollectingInvoice(null);
    setActiveReceipt(receiptData);
    fetchInvoicesData();
    const elem = document.getElementById("payment-receipt-panel-section");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  const handleCloseReceipt = () => {
    setActiveReceipt(null);
  };

  return {
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
    setCollectingInvoice,
    activeReceipt,
    setActiveReceipt,
    newInvoiceOpen,
    setNewInvoiceOpen,
    handleOpenCollectPayment,
    handleCloseCollectPayment,
    handlePaymentSuccess,
    handleCloseReceipt,
    refreshData: fetchInvoicesData,
  };
}
