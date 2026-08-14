

                          USERS
                           │
                           ↓
                         ROLES
                           │
                           ↓
                      PERMISSIONS


PATIENTS ────────────────┐
   │                     │
   ↓                     ↓
APPOINTMENTS          MEDICAL RECORDS
   │                     ↑
   ↓                     │
OPD VISITS ──────────────┘
   │
   ├──────────────→ PRESCRIPTIONS
   │                     │
   │                     ↓
   │                 PHARMACY
   │                     │
   │                     ↓
   │                 INVENTORY
   │
   ├──────────────→ LAB TESTS
   │                     ↓
   │                 LAB REPORTS
   │
   └──────────────→ RADIOLOGY TESTS
                         ↓
                    RADIOLOGY REPORTS


PATIENTS
   │
   ↓
ADMISSIONS
   │
   ├── WARDS
   │     ↓
   │    BEDS
   │
   ↓
MEDICAL RECORDS


PATIENTS
   │
   ↓
INVOICES
   │
   ├────────→ PAYMENTS
   │
   └────────→ INSURANCE CLAIMS
                    ↑
                    │
             INSURANCE POLICIES


SUPPLIERS
   ↓
INVENTORY
   ↓
PHARMACY


//////////////////////////////////////////////////////////////////////////


🏗️ Complete Schema / Model List
🔐 1. Authentication + RBAC
1. User
2. Role
3. Permission

//////////////////////////////////////////////////////////////////////////

User
Login/account ki information.

User                                                            
├── name
├── email
├── password
├── roleId
├── status
├── isVerified
├── lastLoginAt
├── createdAt
└── updatedAt

roleId User ke andar rahega.


Role                                                                  Example

Role                                                                 SUPER_ADMIN
├── name                                                             ADMIN
├── description                                                      DOCTOR
├── permissionIds[]                                                  NURSE
├── isSystemRole                                                     RECEPTIONIST
├── createdAt                                                        ACCOUNTANT
└── updatedAt                                                        PHARMACIST 
                                                                     PATIENT


Permission                                       

Permission                                                             Example 
├── name                                                             patient:create
├── resource                                                         patient:read
├── action                                                           patient:update
└── description                                                      patient:delete

/////////////////////////////////////////////////////////////////////////////////////////////////

🏥 2. Hospital Core
4. Patient
5. Doctor
6. Staff
7. Department
8. Appointment


Patient

Patient
├── patientId
├── name
├── dateOfBirth
├── gender
├── phone
├── email
├── address
├── bloodGroup
├── emergencyContact
├── status
└── createdAt

Doctor

Doctor
├── userId
├── doctorId
├── name
├── departmentId
├── specialization
├── qualification
├── experience
├── consultationFee
├── availability
└── status

Staff

Staff
├── userId
├── employeeId
├── departmentId
├── designation
├── joiningDate
├── shift
└── status

Department

Department
├── name
├── code
├── description
├── headDoctorId
└── status

Appointment

Appointment
├── patientId
├── doctorId
├── departmentId
├── appointmentDate
├── startTime
├── endTime
├── reason
├── status
└── notes

/////////////////////////////////////////////////////////////////////////////////////////////////

🩺 3. Clinical
9.  OPDVisit
10. Admission
11. Ward
12. Bed
13. Prescription
14. MedicalRecord

OPDVisit
Actual consultation ka record.

OPDVisit
├── patientId
├── doctorId
├── appointmentId
├── symptoms
├── diagnosis
├── notes
├── visitDate
└── status

Admission

IPD admission.

Admission
├── patientId
├── doctorId
├── wardId
├── bedId
├── admissionDate
├── reason
├── diagnosis
├── dischargeDate
└── status

Ward
Ward
├── name
├── type
├── floor
├── capacity
└── status

Bed
Bed
├── wardId
├── bedNumber
├── status
├── currentPatientId
└── maintenanceReason

