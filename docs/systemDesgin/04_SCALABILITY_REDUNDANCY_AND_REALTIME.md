# 04. Scalability, Redundancy & Real-Time Architecture

This document details real-time event-driven communication via Socket.IO, Node.js non-blocking I/O event loop optimization, asynchronous email background processing, and horizontal scaling mechanisms.

---

## 1. Real-Time Socket.IO Notification Engine

To keep hospital staff informed instantly without aggressive polling, the application integrates **Socket.IO** (`src/config/socket.config.js`):

```
Mutation Event (e.g. Appointment Booked / Lab Report Ready)
                           │
                           ▼
              `notification.service.js`
                           │
                           ├──► Save Notification in MongoDB
                           └──► Socket.IO `emitNotification(userId, data)`
                                           │
                                           ▼
                       Emits `notification:new` to Target Room
                               `user:<userId>`
```

### Room & Channel Strategy
- **User Target Rooms**: `user:<userId>` (Direct alerts for specific doctors, nurses, or patients).
- **Role Broadcast Rooms**: `role:<roleName>` (Broadcast alerts for all pharmacists when low stock occurs).

---

## 2. Node.js Event Loop & Non-Blocking I/O

Node.js operates on a single-threaded Event Loop backed by `libuv` worker threads:

```
[HTTP Request] ──► Event Loop (Main Thread)
                        │
      ┌─────────────────┴─────────────────┐
      ▼                                   ▼
 [CPU Bound]                        [I/O Bound]
(Cryptographic bcrypt hashing)     (MongoDB, Redis, Socket.IO, Cloudinary)
      │                                   │
Offloaded to libuv ThreadPool     Handled Asynchronously via OS Async I/O
```

### Best Practices Enforced:
1. **Offload Heavy CPU Work**: Password hashing is delegated to `bcrypt.hash()` which uses worker threads.
2. **Never Block Event Loop**: Long-running aggregations use MongoDB aggregation pipelines or background Redis workers.

---

## 3. Asynchronous Email Queue (Resend Integration)

Email dispatching (registration welcome invites, password reset tokens, PDF invoice receipts) is executed asynchronously using **Resend SDK** (`src/utils/email/`):
- Email functions execute in background microtasks (`setImmediate` / Promises) so HTTP API controllers return success responses immediately without waiting for SMTP/Resend API latencies.

---

## 4. Horizontal Scaling & High Availability (HA)

```
                       ┌─────────────────────────┐
                       │  Load Balancer (NGINX)  │
                       └────────────┬────────────┘
                                    │ Round-Robin / IP Hash
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
┌───────────────────────┐┌───────────────────────┐┌───────────────────────┐
│ Node Instance 1 (PM2) ││ Node Instance 2 (PM2) ││ Node Instance 3 (PM2) │
└───────────┬───────────┘└───────────┬───────────┘└───────────┬───────────┘
            │                        │                        │
            └────────────────────────┼────────────────────────┘
                                     ▼
                     ┌──────────────────────────────┐
                     │ Redis Socket.IO Adapter      │
                     │ (Shares WebSocket Sockets)   │
                     └──────────────────────────────┘
```

- **PM2 Cluster Mode**: Utilizes all available CPU cores on application servers.
- **Redis Socket.IO Adapter**: Synchronizes WebSocket connection state across multiple Node.js server instances so sockets broadcast seamlessly regardless of which instance holds the connection.
