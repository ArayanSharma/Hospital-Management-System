import redisClient from "../config/redis.config.js";

/**
 * In-Memory Fallback Map for Rate Limiting when Redis is unreachable/offline
 */
const inMemoryStore = new Map();

// Periodic cleanup for in-memory store every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of inMemoryStore.entries()) {
    if (now > record.resetTime) {
      inMemoryStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Factory function to create custom Rate Limiting middleware
 * @param {Object} options
 * @param {string} options.prefix - Redis key prefix (e.g. 'ratelimit:auth:')
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 mins)
 * @param {number} options.max - Maximum allowed requests in window
 * @param {string} options.message - Custom 429 error message
 */
export function createRateLimiter({
  prefix = "ratelimit:global:",
  windowMs = 15 * 60 * 1000,
  max = 300,
  message = "Too many requests from this IP, please try again later.",
}) {
  const windowSeconds = Math.ceil(windowMs / 1000);

  return async (req, res, next) => {
    // Determine client identifier (IP or authenticated user ID)
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      "127.0.0.1";
    
    const identifier = req.user?._id ? `user:${req.user._id}` : `ip:${clientIp}`;
    const redisKey = `${prefix}${identifier}`;

    let currentHits = 0;
    let ttlSeconds = windowSeconds;

    try {
      // 1. Check if Redis client is ready and connected
      if (redisClient && redisClient.status === "ready") {
        const pipeline = redisClient.pipeline();
        pipeline.incr(redisKey);
        pipeline.ttl(redisKey);
        const results = await pipeline.exec();

        currentHits = results[0][1];
        ttlSeconds = results[1][1];

        // Set key TTL on first request in window
        if (ttlSeconds === -1 || currentHits === 1) {
          await redisClient.expire(redisKey, windowSeconds);
          ttlSeconds = windowSeconds;
        }
      } else {
        // 2. Fallback: In-Memory Rate Limiting when Redis is offline
        const now = Date.now();
        const record = inMemoryStore.get(redisKey);

        if (!record || now > record.resetTime) {
          inMemoryStore.set(redisKey, {
            hits: 1,
            resetTime: now + windowMs,
          });
          currentHits = 1;
          ttlSeconds = windowSeconds;
        } else {
          record.hits += 1;
          currentHits = record.hits;
          ttlSeconds = Math.ceil((record.resetTime - now) / 1000);
        }
      }

      // Calculate remaining allowed requests
      const remaining = Math.max(0, max - currentHits);
      const resetTimeEpoch = Math.ceil(Date.now() / 1000) + Math.max(0, ttlSeconds);

      // Set standard RateLimit HTTP response headers
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", resetTimeEpoch);

      // 3. Reject request if limit exceeded
      if (currentHits > max) {
        res.setHeader("Retry-After", ttlSeconds);
        return res.status(429).json({
          success: false,
          statusCode: 429,
          error: "Too Many Requests",
          message,
          retryAfterSeconds: ttlSeconds,
        });
      }

      next();
    } catch (err) {
      // 4. Fail-Open Principle: Log error & allow traffic to flow if rate limiter encounters unexpected error
      console.error("⚠️ [RateLimiter Error]:", err.message);
      next();
    }
  };
}

/**
 * Pre-configured Rate Limiters for HospitalMS
 */

// 🔒 Strict Auth Limiter: Max 10 attempts per 15 minutes (Login, Register, Password Reset)
export const authRateLimiter = createRateLimiter({
  prefix: "ratelimit:auth:",
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
});

// 🌐 Global API Limiter: Max 300 requests per 15 minutes
export const globalRateLimiter = createRateLimiter({
  prefix: "ratelimit:global:",
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "API request threshold exceeded. Please slow down your requests.",
});

// 📊 Sensitive Heavy Action Limiter: Max 20 requests per 5 minutes (Export CSV, PDF Scans)
export const sensitiveRateLimiter = createRateLimiter({
  prefix: "ratelimit:sensitive:",
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: "Too many export or scan requests. Please wait a few minutes before trying again.",
});
