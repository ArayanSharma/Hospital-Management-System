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

// 🛡️ Security Hardening with Helmet v8
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
        connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5173", "ws:", "wss:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "deny" },
    noSniff: true,
    xssFilter: true,
  })
);

// 🔒 CORS Configuration Hardening
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or localhost or any vercel.app subdomain
      if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(new URL(origin).hostname)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Error: Origin ${origin} is not allowed.`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Correlation-ID"],
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