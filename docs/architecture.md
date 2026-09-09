# Hospital Management System - System Architecture Documentation

This document provides a comprehensive blueprint of the Hospital Management System (HMS) application architecture, directory hierarchy, feature flow patterns, and cross-layer Backend ↔ Frontend mappings.

---

## 🏗️ Overall Project Directory Hierarchy

```
HospitalMS/
├── backend/                  # Express.js REST API & MongoDB Data Layer
├── frontend/                 # React 18 SPA (Vite + Tailwind CSS + Lucide)
├── docs/                     # Technical System Documentation
│   ├── api.md                # REST API Specifications
│   ├── architecture.md       # Master Architecture Blueprint (This File)
│   ├── backendDocs/          # Backend Guides (00 to 06) & Index
│   ├── frontendDocs/         # Frontend Guides (00 to 02) & Index
│   └── databaseDocs/         # Database & Schema Guides (00 to 06) & Index
├── .gitignore                # Git Exclusions
└── README.md                 # Project Repository Landing Page
```

---

## 🔥 Backend Architecture — Clean Layered Controller-Service Pattern

The backend is built on **Node.js, Express, and MongoDB (Mongoose)** using a **Modular Feature-First Clean Layered Architecture**:

```
backend/
├── src/
│   ├── config/
│   │   ├── DbConnect.js       # MongoDB Mongoose connection life-cycle
│   │   ├── cloudinary.js      # Cloudinary v2 SDK file storage config
│   │   ├── seeder.js          # System bootstrap seeder (Roles, Permissions, Super Admin)
│   │   └── socket.config.js   # Socket.IO real-time channels & room manager
│   │
│   ├── core/
│   │   ├── constants/
│   │   │   ├── permissions.js # Permission string keys registry
│   │   │   └── roles.js       # System role constants
│   │   ├── errors/
│   │   │   ├── AppError.js    # Custom AppError class
│   │   │   └── errorCodes.js  # Machine-readable error codes
│   │   └── responses/
│   │       └── apiResponse.js # Standardized JSON HTTP success wrapper
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT Access Token verification (`authenticate`)
│   │   ├── permission.middleware.js # RBAC permission gate (`checkPermission`)
│   │   ├── validation.middleware.js # Zod payload sanitizer (`validate`)
│   │   ├── upload.middleware.js     # Multer + Cloudinary storage handler (`upload`)
│   │   └── error.middleware.js      # Global Express error catcher (`errorHandler`)
│   │
│   ├── modules/               # 27 Feature-Based Domain Modules
│   │   ├── appointments/      # `appointment.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── audit-logs/        # `audit-log.model.js`, `.service.js`, `.controller.js`, `.routes.js`
│   │   ├── auth/              # `auth.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── beds/              # `bed.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── billing/           # `invoice.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── departments/       # `department.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── doctors/           # `doctor.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── insurance/         # `insurancePolicy.model.js`, `insuranceClaim.model.js`, `.service.js`, `.controller.js`, `.routes.js`
│   │   ├── inventory/         # `inventoryItem.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── ipd/               # `admission.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── laboratory/        # `labTest.model.js`, `labReport.model.js`, `.service.js`, `.controller.js`, `.routes.js`
│   │   ├── medical-records/   # `medicalRecord.model.js`, `.service.js`, `.controller.js`, `.routes.js`
│   │   ├── notifications/     # `notification.model.js`, `.service.js`, `.controller.js`, `.routes.js`
│   │   ├── opd/               # `opdVisit.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── patients/          # `patient.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── payments/          # `payment.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── permissions/       # `permission.model.js`, `.service.js`, `.controller.js`, `.routes.js`
│   │   ├── pharmacy/          # `medicine.model.js`, `pharmacySale.model.js`, `.service.js`, `.controller.js`, `.routes.js`
│   │   ├── prescriptions/     # `prescription.model.js`, `.service.js`, `.controller.js`, `.routes.js`
│   │   ├── radiology/         # `radiologyTest.model.js`, `radiologyReport.model.js`, `.service.js`, `.controller.js`, `.routes.js`
│   │   ├── reports/           # `report.service.js`, `.controller.js`, `.routes.js`
│   │   ├── roles/             # `role.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── settings/          # `setting.model.js`, `.service.js`, `.controller.js`, `.routes.js`
│   │   ├── super-admin/       # `superAdmin.service.js`, `.controller.js`, `.routes.js`
│   │   ├── suppliers/         # `supplier.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   ├── users/             # `user.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │   └── wards/             # `ward.model.js`, `.service.js`, `.controller.js`, `.routes.js`, `.validation.js`
│   │
│   ├── routes/
│   │   └── index.js           # Central API Router mounting all 27 module sub-routers
│   │
│   ├── utils/
│   │   ├── asyncHandler.js    # Async route wrapper
│   │   ├── generateId.js      # Human-readable sequential ID generator
│   │   ├── generateToken.js   # JWT Access & Refresh token signer
│   │   ├── getRequestMeta.js  # Client IP & User-Agent extractor for audit logging
│   │   ├── pagination.js      # Paginated query helper
│   │   ├── redisCache.js      # Redis cache wrapper & pattern invalidator
│   │   └── timeOverlap.js     # Time slot collision detector
│   │
│   ├── app.js                 # Express Application setup & middleware pipeline
│   └── server.js              # Server entry point listening on PORT
│
├── .env                       # Environment configuration
├── package.json
└── README.md
```

### Backend Request Execution Flow Pattern

```
Client HTTP Request
       │
       ▼
