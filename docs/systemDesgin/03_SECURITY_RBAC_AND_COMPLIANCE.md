# 03. Security, RBAC & Compliance Architecture

This document outlines the security architecture, dual-layer JWT token rotation, Role-Based Access Control (RBAC) matrix, Zod payload validation, network defense layers, and audit compliance logging.

---

## 1. Authentication & Token Rotation Engine

The application uses **JWT (JSON Web Token) Token Rotation** for stateless identity verification and session security:

```
                  ┌───────────────────────────────┐
                  │    POST /api/v1/auth/login    │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │ Issue Access Token (15m)      │
                  │ Issue Refresh Token (7d)      │
                  └───────────────┬───────────────┘
                                  │
           ┌──────────────────────┴──────────────────────┐
           ▼                                             ▼
[Request Protected API]                   [Access Token Expires]
           │                                             │
   Pass Bearer Token                              POST /auth/refresh-token
           │                                             │
   Verify Signature &                             Verify DB Refresh Token &
   Attach req.user                                Rotate Both Tokens
```

1. **Access Token**: Short-lived (15 minutes), signed with `JWT_ACCESS_SECRET`. Contains `userId`, `role`, `permissions`. Passed in `Authorization: Bearer <token>` header.
2. **Refresh Token**: Long-lived (7 days), signed with `JWT_REFRESH_SECRET`. Saved directly in `User` MongoDB record (`select: false`).
3. **Token Rotation**: On `/auth/refresh-token`, the system invalidates the old refresh token and issues a fresh pair.
4. **Session Revocation**: Logging out sets `user.refreshToken = null`, instantly revoking access across all client instances.

---

## 2. Dual-Layer RBAC Matrix Enforcement

Access control is enforced at both the Backend API level and Frontend UI level:

```
Incoming Request ──► [Backend: `auth.middleware.js`] ──► Decodes Token & Populates req.user
                            │
                            ▼
                     [Backend: `permission.middleware.js`]
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
 [Is SUPER_ADMIN?]                [Check req.user.permissions]
            │                               │
    Wildcard Bypass                 Check capability key (e.g. "patient:create")
            │                               │
            └───────────────┬───────────────┘
                            │
                            ▼
                    API Access Granted
```

### Frontend UI Gate (`usePermission.js` & `<PermissionGate>`)
- Navigation items in `Sidebar.jsx` are dynamically filtered based on `user.permissions`.
- Action buttons (+ New Patient, Edit Invoice) are guarded via `{hasPermission("patient:create") && <Button />}`.

---

## 3. Network Defense & Payload Sanitization

1. **Password Safety**: Bcrypt hashing (`salt factor 10`) enforced via Mongoose `pre("save")` hooks. Passwords have `select: false` to avoid accidental leak in queries.
2. **Zod Input Validation**: `validation.middleware.js` sanitizes `req.body`, `req.query`, and `req.params` against NoSQL injection and malformed types.
3. **Rate Limiting**: `express-rate-limit` prevents brute-force login attacks (max 100 requests per 15-minute window per IP).
4. **HTTP Security Headers**: `helmet()` attaches `X-Frame-Options: DENY`, `X-XSS-Protection`, and `Content-Security-Policy`.
5. **CORS Policy**: Restricts origin requests strictly to white-listed domain URLs.

---

## 4. Non-Blocking Audit Trail Compliance

For healthcare legal compliance, every record mutation (CREATE, UPDATE, DELETE, LOGIN, LOGOUT) triggers `createAuditLog()`:
- **Resiliency Guard**: Wrapped in a `try-catch` block that suppresses logging errors without throwing. Audit storage latency or failure will **NEVER** fail or roll back a primary clinical transaction.
- **Audit Data Captured**: `userId`, `action`, `resource`, `resourceId`, `oldValue` snapshot, `newValue` snapshot, `ipAddress`, and `userAgent`.
