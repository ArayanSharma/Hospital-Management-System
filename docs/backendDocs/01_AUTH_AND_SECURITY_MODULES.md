# 01. Auth & Security Modules Documentation

This document covers all security, identity verification, access control, and administration modules in the backend:
1. **Auth (`auth`)**
2. **Users (`users`)**
3. **Roles (`roles`)**
4. **Permissions (`permissions`)**
5. **Super Admin (`super-admin`)**

---

## 1. Auth Module (`src/modules/auth`)

### Purpose & Business Motivation
The `auth` module manages identity verification, session token issuance, credential validation, token rotation, and secure logout for hospital staff (Doctors, Nurses, Pharmacists, Admins, Receptionists, Lab Technicians, Super Admins).

### Data Model Reference
Uses the `User` model (`src/modules/users/user.model.js`).
- `refreshToken`: Stored directly on the user record in MongoDB to allow instant session revocation upon logout or security breach.
- `lastLoginAt`: Timestamp automatically updated upon every successful authentication event.

---

### Functions & Logic Breakdown

#### Service Layer (`auth.service.js`)

1. **`registerUser(data)`**:
   - **Inputs**: `{ name, email, password, roleId, phone }`
   - **Logic**:
     - Queries `User.findOne({ email })`. Throws `409 USER_ALREADY_EXISTS` if duplicate.
     - Saves new `User` document.
     - **Senior Note**: Pass plain-text password to `User.create()`. Do **NOT** call `bcrypt.hash()` manually in the service layer because `user.model.js` has a Mongoose `pre("save")` hook that automatically hashes passwords. Manual hashing causes double-hashing and breaks login.
   - **Returns**: Cleaned user object without `password` or `refreshToken`.

2. **`loginUser(email, password)`**:
   - **Inputs**: `email`, `password` (string)
   - **Logic**:
     - Finds user by email with `.select("+password")` and populates `roleId` and its nested `permissionIds`.
     - Throws `401 AUTH_INVALID_CREDENTIALS` if user is not found.
     - Verifies `user.status === "active"`. Throws `403 AUTH_ACCOUNT_INACTIVE` if account is suspended/deactivated.
     - Calls `user.isPasswordMatch(password)` (Mongoose instance method using `bcrypt.compare`). Throws `401 AUTH_INVALID_CREDENTIALS` on match failure.
     - Generates JWT `accessToken` (15m expiration) and `refreshToken` (7d expiration).
     - Saves `refreshToken` in DB and updates `lastLoginAt = new Date()`.
   - **Returns**: `{ user, accessToken, refreshToken }`

3. **`refreshAccessToken(token)`**:
   - **Inputs**: `refreshToken` string
   - **Logic**:
     - Verifies JWT signature using `verifyRefreshToken(token)`.
     - Decodes user ID and queries database for stored `refreshToken`.
     - Compares DB token with provided token. If mismatch or user is inactive, throws `401 AUTH_REFRESH_TOKEN_INVALID`.
     - Generates **new** Access Token & **new** Refresh Token (**Token Rotation Pattern**).
     - Saves new refresh token to DB.
   - **Returns**: `{ accessToken, refreshToken }`

4. **`logoutUser(userId)`**:
   - **Inputs**: `userId`
   - **Logic**: Sets `user.refreshToken = null` in DB, revoking active session tokens immediately.
   - **Returns**: `{ message: "Logged out successfully" }`

5. **`getCurrentUser(userId)`**:
   - **Inputs**: `userId` (from authenticated `req.user.id`)
   - **Logic**: Fetches user profile with populated roles and permission names array. Sanitizes sensitive fields.

---

### Validation Schemas (`auth.validation.js`)
- `registerSchema`: Validates email format, minimum 6-character password, valid phone string, valid Mongo ObjectId for `roleId`.
- `loginSchema`: Validates required email format and non-empty password.
- `refreshTokenSchema`: Validates required non-empty `refreshToken` string.

---

### API Endpoints Quick Reference

| Method | Endpoint | Auth Required | Permission | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public / Optional | None | Register new staff account |
| `POST` | `/api/v1/auth/login` | Public | None | Authenticate credentials & return JWT pair |
| `POST` | `/api/v1/auth/refresh-token` | Public | None | Exchange valid refresh token for new access token |
| `POST` | `/api/v1/auth/logout` | Required | None | Invalidate stored refresh token (Logout) |
| `GET` | `/api/v1/auth/me` | Required | None | Fetch current user session profile & permissions |

---

## 2. Users Module (`src/modules/users`)

### Purpose & Business Motivation
Manages hospital staff accounts, profile updates, account activation/deactivation, and role assignments.

### Data Model (`user.model.js`)
- **Fields**: `name`, `email` (unique, lowercase), `password` (select: false), `roleId` (ref: `Role`), `phone`, `status` (`"active"` / `"inactive"` / `"deleted"`), `avatar`, `lastLoginAt`, `refreshToken`.
- **Hooks**:
  - `pre("save")`: Hashes `password` using `bcrypt.hash(password, 10)` if modified.
