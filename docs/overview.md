# Hospital Management System - System Overview & Implementation Roadmap

This document provides a comprehensive overview of the Hospital Management System (HMS), detailing implementation phases (Phases 0 through 11), core security paradigms, Role-Based Access Control (RBAC) matrices, and end-to-end clinical workflow pipelines.

---

## 🏛️ System Core Foundations

The Hospital Management System is designed around four central operational pillars:
1. **Clinical & Care Delivery**: Patient registration, OPD consultation queues, doctor scheduling, IPD bed management, and electronic health records (EHR).
2. **Diagnostics & Treatment**: Digital prescriptions, pathology lab test processing, radiology imaging (X-Ray, MRI, CT Scan), and Cloudinary PDF/DICOM uploads.
3. **Supply Chain & Operations**: Pharmacy sales counter (POS), medicine catalog management, inventory batch tracking, expiry FEFO enforcement, and supplier procurement.
4. **Financials & Governance**: Line-itemized billing, cash/card/UPI payment receipts, health insurance claims management, immutable audit logging, and Redis-cached analytics.

---

## 🔐 Master Role-Based Access Control (RBAC) Security Model

Access control in HMS operates through a dual-layer security model:
- **Backend Enforcement**: Express `authenticate` middleware verifies JWT signatures, and `checkPermission(requiredPermission)` validates permission capabilities.
- **Frontend UI Gating**: `usePermission` hook filters navigation items in `Sidebar.jsx` and `<PermissionGate>` wrappers hide/show action buttons.

### Role Permission Mapping

```
                               ┌────────────────────────────────┐
                               │       SUPER_ADMIN Role         │
                               └───────────────┬────────────────┘
                                               │ (Wildcard Bypass - All Capabilities)
                                               ▼
     ┌──────────────────┬──────────────────┬───┴──────────────┬──────────────────┐
     ▼                  ▼                  ▼                  ▼                  ▼
┌──────────┐      ┌──────────┐      ┌──────────┐       ┌──────────┐       ┌──────────┐
│  DOCTOR  │      │  NURSE   │      │ RECEPT.  │       │PHARMACIST│       │ LAB TECH │
└────┬─────┘      └────┬─────┘      └────┬─────┘       └────┬─────┘       └────┬─────┘
     │                 │                 │                  │                  │
     ├─ patient:read   ├─ patient:read   ├─ patient:create  ├─ medicine:read   ├─ lab_test:read
     ├─ opd:read       ├─ opd:read       ├─ patient:read    ├─ medicine:write  ├─ lab_test:write
     ├─ prescription:* ├─ vitals:write   ├─ opd:create      ├─ sale:create     ├─ report:upload
     └─ medical_rec:*  └─ admission:read └─ invoice:read    └─ stock:update    └─ radiology:*
```

---

## 🚀 12-Phase Implementation Roadmap

```
PHASE 0 ──► PHASE 1 ──► PHASE 2 ──► PHASE 3 ──► PHASE 4 ──► PHASE 5
Project     MongoDB &   User & Role  Auth & JWT  RBAC Gate   Super Admin
Setup       Config      Schemas     Middleware  Engine      Dashboard

   │
   ▼

PHASE 6 ──► PHASE 7 ──► PHASE 8 ──► PHASE 9 ──► PHASE 10 ──► PHASE 11
Frontend    Patients &  OPD / IPD   Diagnostics Operations   Reports &
Shell & UI  Doctors     Care        & EHR       & Pharmacy   Settings
```

### Phase Breakdown & Deliverables

#### Phase 0: Project Setup & Repository Initialization
- Monorepo folder initialization (`backend/`, `frontend/`, `docs/`).
- Package configuration (`package.json`, Vite configuration, Tailwind CSS setup).

#### Phase 1: Database & Core Infrastructure
- MongoDB Mongoose connection life-cycle (`DbConnect.js`).
- Centralized error handling (`AppError.js`, `errorHandler`).
- Response standardizer (`apiResponse.js`).

#### Phase 2: Core Identity Schemas
- Mongoose model definitions for `User`, `Role`, and `Permission`.
- Password hashing `pre("save")` hooks and bcrypt instance methods.

