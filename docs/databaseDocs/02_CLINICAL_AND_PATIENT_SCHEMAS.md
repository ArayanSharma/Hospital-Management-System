# 02. Clinical & Patient Care Schemas Documentation

This document provides complete Mongoose schema specifications for clinical care, doctor management, outpatient (OPD), inpatient (IPD), ward occupancy, and appointment entities:
1. **`Patient` (`patients`)**
2. **`Doctor` (`doctors`)**
3. **`Department` (`departments`)**
4. **`OPDVisit` (`opdvisits`)**
5. **`Appointment` (`appointments`)**
6. **`Admission` (`admissions`)**
7. **`Ward` (`wards`)**
8. **`Bed` (`beds`)**

---

## 1. Patient Model (`Patient` -> `patients` collection)

### Mongoose File Path
`src/modules/patients/patient.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique MongoDB Identifier |
| `patientId` | `String` | Required, unique, trim | N/A | Human-readable sequential UHID (`PAT-YYYYMMDD-XXXX`) |
| `name` | `String` | Required, trim | N/A | Patient full name |
| `dateOfBirth` | `Date` | Required | N/A | Birth date for age computation |
| `gender` | `String` | Required, enum: `["male", "female", "other"]` | N/A | Gender identifier |
| `phone` | `String` | Required, trim, indexed | N/A | Primary contact phone |
| `email` | `String` | Lowercase, trim | `null` | Optional email address |
| `address` | `String` | Trim | `""` | Residential street address |
| `bloodGroup` | `String` | Enum: `["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null]` | `null` | Blood group classification |
| `maritalStatus` | `String` | Enum: `["single", "married", "divorced", "widowed", null]` | `null` | Marital status |
| `occupation` | `String` | Trim | `null` | Occupation |
| `nationality` | `String` | Trim | `"Indian"` | Nationality |
| `notes` | `String` | Trim | `null` | Patient special care notes |
| `emergencyContact`| `Subdocument`| `{ name, phone, relation }` | `{}` | Emergency contact details |
| `status` | `String` | Enum: `["active", "inactive"]` | `"active"` | Record status |
| `isDeleted` | `Boolean` | Soft delete flag | `false` | Compliance soft delete indicator |
| `deletedAt` | `Date` | Nullable date | `null` | Timestamp when soft deleted |
| `createdAt` | `Date` | Auto ISO timestamp | `Date.now` | Registration timestamp |
| `updatedAt` | `Date` | Auto ISO timestamp | `Date.now` | Last update timestamp |

### Virtual Fields & Indexes
- **Virtual Field**: `age` (Computes dynamic age based on `dateOfBirth`).
- **Indexes**:
  - `{ name: "text", phone: "text" }` (Full-text search)
  - `{ isDeleted: 1, status: 1, createdAt: -1 }`
  - `{ phone: 1, isDeleted: 1 }`
  - `{ email: 1, isDeleted: 1 }`

---

## 2. Doctor Model (`Doctor` -> `doctors` collection)

### Mongoose File Path
`src/modules/doctors/doctor.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `doctorId` | `String` | Unique, trim | N/A | Sequential Doctor ID (`DOC-XXXX`) |
| `userId` | `ObjectId` | Required, ref: `User` | N/A | Linked staff user account credentials |
| `departmentId` | `ObjectId` | Required, ref: `Department` | N/A | Associated medical department |
| `specialization` | `String` | Required, trim | N/A | Clinical specialization |
| `licenseNumber` | `String` | Required, trim | N/A | Medical Council registration number |
| `consultationFee` | `Number` | Required, min 0 | N/A | Standard consultation fee |
| `availability` | `[Subdocument]`| Array of `{ dayOfWeek, startTime, endTime, maxPatients }` | `[]` | Weekly consultation schedule |
| `status` | `String` | Enum: `["active", "inactive"]` | `"active"` | Active medical practice state |
| `createdAt` | `Date` | Auto ISO timestamp | `Date.now` | Document creation timestamp |
| `updatedAt` | `Date` | Auto ISO timestamp | `Date.now` | Last document update timestamp |

---

## 3. Department Model (`Department` -> `departments` collection)

### Mongoose File Path
`src/modules/departments/department.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `name` | `String` | Required, unique (case-insensitive), trim | N/A | Department title (e.g. "Cardiology") |
| `code` | `String` | Required, unique, uppercase, trim | N/A | Department code (e.g. `CARD-01`) |
| `description` | `String` | Trim | `""` | Department scope overview |
| `headDoctorId` | `ObjectId` | Ref: `Doctor` | `null` | Appointed HOD physician |
| `status` | `String` | Enum: `["active", "inactive"]` | `"active"` | Department operational status |
| `createdAt` | `Date` | Auto ISO timestamp | `Date.now` | Creation timestamp |
| `updatedAt` | `Date` | Auto ISO timestamp | `Date.now` | Last update timestamp |

---

## 4. OPDVisit Model (`OPDVisit` -> `opdvisits` collection)

### Mongoose File Path
`src/modules/opd/opdVisit.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `visitId` | `String` | Required, unique, trim | N/A | Sequential Visit Token (`OPD-YYYYMMDD-XXX`) |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Patient undergoing consultation |
| `doctorId` | `ObjectId` | Required, ref: `Doctor` | N/A | Attending physician |
| `queueNumber` | `Number` | Required, integer | N/A | Daily consultation queue number |
| `vitals` | `Subdocument`| `{ bp, pulse, temperature, weight, height, spo2 }` | `{}` | Triage vitals recorded by nursing staff |
| `symptoms` | `String` | Trim | `""` | Patient chief complaint |
| `status` | `String` | Enum: `["waiting", "in-consultation", "completed", "cancelled"]` | `"waiting"` | Consultation queue status |
| `visitDate` | `Date` | Date object | `Date.now` | Date of OPD visit |

---

## 5. Appointment Model (`Appointment` -> `appointments` collection)

### Mongoose File Path
`src/modules/appointments/appointment.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Booking patient |
| `doctorId` | `ObjectId` | Required, ref: `Doctor` | N/A | Target doctor |
| `departmentId` | `ObjectId` | Required, ref: `Department` | N/A | Target department |
| `appointmentDate`| `Date` | Required | N/A | Date of appointment slot |
| `startTime` | `String` | Required, format "HH:MM" | N/A | Slot start time |
| `endTime` | `String` | Required, format "HH:MM" | N/A | Slot end time |
| `reason` | `String` | Trim | `""` | Booking reason / consultation topic |
| `status` | `String` | Enum: `["scheduled", "completed", "cancelled", "no-show"]` | `"scheduled"` | Appointment status |
| `cancelledReason`| `String` | Trim | `""` | Reason if status changed to cancelled |

---

## 6. Admission Model (`Admission` -> `admissions` collection)

### Mongoose File Path
`src/modules/ipd/admission.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `admissionId` | `String` | Required, unique | N/A | Sequential Admission ID (`IPD-YYYY-XXXX`) |
| `patientId` | `ObjectId` | Required, ref: `Patient` | N/A | Admitted patient |
| `doctorId` | `ObjectId` | Required, ref: `Doctor` | N/A | Primary attending physician |
| `wardId` | `ObjectId` | Required, ref: `Ward` | N/A | Assigned physical ward |
| `bedId` | `ObjectId` | Required, ref: `Bed` | N/A | Assigned locked bed |
| `admissionDate` | `Date` | Date object | `Date.now` | Admission timestamp |
| `dischargeDate` | `Date` | Nullable Date | `null` | Discharge timestamp |
| `admissionReason`| `String` | Trim | `""` | Reason for IPD admission |
| `status` | `String` | Enum: `["admitted", "discharged", "transferred"]` | `"admitted"` | Admission state |
| `dischargeSummary`| `Subdocument`| `{ diagnosis, treatmentGiven, adviceOnDischarge, followUpDate }` | `null` | Final discharge summary |

---

## 7. Ward Model (`Ward` -> `wards` collection)

### Mongoose File Path
`src/modules/wards/ward.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `name` | `String` | Required, trim | N/A | Ward name (e.g. "ICU Ward 2") |
| `type` | `String` | Enum: `["general", "semi-private", "private", "icu", "emergency"]` | `"general"` | Ward category |
| `floor` | `String` | Trim | `""` | Hospital floor location |
| `capacity` | `Number` | Required, min 1 | N/A | Total bed capacity |
| `dailyRate` | `Number` | Required, min 0 | N/A | Daily room charge for billing |

---

## 8. Bed Model (`Bed` -> `beds` collection)

### Mongoose File Path
`src/modules/beds/bed.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `bedNumber` | `String` | Required, trim | N/A | Bed label string (e.g. "BED-104") |
| `wardId` | `ObjectId` | Required, ref: `Ward` | N/A | Parent ward reference |
| `status` | `String` | Enum: `["available", "occupied", "maintenance"]` | `"available"` | Live occupancy status |
