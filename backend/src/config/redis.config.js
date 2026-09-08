import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let isRedisConnected = false;
let hasLoggedOfflineWarning = false;
let retryCounter = 0;

const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false, // Prevents memory leaks by not queuing commands when Redis is offline
  retryStrategy(times) {
    retryCounter = times;
    // Exponential backoff strategy: 500ms, 1s, 2s, 4s... capped at 10 seconds
    const delay = Math.min(Math.pow(2, times) * 250, 10000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
};

let redisClient;

try {
  if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL, redisOptions);
  } else {
    redisClient = new Redis(redisOptions);
  }

  redisClient.on("connect", () => {
    if (!isRedisConnected) {
      console.log("⚡ [Redis] Connecting to Redis server...");
    }
  });

  redisClient.on("ready", () => {
    isRedisConnected = true;
    hasLoggedOfflineWarning = false;
    retryCounter = 0;
    console.log("✅ [Redis] Connection established & ready for caching.");
  });

  redisClient.on("error", (err) => {
    isRedisConnected = false;
    // THROTTLED LOGGING: Log offline warning ONLY ONCE when Redis fails to connect, avoiding terminal log spam
    if (!hasLoggedOfflineWarning) {
      hasLoggedOfflineWarning = true;
      console.warn(
        `⚠️ [Redis Offline] Server connection refused (${redisOptions.host}:${redisOptions.port}). Application operating in Fail-Open fallback mode using direct MongoDB database queries.`
      );
    }
  });

  redisClient.on("reconnecting", (time) => {
    isRedisConnected = false;
    // Log reconnection attempt only periodically (every 5th attempt) to keep production logs clean
    if (retryCounter > 0 && retryCounter % 5 === 0) {
      console.log(`🔄 [Redis] Background reconnect attempt #${retryCounter} in ${time}ms...`);
    }
  });

  redisClient.on("end", () => {
    if (isRedisConnected) {
      console.warn("❌ [Redis] Connection closed.");
    }
    isRedisConnected = false;
  });
} catch (error) {
  console.error("❌ [Redis Initialization Failure]:", error.message);
  redisClient = null;
}

export default redisClient;
