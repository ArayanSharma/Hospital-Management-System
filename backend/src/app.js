import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));

// Increase payload limits for base64 scan images and DICOM reports
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use("/api/v1", routes);
app.use("/api", routes);

// Global Error Handler
app.use(errorHandler);

export default app;