# 01. Auth & Security Modules Documentation

This document covers all security, access control, identity management, and administration modules in the backend:
1. **Auth (`auth`)**
2. **Users (`users`)**
3. **Roles (`roles`)**
4. **Permissions (`permissions`)**
5. **Super Admin (`super-admin`)**

---

## 1. Auth Module (`src/modules/auth`)

### Purpose & Business Motivation
The `auth` module manages identity verification, session token issuance, credential validation, token rotation, and secure logout for hospital staff (Doctors, Nurses, Pharmacists, Admins, Receptionists).

### Data Model Reference
Uses `User` model (`src/modules/users/user.model.js`).
- `refreshToken`: Stored directly on the user record in MongoDB (hashed or exact matching) to allow instant session revocation upon logout.
- `lastLoginAt`: Timestamp automatically recorded upon successful login.

---

### Functions & Logic Breakdown

#### Service Layer (`auth.service.js`)

1. **`registerUser(data)`**:
   - **Inputs**: `{ name, email, password, roleId, phone }`
   - **Logic**:
     - Checks if `email` already exists in MongoDB (`User.findOne({ email })`). Throws `409 USER_ALREADY_EXISTS` if found.
     - Saves the new `User` document.
     - **Senior Note**: Password is passed as plain text into `User.create()`. Do **NOT** run `bcrypt.hash()` manually in the service layer because `user.model.js` has a `pre("save")` hook that automatically hashes the password. Manual hashing will cause double-hashing and break login verification.
   - **Returns**: Cleaned user object without `password` or `refreshToken`.

2. **`loginUser(email, password)`**:
   - **Inputs**: `email`, `password` (string)
   - **Logic**:
     - Finds user by email with `select("+password")` and populates `roleId` and its nested `permissionIds`.
     - Throws `401 AUTH_INVALID_CREDENTIALS` if user is not found.
     - Checks `user.status !== "active"`. Throws `403 AUTH_ACCOUNT_INACTIVE` if account is deactivated.
     - Calls `user.isPasswordMatch(password)` (Mongoose instance method using `bcrypt.compare`). Throws `401 AUTH_INVALID_CREDENTIALS` if match fails.
     - Generates JWT `accessToken` (short-lived) and `refreshToken` (long-lived).
     - Saves `refreshToken` and updates `lastLoginAt = new Date()`.
   - **Returns**: `{ user, accessToken, refreshToken }`

3. **`refreshAccessToken(token)`**:
   - **Inputs**: `refreshToken` string
   - **Logic**:
     - Verifies JWT signature using `verifyRefreshToken(token)`.
     - Finds user by decoded ID and fetches stored `refreshToken`.
     - Compares DB token with provided token. If mismatch or user missing, throws `401 AUTH_REFRESH_TOKEN_INVALID`.
     - Generates **new** Access Token & **new** Refresh Token (Token Rotation Pattern).
     - Saves new refresh token to DB.
   - **Returns**: `{ accessToken, refreshToken }`

4. **`logoutUser(userId)`**:
   - **Inputs**: `userId`
   - **Logic**: Sets `user.refreshToken = null` in DB, revoking active session tokens.
   - **Returns**: Success message.

5. **`getCurrentUser(userId)`**:
   - **Inputs**: `userId` (from authenticated `req.user.id`)
   - **Logic**: Fetches user profile with populated roles and permissions array. Sanitizes sensitive credentials.

---

### Validation Schemas (`auth.validation.js`)
- `registerSchema`: Requires valid email format, min 6 char password, valid phone, valid Mongo ObjectId for `roleId`.
- `loginSchema`: Requires valid email and non-empty password.
- `refreshTokenSchema`: Requires non-empty `refreshToken` string.

---

### API Endpoints Quick Reference

| Method | Endpoint | Auth Required | Permission | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Optional / Public | None | Create new user account |
| `POST` | `/api/v1/auth/login` | Public | None | Login user & receive JWT tokens |
| `POST` | `/api/v1/auth/refresh-token` | Public | None | Exchange valid refresh token for new access token |
| `POST` | `/api/v1/auth/logout` | Required | None | Invalidate refresh token / Logout |
| `GET` | `/api/v1/auth/me` | Required | None | Fetch logged-in user profile & permissions |

---

## 2. Users Module (`src/modules/users`)

### Purpose & Business Motivation
Manages hospital staff accounts, profile updates, account activation/deactivation, and role assignments.

### Data Model (`user.model.js`)
- **Fields**: `name`, `email` (unique, lowercase), `password` (select: false), `roleId` (ref: `Role`), `phone`, `status` (`active` / `inactive`), `avatar`, `lastLoginAt`, `refreshToken`.
- **Hooks**:
  - `pre("save")`: Hashes `password` using `bcrypt.hash(password, 10)` if modified.
- **Instance Methods**:
  - `isPasswordMatch(enteredPassword)`: Compares plain password with hashed DB string using `bcrypt.compare`.

---

### Functions & Logic Breakdown (`user.service.js`)

1. **`getAllUsers(query)`**:
   - Accepts search filters (`search`, `roleId`, `status`) and pagination params (`page`, `limit`).
   - Builds MongoDB filter object, performs populated query on `roleId`, and returns paginated result set using `pagination.js`.

2. **`getUserById(id)`**:
   - Finds user by `_id`, populating role and associated permissions. Throws `404 USER_NOT_FOUND` if absent.

3. **`updateUser(id, data)`**:
   - Updates editable fields (`name`, `phone`, `avatar`, `roleId`). Sanitizes output to exclude password.

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
- **`getPermissions()`**: Returns all registered permissions grouped by module category for frontend UI checkbox matrices (e.g. Role Edit screen).
- **`seedPermissions()`**: Internal helper to sync predefined system permissions list into MongoDB upon app startup.

---

## 5. Super Admin Module (`src/modules/super-admin`)

### Purpose & Business Motivation
Provides system-level override utilities reserved strictly for the Super Admin role.

### Functions & Logic Breakdown (`superAdmin.service.js`)
- **`getSystemStats()`**: Computes total MongoDB collection counts across users, patients, doctors, admissions, revenue, and active server connections.
- **`forceResetUserPassword(userId, newPassword)`**: Admin override to reset any locked or compromised user account password.
- **`reseedDatabase()`**: Administrative utility to re-run permission seeders and repair broken system roles.

---

## Senior Developer Notes & 6-Month Maintenance

1. **Security Vulnerability Prevention**:
   - Never remove `select: false` from `password` in `user.model.js`.
   - Never disable `authenticate` or `checkPermission` middleware on production routes.
2. **Adding New Permissions**:
   - When introducing a new module (e.g., `blood-bank`), register its permission constants in `src/core/constants/permissions.js` and execute permission sync seeder.
