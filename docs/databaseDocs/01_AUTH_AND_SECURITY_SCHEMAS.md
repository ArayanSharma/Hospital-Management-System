# 01. Auth & Security Schemas Documentation

This document provides full Mongoose schema specifications for authentication, user management, and role-based access control (RBAC) collections:
1. **`User` (`users`)**
2. **`Role` (`roles`)**
3. **`Permission` (`permissions`)**

---

## 1. User Model (`User` -> `users` collection)

### Mongoose File Path
`src/modules/users/user.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique MongoDB Identifier |
| `name` | `String` | Required, trim, min 2, max 100 chars | N/A | Full name of the hospital staff member |
| `email` | `String` | Required, unique, lowercase, trim | N/A | Primary login email address |
| `username` | `String` | Lowercase, trim | `""` | Optional system handle |
| `password` | `String` | Required, min 8 chars, `select: false` | N/A | Bcrypt hashed password string |
| `roleId` | `ObjectId` | Ref: `Role` | `null` | Foreign key referencing assigned Role |
| `roleName` | `String` | Uppercase, trim | `"DOCTOR"` | Cached role name string for quick lookups |
| `department` | `String` | Trim | `"General"` | Assigned department title |
| `designation` | `String` | Trim | `"Staff"` | Staff job title |
| `employeeId` | `String` | Trim | `""` | Hospital employee badge ID |
| `phone` | `String` | Trim | `"+91 98765 43210"` | Contact phone number |
| `countryCode` | `String` | Trim | `"+91"` | Country calling code |
| `dateOfBirth` | `String` | ISO Date string | `""` | Staff date of birth |
| `gender` | `String` | Enum: `["Male", "Female", "Other", ""]` | `""` | Staff gender |
| `avatar` | `String` | Cloudinary URL string | `""` | Profile picture image URL |
| `bloodGroup` | `String` | Enum: `["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", ""]` | `""` | Staff blood group |
| `maritalStatus` | `String` | Enum: `["Single", "Married", "Divorced", "Widowed", ""]` | `""` | Marital status |
| `nationality` | `String` | Trim | `"Indian"` | Nationality |
| `currentAddress`| `String` | Trim | `""` | Residential address |
| `joiningDate` | `String` | Trim | `""` | Employment start date |
| `isProfileComplete`| `Boolean` | Boolean flag | `false` | Indicates whether profile setup was completed |
| `status` | `String` | Enum: `["active", "inactive", "suspended", "blocked", "deleted"]` | `"active"` | Account state |
| `emailVerified` | `String` | Trim | `"Unverified"` | Email verification status |
| `loginAccess` | `String` | Trim | `"Allowed"` | Login permission state |
| `forcePasswordChange`| `Boolean` | Boolean flag | `true` | Requires password reset on first login |
| `sendWelcomeEmail`| `Boolean` | Boolean flag | `false` | Trigger welcome email flag |
| `notes` | `String` | Max 250 chars | `""` | Internal administrative notes |
| `isVerified` | `Boolean` | Boolean flag | `true` | Verification status |
| `lastLoginAt` | `Date` | Date object | `Date.now` | Last authentication timestamp |
| `authProvider` | `String` | Enum: `["local", "google"]` | `"local"` | Authentication identity provider |
| `firebaseUid` | `String` | Nullable string | `null` | Firebase identity mapping UID |
| `refreshToken` | `String` | Nullable string, `select: false` | `null` | Long-lived JWT session refresh token |
| `createdAt` | `Date` | Auto ISO timestamp | `Date.now` | Document creation timestamp |
| `updatedAt` | `Date` | Auto ISO timestamp | `Date.now` | Last document modification timestamp |

### Indexes & Hooks
- **Indexes**:
  - `{ email: 1 }` (unique index)
  - `{ username: 1 }`
  - `{ status: 1 }`
  - `{ department: 1 }`
- **Hooks**:
  - `pre("save")`: Automatically hashes `password` using `bcrypt.hash(password, 10)` if modified.
- **Instance Methods**:
  - `isPasswordMatch(enteredPassword)`: Compares plain text password against stored hash using `bcrypt.compare`.

---

## 2. Role Model (`Role` -> `roles` collection)

### Mongoose File Path
`src/modules/roles/role.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique MongoDB Identifier |
| `name` | `String` | Required, unique, uppercase, trim | N/A | Unique Role title (e.g. `SUPER_ADMIN`, `DOCTOR`, `NURSE`, `PHARMACIST`) |
| `description` | `String` | Trim | `""` | Human-readable explanation of role responsibilities |
| `permissionIds` | `[ObjectId]` | Array of ObjectIds, ref: `Permission` | `[]` | List of assigned permission ObjectIds |
| `isSystemRole` | `Boolean` | Boolean flag | `false` | System role protection flag (prevents deletion of built-in roles) |
| `createdAt` | `Date` | Auto ISO timestamp | `Date.now` | Document creation timestamp |
| `updatedAt` | `Date` | Auto ISO timestamp | `Date.now` | Last document modification timestamp |

---

## 3. Permission Model (`Permission` -> `permissions` collection)

### Mongoose File Path
`src/modules/permissions/permission.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique MongoDB Identifier |
| `name` | `String` | Required, unique, lowercase, trim | N/A | Unique permission string key (e.g. `patients:read`, `billing:approve`) |
| `module` | `String` | Required, trim | N/A | Feature category grouping (e.g. `patients`, `appointments`, `billing`) |
| `description` | `String` | Trim | `""` | Description of capability granted by permission |
| `createdAt` | `Date` | Auto ISO timestamp | `Date.now` | Document creation timestamp |
| `updatedAt` | `Date` | Auto ISO timestamp | `Date.now` | Last document modification timestamp |
