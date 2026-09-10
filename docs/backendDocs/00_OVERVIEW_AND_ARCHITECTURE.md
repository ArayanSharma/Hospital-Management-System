# 00. Backend Overview & Architecture Documentation

## 1. System Architecture Overview

This backend is built on **Node.js, Express (v4.x), and MongoDB (via Mongoose v8.x)** following a modular **Clean Layered Controller-Service Architecture**. Each feature or business domain resides inside its own self-contained module directory (`src/modules/<module-name>`).

### Architectural Layering Pattern

Every module follows a strict separation of concerns into 5 distinct layers:

```
                  ┌────────────────────────┐
                  │      HTTP Client       │
                  └───────────┬────────────┘
                              │ Request
                              ▼
                  ┌────────────────────────┐
                  │    Express Router      │ (Routes Layer)
                  └───────────┬────────────┘
                              │ Auth & Validation Middleware
                              ▼
                  ┌────────────────────────┐
                  │       Controller       │ (Controller Layer)
                  └───────────┬────────────┘
                              │ Passes Clean DTO / Data
                              ▼
                  ┌────────────────────────┐
                  │        Service         │ (Business Logic Layer)
                  └───────────┬────────────┘
                              │ DB Operations & Mongoose Queries
                              ▼
                  ┌────────────────────────┐
                  │      Mongoose Model    │ (Data Layer - MongoDB)
                  └────────────────────────┘
```

1. **Routes Layer (`*.routes.js`)**: Maps URL endpoints to HTTP methods, applies authentication (`authenticate`), permission guards (`checkPermission`), file upload handlers (`upload`), and payload validation middlewares (`validate`).
2. **Validation Layer (`*.validation.js`)**: Defines Zod schemas to sanitize and validate request payloads (`req.body`, `req.params`, `req.query`).
3. **Controller Layer (`*.controller.js`)**: Extracts input data, invokes the corresponding service method, wraps the result in standard `ApiResponse`, and handles success HTTP response codes (`200 OK`, `201 Created`).
4. **Service Layer (`*.service.js`)**: Contains pure business logic, database transactions (`session`), collision checks, entity existence checks, status workflow transitions, and external integration calls (Cloudinary, Notifications, Audit Logs).
5. **Model Layer (`*.model.js`)**: Defines Mongoose Schemas, MongoDB indexes, virtual getters, pre/post hooks (e.g., password hashing, ID generation), and custom instance methods.

---

## 2. Core Infrastructure & Configuration

### [DbConnect.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/config/DbConnect.js)
- **Purpose**: Manages MongoDB connection life cycle using Mongoose.
- **Key Details**: Configures connection strings from `MONGODB_URI`, handles connection pooling, logs successful connection events, and catches database startup errors with graceful shutdown handlers.

