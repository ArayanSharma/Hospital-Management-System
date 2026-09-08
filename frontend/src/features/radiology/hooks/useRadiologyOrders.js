import { useState, useEffect, useCallback } from "react";
import {
  getRadiologyTestsApi,
  updateRadiologyTestStatusApi,
  deleteRadiologyTestApi,
} from "../services/radiologyTest.api.js";

export function useRadiologyOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [modality, setModality] = useState("");
  const [priority, setPriority] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getRadiologyTestsApi({
        page: 1,
        limit: 50,
        status: activeTab !== "all" ? activeTab : status,
        modality,
        priority,
        search,
        fromDate,
        toDate,
      });

      const apiTests = data?.data?.tests || [];
      const apiStats = data?.data?.stats || {};
      setOrders(apiTests);
      setStats(apiStats);
    } catch (err) {
      console.error("Failed to load radiology orders:", err);
      setError("Failed to fetch radiology orders from server.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, status, modality, priority, search, fromDate, toDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Keep selected order updated when orders change or auto-select first order
  useEffect(() => {
    if (orders.length > 0) {
      if (!selectedOrder) {
        setSelectedOrder(orders[0]);
      } else {
        const found = orders.find((o) => o._id === selectedOrder._id || o.orderId === selectedOrder.orderId);
        if (found) setSelectedOrder(found);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [orders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateRadiologyTestStatusApi(orderId, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update order status.";
      alert(`Error: ${msg}`);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this radiology test order?")) {
      return;
    }
    try {
      await deleteRadiologyTestApi(orderId);
      await fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete order.";
      alert(`Error: ${msg}`);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const pName = order.patientName || order.patientId?.name || "";
    const pId = order.patientId?.patientId || order.patientId || "";
    const oId = order.orderId || "";
    const mod = order.modality || order.testType || "";

    if (
      search &&
      !pName.toLowerCase().includes(search.toLowerCase()) &&
      !pId.toLowerCase().includes(search.toLowerCase()) &&
      !oId.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    const activeStatus = activeTab !== "all" ? activeTab : status;
    if (activeStatus && activeStatus !== "" && order.status !== activeStatus) {
      return false;
    }

    if (modality && !mod.toLowerCase().includes(modality.toLowerCase())) {
      return false;
    }

    if (priority && order.priority !== priority) {
      return false;
    }

    return true;
  });

  return {
    orders,
    filteredOrders,
    stats,
    loading,
    error,
    selectedOrder,
    setSelectedOrder,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
    // Filter bindings
    filters: {
      search,
      setSearch,
      status,
      setStatus,
      modality,
      setModality,
      priority,
      setPriority,
      fromDate,
      setFromDate,
      toDate,
      setToDate,
      activeTab,
      setActiveTab,
    },
  };
}
