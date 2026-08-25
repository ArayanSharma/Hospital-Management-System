import jwt from "jsonwebtoken";
import AppError from "../core/errors/AppError.js";
import { ErrorCodes } from "../core/errors/errorCodes.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token required", 401, ErrorCodes.AUTH_TOKEN_MISSING);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "default_access_secret");

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
