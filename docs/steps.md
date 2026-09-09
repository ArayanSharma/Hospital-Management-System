# Step-by-Step Implementation Roadmap Guide

> 🚀 **Golden Rule**: Never build all 27 modules at once! Building modules without completing prerequisite security foundations leads to broken database references, missing permissions, and un-authenticated API vulnerabilities. Follow the 6 phased steps below.

---

## 🗺️ Master Phase Overview

| Phase | Category Name | Modules Included | Key Phase Deliverables |
| :-: | :--- | :--- | :--- |
| **Phase 1** | **Foundation & Security** | `auth`, `users`, `roles`, `permissions`, `super-admin`, `audit-logs` | User identity, JWT token rotation, Bcrypt password hashing, RBAC permission matrix, Super Admin analytics dashboard. |
| **Phase 2** | **Core Hospital Infrastructure**| `patients`, `doctors`, `departments`, `appointments` | Master patient UHID directory, physician availability rosters, department HOD assignments, appointment slot collision detection. |
| **Phase 3** | **Clinical & Diagnostics** | `opd`, `ipd`, `wards`, `beds`, `prescriptions`, `medical-records`, `laboratory`, `radiology` | Outpatient triage tokens, IPD ward bed locking, digital prescription writer, EHR timelines, Pathology PDFs & Radiology scan uploads. |
| **Phase 4** | **Operations & Supply Chain** | `pharmacy`, `inventory`, `suppliers` | Medicine catalog, OTC/Prescription sales counter (POS), SKU batch tracking, expiry FEFO enforcement, supplier procurement. |
| **Phase 5** | **Finance & Billing** | `billing`, `payments`, `insurance` | Line-item invoice generation, partial/full payment receipts, overpayment guards, insurance policies & claim approval workflows. |
| **Phase 6** | **System Operations** | `notifications`, `reports`, `settings` | Socket.IO real-time alerts, revenue/occupancy analytics, global hospital settings & tax defaults. |

---

## 🛠️ Phase-by-Phase Technical Implementation Steps

### Phase 1 — Foundation & Security (Build First)

#### Included Modules:
1. `permissions`: Central registry for permission string keys (e.g. `patients:read`, `prescriptions:create`).
2. `roles`: Group permissions into system roles (`SUPER_ADMIN`, `ADMIN`, `DOCTOR`, `NURSE`, `RECEPTIONIST`, `PHARMACIST`, `LAB_TECH`, `PATIENT`).
3. `users`: Staff user account schema with `bcrypt` pre-save password hashing hook.
4. `auth`: Register, login, token rotation, and logout services issuing 15-minute Access Tokens and 7-day Refresh Tokens.
5. `super-admin`: System KPI analytics dashboard service cached in Redis with 300s TTL.
6. `audit-logs`: Non-blocking, immutable security compliance audit logger.

#### Phase 1 Verification Checklist:
- [x] Admin can log in and receive JWT access + refresh tokens.
- [x] Unauthenticated API requests receive `401 Unauthorized`.
- [x] Non-permitted role requests receive `403 Forbidden`.

---

### Phase 2 — Core Hospital Infrastructure

#### Included Modules:
1. `departments`: Medical departments directory with head doctor (HOD) assignments and unique case-insensitive code validation (`CARD-01`).
2. `doctors`: Physician profiles linked to `User` credentials and `Department`, specifying consultation fees and weekly availability slots.
3. `patients`: Master patient demographic records with auto-generated sequential UHID (`PAT-YYYYMMDD-XXXX`).
4. `appointments`: Pre-booked consultation slot scheduling with doctor time-overlap collision detection (`checkTimeOverlap`).

#### Phase 2 Verification Checklist:
- [x] Registering a patient generates a unique UHID.
- [x] Attempting to book an overlapping doctor slot returns `409 Conflict`.

---

### Phase 3 — Clinical & Diagnostics

#### Included Modules:
1. `opd`: Outpatient consultation queue token management (`OPD-YYYYMMDD-XXX`), vital sign recording, and consultation completion.
2. `ipd`: Inpatient admissions (`IPD-YYYY-XXXX`), attending doctor assignment, and discharge summary issuance.
3. `wards`: Physical ward setup (ICU, Private, Deluxe) with capacity and daily room rate configuration.
4. `beds`: Individual bed occupancy status tracking (`available`, `occupied`, `maintenance`) with atomic locking during IPD admission.
5. `prescriptions`: Digital prescription writer issuing dosage and frequency instructions (`RX-YYYY-XXXX`).
6. `medical-records`: Electronic Health Records (EHR) timeline sorted chronologically with Cloudinary document attachments.
7. `laboratory`: Pathology test catalog (`labTest`) and report result entry (`labReport`) with Cloudinary PDF uploads.
8. `radiology`: Diagnostic imaging scan requests (`radiologyTest`) and radiologist opinion entry (`radiologyReport`) with DICOM image uploads.

#### Phase 3 Verification Checklist:
- [x] Admitting an IPD patient atomically toggles bed status from `available` to `occupied`.
- [x] Discharging an IPD patient releases the bed back to `available`.

---

### Phase 4 — Operations & Supply Chain

#### Included Modules:
1. `suppliers`: Vendor directory, contact details, tax numbers (GSTIN/Tax ID), and lead times.
2. `pharmacy`: Drug catalog (`Medicine`) and sales point-of-sale counter (`PharmacySale`) supporting OTC and prescription sales.
3. `inventory`: Physical stock levels (`InventoryItem`), batch numbers, unit costs, low-stock threshold alerts, and FEFO expiry enforcement.

#### Phase 4 Verification Checklist:
- [x] Pharmacy checkout atomically decrements batch stock count inside a Mongoose transaction session.
- [x] Selling an item with zero stock throws `400 Insufficient Stock`.

---

### Phase 5 — Finance & Billing

#### Included Modules:
1. `billing`: Line-itemized patient invoices (`INV-YYYY-XXXX`), subtotal calculations, monetary discounts, tax calculations, and status updates (`unpaid`, `partially-paid`, `paid`).
2. `payments`: Payment receipt processing (`RCP-YYYY-XXXX`) supporting Cash, Card, UPI, NetBanking, and Cheque with overpayment protection.
3. `insurance`: Patient insurance policy registration (`InsurancePolicy`) and claim approval/rejection workflows (`InsuranceClaim`).

#### Phase 5 Verification Checklist:
- [x] Processing a payment increments `invoice.amountPaid` and transitions status to `partially-paid` or `paid`.
- [x] Attempting to pay more than the remaining balance throws `400 Overpayment Error`.

---

### Phase 6 — System Operations & Governance

#### Included Modules:
1. `notifications`: Real-time in-app alert notifications delivered via Socket.IO target rooms (`user:<userId>`).
2. `reports`: Aggregated analytical revenue, patient demographic, doctor occupancy, and inventory expiry reports.
3. `settings`: Global hospital institution profile, brand logo URL, default currency (`INR`), default tax rate (`18%`), and appointment slot duration settings.

#### Phase 6 Verification Checklist:
- [x] Real-time socket events fire when appointments are booked or lab reports complete.
- [x] Changing global tax rates updates future invoice calculations automatically.