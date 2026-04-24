# GRC Compliance Lifecycle Guide

> Reference guide for the five-phase compliance lifecycle used across all compliance skills.

---

## Overview

The GRC (Governance, Risk, and Compliance) Compliance Lifecycle provides a structured approach to achieving and maintaining regulatory compliance. It is the **assessment and audit layer** — it evaluates organizational posture against regulatory requirements, identifies gaps, drives remediation, and provides ongoing assurance.

---

## Five Phases

### Phase 1 — Scope

**Purpose:** Define what regulations apply, what systems/processes are in scope, and establish the compliance boundary.

**Key Activities:**

- Identify applicable regulations based on industry, geography, data types, and business model
- Define organizational scope (business units, systems, data flows)
- Map data classifications and processing activities
- Establish compliance objectives and risk appetite
- Identify stakeholders and assign ownership

**Outputs:**

- `00-scope.md` — Scope definition with applicability matrix
- Regulatory inventory with prioritization
- Data flow diagrams for in-scope systems

---

### Phase 2 — Assess

**Purpose:** Evaluate current compliance posture against each applicable regulation's control requirements.

**Key Activities:**

- Map controls to regulatory requirements
- Assess current implementation status (Compliant / Partial / Non-Compliant / N/A)
- Collect and review existing evidence
- Identify gaps and weaknesses
- Score compliance maturity per regulation

**Outputs:**

- Per-regulation assessment reports (using `assessment-template.md`)
- Unified control mapping (using `control-mapping-template.md`)
- Evidence catalog (using `evidence-catalog-template.md`)
- Gap analysis with risk-ranked findings

---

### Phase 3 — Remediate

**Purpose:** Close identified gaps through policy updates, technical controls, process changes, and evidence collection.

**Key Activities:**

- Prioritize remediation by risk level and effort
- Draft or update policies, procedures, and standards
- Implement technical controls and configurations
- Collect and organize evidence artifacts
- Validate remediation effectiveness

**Outputs:**

- Remediation plans with owners and deadlines
- Updated policies and procedures
- Technical control implementation records
- Evidence packages per control

---

### Phase 4 — Certify

**Purpose:** Prepare for and support formal audits, certifications, and attestations.

**Key Activities:**

- Prepare audit-ready evidence packages
- Conduct internal pre-audit readiness assessments
- Coordinate with external auditors/assessors
- Address auditor findings and requests
- Track certification status and timelines

**Outputs:**

- Audit readiness reports
- Evidence packages organized by control
- Certification status tracking
- Auditor communication logs

---

### Phase 5 — Monitor

**Purpose:** Maintain compliance through continuous monitoring, periodic reassessment, and change management.

**Key Activities:**

- Monitor control effectiveness continuously
- Track regulatory changes and updates
- Conduct periodic reassessments
- Manage compliance-related incidents
- Report compliance status to stakeholders

**Outputs:**

- Compliance dashboards and status reports
- Regulatory change impact assessments
- Periodic reassessment schedules
- Compliance incident records

---

## Cross-Plugin Integration

The Compliance plugin reads from and complements other Metapowers plugins:

- **Legal plugin** — Compliance assessments reference legal analysis artifacts (privacy impact assessments, data processing agreements, regulatory interpretations) from `.metapowers/legal/`
- **Security plugin** — Security controls and posture assessments from `.metapowers/security/` feed directly into compliance control evaluations, avoiding duplicate work
- **Accessibility plugin** — WCAG conformance results from `.metapowers/accessibility/` map to accessibility-related compliance requirements (ADA, EN 301 549, EAA)

> **Separation of concerns:** The Security plugin implements controls (the "how"). The Compliance plugin assesses whether those controls satisfy regulatory requirements (the "does it meet the standard?"). Legal provides the regulatory interpretation layer.
