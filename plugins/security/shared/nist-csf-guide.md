# NIST Cybersecurity Framework 2.0 — Reference Guide

## Core Concepts

The NIST CSF 2.0 organizes cybersecurity activities into a structured hierarchy:

- **Functions** — The highest-level grouping of cybersecurity outcomes (6 functions)
- **Categories** — Subdivisions of each function into groups of related outcomes
- **Subcategories** — Specific outcome statements that support each category
- **Implementation Tiers** — Describe the degree of rigor in cybersecurity risk management (Tier 1–4)

### Implementation Tiers

| Tier | Name | Description |
|------|------|-------------|
| 1 | Partial | Ad hoc, reactive; limited awareness of cybersecurity risk |
| 2 | Risk Informed | Risk management approved by leadership but not org-wide policy |
| 3 | Repeatable | Formally approved policies; practices regularly updated |
| 4 | Adaptive | Organization adapts practices based on lessons learned and predictive indicators |

---

## Function 1: Govern (GV)

**Purpose:** Establish and monitor the organization's cybersecurity risk management strategy, expectations, and policy. Governance provides the context for how an organization manages and reduces cybersecurity risk.

### Key Activities

- Define organizational cybersecurity risk management strategy
- Establish roles, responsibilities, and authorities
- Maintain cybersecurity policy aligned with business objectives
- Oversee cybersecurity supply chain risk management
- Integrate cybersecurity into enterprise risk management

### Categories

| ID | Category | Description |
|----|----------|-------------|
| GV.OC | Organizational Context | Mission, stakeholder expectations, and legal/regulatory requirements are understood |
| GV.RM | Risk Management Strategy | Priorities, constraints, risk tolerance, and appetite are established |
| GV.RR | Roles, Responsibilities & Authorities | Cybersecurity roles and accountability are defined |
| GV.PO | Policy | Organizational cybersecurity policy is established and communicated |
| GV.OV | Oversight | Results of cybersecurity risk management are used to inform and adjust strategy |
| GV.SC | Cybersecurity Supply Chain Risk Management | Supply chain risks are identified, assessed, and managed |

### Success Metrics

- Risk appetite statement formally documented and board-approved
- 100% of cybersecurity roles mapped with named accountable owners
- Policy review cycle established (at least annually)
- Supply chain risk assessment completed for all critical vendors

---

## Function 2: Identify (ID)

**Purpose:** Understand the organization's current cybersecurity risks. Knowing assets, suppliers, vulnerabilities, and threats enables risk prioritization aligned with strategy.

### Key Activities

- Maintain asset inventories (hardware, software, data, services)
- Identify and document business environment and critical processes
- Assess vulnerabilities across the technology estate
- Conduct threat intelligence analysis
- Perform risk assessments

### Categories

| ID | Category | Description |
|----|----------|-------------|
| ID.AM | Asset Management | Assets that enable the organization's business are identified and managed |
| ID.RA | Risk Assessment | The organization understands cybersecurity risks to operations, assets, and individuals |
| ID.IM | Improvement | Improvements to cybersecurity risk management are identified from evaluations, testing, and operational experience |

### Success Metrics

- Asset inventory coverage >= 95% of known infrastructure
- Risk assessments completed for all critical systems (quarterly)
- Threat intelligence feeds integrated and reviewed weekly
- Vulnerability backlog age < 30 days for critical findings

---

## Function 3: Protect (PR)

**Purpose:** Use safeguards to manage cybersecurity risks. Once risks are identified, Protect supports the ability to secure assets and prevent or lower the likelihood and impact of adverse events.

### Key Activities

- Manage identity, authentication, and access control
- Train and raise security awareness for all personnel
- Secure data through encryption, classification, and handling procedures
- Harden platform and infrastructure security
- Manage technology lifecycle and resilience

### Categories

| ID | Category | Description |
|----|----------|-------------|
| PR.AA | Identity Management, Authentication & Access Control | Access is limited to authorized users, services, and hardware |
| PR.AT | Awareness & Training | Personnel are trained to perform cybersecurity duties |
| PR.DS | Data Security | Data is managed consistently with risk strategy to protect confidentiality, integrity, and availability |
| PR.PS | Platform Security | Hardware, software, and services are managed consistently with risk strategy |
| PR.IR | Technology Infrastructure Resilience | Security architectures support asset and system resilience |

