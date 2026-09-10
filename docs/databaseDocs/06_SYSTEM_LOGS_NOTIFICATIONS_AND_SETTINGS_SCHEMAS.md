# 06. System Logs, Notifications & Settings Schemas Documentation

This document provides complete Mongoose schema specifications for security audit trails, real-time user notifications, and global hospital configurations:
1. **`AuditLog` (`auditlogs`)**
2. **`Notification` (`notifications`)**
3. **`Setting` (`settings`)**

---

## 1. AuditLog Model (`AuditLog` -> `auditlogs` collection)

### Mongoose File Path
`src/modules/audit-logs/audit-log.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `userId` | `ObjectId` | Ref: `User` | `null` | User who triggered mutation (null for system jobs) |
| `action` | `String` | Enum: `["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"]` | N/A | Mutation / Event category |
| `resource` | `String` | Required, trim | N/A | Target entity collection (e.g. `"patient"`, `"invoice"`) |
| `resourceId` | `Schema.Types.Mixed`| ObjectId / String | `null` | Modified document ID |
| `oldValue` | `Object` | Object / JSON snapshot | `null` | Pre-mutation document state snapshot |
| `newValue` | `Object` | Object / JSON snapshot | `null` | Post-mutation document state snapshot |
| `ipAddress` | `String` | Trim | `""` | Client HTTP IP Address |
| `userAgent` | `String` | Trim | `""` | Client Browser User-Agent header |
| `createdAt` | `Date` | Auto ISO timestamp, indexed | `Date.now` | Audit event timestamp |

---

## 2. Notification Model (`Notification` -> `notifications` collection)

### Mongoose File Path
`src/modules/notifications/notification.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `userId` | `ObjectId` | Required, ref: `User` | N/A | Recipient user account ID |
| `type` | `String` | Enum: `["appointment", "prescription", "lab", "inventory", "system"]` | N/A | Alert category |
| `title` | `String` | Required, trim | N/A | Short notification header |
| `message` | `String` | Required, trim | N/A | Detailed alert payload body |
| `isRead` | `Boolean` | Boolean flag | `false` | Read status indicator |
| `metadata` | `Object` | Arbitrary JSON key-value pairs | `{}` | Optional payload context (e.g. `{ appointmentId: "..." }`) |
| `createdAt` | `Date` | Auto ISO timestamp | `Date.now` | Notification dispatch timestamp |

---

## 3. Setting Model (`Setting` -> `settings` collection)

### Mongoose File Path
`src/modules/settings/setting.model.js`

### Schema Definition & Field Matrix

| Field Name | Data Type | Validation / Constraints | Default Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated Primary Key | Auto | Unique Identifier |
| `hospitalName` | `String` | Required, trim | `"CityCare Hospital"` | Institution legal name |
| `logoUrl` | `String` | Cloudinary URL | `""` | Hospital brand logo URL |
| `address` | `String` | Trim | `""` | Official physical address |
| `contactEmail` | `String` | Lowercase, trim | `""` | Official support email |
| `contactPhone` | `String` | Trim | `""` | Official telephone number |
| `currency` | `String` | Trim | `"INR"` | System currency code / symbol |
| `taxRate` | `Number` | Min 0, max 100 | `18` | Default tax percentage for invoices |
| `appointmentSlotDuration`| `Number` | Min 5, max 120 | `15` | Default slot duration in minutes |
| `updatedAt` | `Date` | Auto ISO timestamp | `Date.now` | Settings update timestamp |
