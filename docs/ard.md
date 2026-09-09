# Architectural Requirements Document (ARD) & System Specification

This document serves as the master **Architectural Requirements Document (ARD)** for the Hospital Management System (HMS). It outlines system requirements, target user personas, role permissions, module breakdowns, UI component trees, API contracts, production tech stack capabilities, security standards, and edge-case guards in simple, easy-to-understand language.

---

## 1. Requirements & System Motivation

### Purpose & Problem Statement
Hospitals face severe operational bottlenecks when managing patient registrations, doctor appointment collisions, bed occupancy concurrency, drug inventory expiry, and manual paper billing. 

The HMS automates and digitizes end-to-end healthcare operations into a single-page web application (SPA) backed by a secure REST API.

### Target User Personas
- **Super Admin**: System owner with wildcard permission access, system stats, Redis-cached dashboards, and audit log tracking.
- **Admin**: Staff management, role assignments, department setups, and hospital configuration.
- **Doctor**: Appointment schedules, OPD consultation queue processing, digital prescription issuance, and patient EHR records.
- **Nurse**: Triage vital signs recording, ward management, bed status tracking, and IPD patient care logs.
- **Receptionist**: Patient registration (UHID generation), OPD visit token issue, appointment booking, and cashier invoice collection.
- **Pharmacist**: OTC & prescription drug sales counter (POS), stock inventory batch tracking, and supplier procurement.
- **Lab Technician**: Pathology lab test execution, result value entry, and Cloudinary PDF report uploads.
- **Radiologist**: Diagnostic scan execution (X-Ray, MRI, CT) and Cloudinary DICOM image uploads.
- **Patient**: Self-service profile view, appointment booking, prescription viewing, and invoice receipts.

---

## 2. User Roles & Permission Capabilities

```
┌─────────────────┐
│   Super Admin   │ ──► (Wildcard Bypass - All System Capabilities)
└────────┬────────┘
         │
         ├──► Admin: User management, Role assignment, Department setup, Audit view.
         ├──► Doctor: OPD consultations, Prescriptions, Medical records, Doctor schedule.
         ├──► Nurse: Patient registration, Vitals recording, IPD admission view, Bed state.
         ├──► Receptionist: Patient registration, Appointment booking, OPD tokens, Cashier billing.
         ├──► Pharmacist: Pharmacy sales counter, Inventory batch stock-in, Supplier directory.
         ├──► Lab Tech: Pathology test catalog view, Test result entry, PDF uploads.
         └──► Patient: View own appointments, View own prescriptions, View own invoices.
```

---

## 3. Modular Feature Subdivision

The application is cleanly subdivided into **27 Backend Modules** (`backend/src/modules/`) and **25 Frontend Features** (`frontend/src/features/`):

1. **Auth & Identity**: `auth`, `users`, `roles`, `permissions`, `super-admin`
2. **Clinical Care**: `patients`, `doctors`, `departments`, `appointments`, `opd`, `ipd`, `wards`, `beds`
3. **Diagnostics**: `medical-records`, `prescriptions`, `laboratory`, `radiology`
4. **Operations & Pharmacy**: `pharmacy`, `inventory`, `suppliers`
5. **Financials**: `billing`, `payments`, `insurance`
6. **Governance & Operations**: `audit-logs`, `notifications`, `reports`, `settings`

---

## 4. UI Page Hierarchy & Shared Component Architecture

### Standard Page Layout Component Tree (`PatientList.jsx` example)

```
[DashboardLayout Shell]
       │
       ├──► [Header Bar] (User Profile, Notifications Popover, Logout)
       └──► [Sidebar Navigation Menu] (Role-filtered Menu items via `usePermission`)
               │
               ▼
       [RouteErrorBoundary]
               │
               ▼
       [PatientList Page Container]
               │
               ├──► [PageHeader] (Title, Subtitle, "+ Register New Patient" Button guarded by `hasPermission`)
               ├──► [SearchBar & FilterBar] (Live text search, Gender filter, Status dropdown)
               ├──► [PatientTable Wrapper]
               │       ├──► [TableHeader]
               │       ├──► [PatientRow Item] (Demographics, UHID badge, Action buttons)
               │       └──► [EmptyState / Skeleton Pulse Loader]
               ├──► [Pagination Controls] (Page numbers, limit select, Prev/Next buttons)
               └──► [RegisterPatientModal & EditPatientModal Popovers]
```

---

## 5. Core Business Logic & Service Contract Functions

Each domain service file exposes pure business logic functions wrapped in async error handlers:

```javascript
// Patients Service Contract (src/modules/patients/patient.service.js)
createPatient(data, currentUser, requestMeta)     // Generates PAT-YYYYMMDD-XXXX UHID & creates document
getAllPatients({ page, limit, search, status })  // Returns paginated regex search results
getPatientById(id)                               // Fetches patient profile with virtual age getter
updatePatient(id, data, currentUser, requestMeta) // Updates patient demographics & logs audit delta
deletePatient(id, currentUser, requestMeta) // Soft deletes setting status = "inactive"
```

