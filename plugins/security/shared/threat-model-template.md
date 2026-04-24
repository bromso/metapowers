# Threat Model — {{SYSTEM_NAME}}

> **Methodology:** STRIDE  
> **Date:** {{DATE}}  
> **Author:** {{AUTHOR}}  
> **Status:** Draft | In Review | Approved  
> **Review Cycle:** Quarterly or upon significant change

---

## 1. System Description

**System name:** {{SYSTEM_NAME}}  
**Purpose:** {{Brief description of what the system does}}  
**Scope:** {{What is included/excluded from this threat model}}  
**Technology stack:** {{Languages, frameworks, infrastructure}}  
**Deployment model:** {{Cloud / On-prem / Hybrid — region and provider}}

---

## 2. Data Flow Diagram

```
┌──────────┐     HTTPS/TLS      ┌──────────────┐     gRPC/mTLS      ┌──────────┐
│  Client   │ ─────────────────► │  API Gateway  │ ──────────────────► │ Service  │
│ (Browser) │                    │  (Public)     │                    │ (Private) │
└──────────┘                    └──────┬───────┘                    └─────┬────┘
                                       │                                   │
                                       │ OAuth 2.0                         │ SQL/TLS
                                       ▼                                   ▼
                                ┌──────────────┐                    ┌──────────┐
                                │   Identity    │                    │ Database │
                                │   Provider    │                    │ (Private) │
                                └──────────────┘                    └──────────┘
```

> Replace the diagram above with the actual data flow for the system under review.

---

## 3. Assets

| # | Asset | Classification | Owner | Storage Location | Notes |
|---|-------|---------------|-------|-----------------|-------|
| A1 | {{Asset name}} | Public / Internal / Confidential / Restricted | {{Team or person}} | {{Where stored}} | {{Additional context}} |
| A2 | | | | | |
| A3 | | | | | |

---

## 4. Trust Boundaries

| # | Boundary | Description | Crossing Points |
|---|----------|-------------|-----------------|
| TB1 | Internet ↔ DMZ | Traffic crosses from untrusted internet to the public-facing edge | API Gateway, CDN, Load Balancer |
| TB2 | DMZ ↔ Internal Network | Traffic crosses from edge services to internal microservices | Service mesh ingress, VPN |
| TB3 | Application ↔ Data Store | Application layer accesses persistent storage | Database connections, object storage API |
| TB4 | {{Custom boundary}} | {{Description}} | {{Crossing points}} |

---

## 5. Threats (STRIDE Analysis)

### Spoofing

| # | Threat | Component | Risk Rating | Mitigation |
|---|--------|-----------|-------------|------------|
| S1 | Attacker impersonates legitimate user via stolen credentials | Authentication service | {{Critical/High/Medium/Low}} | MFA enforcement, credential rotation policy |
| S2 | API caller forges identity header | API Gateway | {{Rating}} | Mutual TLS, signed JWT validation |
| S3 | | | | |

### Tampering

| # | Threat | Component | Risk Rating | Mitigation |
|---|--------|-----------|-------------|------------|
| T1 | Man-in-the-middle modifies request payload | Network edge | {{Rating}} | TLS 1.3 enforcement, certificate pinning |
| T2 | Unauthorized modification of database records | Database | {{Rating}} | Row-level access control, audit logging |
| T3 | | | | |

### Repudiation

| # | Threat | Component | Risk Rating | Mitigation |
|---|--------|-----------|-------------|------------|
| R1 | User denies performing a destructive action | Application layer | {{Rating}} | Immutable audit log with user identity, timestamp, and action |
| R2 | Admin changes configuration without attribution | Infrastructure | {{Rating}} | Infrastructure-as-code with signed commits, change management |
| R3 | | | | |

### Information Disclosure

| # | Threat | Component | Risk Rating | Mitigation |
|---|--------|-----------|-------------|------------|
| I1 | Sensitive data exposed in API error responses | API endpoints | {{Rating}} | Structured error handling, no stack traces in production |
| I2 | Secrets leaked in application logs | Logging pipeline | {{Rating}} | Secret scanning, log redaction rules |
| I3 | | | | |

### Denial of Service

| # | Threat | Component | Risk Rating | Mitigation |
|---|--------|-----------|-------------|------------|
| D1 | Volumetric DDoS overwhelms public endpoints | API Gateway / CDN | {{Rating}} | Rate limiting, WAF, auto-scaling, DDoS protection service |
| D2 | Resource exhaustion via expensive queries | Database | {{Rating}} | Query timeout limits, connection pooling, read replicas |
| D3 | | | | |

### Elevation of Privilege

| # | Threat | Component | Risk Rating | Mitigation |
|---|--------|-----------|-------------|------------|
| E1 | IDOR allows user to access another user's resources | API authorization layer | {{Rating}} | Object-level authorization checks, ownership validation |
| E2 | Container escape to host OS | Container runtime | {{Rating}} | Non-root containers, seccomp profiles, runtime security monitoring |
| E3 | | | | |

---

## 6. Risk Rating Matrix

Combine **Likelihood** and **Impact** to determine the overall risk rating for each threat.

| | Impact: Low | Impact: Medium | Impact: High | Impact: Critical |
|---|---|---|---|---|
| **Likelihood: High** | Medium | High | Critical | Critical |
| **Likelihood: Medium** | Low | Medium | High | Critical |
| **Likelihood: Low** | Low | Low | Medium | High |
| **Likelihood: Very Low** | Low | Low | Low | Medium |

### Likelihood Factors

- **High:** Easily exploitable, public exploit exists, no authentication required
- **Medium:** Requires some skill or access, known vulnerability class
- **Low:** Requires significant skill, insider access, or chained exploits
- **Very Low:** Theoretical, requires nation-state capabilities or physical access

### Impact Factors

- **Critical:** Complete system compromise, mass data breach, regulatory action
- **High:** Significant data exposure, extended outage, financial loss
- **Medium:** Limited data exposure, degraded service, contained blast radius
- **Low:** Minimal impact, no sensitive data involved, quickly recoverable

---

## 7. Mitigations Summary

| # | Mitigation | Addresses Threats | Priority | Status | Owner |
|---|-----------|-------------------|----------|--------|-------|
| M1 | {{Mitigation description}} | S1, T1 | P1 / P2 / P3 | Not Started / In Progress / Complete | {{Owner}} |
| M2 | | | | | |
| M3 | | | | | |

---

## 8. Residual Risks

Risks that remain after all planned mitigations are implemented.

| # | Residual Risk | Related Threats | Accepted By | Justification | Review Date |
|---|--------------|-----------------|-------------|---------------|-------------|
| RR1 | {{Description of remaining risk}} | {{Threat IDs}} | {{Name and role}} | {{Why this risk is accepted}} | {{Next review}} |
| RR2 | | | | | |

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Security Lead | | | |
| Engineering Lead | | | |
| Product Owner | | | |
