# 01. High-Level System Architecture

This document details the high-level system architecture, client-server communication topology, architectural pattern tradeoffs, Express API gateway routing, and load balancing strategy.

---

## 1. Modular Monolith Pattern vs Microservices Tradeoffs

The HMS application is intentionally designed as a **Modular Monolith**:

```
                         ┌─────────────────────────────────┐
                         │   Modular Monolith Application  │
                         │   (Single Express Application)  │
                         │                                 │
                         │ ┌────────────┐ ┌──────────────┐ │
                         │ │    Auth    │ │   Patients   │ │
                         │ └────────────┘ └──────────────┘ │
                         │ ┌────────────┐ ┌──────────────┐ │
                         │ │    IPD     │ │   Pharmacy   │ │
                         │ └────────────┘ └──────────────┘ │
                         │ ┌────────────┐ ┌──────────────┐ │
                         │ │  Billing   │ │ Diagnostic   │ │
                         │ └────────────┘ └──────────────┘ │
                         └─────────────────────────────────┘
```

### Why Modular Monolith over Microservices?
1. **ACID Transaction Simplicity**: Medical operations like IPD bed locking and Pharmacy stock deduction require strict ACID transactions. Cross-microservice distributed transactions (Saga pattern) introduce unacceptable complexity and failure modes.
2. **Simplified Operational Overhead**: Single deployment artifact eliminating Kubernetes cluster management and gRPC inter-service networking.
3. **Strict Domain Boundaries**: 27 modules reside in isolated directories (`src/modules/*`) with clean service interfaces, allowing future extraction into microservices if hospital scale demands it.

---

## 2. End-to-End Client-Server Component Topology

```
┌─────────────────────────┐
│ React 18 SPA (Frontend) │
└────────────┬────────────┘
             │
             │ HTTPS REST Requests & Socket.IO WebSockets
             ▼
┌─────────────────────────┐
│ NGINX Reverse Proxy     │ ──► SSL Termination & Static Asset Caching
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Express API Gateway     │ ──► Cors, Helmet, Rate Limiter, Auth JWT, Permission Gate
└────────────┬────────────┘
             │
             ├──► [Module Controllers & Services (27 Modules)]
             │           │
             │           ├──► MongoDB Cluster (Primary Data Store)
             │           ├──► Redis Cache Store (SuperAdmin Stats & Session Revocation)
             │           └──► Cloudinary Storage (Lab PDFs & Radiology Images)
             │
             └──► [Socket.IO Manager] ──► Real-Time Notification Target Rooms (`user:<userId>`)
```

---

## 3. Express API Gateway & Pipeline Flow

Every incoming HTTP request passes through an Express pipeline before reaching controller methods:

1. **Security Headers**: `helmet()` attaches CSP, HSTS, and XSS headers.
2. **CORS Policy**: Configured to restrict origin requests strictly to white-listed frontend domains.
3. **Rate Limiting**: `express-rate-limit` prevents brute-force login and API abuse (100 req/15min per IP).
4. **Authentication (`authenticate`)**: Extracts Bearer token, verifies JWT signature, attaches `req.user`.
5. **Authorization (`checkPermission`)**: Checks `req.user.permissions` against required capability key.
6. **Payload Sanitization (`validate(schema)`)**: Zod validates payload parameters.
7. **Controller & Service Layer**: Pure business logic execution.
8. **Global Catcher (`errorHandler`)**: Sanitizes errors into standard `ApiResponse` JSON envelopes.

---

## 4. Multi-Level Caching Architecture

```
Client Browser ──► [Level 1: Frontend State / LocalStorage]
                          │ (Cache miss)
                          ▼
Express API   ──► [Level 2: Redis In-Memory Cache]
                          │ (Cache miss - TTL 300s)
                          ▼
MongoDB DB    ──► [Level 3: Mongoose Database Queries & Indexes]
```

- **Redis Cache Key Schema**: `hms:<module>:<resource>:<params>`
- **Invalidation Strategy**: Any mutation (CREATE, UPDATE, DELETE) in a domain triggers explicit key invalidation (`invalidatePattern("hms:dept:*")`).