---

## 6. Entity-Relationship (ER) Schema Links

- `User (roleId)` ───────► `Role (permissionIds[])` ───────► `Permission`
- `Doctor (userId, departmentId)` ───────► `Department`
- `Appointment (patientId, doctorId, departmentId)` ───────► `Patient` & `Doctor`
- `Admission (patientId, doctorId, wardId, bedId)` ───────► `Ward` & `Bed`
- `Prescription (patientId, doctorId, visitId)` ───────► `PharmacySale`
- `PharmacySale (medicines[inventoryItemId])` ───────► `InventoryItem`
- `Invoice (patientId)` ───────► `Payment` & `InsuranceClaim`

---

## 7. REST API Standards & Endpoint Conventions

- **Base Endpoint Prefix**: `/api/v1`
- **Standardized Response Wrappers**:
  ```json
  // Success Response (ApiResponse.js)
  {
    "success": true,
    "statusCode": 200,
    "message": "Operation successful",
    "data": { ... },
    "meta": { "page": 1, "totalPages": 5, "total": 48 }
  }

  // Error Response (error.middleware.js)
  {
    "success": false,
    "statusCode": 400,
    "errorCode": "SLOT_OVERLAP_CONFLICT",
    "message": "Doctor already has a booking at this time slot",
    "errors": []
  }
  ```

---

## 8. Production Tech Stack Specifications

### Frontend
- **Framework**: React 18 SPA built with Vite
- **Styling**: Tailwind CSS + Lucide React Icons
- **Data Visualization**: Recharts (Donut & Area Charts) + Custom Mini SVG Sparklines
- **State & Routing**: React Router v6 + React AuthContext + `usePermission` hook
- **HTTP Client**: Axios with JWT Bearer Token interceptor & automatic 401 redirection

### Backend
- **Runtime & Framework**: Node.js v20 LTS + Express.js v4
- **Database Layer**: MongoDB + Mongoose v8 ODM
- **Caching**: Redis (Super Admin Dashboard caching & TTL invalidation)
- **File Storage**: Cloudinary SDK (Lab PDF reports & Radiology DICOM/PNG scans)
- **Real-Time Sockets**: Socket.IO (Targeted user notifications `user:<userId>`)
- **Email Delivery**: Resend SDK (Asynchronous transaction emails)

---

## 9. Security & Compliance Requirements

1. **Authentication**: JWT Access Tokens (15m expiration) + Refresh Tokens (7d expiration) with Token Rotation.
2. **Password Security**: Bcrypt password hashing (`cost factor 10`) enforced via Mongoose `pre("save")` hooks. `select: false` hides passwords in queries.
3. **Payload Sanitization**: Zod validation schemas (`validation.middleware.js`) sanitize input parameters against NoSQL injection and malformed payloads.
4. **Resilient Audit Logging**: Mutations trigger `createAuditLog()`. The audit logger uses fail-safe isolation (`try/catch` suppression) so logging latency never breaks business operations.
5. **Rate Limiting & Headers**: Express Rate Limiter limits brute-force attacks; Helmet sets HTTP security headers (`X-Frame-Options`, `X-XSS-Protection`).

---

## 10. Edge Case & Failure Guards ("What If?" Scenarios)

| Scenario ("What If?") | Built-In System Guard & Resolution |
| :--- | :--- |
| **❌ Duplicate Email / UHID?** | Mongoose unique index throws duplicate key error -> Express error middleware returns `409 Conflict`. |
| **❌ Overlapping Doctor Appointment?** | `checkTimeOverlap()` queries doctor's schedule -> Throws `409 Conflict` ("Doctor slot already booked"). |
| **❌ Out of Stock Medicine Checkout?** | `createPharmacySale` checks `InventoryItem.quantity >= requested` -> Throws `400 Insufficient Stock`. |
| **❌ Overpaying an Invoice?** | `processPayment` verifies `amount <= remaining_balance` -> Throws `400 Overpayment Error`. |
| **❌ Deactivating Department with Active Doctors?** | `updateDepartment` checks assigned doctor count -> Throws `400 Reassign Doctors First`. |
| **❌ Concurrent Bed Allocation?** | Mongoose Session transaction (`startTransaction()`) locks bed status -> Prevents double-booking. |
| **❌ Front-end Chunk Error on Deployment?** | `lazyWithRetry.js` catches chunk load errors -> Automatically reloads browser session to fetch fresh assets. |
| **❌ Single Component Runtime Crash?** | `RouteErrorBoundary.jsx` catches JavaScript exceptions -> Displays localized retry card without crashing sidebar header. |

---

## 💡 Senior Developer Rule of Execution

> **"Pehle WHAT → Phir HOW → Phir CODE."**
> 1. **WHAT**: Understand what business problem needs solving (Requirements, User Personas, RBAC rules).
> 2. **HOW**: Design the data flow, schemas, components, and edge cases (Mongoose models, Zod validation, UI component tree).
> 3. **CODE**: Implement clean layered modular code with automated tests and documentation.