import { useEffect } from "react";
import { useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "../lib/socket";
import { useToast } from "../components/common/ToastProvider";

export const useSocketNotification = () => {
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);
  const { addToast } = useToast();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    if (socket) {
      const handleNotification = (notification) => {
        console.log("🔔 Realtime notification received:", notification);
        
        // Show live toast
        addToast({
          id: notification._id,
          title: notification.title,
          message: notification.message,
          type: notification.type || "default",
          metadata: notification.metadata,
        });

        // Dispatch custom window event for header badge sync
        window.dispatchEvent(new CustomEvent("hms:notification:new", { detail: notification }));
      };

      // Edge Case 2: Reconnection sync for missed notifications while offline
      const handleReconnect = () => {
        console.log("🔌 Socket reconnected. Refreshing notifications sync...");
        window.dispatchEvent(new CustomEvent("hms:notification:sync"));
      };

      socket.on("notification:received", handleNotification);
      socket.on("reconnect", handleReconnect);

      return () => {
        socket.off("notification:received", handleNotification);
        socket.off("reconnect", handleReconnect);
      };
    }
  }, [isAuthenticated, accessToken, addToast]);
};
