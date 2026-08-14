🔴 Backend Modules

backend/src/modules/

├── auth/
├── users/
├── roles/
├── permissions/
├── super-admin/
│
├── patients/
├── doctors/
├── staff/
├── departments/
├── appointments/
│
├── opd/
├── ipd/
├── wards/
├── beds/
│
├── prescriptions/
├── medical-records/
├── laboratory/
├── radiology/
│
├── pharmacy/
├── inventory/
├── suppliers/
│
├── billing/
├── payments/
├── insurance/
│
├── notifications/
├── reports/
├── audit-logs/
└── settings/

Backend modules Work

| Module              | work                                        |
| ------------------- | ------------------------------------------- |
| **Auth**            | Login, logout, JWT, refresh token, password |
| **Users**           | Users create/update/delete/manage           |
| **Roles**           | Admin, Doctor, Receptionist etc. roles      |
| **Permissions**     | User kya kar sakta hai                      |
| **Super Admin**     | Complete system administration              |
| **Patients**        | Patient profile & information               |
| **Doctors**         | Doctor profile, specialization, schedule    |
| **Staff**           | Nurses, receptionists, accountants etc.     |
| **Departments**     | Cardiology, ENT, ICU etc.                   |
| **Appointments**    | Doctor-patient appointments                 |
| **OPD**             | Outpatient consultation                     |
| **IPD**             | Patient admission/discharge                 |
| **Wards**           | Hospital wards management                   |
| **Beds**            | Bed allocation/availability                 |
| **Prescriptions**   | Doctor medicines/prescriptions              |
| **Medical Records** | Patient medical history                     |
| **Laboratory**      | Lab tests & reports                         |
| **Radiology**       | X-ray, MRI, CT etc.                         |
| **Pharmacy**        | Medicine management/sales                   |
| **Inventory**       | Hospital stock                              |
| **Suppliers**       | Vendors & purchases                         |
| **Billing**         | Patient invoices/charges                    |
| **Payments**        | Cash/UPI/card/payment status                |
| **Insurance**       | Insurance & claims                          |
| **Notifications**   | Email/SMS/in-app notifications              |
| **Reports**         | Hospital reports & analytics                |
| **Audit Logs**      | Kis user ne kya action kiya                 |
| **Settings**        | Hospital/system configuration               |


🟢 Frontend Features

frontend/src/features/

├── auth/
├── users/
├── roles/
├── permissions/
├── super-admin/
│
├── patients/
├── doctors/
├── staff/
├── departments/
├── appointments/
│
├── opd/
├── ipd/
├── wards/
├── beds/
│
├── prescriptions/
├── medical-records/
├── laboratory/
├── radiology/
│
├── pharmacy/
├── inventory/
├── suppliers/
│
├── billing/
├── payments/
├── insurance/
│
├── notifications/
├── reports/
├── audit-logs/
└── settings/


🧩 Common Frontend Structure
Ye modules/features nahi hain, ye shared infrastructure hai:

frontend/src/

├── app/
├── layouts/
│   └── DashboardLayout.jsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── common/
│
├── hooks/
├── store/
├── services/
├── lib/
├── utils/
├── constants/
└── assets/