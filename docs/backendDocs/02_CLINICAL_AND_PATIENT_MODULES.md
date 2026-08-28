# 02. Clinical & Patient Modules Documentation

This document covers all core patient care and hospital clinical operation modules:
1. **Patients (`patients`)**
2. **Doctors (`doctors`)**
3. **OPD (`opd`)**
4. **Appointments (`appointments`)**
5. **IPD (`ipd`)**
6. **Wards (`wards`)**
7. **Beds (`beds`)**

---

## 1. Patients Module (`src/modules/patients`)

### Purpose & Business Motivation
Stores master medical demographics and identification records for all hospital patients. Serves as the central anchor entity linked to Appointments, Prescriptions, Admissions, Invoices, Lab Reports, and Medical History.

### Data Model (`patient.model.js`)
- `patientId`: String (Unique sequential ID format, e.g., `PAT-20260826-0001`). Generated via `generateSequentialId()`.
- `name`: String (Required).
- `dateOfBirth`: Date (Required).
- `gender`: Enum (`"male"`, `"female"`, `"other"`).
- `phone`: String (Required, indexed for fast phone search).
- `email`: String (Optional).
- `address`: `{ street, city, state, zipCode }`.
- `bloodGroup`: Enum (`"A+"`, `"A-"`, `"B+"`, `"B-"`, `"AB+"`, `"AB-"`, `"O+"`, `"O-"`).
- `emergencyContact`: `{ name, phone, relationship }`.
- `status`: Enum (`"active"`, `"inactive"`, default: `"active"`). Soft-delete design pattern.

---

### Key Functions & Business Logic (`patient.service.js`)

1. **`createPatient(data, currentUser, requestMeta)`**:
   - Generates sequential `patientId` (`PAT-YYYYMMDD-XXXX`).
   - Inserts patient into MongoDB.
   - Triggers `createAuditLog` capturing creator ID, IP, and User-Agent.

2. **`getAllPatients({ page, limit, search, status, gender })`**:
   - Performs paginated regex search on `name`, `phone`, or `patientId`.

3. **`updatePatient(id, data, currentUser, requestMeta)`**:
   - Updates demographic details and records differential audit logs (`oldValue` vs `newValue`).

4. **`deletePatient(id, currentUser, requestMeta)`**:
   - **Healthcare Compliance Notice**: Does **NOT** execute MongoDB `deleteOne()`. Healthcare regulation requires medical history retention. Performs **soft delete** setting `status = "inactive"`.

---

## 2. Doctors Module (`src/modules/doctors`)

### Purpose & Business Motivation
Tracks physician profiles, specializations, medical license numbers, department affiliations, daily consultation schedules, and consultation fees.

### Data Model (`doctor.model.js`)
- `doctorId`: Unique Sequential ID (`DOC-XXXX`).
- `userId`: ObjectId reference to `User` model (provides login credentials).
- `departmentId`: ObjectId reference to `Department`.
- `specialization`: String (e.g. "Cardiology", "Orthopedics").
- `licenseNumber`: String (Medical Council registration number).
- `consultationFee`: Number (Used in OPD and Appointment billing).
- `availability`: Array of schedules `{ dayOfWeek, startTime, endTime, maxPatients }`.
- `status`: Enum (`"active"`, `"inactive"`).

---

### Key Functions & Business Logic (`doctor.service.js`)
- **`createDoctor(data)`**: Creates doctor profile linked to a valid `User` account with role `DOCTOR`.
- **`getDoctorSchedule(doctorId, date)`**: Evaluates available consultation time slots based on doctor's weekly `availability` array and existing booked appointments.

---

## 3. OPD Module (`src/modules/opd`)

### Purpose & Business Motivation
Handles Outpatient Department (OPD) walk-in consultations, queue token generation, vital sign recording, and OPD consultation status (`waiting`, `in-consultation`, `completed`).

### Data Model (`opdVisit.model.js`)
- `visitId`: Unique sequential token ID (`OPD-20260826-012`).
- `patientId`: Ref `Patient`.
- `doctorId`: Ref `Doctor`.
- `queueNumber`: Integer (Daily queue counter reset every morning).
- `vitals`: `{ bp, pulse, temperature, weight, height, spo2 }`.
- `symptoms`: String.
- `status`: Enum (`"waiting"`, `"in-consultation"`, `"completed"`, `"cancelled"`).
- `visitDate`: Date (default: `Date.now`).

---

### Key Functions & Business Logic (`opdVisit.service.js`)

1. **`createOPDVisit(data)`**:
   - Calculates next `queueNumber` for the selected doctor on the current date (`max(queueNumber) + 1`).
   - Assigns token `visitId` and sets status to `"waiting"`.

2. **`updateVitals(visitId, vitals)`**:
   - Nurse/Triage team records temperature, blood pressure, and pulse before consultation.

3. **`completeOPDVisit(visitId)`**:
   - Marks visit `"completed"` and links generated prescription/bill.

---

## 4. Appointments Module (`src/modules/appointments`)

