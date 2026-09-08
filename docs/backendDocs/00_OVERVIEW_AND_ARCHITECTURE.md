# 00. Backend Overview & Architecture Documentation

## 1. System Architecture Overview

This backend is built on **Node.js, Express, and MongoDB (via Mongoose)** following a modular **Clean Layered Architecture**. Each feature or business domain resides inside its own self-contained module directory (`src/modules/<module-name>`).

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

1. **Routes Layer (`*.routes.js`)**: Maps URL endpoints to HTTP methods, applies authentication (`authenticate`), permission guards (`checkPermission`), file upload handlers, and input validation middlewares (`validate`).
2. **Validation Layer (`*.validation.js`)**: Defines Zod validation schemas to sanitize and validate request payload (`req.body`, `req.params`, `req.query`).
3. **Controller Layer (`*.controller.js`)**: Extracts input data, invokes the corresponding service method, wraps the result in standard `ApiResponse`, and handles success HTTP response codes (`200 OK`, `201 Created`).
4. **Service Layer (`*.service.js`)**: Contains pure business logic, database transactions, validations, entity existence checks, status workflow transitions, and external service calls (e.g. Cloudinary, Notifications).
5. **Model Layer (`*.model.js`)**: Defines Mongoose Schemas, MongoDB indexes, virtual getters, pre/post hooks (e.g., password hashing, ID generation), and custom methods.

---

## 2. Core Infrastructure & Configuration

### [DbConnect.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/config/DbConnect.js)
- **Purpose**: Manages MongoDB connection life cycle using Mongoose.
- **Why it exists**: Provides centralized connection configuration, logs successful connection events, and catches database startup errors.

### [cloudinary.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/config/cloudinary.js)
- **Purpose**: Configures Cloudinary SDK for cloud-based file uploads (Lab reports, X-rays/Radiology scans, User avatars).
- **Why it exists**: Keeps API keys (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) isolated in one place.

### [seeder.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/config/seeder.js)
- **Purpose**: Automated Database Initialization / Bootstrap script.
- **Why it exists**: Seeds initial roles (`SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `NURSE`, `RECEPTIONIST`, `PHARMACIST`, `LAB_TECH`, `PATIENT`), default system permissions, and the initial Super Admin account so the application works out-of-the-box upon deployment.

---

## 3. Middleware Pipeline

### 1. `authenticate` ([auth.middleware.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/middleware/auth.middleware.js))
- **Function**: Validates the JSON Web Token (`JWT`) passed in the `Authorization: Bearer <token>` header.
- **Logic**: Decodes the token using `JWT_ACCESS_SECRET`, extracts `userId`, `role`, and `permissions`, and attaches it to `req.user`. Handles `TokenExpiredError` (returns 401 token expired) and `JsonWebTokenError` (returns 401 invalid token).

### 2. `checkPermission(requiredPermission)` ([permission.middleware.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/middleware/permission.middleware.js))
- **Function**: Enforces Role-Based Access Control (RBAC).
- **Logic**: Inspects `req.user.permissions` or `req.user.role`. If the user is `SUPER_ADMIN`, access is automatically granted (wildcard bypass). Otherwise, checks if `requiredPermission` exists in `req.user.permissions`. If missing, throws a `403 Forbidden` error.

### 3. `validate(schema)` ([validation.middleware.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/middleware/validation.middleware.js))
- **Function**: Express request validator utilizing Zod schemas.
- **Logic**: Validates `req.body`, `req.query`, or `req.params` against a Zod schema. If validation fails, collects all field errors and throws a `400 Bad Request` with structured field message errors.

### 4. `upload` ([upload.middleware.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/middleware/upload.middleware.js))
- **Function**: Handles multipart form-data for file uploads via `multer` + Cloudinary Storage.
- **Logic**: Filters file types (images: JPG/PNG, documents: PDF/DICOM), sets file size limits (e.g. 5MB/10MB), uploads directly to Cloudinary, and populates `req.file` or `req.files` with Cloudinary URLs.

### 5. `errorHandler` ([error.middleware.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/middleware/error.middleware.js))
- **Function**: Express global error handler middleware.
- **Logic**: Catches all unhandled errors passed via `next(err)` or thrown inside `asyncHandler`. Sanitizes error output for production (hides stack traces) and formats standard JSON error response:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "errorCode": "INVALID_INPUT",
    "message": "Validation failed",
    "errors": []
  }
  ```

---

## 4. Response & Error Standardization

### `AppError` ([AppError.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/core/errors/AppError.js))
Custom JavaScript `Error` class extended for standard application exceptions:
- `statusCode`: HTTP Status Code (400, 401, 403, 404, 409, 500).
- `errorCode`: Machine-readable error code string (e.g. `AUTH_TOKEN_EXPIRED`, `PATIENT_NOT_FOUND`).
- `errors`: Optional array of specific field validation errors.

### `ApiResponse` ([apiResponse.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/core/responses/apiResponse.js))
Standardized HTTP success response wrapper helper:
```js
ApiResponse.success(res, data, message, statusCode = 200, meta = null)
```

---

## 5. Shared Utility Helpers (`src/utils`)

| Utility File | Main Functions | Why it exists & Business Logic |
| :--- | :--- | :--- |
| **[asyncHandler.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/asyncHandler.js)** | `asyncHandler(fn)` | Higher-order wrapper around async controller methods to catch promises and pass errors to `next(err)` automatically, eliminating boilerplate `try-catch` blocks. |
| **[generateId.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/generateId.js)** | `generateUHID()`, `generateInvoiceNumber()`, `generateAppointmentNo()` | Generates human-readable unique tracking numbers using date prefixes and padded counters (e.g., UHID: `PAT-20260826-0001`, Invoice: `INV-2026-1002`). |
| **[generateToken.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/generateToken.js)** | `generateAccessToken(user)`, `generateRefreshToken(user)` | Issues signed JWT access tokens (short-lived, e.g., 15m) and refresh tokens (long-lived, e.g., 7d) containing `userId`, `role`, `email`, and `permissions`. |
| **[getRequestMeta.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/getRequestMeta.js)** | `getRequestMeta(req)` | Extracts Client IP Address and User-Agent from HTTP headers for Audit Logging purposes. |
| **[pagination.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/pagination.js)** | `getPagination(query)` | Standardizes pagination logic across list APIs. Parses `page` (default 1), `limit` (default 10), computes `skip`, and returns total page metadata (`totalPages`, `hasNextPage`, `hasPrevPage`). |
| **[timeOverlap.js](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/backend/src/utils/timeOverlap.js)** | `checkTimeOverlap(start1, end1, start2, end2)` | Utility to check slot collisions for Doctor scheduling, Appointment booking, and Operating Theatre (OT) reservations. |

---

## 6. Senior Developer Guidance & 6-Month Maintenance Notes

1. **Adding a New Module**:
   - Create a subfolder under `src/modules/<feature-name>/`.
   - Create standard 5 files: `<name>.model.js`, `<name>.service.js`, `<name>.controller.js`, `<name>.routes.js`, `<name>.validation.js`.
   - Mount the route inside `src/routes/index.js`.
2. **DB Transactions**:
   - For critical workflows (e.g., Bed allocation during IPD admission, Medicine stock deduction during Pharmacy sale, Invoice generation), always wrap database operations inside Mongoose Transactions (`session.startTransaction()`) to guarantee ACID compliance.
3. **Audit Logging**:
   - Every mutation route (POST, PUT, DELETE) should invoke `auditLogService.createLog(...)` passing `req.user.id`, `action`, `resource`, `ipAddress`, and `userAgent` (`getRequestMeta(req)`).