[Express Router (`*.routes.js`)]
       │
       ├──► `authenticate` (JWT Authorization check)
       ├──► `checkPermission` (RBAC capability check)
       └──► `validate(schema)` (Zod payload sanitization)
       │
       ▼
[Controller (`*.controller.js`)]
       │ (Extracts req.body, req.params, req.query, req.user)
       ▼
[Service (`*.service.js`)]
       │ (Business logic, slot collision checks, Mongoose sessions, Redis caching, Audit logging)
       ▼
[Mongoose Model (`*.model.js`)]
       │ (MongoDB CRUD queries & document validation)
       ▼
MongoDB Database Cluster
```

---

## 🟢 Frontend Architecture — Feature-First Component Hierarchy

The frontend is a **React 18 Single-Page Application (SPA)** built with Vite, Tailwind CSS, and Lucide icons:

```
frontend/
├── src/
│   ├── app/
│   │   ├── App.jsx            # Root entry with AuthProvider & Query Client
│   │   └── routes.jsx         # React Router v6 tree with Protected Routes
│   │
│   ├── components/
│   │   ├── common/            # Shared reusable UI elements
│   │   │   ├── ErrorBoundary.jsx # Main React Error Boundary
│   │   │   ├── ErrorState.jsx    # Inline error banner component
│   │   │   ├── RouteErrorBoundary.jsx # Route crash fallback wrapper
│   │   │   └── LoadingSpinner.jsx # Spinner indicator
│   │   └── layout/            # Application Shell
│   │       ├── Header.jsx     # Top Navigation & User profile bar
│   │       ├── Sidebar.jsx    # Dynamic Role-filtered navigation menu
│   │       └── DashboardLayout.jsx # Main shell wrapper layout
│   │
│   ├── features/              # 25 Modular Feature Directories
│   │   ├── admissions/        # IPD patient stay management & discharge
│   │   ├── appointments/      # OPD appointment scheduling & slot grid
│   │   ├── audit-logs/        # System security audit log viewer
│   │   ├── auth/              # Login page, profile setup & AuthContext
│   │   ├── beds/              # Live bed occupancy grid & maintenance toggles
│   │   ├── billing/           # Line-item invoice generation & payment popovers
│   │   ├── departments/       # Department directory & HOD assignment
│   │   ├── doctors/           # Physician profiles & weekly schedules
│   │   ├── insurance/         # Health insurance policies & claims
│   │   ├── ipd/               # IPD overview & ward capacity stats
│   │   ├── laboratory/        # Lab test catalog & report PDF uploads
│   │   ├── notifications/     # In-app real-time notification popover
│   │   ├── opd/               # Outpatient visit consultation queue workbench
│   │   ├── patients/          # Patient registration & EMR timeline
│   │   ├── permissions/       # System permissions registry display
│   │   ├── pharmacy/          # Drug catalog & POS sale stock deduction
│   │   ├── prescriptions/     # Doctor prescription writer
│   │   ├── radiology/         # Diagnostic imaging orders & DICOM uploads
│   │   ├── reports/           # Hospital revenue & doctor occupancy reports
│   │   ├── roles/             # Custom role management & RBAC matrix
│   │   ├── settings/          # Global hospital settings & tax defaults
│   │   ├── super-admin/       # System analytics KPI dashboard
│   │   ├── suppliers/         # Vendor directory & procurement records
│   │   ├── users/             # Staff directory & role assignment
│   │   └── wards/             # Physical ward setup & daily rate config
│   │
│   ├── hooks/
│   │   ├── useAuth.js         # AuthContext hook for user session state
│   │   └── usePermission.js   # RBAC permission engine hook
│   │
│   ├── utils/
│   │   ├── api.js             # Centralized Axios instance with JWT interceptor
│   │   └── lazyWithRetry.js   # Resilient dynamic import retry wrapper
│   │
│   └── index.css              # Tailwind CSS directives & design tokens
│
├── index.html
├── package.json
└── vite.config.js
```

### Frontend Execution Flow Pattern

```
User Action (Browser)
       │
       ▼