### Purpose & Business Motivation
Manages pre-booked patient-doctor appointments, slot scheduling, collision detection, rescheduling, and cancellation with automated notifications.

### Data Model (`appointment.model.js`)
- `patientId`: Ref `Patient`.
- `doctorId`: Ref `Doctor`.
- `departmentId`: Ref `Department` (Automatically inherited from Doctor).
- `appointmentDate`: Date.
- `startTime`: String ("09:30").
- `endTime`: String ("10:00").
- `reason`: String.
- `status`: Enum (`"scheduled"`, `"completed"`, `"cancelled"`, `"no-show"`).
- `cancelledReason`: String.

---

### Key Functions & Business Logic (`appointment.service.js`)

1. **`createAppointment(data)`**:
   - **Collision Prevention Logic (`checkDoctorConflict`)**: Queries all active scheduled appointments for the target doctor on `appointmentDate`. Executes `isTimeOverlapping(startTime, endTime, existingStart, existingEnd)`. Throws `409 Conflict` if slot overlaps!
   - Sends automated in-app notification to doctor's user account (`createNotification`).

2. **`updateAppointment(id, data)`**:
   - Excludes self ID when re-checking slot overlap during rescheduling.

3. **`changeAppointmentStatus(id, status, cancelledReason)`**:
   - Updates status. If `"cancelled"`, records `cancelledReason` and sends cancellation alert notification to the doctor.

---

## 5. IPD Module (`src/modules/ipd`)

### Purpose & Business Motivation
Manages Inpatient Department (IPD) admissions, bed allocation, attending doctors, nursing care logs, and discharge summaries.

### Data Model (`admission.model.js`)
- `admissionId`: Unique ID (`IPD-2026-0042`).
- `patientId`: Ref `Patient`.
- `doctorId`: Ref `Doctor` (Primary Attending Physician).
- `wardId`: Ref `Ward`.
- `bedId`: Ref `Bed`.
- `admissionDate`: Date.
- `dischargeDate`: Date (Populated upon discharge).
- `admissionReason`: String.
- `status`: Enum (`"admitted"`, `"discharged"`, `"transferred"`).
- `dischargeSummary`: `{ diagnosis, treatmentGiven, adviceOnDischarge, followUpDate }`.

---

### Key Functions & Business Logic (`admission.service.js`)

1. **`admitPatient(data)`**:
   - Checks if `bedId` is currently `"available"`.
   - In a single transaction:
     - Creates `Admission` record with status `"admitted"`.
     - Updates `Bed` status to `"occupied"`.

2. **`dischargePatient(admissionId, dischargeData)`**:
   - Updates admission record with `dischargeDate` and `dischargeSummary`.
   - Changes status to `"discharged"`.
   - Releases the bed: updates `Bed` status back to `"available"`.
   - Generates final IPD billing entry.

---

## 6. Wards Module (`src/modules/wards`)

### Purpose & Business Motivation
Defines physical hospital wards (e.g. ICU, General Ward Male, Pediatric Ward, Deluxe Private Rooms).

### Data Model (`ward.model.js`)
- `name`: String (e.g. "ICU Ward 3").
- `type`: Enum (`"general"`, `"semi-private"`, `"private"`, `"icu"`, `"emergency"`).
- `floor`: String.
- `capacity`: Number (Total beds count).
- `dailyRate`: Number (Cost per 24 hours for billing calculation).

---

## 7. Beds Module (`src/modules/beds`)

### Purpose & Business Motivation
Tracks individual bed numbers inside wards and their live occupancy state.

### Data Model (`bed.model.js`)
- `bedNumber`: String (e.g. "BED-102").
- `wardId`: Ref `Ward`.
- `status`: Enum (`"available"`, `"occupied"`, `"maintenance"`).

---

## API Endpoints Summary

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Patients** | `POST` | `/api/v1/patients` | Register new patient |
| **Patients** | `GET` | `/api/v1/patients` | Paginated search patients |
| **Doctors** | `GET` | `/api/v1/doctors` | List doctors & availability |
| **OPD** | `POST` | `/api/v1/opd-visits` | Issue new OPD consultation token |
| **Appointments** | `POST` | `/api/v1/appointments` | Book appointment (with overlap check) |
| **Appointments** | `PATCH` | `/api/v1/appointments/:id/status` | Complete / Cancel appointment |
| **IPD** | `POST` | `/api/v1/admissions` | Admit IPD patient & occupy bed |
| **IPD** | `POST` | `/api/v1/admissions/:id/discharge` | Discharge IPD patient & free bed |

---

## Senior Developer Notes & Edge Cases

- **Bed Allocation Concurrency**: When 2 receptionists try to assign the same bed at the same instant, Mongoose transaction lock or atomic check (`{ _id: bedId, status: "available" }`) prevents double booking.
- **Doctor Overlap Guard**: Cancelled appointments (`status: "cancelled"`) are ignored during overlap validation so cancelled slots become immediately re-bookable.