#### Phase 3: Authentication Engine
- User registration, login, token rotation, and logout endpoints (`/auth/*`).
- JWT Access Token (15m) and Refresh Token (7d) generation (`generateToken.js`).
- Bearer token verification middleware (`auth.middleware.js`).

#### Phase 4: Role-Based Access Control (RBAC)
- Permission registry seeder script (`seeder.js`).
- Permission guard middleware (`checkPermission`).
- Frontend custom permission hooks (`usePermission.js`) and UI wrappers (`PermissionGate`).

#### Phase 5: Super Admin & System Bootstrap
- Super Admin dashboard statistics service with Redis caching (`getDashboardStats`).
- System-wide recent activity audit feed (`getRecentActivity`).

#### Phase 6: Frontend Shell & Navigation
- Dashboard layout shell (`DashboardLayout.jsx`, `Header.jsx`, `Sidebar.jsx`).
- Dynamic import lazy loading with chunk reload retry wrapper (`lazyWithRetry.js`).
- Route-level error boundaries (`RouteErrorBoundary.jsx`).

#### Phase 7: Patient & Physician Registry
- Patient registration, UHID sequential generation (`PAT-YYYYMMDD-XXXX`), paginated search.
- Doctor profiles, department linkage, weekly consultation availability rosters.

#### Phase 8: Outpatient (OPD) & Inpatient (IPD) Care
- OPD consultation token generation, daily queue counters, vital sign recording.
- Pre-booked appointment scheduling with slot collision detection (`checkTimeOverlap`).
- IPD patient admission, bed occupancy status locking (`available` -> `occupied`), discharge summary issuance.

#### Phase 9: Medical Records & Diagnostics
- Electronic Health Records (EHR) timeline (`medical-records`).
- Digital prescription writer (`prescriptions`) linked to pharmacy dispensing.
- Pathology laboratory test ordering and report PDF uploads (`laboratory`).
- Radiology imaging requests (X-Ray, MRI, CT) and DICOM image uploads (`radiology`).

#### Phase 10: Pharmacy, Inventory & Financials
- Over-the-counter (OTC) and prescription drug sales POS (`pharmacy`).
- ACID transaction stock deduction inside Mongoose sessions (`inventory`).
- Line-itemized invoice creation, discount/tax calculation, partial payment receipts (`billing`, `payments`).
- Health insurance policy registration and claim approval workflows (`insurance`).

#### Phase 11: Analytics, Notifications & Settings
- Immutable security audit logging with fail-safe isolation (`audit-logs`).
- Real-time in-app notification alerts via Socket.IO (`notifications`).
- Aggregate financial, occupancy, and demographic analytics reports (`reports`).
- Global hospital profile, tax rates, currency symbol configuration (`settings`).

---

## 🔄 End-to-End Clinical Workflows

### 1. OPD Walk-in Consultation Flow
```
Patient Arrives ──► Register / Search UHID ──► Create OPD Visit Token ──► Triage Vitals Recorded
                                                                                   │
                                                                                   ▼
Prescription Issued ◄── Doctor Consultation Completed ◄── Queue Token Called ──────┘
        │
        ▼
Pharmacy Dispensing & Invoice Settlement
```

### 2. IPD Admission & Bed Locking Flow
```
Patient Recommends Admission ──► Select Available Bed ──► Mongoose Session Started
                                                                  │
                                 Bed Status: "occupied" ◄── Create Admission Record
                                          │
                                          ▼
                                Patient Stay & Clinical Logs
                                          │
                                          ▼
                                Discharge Summary Generated
                                          │
                                          ▼
                                Bed Status: "available" ──► Final Invoice Generated
```

---

## 📚 Complete System Documentation Cross-Reference Index

- **[Master Architecture Blueprint](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/architecture.md)**
- **[REST API Specifications](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/api.md)**
- **[Backend Documentation Suite Index](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/backendDocs/README.md)**
- **[Frontend Documentation Suite Index](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/frontendDocs/README.md)**
- **[Database & Schema Suite Index](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/databaseDocs/README.md)**