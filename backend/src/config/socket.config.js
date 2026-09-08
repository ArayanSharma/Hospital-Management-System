import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io = null;

export const initSocket = (httpServer) => {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ].filter(Boolean);

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
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

      const secret = process.env.JWT_ACCESS_SECRET || "default_access_secret";
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
