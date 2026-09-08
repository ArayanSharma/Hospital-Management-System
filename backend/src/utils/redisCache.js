import redisClient from "../config/redis.config.js";

/**
 * Retrieve parsed data from Redis cache.
 * @param {string} key - Redis key
 * @returns {Promise<any|null>} Parsed JSON or string, or null on cache miss/error
 */
export const getCache = async (key) => {
  if (!redisClient || redisClient.status !== "ready") return null;
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  } catch (error) {
    console.warn(`⚠️ [Redis Cache GET Error] Key: ${key} |`, error.message);
    return null;
  }
};

/**
 * Store data into Redis cache with TTL.
 * @param {string} key - Redis key
 * @param {any} value - Value to cache (Objects/Arrays will be JSON stringified)
 * @param {number} ttlInSeconds - Expiration time in seconds (Default: 3600 = 1 hour)
 */
export const setCache = async (key, value, ttlInSeconds = 3600) => {
  if (!redisClient || redisClient.status !== "ready") return false;
  try {
    const payload = typeof value === "object" ? JSON.stringify(value) : String(value);
    if (ttlInSeconds > 0) {
      await redisClient.set(key, payload, "EX", ttlInSeconds);
    } else {
      await redisClient.set(key, payload);
    }
    return true;
  } catch (error) {
    console.warn(`⚠️ [Redis Cache SET Error] Key: ${key} |`, error.message);
    return false;
  }
};

/**
 * Delete a single key or array of keys from Redis.
 * @param {string|string[]} keys
 */
export const delCache = async (keys) => {
  if (!redisClient || redisClient.status !== "ready") return false;
  try {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    if (keysArray.length === 0) return true;
    await redisClient.del(...keysArray);
    return true;
  } catch (error) {
    console.warn(`⚠️ [Redis Cache DEL Error]`, error.message);
    return false;
  }
};

/**
 * Non-blocking pattern key deletion using SCAN.
 * @param {string} pattern - Key pattern (e.g. 'hms:perm:*')
 */
export const invalidatePattern = async (pattern) => {
  if (!redisClient || redisClient.status !== "ready") return false;
  try {
    let stream = redisClient.scanStream({
      match: pattern,
      count: 100,
    });

    stream.on("data", async (resultKeys) => {
      if (resultKeys.length) {
        const pipeline = redisClient.pipeline();
        resultKeys.forEach((key) => pipeline.del(key));
        await pipeline.exec();
      }
    });

    return true;
  } catch (error) {
    console.warn(`⚠️ [Redis Pattern Invalidation Error] Pattern: ${pattern} |`, error.message);
    return false;
  }
};

/**
 * Retrieve from cache if available, or fetch fresh from DB and populate cache.
 * @param {string} key
 * @param {Function} fetchFn - Async fallback fetch function
 * @param {number} ttlInSeconds
 */
export const getOrSetCache = async (key, fetchFn, ttlInSeconds = 3600) => {
  const cached = await getCache(key);
  if (cached !== null) {
    return { data: cached, source: "CACHE_HIT" };
  }

  const freshData = await fetchFn();
  if (freshData !== null && freshData !== undefined) {
    await setCache(key, freshData, ttlInSeconds);
  }
  return { data: freshData, source: "CACHE_MISS" };
};

/**
 * Acquire Atomic Distributed Mutex Lock using Redis SET NX EX.
 * @param {string} lockKey
 * @param {number} ttlInSeconds - Duration before lock auto-expires (Default: 10s)
 * @returns {Promise<boolean>} True if lock acquired, False if already locked
 */
export const acquireLock = async (lockKey, ttlInSeconds = 10) => {
  if (!redisClient || redisClient.status !== "ready") return true; // Fail open if Redis offline
  try {
    const result = await redisClient.set(lockKey, "LOCKED", "EX", ttlInSeconds, "NX");
    return result === "OK";
  } catch (error) {
    console.warn(`⚠️ [Redis Acquire Lock Error] Key: ${lockKey} |`, error.message);
    return true; // Fail open
  }
};

/**
 * Release Atomic Mutex Lock.
 * @param {string} lockKey
 */
export const releaseLock = async (lockKey) => {
  return await delCache(lockKey);
};

