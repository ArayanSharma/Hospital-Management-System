import http from "http";
import app from "./app.js";
import connectDB from "./config/DbConnect.js";
import { initSystemDatabase } from "./config/initDatabase.js";
import redisClient from "./config/redis.config.js";
import { initSocket } from "./config/socket.config.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    await initSystemDatabase();
    server.listen(PORT, () => {
      console.log(`🚀 Server & Socket.io running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

