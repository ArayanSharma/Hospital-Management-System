# Hospital Management System - System Design Documentation Index

Welcome to the official **System Design & Architecture Specification Suite** for the Hospital Management System (HMS). This documentation details high-level and low-level system design patterns, capacity estimations, database architecture, multi-tier security, real-time WebSocket communication, scalability, and disaster recovery for enterprise hospital deployments.

---

## 📚 System Design Guides Index

Click on any section to open the detailed system design guide:

| # | System Design Guide | Primary Topics Covered |
| :-: | :--- | :--- |
| **00** | **[00. System Requirements & Capacity](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/systemDesgin/00_SYSTEM_REQUIREMENTS_AND_CAPACITY.md)** | Functional vs Non-Functional Requirements, Latency SLAs (<100ms), 99.99% Availability, DAU/MAU traffic estimations, database storage projections, and bandwidth calculations. |
| **01** | **[01. High-Level Architecture](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/systemDesgin/01_HIGH_LEVEL_SYSTEM_ARCHITECTURE.md)** | Monolith vs Microservices tradeoffs, Express API gateway, Client-Server interactions, Load balancing strategies, and Multi-level caching. |
| **02** | **[02. Data Architecture & Storage Strategy](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/systemDesgin/02_DATA_ARCHITECTURE_AND_STORAGE_STRATEGY.md)** | MongoDB document schemas, Mongoose ACID session transactions, Redis cache invalidation strategies (`hms:superadmin:dashboard:*`), and Cloudinary object storage. |
| **03** | **[03. Security, RBAC & Compliance](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/systemDesgin/03_SECURITY_RBAC_AND_COMPLIANCE.md)** | Dual-layer JWT token rotation, Bcrypt password hashing (`cost 10`), RBAC matrix, Zod payload sanitization, DDoS Rate limiting, CORS, Helmet, and non-blocking Audit Log compliance. |
| **04** | **[04. Scalability, Redundancy & Real-Time](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/systemDesgin/04_SCALABILITY_REDUNDANCY_AND_REALTIME.md)** | Socket.IO WebSocket real-time notification engine (`user:<userId>`), Node.js Event Loop non-blocking I/O, async Resend email workers, and horizontal scaling. |
| **05** | **[05. Disaster Recovery, Monitoring & Logging](file:///c:/Users/Arayan/OneDrive/Documents/HospitalMS/docs/systemDesgin/05_DISASTER_RECOVERY_MONITORING_AND_LOGGING.md)** | Disaster recovery plans (RPO/RTO goals), MongoDB replica set failover, automated backup policies, `/health` check endpoints, and metric tracking. |

---

## 🏛️ High-Level System Architecture Diagram

```
                               ┌──────────────────────────┐
                               │   Client Applications    │
                               │  (React 18 SPA / Vite)   │
                               └────────────┬─────────────┘
                                            │ HTTPS / WebSockets
                                            ▼
                               ┌──────────────────────────┐
                               │     Load Balancer        │ (NGINX / Cloudflare)
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │   Express API Gateway    │ (Node.js Cluster)
                               └──────┬──────┬──────┬─────┘
                                      │      │      │
            ┌─────────────────────────┘      │      └────────────────────────┐
            ▼                                ▼                               ▼
┌───────────────────────┐        ┌───────────────────────┐       ┌───────────────────────┐
│     MongoDB Cluster   │        │     Redis Cache       │       │    Cloud Storage      │
│ (Mongoose ODM / ACID) │        │ (Dashboard Stats 300s)│       │  (Cloudinary PDFs/Scans)│
└───────────────────────┘        └───────────────────────┘       └───────────────────────┘
```
