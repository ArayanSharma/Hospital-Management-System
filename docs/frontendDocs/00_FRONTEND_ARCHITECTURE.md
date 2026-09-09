# 00. Frontend Architecture & Modular Layout

Welcome to the **Frontend Architecture Guide** for the Hospital Management System (HMS). This document provides a complete technical overview of the React 18 single-page application built on top of Vite, Tailwind CSS, Lucide Icons, and Recharts.

---

## 🏗️ Directory & Feature-First Structure

The application adopts a **Feature-First Domain Architecture** where components, pages, hooks, and API services are grouped by business domain:

```
frontend/src/
├── app/
│   ├── App.jsx               # Root application entry with Router & Auth Provider
│   └── routes.jsx            # React Router v6 configuration & Protected Routes
├── components/
│   ├── common/               # Global shared UI components
│   │   ├── ErrorBoundary.jsx # Core React Error Boundary
│   │   ├── ErrorState.jsx    # Standardized Inline Error Display
│   │   ├── RouteErrorBoundary.jsx # Route-level Crash Fallback UI
│   │   └── LoadingSpinner.jsx # Central loading indicator
│   └── layout/               # Shell layout components
│       ├── Header.jsx        # Top Navigation & User Profile Bar
│       ├── Sidebar.jsx       # Dynamic Role-filtered Navigation Menu
│       └── DashboardLayout.jsx # Main Dashboard shell wrapper
├── features/                 # Modular Domain Features (25 Features)
│   ├── admissions/           # IPD Admissions & Discharge Summaries
│   ├── appointments/         # OPD Appointments Module (Pages, Modals, Tables)
│   ├── audit-logs/           # System Security Audit Trail Viewer
│   ├── auth/                 # Login, Complete Profile & Auth Context
│   ├── beds/                 # Bed Occupancy Matrix & Status Toggles
│   ├── billing/              # Invoice Generation & Payment Modals
│   ├── departments/          # Department Directory & HOD Assignment
│   ├── doctors/              # Doctor Rostering & Weekly Schedules
│   ├── insurance/            # Policy & Claims Management
│   ├── ipd/                  # IPD Overview & Ward Occupancy
│   ├── laboratory/           # Lab Test Catalog & Result Uploads
│   ├── notifications/        # Real-time In-App Notification Center
│   ├── opd/                  # Outpatient Visit Consultation Workbench
│   ├── patients/             # Patient Registration & EMR Timeline
│   ├── permissions/          # System Permissions Registry Display
│   ├── pharmacy/             # Inventory, Dispensing & Sales Workbench
│   ├── prescriptions/        # Doctor Prescription Issuance
│   ├── radiology/            # Diagnostic Imaging Orders & Image Uploads
│   ├── reports/              # Financial & Hospital Analytics
│   ├── roles/                # RBAC Matrix & Role/Permission Editor
│   ├── settings/             # Global Hospital Settings
│   ├── super-admin/          # System Overview Analytics Dashboard
│   ├── suppliers/            # Vendor Procurement & Purchase Directory
│   ├── users/                # Staff Directory & Account Management
│   └── wards/                # Physical Wards & Daily Rate Config
├── hooks/
│   ├── useAuth.js            # Global Authentication Context Hook
│   └── usePermission.js      # Fine-Grained Module & Action Permission Engine
├── utils/
│   ├── api.js                # Axios Instance with JWT Interceptor
│   └── lazyWithRetry.js      # Dynamic Import Retry Mechanism for Chunk Errors
└── index.css                 # Global Design System Tokens & Tailwind Directives
```

---

## ⚡ Key Architectural Patterns

### 1. Robust Lazy Loading with Chunk Retry (`lazyWithRetry.js`)
To prevent app crashes during deployment when chunk hashes change on the server, dynamic imports are wrapped in a resilient retry strategy:

```javascript
// src/utils/lazyWithRetry.js
export const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenRefreshed = JSON.parse(
      window.sessionStorage.getItem('page_has_been_refreshed') || 'false'
    );
    try {
      return await componentImport();
    } catch (error) {
      if (!pageHasAlreadyBeenRefreshed) {
        window.sessionStorage.setItem('page_has_been_refreshed', 'true');
        window.location.reload();
      }
      throw error;
    }
  });
```

### 2. Route-Level Error Boundaries (`RouteErrorBoundary.jsx`)
Individual routes are isolated inside an error boundary so that an unexpected runtime failure in a single table or modal does not crash the entire shell header or sidebar.

### 3. Centralized Axios Interceptor (`api.js`)
- **Bearer Token injection** on every outgoing request via `Authorization: Bearer <token>`.
- **Automatic 401 handling**: Token expiration clears stored credentials and redirects to `/login`.
- **Global Error Handling**: Standardizes error objects into `{ message, errorCode, errors }`.

---

## 🧭 Routing & Protected Route Hierarchy (`routes.jsx`)

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
    <Route index element={<Dashboard />} />
    <Route path="patients" element={<PermissionGate module="Patient Management"><PatientList /></PermissionGate>} />
    <Route path="opd" element={<PermissionGate module="OPD Management"><VisitList /></PermissionGate>} />
    <Route path="ipd" element={<PermissionGate module="IPD Management"><IpdDashboard /></PermissionGate>} />
    <Route path="pharmacy" element={<PermissionGate module="Pharmacy"><PharmacyDashboard /></PermissionGate>} />
    <Route path="billing" element={<PermissionGate module="Billing & Invoicing"><InvoiceList /></PermissionGate>} />
  </Route>
</Routes>
```
