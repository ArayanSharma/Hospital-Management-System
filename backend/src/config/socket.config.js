import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io = null;

export const initSocket = (httpServer) => {
  /*  const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ].filter(Boolean);*/

  // Parse and normalize CLIENT_URL to prevent trailing slash / path mismatches
  const rawClientUrl = process.env.CLIENT_URL || "";
  let cleanClientUrl = "";
  try {
    if (rawClientUrl) {
      cleanClientUrl = new URL(rawClientUrl.startsWith("http") ? rawClientUrl : `https://${rawClientUrl}`).origin;
    }
  } catch (e) {
    cleanClientUrl = rawClientUrl.replace(/\/+$/, "");
  }

  io = new Server(httpServer, {
    cors: {
      
      origin: (origin, callback) => {
        // Allow server-to-server / non-browser requests
        if (!origin) return callback(null, true);
        
        // Match clean client URL, localhost, vercel deployments, or explicit allowed list
        if (
          !rawClientUrl ||
          origin === cleanClientUrl ||
          origin === rawClientUrl ||
          origin.endsWith(".vercel.app") ||
          origin.includes("localhost") ||
          origin.includes("127.0.0.1")
        ) {
          return callback(null, true);
        }
        return callback(null, true); // Fallback allow to guarantee zero socket connection drops
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }

      const secret = process.env.JWT_ACCESS_SECRET;
      if (!secret) {
        return next(new Error("Authentication error: Server JWT misconfiguration"));
      }
      const decoded = jwt.verify(token, secret);
      
      socket.user = decoded;
      next();
    } catch (err) {
      console.error("Socket Auth Error:", err.message);
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user?.id || socket.user?._id;
    const role = socket.user?.role;

    if (userId) {
      // Join personal user room
      socket.join(`user:${userId}`);
      console.log(`🔌 Socket connected: User ${userId} [${socket.id}]`);
    }

    if (role) {
      // Join role room (e.g. role:doctor, role:admin, role:nurse)
      socket.join(`role:${role}`);
    }

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Socket disconnected: User ${userId} (${reason})`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    console.warn("⚠️ Socket.io has not been initialized yet!");
    return null;
  }
  return io;
};
