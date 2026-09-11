  import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { globalRateLimiter } from "./middleware/rateLimiter.middleware.js";
import { mongoSanitizeMiddleware } from "./middleware/sanitize.middleware.js";

const app = express();

// Disable 'X-Powered-By: Express' header to prevent technology stack disclosure
app.disable("x-powered-by");

// 🔒 CORS Configuration Hardening - MUST BE PLACED BEFORE OTHER MIDDLEWARES
app.use(cors());
app.options("*", cors());

// 🛡️ Security Hardening with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

// Payload limits for base64 scan images and DICOM reports
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// 🧹 NoSQL Injection Sanitizer
app.use(mongoSanitizeMiddleware);

// ⚡ Global API Rate Limiter
app.use("/api", globalRateLimiter);

app.use("/api/v1", routes);
app.use("/api", routes);

// Global Error Handler
app.use(errorHandler);

export default app;