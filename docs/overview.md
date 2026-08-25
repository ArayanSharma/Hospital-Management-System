1. Project Setup                                                      //Department → Doctor → Patient → Appointment
      ↓
2. Config + MongoDB                                                   //User → Role → Permission → Role-Permission Mapping
      ↓
3. User Model                                                         //Doctor, Patient, Nurse, Staff
      ↓
4. Auth Module                                                        //Login, Logout, JWT, Refresh Token, Reset Password
      ↓
5. Role Module                                                          //Create, Update, Delete, Permissions
      ↓
6. Permission Module                                                    //Create, Update, Delete, Roles
      ↓ 
7. RBAC Middleware                                                      //Permission-based Access Control
      ↓
8. Super Admin                                                          //Create, Update, Delete, Audit Logs
      ↓
9. Audit Logs                                                            //Create, Update, Delete, Users
      ↓
10. Other Business Modules                                              //Create, Update, Delete, Departments


🔐 RBAC Modules

Tumhare project ke foundation ke liye sabse important:

auth
   ↓
users
   ↓
roles
   ↓
permissions
   ↓
super-admin


Example:

SUPER_ADMIN
    ↓
All Permissions

DOCTOR
    ↓
patient:read
appointment:read
prescription:create

RECEPTIONIST
    ↓
patient:create
patient:read
appointment:create
billing:read

//////////////////////////
Frontend:

Permission
    ↓
Sidebar hide/show
    ↓
Button hide/show
    ↓
Page access
///////////////////////////////
Backend:

Permission
    ↓
Middleware
    ↓
API Allow / Deny
//////////////////////////////////


PHASE 0
Project Setup
       ↓
PHASE 1
MongoDB + Config
       ↓
PHASE 2
User Schema
       ↓
Role Schema
       ↓
Permission Schema
       ↓
PHASE 3
Auth
       ↓
Login
       ↓
JWT
       ↓
Auth Middleware
       ↓
PHASE 4
RBAC
       ↓
Role Middleware
       ↓
Permission Middleware
       ↓
PHASE 5
Super Admin
       ↓
Seed
       ↓
Dashboard APIs
       ↓
User Management
       ↓
Role Management
       ↓
Permission Management
       ↓
Audit Logs
       ↓
PHASE 6
Frontend
       ↓
Login
       ↓
Common Dashboard
       ↓
Dynamic Sidebar
       ↓
Permission-based UI
       ↓
PHASE 7
Patients
       ↓
Doctors
       ↓
Departments
       ↓
Appointments
       ↓
PHASE 8
OPD / IPD / Clinical
       ↓
PHASE 9
Lab / Pharmacy / Inventory
       ↓
PHASE 10
Billing / Payment / Insurance
       ↓
PHASE 11
Reports / Notifications / Settings