Prescription
Prescription
├── patientId
├── doctorId
├── visitId
├── medicines[]
├── instructions
└── createdAt

MedicalRecord

Patient ki long-term medical history.

MedicalRecord
├── patientId
├── doctorId
├── visitId
├── diagnosis
├── treatment
├── allergies
├── notes
└── createdAt

/////////////////////////////////////////////////////////////////////////////////////////////////

🧪 4. Laboratory
15. LabTest
16. LabReport

LabTest
Doctor ne test order kiya.

LabTest
├── patientId
├── doctorId
├── visitId
├── testName
├── sampleType
├── priority
├── status
└── requestedAt

LabReport
Actual result.

LabReport
├── labTestId
├── patientId
├── technicianId
├── results
├── interpretation
├── reportFile
├── status
└── reportedAt

/////////////////////////////////////////////////////////////////////////////////////////////////


🩻 5. Radiology
17. RadiologyTest
18. RadiologyReport

RadiologyTest

RadiologyTest                                           Example
├── patientId
├── doctorId                                                XRAY
├── visitId                                                 MRI
├── testType                                                CT SCAN
├── priority                                                ULTRASOUND
├── scheduledAt                                             
└── status

RadiologyReport

RadiologyReport
├── testId
├── patientId
├── radiologistId
├── findings
├── impression
├── images[]
├── reportFile
└── reportedAt

/////////////////////////////////////////////////////////////////////////////////////////////////


💊 6. Pharmacy + Inventory
19. Medicine
20. PharmacySale
21. InventoryItem
22. Supplier

Medicine
Medicine ka master data.

Medicine
├── name
├── genericName
├── category
├── manufacturer
├── unit
├── reorderLevel
└── status

PharmacySale
PharmacySale
├── patientId
├── prescriptionId
├── medicines[]
├── totalAmount
├── paymentStatus
└── createdAt

InventoryItem
InventoryItem
├── itemName
├── category
├── quantity
├── unit
├── minimumStock
├── supplierId
├── batchNumber
├── expiryDate
└── status

Supplier
Supplier
├── name
├── company
├── phone
├── email
├── address
└── status

/////////////////////////////////////////////////////////////////////////////////////////////////


💰 7. Billing + Payments
23. Invoice
24. Payment

Invoice
Invoice
├── invoiceNumber
├── patientId
├── items[]
├── subtotal
├── discount
├── tax
├── total
├── status
└── dueDate

Payment
Payment
├── invoiceId
├── patientId
├── amount
├── method
├── transactionId
├── status
└── paidAt

/////////////////////////////////////////////////////////////////////////////////////////////////


🏥 8. Insurance
25. InsurancePolicy
26. InsuranceClaim

InsurancePolicy
InsurancePolicy
├── patientId
├── providerName
├── policyNumber
├── coverageAmount
├── validFrom
├── validUntil
└── status

InsuranceClaim
InsuranceClaim
├── patientId
├── policyId
├── invoiceId
├── claimAmount
├── approvedAmount
├── status
├── documents[]
└── submittedAt

/////////////////////////////////////////////////////////////////////////////////////////////////


🔔 9. System
27. Notification
28. AuditLog
29. Setting

Notification
Notification
├── userId
├── type
├── title
├── message
├── channel
├── isRead
└── createdAt

AuditLog
AuditLog
├── userId
├── action
├── resource
├── resourceId
├── oldValue
├── newValue
├── ipAddress
├── userAgent
└── createdAt

Setting
Setting
├── hospitalName
├── logo
├── address
├── phone
├── email
├── timezone
├── currency
├── invoiceSettings
└── notificationSettings

/////////////////////////////////////////////////////////////////////////////////////////////////


📊 Reports ka Schema?
Initially Report schema mat banao.

Reports existing data se generate honge:

Patients
Appointments
Billing
Payments
Pharmacy
      ↓
Aggregation
      ↓
Reports
      ↓
Dashboard / PDF / Excel