- **Instance Methods**:
  - `isPasswordMatch(enteredPassword)`: Compares plain password with hashed DB string using `bcrypt.compare`.

---

### Functions & Logic Breakdown (`user.service.js`)

1. **`getAllUsers(query)`**:
   - Accepts search filters (`search`, `roleId`, `status`) and pagination params (`page`, `limit`).
   - Builds MongoDB filter object, performs populated query on `roleId`, and returns paginated result set via `pagination.js`.

2. **`getUserById(id)`**:
   - Finds user by `_id`, populating role and associated permissions. Throws `404 USER_NOT_FOUND` if absent.

3. **`updateUser(id, data)`**:
   - Updates editable fields (`name`, `phone`, `avatar`, `roleId`). Excludes sensitive fields.

4. **`toggleUserStatus(id)`**:
   - Toggles status between `"active"` and `"inactive"`. If deactivated, instantly clears `refreshToken` to terminate active user sessions.

---

### API Endpoints Quick Reference

| Method | Endpoint | Auth Required | Permission | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users` | Required | `users:read` | List all staff users with filters |
| `GET` | `/api/v1/users/:id` | Required | `users:read` | Get specific user by ID |
| `PUT` | `/api/v1/users/:id` | Required | `users:write` | Update user details |
| `PATCH` | `/api/v1/users/:id/status` | Required | `users:write` | Toggle active/inactive status |

---

## 3. Roles Module (`src/modules/roles`)

### Purpose & Business Motivation
Allows custom Role creation (e.g. Senior Doctor, Head Nurse, Pharmacist Lead) and associates specific permission strings with roles.

### Data Model (`role.model.js`)
- **Fields**: `name` (unique string, e.g. `DOCTOR`), `description`, `permissionIds` (array of ObjectIds referencing `Permission` model), `isSystemRole` (boolean, prevents deletion of built-in roles like `SUPER_ADMIN`).

---

### Service Functions (`role.service.js`)
- **`createRole(data)`**: Validates unique role name and creates role.
- **`getRoles()`**: Returns list of all system roles with populated permission names.
- **`updateRole(id, data)`**: Updates role name, description, or assigned permission IDs. Rejects modifications to `isSystemRole` protected entries.
- **`deleteRole(id)`**: Prevents deletion if `isSystemRole === true` or if active users are currently assigned to the role.

---

## 4. Permissions Module (`src/modules/permissions`)

### Purpose & Business Motivation
Serves as the central Permission Registry. Defines discrete capability strings across modules (e.g. `patients:read`, `prescriptions:create`, `billing:approve`).

### Data Model (`permission.model.js`)
- **Fields**: `name` (unique string key, e.g. `appointments:cancel`), `module` (grouping category like `appointments`), `description`.

---

### Service Functions (`permission.service.js`)
- **`getPermissions()`**: Returns all registered permissions grouped by module category for frontend UI permission matrix configurations.
- **`seedPermissions()`**: Internal helper to sync predefined system permissions list into MongoDB upon application bootstrap.

---

## 5. Super Admin Module (`src/modules/super-admin`)

### Purpose & Business Motivation
Provides system-wide operational analytics dashboard, real-time activity feeds, and administrative overrides reserved strictly for `SUPER_ADMIN`.

### Functions & Logic Breakdown (`superAdmin.service.js`)

1. **`getDashboardStats(params)`**:
   - Accepts `startDate`, `endDate`, `departmentId`.
   - **Redis Caching**: Caches aggregated response in `hms:superadmin:dashboard:<start>:<end>:<dept>` with 300s TTL.
   - Computes system counts across users, patients, doctors, admissions, revenue breakdown, pending invoices, claims, low stock inventory items, and ward occupancy rates in parallel using `Promise.all()`.

2. **`getRecentActivity(limit)`**:
   - Queries `AuditLog` collection populated with user names and emails, formatted into readable human-friendly activity feeds (`"System User updated a patient"`).
   - Caches output in Redis under key `hms:superadmin:activity:<limit>` for 60s.

---

### API Endpoints Quick Reference

| Method | Endpoint | Auth Required | Permission | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/super-admin/dashboard` | Required | `SUPER_ADMIN` / `superadmin:read` | Fetch Redis-cached system analytics dashboard |
| `GET` | `/api/v1/super-admin/activity` | Required | `SUPER_ADMIN` / `superadmin:read` | Fetch recent system activity feed |

---

## Senior Developer Notes & Maintenance Rules

1. **Security Vulnerability Prevention**:
   - Never remove `select: false` from `password` in `user.model.js`.
   - Never disable `authenticate` or `checkPermission` middleware on production routes.
2. **Adding New Permissions**:
   - When introducing a new module, register its permission constants in `src/core/constants/permissions.js` and execute permission sync seeder.