[React Router v6 (`routes.jsx`)]
       │
       ├──► `ProtectedRoute` (Verifies authenticated session)
       └──► `PermissionGate` (Checks required module access via `usePermission`)
       │
       ▼
[Route Error Boundary (`RouteErrorBoundary.jsx`)]
       │
       ▼
[Domain Feature Page Component]
       │
       ▼
[Axios API Client (`src/utils/api.js`)]
       │ (Attaches Authorization: Bearer <token>, handles 401 token expiry)
       ▼
Backend Express API Server
```

---

## 🔄 Cross-Layer Feature Mapping (Backend ↔ Frontend)

Every backend business domain maps directly to a corresponding frontend feature module:

| # | Backend Module (`backend/src/modules/`) | Frontend Feature (`frontend/src/features/`) | Dominant Permission Key |
| :-: | :--- | :--- | :--- |
| **01** | `auth` | `auth` | Public / Required |
| **02** | `users` | `users` | `user:read` |
| **03** | `roles` | `roles` | `role:read` |
| **04** | `permissions` | `permissions` | `role:write` |
| **05** | `super-admin` | `super-admin` | `superadmin:read` |
| **06** | `patients` | `patients` | `patient:read` |
| **07** | `doctors` | `doctors` | `doctor:read` |
| **08** | `departments` | `departments` | `user:read` |
| **09** | `opd` | `opd` | `opd:read` |
| **10** | `appointments` | `appointments` | `appointment:read` |
| **11** | `ipd` | `ipd` | `admission:read` |
| **12** | `admissions` | `admissions` | `admission:read` |
| **13** | `wards` | `wards` | `admission:read` |
| **14** | `beds` | `beds` | `admission:read` |
| **15** | `medical-records` | `medical-records` | `patient:read` |
| **16** | `prescriptions` | `prescriptions` | `medicine:read` |
| **17** | `laboratory` | `laboratory` | `lab_test:read` |
| **18** | `radiology` | `radiology` | `radiology_test:read` |
| **19** | `pharmacy` | `pharmacy` | `medicine:read` |
| **20** | `inventory` | `inventory` | `medicine:read` |
| **21** | `suppliers` | `suppliers` | `medicine:read` |
| **22** | `billing` | `billing` | `invoice:read` |
| **23** | `payments` | `payments` | `invoice:read` |
| **24** | `insurance` | `insurance` | `insurance:read` |
| **25** | `audit-logs` | `audit-logs` | `audit_log:read` |
| **26** | `notifications` | `notifications` | Required |
| **27** | `reports` | `reports` | `audit_log:read` |
| **28** | `settings` | `settings` | `superadmin:write` |
