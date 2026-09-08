import { useState, useEffect, useCallback } from "react";
import { getNotificationsApi, markAsReadApi, markAllAsReadApi } from "../services/notification.api.js";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getNotificationsApi({ limit: 10 });
      setNotifications(data?.data?.notifications || []);
      setUnreadCount(data?.data?.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    
    // Listen for realtime Socket.io notification event
    const handleNewNotification = (e) => {
      const newNotif = e.detail;
      if (newNotif) {
        setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
        setUnreadCount((prev) => prev + 1);
      }
    };

    window.addEventListener("hms:notification:new", handleNewNotification);
    window.addEventListener("hms:notification:sync", fetchNotifications);

    // Fallback polling every 60s
    const interval = setInterval(fetchNotifications, 60000);

    return () => {
      window.removeEventListener("hms:notification:new", handleNewNotification);
      window.removeEventListener("hms:notification:sync", fetchNotifications);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const markRead = async (id) => {
    try {
      await markAsReadApi(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllAsReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return { notifications, unreadCount, loading, markRead, markAllRead, refetch: fetchNotifications };
};