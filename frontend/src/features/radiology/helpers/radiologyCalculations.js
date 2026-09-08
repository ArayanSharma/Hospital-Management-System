/**
 * Helper functions to dynamically calculate radiology metrics from live backend data
 */

export function calculateRadiologyStats(orders = [], backendStats = {}) {
  if (backendStats && Object.keys(backendStats).length > 0 && backendStats.totalOrders !== undefined) {
    const pending = backendStats.pendingOrders || 0;
    const scheduled = backendStats.scheduledOrders || 0;
    const inProgress = backendStats.inProgressOrders || 0;
    const completed = backendStats.completedOrders || 0;
    const cancelled = backendStats.cancelledOrders || 0;
    const total = backendStats.totalOrders || (pending + scheduled + inProgress + completed + cancelled);
    const urgentCount = orders.filter((o) => o.priority === "urgent" || o.priority === "emergency").length;
    
    return {
      total,
      pending,
      scheduled,
      inProgress,
      completed,
      cancelled,
      urgent: urgentCount,
    };
  }

  const total = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const scheduled = orders.filter((o) => o.status === "scheduled").length;
  const inProgress = orders.filter((o) => o.status === "in-progress").length;
  const completed = orders.filter((o) => o.status === "completed").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;
  const urgent = orders.filter((o) => o.priority === "urgent" || o.priority === "emergency").length;

  return { total, pending, scheduled, inProgress, completed, cancelled, urgent };
}

export function calculateModalityDistribution(orders = []) {
  if (!orders || orders.length === 0) return [];

  const counts = {};
  orders.forEach((order) => {
    const mod = order.modality || order.testType || "Other";
    counts[mod] = (counts[mod] || 0) + 1;
  });

  const total = orders.length;
  const colors = {
    "X-Ray": "#3b82f6",
    "MRI Scan": "#8b5cf6",
    "CT Scan": "#06b6d4",
    "Ultrasound (USG)": "#10b981",
    Mammography: "#ec4899",
    "PET Scan": "#f59e0b",
    ECG: "#6366f1",
  };

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100),
    color: colors[name] || "#64748b",
  }));
}

export function getTodaySchedule(orders = []) {
  if (!orders || orders.length === 0) return [];

  const todayStr = new Date().toISOString().slice(0, 10);

  return orders.filter((order) => {
    if (!order.scheduledAt) return false;
    const orderDateStr = new Date(order.scheduledAt).toISOString().slice(0, 10);
    return orderDateStr === todayStr || order.status === "scheduled" || order.status === "in-progress";
  });
}
