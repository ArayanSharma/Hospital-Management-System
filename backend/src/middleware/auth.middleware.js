import jwt from "jsonwebtoken";
import AppError from "../core/errors/AppError.js";
import { ErrorCodes } from "../core/errors/errorCodes.js";
import { getCache } from "../utils/redisCache.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token required", 401, ErrorCodes.AUTH_TOKEN_MISSING);
    }

    const token = authHeader.split(" ")[1];

    // Check if token has been revoked / logged out
    const isBlacklisted = await getCache(`hms:token:blacklist:${token}`);
    if (isBlacklisted) {
      throw new AppError("Token has been revoked. Please login again.", 401, ErrorCodes.AUTH_UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "default_access_secret");

    req.token = token;
    req.user = decoded;
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Access token expired", 401, ErrorCodes.AUTH_TOKEN_EXPIRED));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid access token", 401, ErrorCodes.AUTH_TOKEN_INVALID));
    }
    next(err);
  }
};
