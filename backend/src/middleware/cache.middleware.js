import { getCache, setCache } from "../utils/redisCache.js";

/**
 * Enterprise Production-Grade Route Cache Middleware
 * Secure, User-Scoped, and Authorization-Safe.
 * 
 * @param {number} ttlInSeconds - Cache duration in seconds (Default: 300 = 5 minutes)
 * @param {string} prefix - Custom key prefix (Default: 'hms:route')
 * @param {boolean} isUserSpecific - Whether cache key must be isolated per authenticated user (Default: true)
 */
export const routeCache = (ttlInSeconds = 300, prefix = "hms:route", isUserSpecific = true) => {
  return async (req, res, next) => {
    // 1. SECURITY GUARANTEE: Only cache HTTP GET requests. Never cache mutations (POST, PUT, DELETE, PATCH)
    if (req.method !== "GET") {
      return next();
    }

    // 2. SECURITY GUARANTEE: Never cache sensitive Auth, Financial checkout, or Password endpoints
    const sensitivePaths = ["/auth/login", "/auth/logout", "/auth/refresh", "/payments/checkout", "/users/change-password"];
    if (sensitivePaths.some((path) => req.originalUrl.includes(path))) {
      return next();
    }

    // 3. SECURITY & DATA ISOLATION: Build user-scoped or global cache key
    // If request is authenticated, attach req.user.id to prevent cross-user data leakage!
    const userIdScope = isUserSpecific && req.user?.id ? `usr:${req.user.id}:` : "pub:";
    const cacheKey = `${prefix}:${userIdScope}${req.originalUrl || req.url}`;

    try {
      // 4. Check Redis cache
      const cachedResponse = await getCache(cacheKey);
      if (cachedResponse) {
        res.setHeader("X-Cache-Status", "HIT");
        res.setHeader("X-Cache-Scoped-User", req.user?.id || "anonymous");
        return res.status(200).json(cachedResponse);
      }

      // 5. Cache MISS - Capture response safely
      res.setHeader("X-Cache-Status", "MISS");
      const originalJson = res.json.bind(res);

      res.json = (body) => {
        // SECURITY: Cache ONLY HTTP 200 Success responses. Never cache 401, 403, 404, or 500 errors!
        if (res.statusCode === 200 && body) {
          setCache(cacheKey, body, ttlInSeconds).catch((err) =>
            console.warn("⚠️ [Route Cache Write Warning]:", err.message)
          );
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.warn("⚠️ [Route Cache Error, Fallback to DB]:", error.message);
      next();
    }
  };
};