### Success Metrics

- MFA enforced for 100% of privileged and remote access accounts
- Security awareness training completion rate >= 95% annually
- Data classification applied to all repositories containing sensitive data
- Mean time to patch critical vulnerabilities < 72 hours

---

## Function 4: Detect (DE)

**Purpose:** Find and analyze possible cybersecurity attacks and compromises. Detection enables timely discovery and analysis of anomalies, indicators of compromise, and adverse events.

### Key Activities

- Continuously monitor networks, systems, and assets for anomalies
- Analyze events to characterize known attacks and indicators of compromise
- Integrate detection information from multiple sources
- Declare security incidents when detection thresholds are met

### Categories

| ID | Category | Description |
|----|----------|-------------|
| DE.CM | Continuous Monitoring | Assets are monitored to find anomalies, indicators of compromise, and other potentially adverse events |
| DE.AE | Adverse Event Analysis | Anomalies, indicators of compromise, and other potentially adverse events are analyzed to characterize the events and detect cybersecurity incidents |

### Success Metrics

- Mean time to detect (MTTD) < 24 hours for critical threats
- Security event correlation coverage >= 90% of critical assets
- False positive rate < 5% for high-severity alerts
- Detection rules reviewed and updated monthly

---

## Function 5: Respond (RS)

**Purpose:** Take action regarding a detected cybersecurity incident. Respond supports the ability to contain the impact of cybersecurity incidents.

### Key Activities

- Execute incident response plans
- Triage, analyze, and prioritize incidents
- Contain and eradicate threats
- Coordinate incident reporting and communication
- Conduct forensic analysis

### Categories

| ID | Category | Description |
|----|----------|-------------|
| RS.MA | Incident Management | Responses to detected cybersecurity incidents are managed |
| RS.AN | Incident Analysis | Investigations are conducted to ensure effective response and support forensics and recovery activities |
| RS.CO | Incident Response Reporting & Communication | Response activities are coordinated with internal and external stakeholders |
| RS.MI | Incident Mitigation | Activities are performed to prevent expansion of an event and to mitigate its effects |

### Success Metrics

- Mean time to respond (MTTR) < 4 hours for P1 incidents
- Incident response plan tested via tabletop exercise at least semi-annually
- All P1/P2 incidents have documented post-incident reviews
- Stakeholder communication initiated within defined SLA windows

---

## Function 6: Recover (RC)

**Purpose:** Restore assets and operations affected by a cybersecurity incident. Recovery supports timely restoration to reduce the impact of cybersecurity incidents.

### Key Activities

- Execute recovery plans
- Restore systems and data from known-good states
- Verify integrity of restored systems
- Communicate recovery status to stakeholders
- Incorporate lessons learned into future planning

### Categories

| ID | Category | Description |
|----|----------|-------------|
| RC.RP | Incident Recovery Plan Execution | Restoration activities are performed to ensure operational availability of systems and services affected by cybersecurity incidents |
| RC.CO | Incident Recovery Communication | Restoration activities are coordinated with internal and external parties |

### Success Metrics

- Recovery time objective (RTO) met for all critical systems
- Recovery point objective (RPO) met with < 1 hour of data loss for Tier 1 systems
- Recovery plans tested at least annually with documented results
- Lessons learned incorporated into updated procedures within 30 days

---

## Quick Reference: Function Flow

```
GOVERN ──────────────────────────────────────────────
   │  (cross-cutting oversight of all functions)
   │
   ├── IDENTIFY → Know your assets, risks, threats
   │
   ├── PROTECT  → Safeguards to manage risks
   │
   ├── DETECT   → Find attacks and anomalies
   │
   ├── RESPOND  → Act on detected incidents
   │
   └── RECOVER  → Restore affected operations
```

> **Note:** Govern is unique as a cross-cutting function that informs and guides all other five functions. The remaining functions follow the logical sequence of cybersecurity risk management from identification through recovery.