### [cloudinary.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/config/cloudinary.js)
- **Purpose**: Configures Cloudinary v2 SDK for cloud-based file storage (Lab PDFs, Radiology DICOM/scans, User avatars, Clinical attachments).
- **Key Details**: Isolates API keys (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

### [seeder.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/config/seeder.js)
- **Purpose**: Automated Database Initialization / Bootstrap script.
- **Key Details**: Seeds initial system roles (`SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `NURSE`, `RECEPTIONIST`, `PHARMACIST`, `LAB_TECH`, `PATIENT`), default permissions registry, and the initial Super Admin account so the application works out-of-the-box upon deployment.

---

## 3. Middleware Pipeline

### 1. `authenticate` ([auth.middleware.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/middleware/auth.middleware.js))
- **Function**: Validates JSON Web Token (`JWT`) passed in the `Authorization: Bearer <token>` header.
- **Logic**: Decodes token using `JWT_ACCESS_SECRET`, extracts `userId`, `role`, and `permissions`, attaching them to `req.user`. Handles `TokenExpiredError` (returns `401 AUTH_TOKEN_EXPIRED`) and `JsonWebTokenError` (returns `401 AUTH_TOKEN_INVALID`).

### 2. `checkPermission(requiredPermission)` ([permission.middleware.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/middleware/permission.middleware.js))
- **Function**: Enforces Role-Based Access Control (RBAC).
- **Logic**: Inspects `req.user.permissions` or `req.user.role`. If the user is `SUPER_ADMIN`, access is automatically granted (wildcard bypass). Otherwise, checks if `requiredPermission` exists in `req.user.permissions`. If missing, throws `403 FORBIDDEN`.

### 3. `validate(schema)` ([validation.middleware.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/middleware/validation.middleware.js))
- **Function**: Express request validator utilizing Zod schemas.
- **Logic**: Validates `req.body`, `req.query`, or `req.params` against a Zod schema. If validation fails, collects field errors and throws `400 BAD_REQUEST` with structured field error arrays.

### 4. `upload` ([upload.middleware.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/middleware/upload.middleware.js))
- **Function**: Handles multipart form-data for file uploads via `multer` + Cloudinary Storage.
- **Logic**: Filters file MIME types (images: JPG/PNG, documents: PDF/DICOM), sets file size limits (5MB/10MB), uploads directly to Cloudinary, and populates `req.file` or `req.files` with Cloudinary metadata.

### 5. `errorHandler` ([error.middleware.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/middleware/error.middleware.js))
- **Function**: Global Express error handler middleware.
- **Logic**: Catches all errors passed via `next(err)` or thrown inside `asyncHandler`. Sanitizes error output in production and formats standardized JSON response:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "errorCode": "INVALID_INPUT",
    "message": "Validation failed",
    "errors": [
      { "field": "email", "message": "Invalid email address format" }
    ]
  }
  ```

---

## 4. Response & Error Standardization

### `AppError` ([AppError.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/core/errors/AppError.js))
Custom JavaScript `Error` class extended for standard application exceptions:
- `statusCode`: HTTP Status Code (400, 401, 403, 404, 409, 422, 500).
- `errorCode`: Machine-readable error code string (e.g. `AUTH_TOKEN_EXPIRED`, `PATIENT_NOT_FOUND`, `SLOT_OVERLAP_CONFLICT`).
- `errors`: Optional array of specific field validation errors.

### `ApiResponse` ([apiResponse.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/core/responses/apiResponse.js))
Standardized HTTP success response wrapper helper:
```js
ApiResponse.success(res, data, message, statusCode = 200, meta = null)
```

---

## 5. Shared Utility Helpers (`src/utils`)

| Utility File | Main Functions | Purpose & Business Logic |
| :--- | :--- | :--- |
| **[asyncHandler.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/asyncHandler.js)** | `asyncHandler(fn)` | Higher-order wrapper around async controller methods to catch promise rejections and pass errors to `next(err)` automatically. |
| **[generateId.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/generateId.js)** | `generateUHID()`, `generateInvoiceNumber()`, `generateAppointmentNo()` | Generates human-readable sequential tracking numbers (e.g., Patient UHID: `PAT-20260826-0001`, Invoice: `INV-2026-1002`). |
| **[generateToken.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/generateToken.js)** | `generateAccessToken(user)`, `generateRefreshToken(user)` | Issues signed JWT access tokens (short-lived, e.g., 15m) and refresh tokens (long-lived, e.g., 7d) containing `userId`, `role`, `email`, and `permissions`. |
| **[getRequestMeta.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/getRequestMeta.js)** | `getRequestMeta(req)` | Extracts Client IP Address and User-Agent from HTTP headers for Audit Logging purposes. |
| **[pagination.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/pagination.js)** | `getPagination(query)` | Standardizes pagination logic across list APIs. Parses `page` (default 1), `limit` (default 10), computes `skip`, and returns page metadata (`totalPages`, `hasNextPage`, `hasPrevPage`). |
| **[timeOverlap.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/timeOverlap.js)** | `checkTimeOverlap(start1, end1, start2, end2)` | Utility to check slot collisions for Doctor scheduling, Appointment booking, and Operating Theatre (OT) reservations. |

---

## 6. Performance & Real-Time Infrastructure

### ⚡ Redis Caching Layer (`src/utils/redisCache.js`)
- **Cache Key Schema**: `hms:<module>:<sub-resource>:<params>` (e.g., `hms:superadmin:dashboard:2026-08-10:2026-09-09:all`).
- **TTL Strategy**: Dashboard stats are cached for 300s (5 minutes) with automatic cache invalidation upon critical mutation events.

### 🔌 Socket.IO Real-Time Channels (`src/config/socket.config.js`)
- **Notification Channels**: Emits `notification:new` events to target user rooms (`user:<userId>`) or role channels (`role:<roleName>`) for appointment bookings, critical lab report completions, and inventory alerts.

### 📧 Email Dispatcher Integration (`src/utils/email/`)
- **Templates**: Modular HTML email layouts (`adminTemplates.js`, `appointmentTemplates.js`, `billingTemplates.js`, `authTemplates.js`).
- **Resend Transport**: Asynchronous background email delivery for user registration invitations and invoice receipts.
