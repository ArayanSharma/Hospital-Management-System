# 05. Disaster Recovery, Monitoring & Logging

This document outlines disaster recovery targets (RPO/RTO), database replication strategies, automated backup policies, health check endpoints, and system monitoring metrics.

---

## 1. Disaster Recovery Targets (RPO & RTO)

- **Recovery Point Objective (RPO)**: **< 15 minutes**. In the event of catastrophic data corruption or infrastructure loss, no more than 15 minutes of transactional data will be lost.
- **Recovery Time Objective (RTO)**: **< 30 minutes**. Full operational restoration of backend APIs and database nodes within 30 minutes.

### Backup Strategy & Rotation Matrix

| Backup Type | Frequency | Retention Period | Storage Target |
| :--- | :--- | :--- | :--- |
| **Continuous Oplog Tail** | Real-Time | 24 Hours | MongoDB Atlas Continuous Backup |
| **Hourly DB Snapshots** | Every Hour | 7 Days | AWS S3 Encrypted Bucket (Versioned) |
| **Daily Full Backups** | Daily (02:00 AM) | 30 Days | Cold Storage (AWS Glacier / GCS) |
| **Monthly Compliance Archive** | Monthly | 7 Years | Multi-Region Encrypted Archive |

---

## 2. High Availability (HA) Database Replica Sets

```
                 ┌────────────────────────────────┐
                 │     MongoDB Primary Node       │ (Reads & Writes)
                 └───────────────┬────────────────┘
                                 │ Oplog Replication
                 ┌───────────────┴────────────────┐
                 ▼                                ▼
┌────────────────────────────────┐┌────────────────────────────────┐
│    MongoDB Secondary Node 1    ││    MongoDB Secondary Node 2    │
│    (Read Operations / Backup)  ││    (Automatic Failover Target) │
└────────────────────────────────┘└────────────────────────────────┘
```

- **3-Node Replica Set**: Guarantees zero downtime during database maintenance or node failures.
- **Automatic Election**: If the Primary node fails, Secondaries elect a new Primary within **< 10 seconds**.

---

## 3. Health Checks & System Monitoring

### Health Check Endpoint (`GET /health`)
Exposes live status of system dependencies for load balancers and uptime monitors:

```json
{
  "status": "healthy",
  "timestamp": "2026-09-09T16:10:00.000Z",
  "services": {
    "database": { "status": "up", "latencyMs": 4 },
    "redis": { "status": "up", "latencyMs": 1 },
    "cloudinary": { "status": "up" }
  },
  "uptimeSeconds": 184200
}
```

### Key Metrics Tracked (Prometheus / Grafana)
1. **HTTP Error Rate**: Percentage of 5xx server exceptions (Triggers PagerDuty if > 1%).
2. **Event Loop Latency**: Delay in Node.js event loop processing (Alerts if > 50ms).
3. **Database Connection Pool**: Active vs available Mongoose database connections.
4. **Memory RSS & Heap Usage**: Process memory consumption to catch memory leaks early.
