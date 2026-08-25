                    ┌──────────────┐
                    │ Super Admin  │
                    └──────┬───────┘
                           ↓
                  Users / Roles / Permissions
                           ↓
              ┌────────────┴────────────┐
              ↓                         ↓
          Hospital Staff              Patients
              ↓                         ↓
       Doctors / Nurses            Appointments
       Receptionist                     ↓
       Pharmacist                  Consultation
       Accountant                        ↓
              ↓                    Prescription
              ↓                         ↓
        Hospital Operations        Lab / Radiology
              ↓                         ↓
         Pharmacy / Inventory      Medical Records
              ↓                         ↓
             Billing ←───────────────┘
              ↓
           Payments
              ↓
        Reports / Analytics



Phase 2-

Department (koi dependency nahi)
      ↓
Doctor (User + Department pe depend karta hai)
      ↓
Patient (koi dependency nahi — standalone)
      ↓
Appointment (Patient + Doctor + Department teeno pe depend karta hai)