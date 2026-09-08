# 06. System Logs, Notifications, Reports & Settings Modules Documentation

This document covers system compliance logging, notification dispatching, analytics reporting, and global hospital configuration:
1. **Audit Logs (`audit-logs`)**
2. **Notifications (`notifications`)**
3. **Reports (`reports`)**
4. **Settings (`settings`)**

---

## 1. Audit Logs Module (`src/modules/audit-logs`)

### Purpose & Business Motivation
Provides immutable security compliance logging. Captures every record mutation (CREATE, UPDATE, DELETE) across all hospital modules, recording who performed the change (`userId`), target entity (`resource` & `resourceId`), previous snapshot (`oldValue`), updated snapshot (`newValue`), IP Address, and browser User-Agent.

### Data Model (`audit-log.model.js`)
- `userId`: Ref `User` (User who performed action).
- `action`: Enum (`"CREATE"`, `"UPDATE"`, `"DELETE"`, `"LOGIN"`, `"LOGOUT"`).
- `resource`: String (e.g. `"patient"`, `"appointment"`, `"invoice"`).
- `resourceId`: ObjectId / String of modified document.
- `oldValue`: Object (Pre-mutation document state snapshot).
- `newValue`: Object (Post-mutation document state snapshot).
- `ipAddress`: String.
- `userAgent`: String.
- `createdAt`: Date (Indexed for date-range queries).

---

### Key Functions & Resiliency Logic (`audit-log.service.js`)

1. **`createAuditLog({ userId, action, resource, resourceId, oldValue, newValue, ipAddress, userAgent })`**:
   - Called internally by services across all backend modules.
   - **Resiliency Guard Principle**: Wrapped inside a `try-catch` block that catches and logs any internal audit error to console **without throwing**.
   - **Why this exists**: Audit logging must **NEVER** break primary business operations. If database logging encounters an issue, the primary transaction (e.g. Patient creation, Prescription issuance) still completes successfully.

2. **`getAuditLogs({ page, limit, userId, resource, action, startDate, endDate })`**:
   - Provides paginated, filtered audit log lookup for compliance officers and Super Admin.

---

## 2. Notifications Module (`src/modules/notifications`)

### Purpose & Business Motivation
Delivers real-time in-app alerts and notifications to hospital staff members (e.g. Doctor notified when appointment is booked/cancelled, Pharmacist notified when prescription is issued, Admin notified of low inventory stock).

### Data Model (`notification.model.js`)
- `userId`: Ref `User` (Recipient user ID).
- `type`: Enum (`"appointment"`, `"prescription"`, `"lab"`, `"inventory"`, `"system"`).
- `title`: String.
- `message`: String.
- `isRead`: Boolean (Default: `false`).
- `metadata`: Object (e.g. `{ appointmentId: "..." }`).

---

### Key Functions & Business Logic (`notification.service.js`)

1. **`createNotification(data)`**:
   - Creates in-app alert entry for target `userId`.

2. **`getUserNotifications(userId, isRead)`**:
   - Returns notifications list for logged-in user.

3. **`markNotificationAsRead(id, userId)`**:
   - Sets `isRead = true`.

---

## 3. Reports Module (`src/modules/reports`)

### Purpose & Business Motivation
Generates aggregated analytical intelligence and hospital KPIs for hospital management dashboards.

### Key Reports & Functions (`report.service.js`)

1. **`getRevenueReport({ startDate, endDate })`**:
   - Aggregates paid invoices and pharmacy sales across date range.
   - Breakdown by payment methods (Cash vs Card vs UPI).

2. **`getPatientDemographicsReport()`**:
   - Aggregates total registered patients grouped by Gender, Age Brackets, and Blood Groups.

3. **`getDoctorOccupancyReport({ startDate, endDate })`**:
   - Aggregates appointments count, completion rate, and total consultations per doctor.

4. **`getInventoryExpiryReport()`**:
   - Identifies stock items expiring within 30, 60, and 90 days.

---

## 4. Settings Module (`src/modules/settings`)

### Purpose & Business Motivation
Manages global hospital system configurations, institution profile, tax rates, currency symbol, and feature flags.

### Data Model (`setting.model.js`)
- `hospitalName`: String (e.g. "CityCare Super Specialty Hospital").
- `logoUrl`: String (Cloudinary URL).
- `address`: String.
- `contactEmail`: String.
- `contactPhone`: String.
- `currency`: String (Default: `"INR"` / `"₹"`).
- `taxRate`: Number (Default tax percentage for billing, e.g., 18%).
- `appointmentSlotDuration`: Number (Slot duration in minutes, e.g. 15 / 30).

---

### Key Functions (`setting.service.js`)
- **`getSettings()`**: Fetches global system settings (Cached in memory / Redis for ultra-fast response).
- **`updateSettings(data)`**: Admin endpoint to update hospital metadata and billing tax defaults.

---

## API Endpoints Quick Reference

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Audit Logs** | `GET` | `/api/v1/audit-logs` | Filterable audit history list |
| **Notifications** | `GET` | `/api/v1/notifications` | Get user in-app notifications |
| **Notifications** | `PATCH` | `/api/v1/notifications/:id/read` | Mark notification as read |
| **Reports** | `GET` | `/api/v1/reports/revenue` | Aggregate revenue & billing analytics |
| **Reports** | `GET` | `/api/v1/reports/doctors` | Doctor consultation occupancy report |
| **Settings** | `GET` | `/api/v1/settings` | Get hospital configuration settings |
| **Settings** | `PUT` | `/api/v1/settings` | Update hospital settings |

---

## Senior Developer Notes & Edge Cases

- **Non-Blocking Audit Pattern**: Audit logging is designed with fail-safe isolation (`try/catch` suppression). Audit storage latency or errors will never block or roll back a clinical workflow.
- **Settings Caching**: Global settings like `currency` and `taxRate` are referenced in high-frequency invoice creation loops. Keep these lightweight to avoid redundant DB overhead.
