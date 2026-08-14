# 🏥 Hospital Management System

A production-oriented Hospital Management System built using the MERN stack with a feature-based architecture, Role-Based Access Control (RBAC), permission-based authorization, centralized error handling, audit logging, and a scalable modular structure.

---

## 📌 Project Overview

The Hospital Management System is designed to manage hospital operations from a single platform.

The system supports:

- Authentication & Authorization
- Role-Based Access Control
- Permission Management
- Super Admin Management
- User Management
- Patient Management
- Doctor Management
- Department Management
- Appointment Management
- OPD Management
- IPD Management
- Ward & Bed Management
- Medical Records
- Prescriptions
- Laboratory
- Radiology
- Pharmacy
- Inventory
- Billing
- Payments
- Insurance
- Notifications
- Reports
- Audit Logs
- Hospital Settings

The application follows a **feature-based architecture** so that every business module remains isolated, maintainable, testable, and scalable.

---

# 🎯 Project Goals

The main goals of this project are:

1. Build a scalable Hospital Management System.
2. Follow production-level backend architecture.
3. Follow feature-based frontend architecture.
4. Implement secure authentication.
5. Implement Role-Based Access Control.
6. Implement permission-based authorization.
7. Maintain a clean separation between business logic and HTTP logic.
8. Maintain centralized error handling.
9. Maintain audit logs for important actions.
10. Build reusable frontend components.
11. Keep backend and frontend modules aligned.
12. Make the system easy to extend with new hospital modules.

---

# 🧰 Technology Stack

## Frontend

- React
- Vite
- React Router
- Axios
- Redux Toolkit
- JavaScript
- Tailwind CSS / UI library

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- REST API

# 🏗️ High-Level Architecture

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │       React          │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │       Express        │
                    │      REST API        │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
              Middleware               Features
                    │                      │
        ┌───────────┼───────────┐         │
        │           │           │         │
       Auth        RBAC      Validation    │
        │           │           │         │
        └───────────┴───────────┘         │
                                          ▼
                                      Services
                                          │
                                          ▼
                                       Models
                                          │
                                          ▼
                                     MongoDB

🔥 Backend Architecture

The backend uses a feature-based architecture.

Each business feature contains its own:

Controller
Service
Routes
Validation
Model (when required)
Constants


🔄 Backend Request Flow

Every feature should generally follow:

Client
  ↓
Route
  ↓
Authentication Middleware
  ↓
Permission Middleware
  ↓
Validation Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB


👤 User → Role → Permission

The RBAC architecture is:

User
 │
 │ roleId
 ▼
Role
 │
 │ permissionIds[]
 ▼
Permission


🌱 Database Seed Flow

The initial database setup should follow:

Seed Permissions
       ↓
Seed Roles
       ↓
Assign Permissions to Roles
       ↓
Create Super Admin
       ↓
System Ready
🗄️ Database Models

The project uses MongoDB with Mongoose.

Authentication / RBAC
1. User
2. Role
3. Permission
Hospital Core
4. Patient
5. Doctor
6. Staff
7. Department
8. Appointment
Clinical
9. OPDVisit
10. Admission
11. Ward
12. Bed
13. Prescription
14. MedicalRecord
Laboratory
15. LabTest
16. LabReport
Radiology
17. RadiologyTest
18. RadiologyReport
Pharmacy / Inventory
19. Medicine
20. PharmacySale
21. InventoryItem
22. Supplier
Finance
23. Invoice
24. Payment
25. InsurancePolicy
26. InsuranceClaim
System
27. Notification
28. AuditLog
29. Setting


```
