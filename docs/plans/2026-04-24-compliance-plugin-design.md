# Compliance Plugin Design

**Date:** 2026-04-24
**Status:** Approved
**Methodology:** GRC Compliance Lifecycle

## Overview

The master compliance assessment plugin for Metapowers. Answers "Are we compliant?" across 30+ regulations spanning security, privacy, sector-specific, AI, accessibility, and operational requirements. Implements the GRC Compliance Lifecycle with 48 skills — the largest Metapowers plugin.

**Relationship to other plugins:** Compliance is the audit/assessment layer. Legal drafts documents, Security implements controls, Compliance evaluates whether you meet the requirements. It can read artifacts from Legal and Security plugins for context.

## Methodology: GRC Compliance Lifecycle

```
Scope → Assess → Remediate → Certify → Monitor
(Phase 0) (Phase 1) (Phase 2)   (Phase 3) (Phase 4)
```

- **Scope (Phase 0):** Determine which regulations apply, map to business, prioritize, build roadmap.
- **Assess (Phase 1):** Run per-regulation compliance assessments — 30 regulation-specific skills producing individual assessment reports.
- **Remediate (Phase 2):** Aggregate gaps, map to unified controls, plan evidence collection and implementation.
- **Certify (Phase 3):** Prepare for formal audit — evidence packaging, auditor selection, certification tracking.
- **Monitor (Phase 4):** Ongoing compliance — continuous monitoring, regulatory changes, renewal calendar, reporting.

## Artifact Structure

```
.metapowers/compliance/<topic>/
  00-scope.md                    ← Applicable regulations, priorities, roadmap
  01-assess/                     ← Directory of per-regulation assessments
    soc2.md                      ← SOC 2 Type II assessment
    gdpr.md                      ← GDPR assessment
    iso27001.md                  ← ISO 27001 assessment
    hipaa.md                     ← HIPAA assessment
    ... (one file per assessed regulation)
  02-remediate.md                ← Gap register, control mapping, evidence plan
  03-certify.md                  ← Audit readiness, evidence packages, timeline
  04-monitor.md                  ← Monitoring design, regulatory watch, renewals
  skip-log.md
```

Note: Phase 1 uses a subdirectory because 30+ assessments would make a single file unmanageable.

## Skill Inventory (48 skills)

### Phase 0: Scope (4 skills)
- `regulatory-landscape` — Map all applicable regulations by jurisdiction, industry, data types
- `compliance-priorities` — Prioritize by business impact, deadline, customer demand
- `control-framework` — Select unified control framework (ISO 27001 or NIST CSF as baseline)
- `compliance-roadmap` — Build phased compliance roadmap with milestones and resources

### Phase 1: Assess — Security & Trust (4 skills)
- `nis2` — NIS2 Directive (EU 2022/2555)
- `soc2` — SOC 2 Type II
- `iso27001` — ISO/IEC 27001 ISMS
- `csa-star` — CSA STAR (Cloud Controls Matrix)

### Phase 1: Assess — ISO 27000 Family (3 skills)
- `iso27017` — ISO 27017 cloud security
- `iso27018` — ISO 27018 PII in cloud
- `iso27701` — ISO 27701 privacy extension

### Phase 1: Assess — Privacy & Data Protection (6 skills)
- `gdpr` — EU GDPR
- `uk-gdpr` — UK GDPR
- `ccpa` — CCPA/CPRA
- `us-state-privacy` — US state privacy patchwork (VCDPA, CPA, etc.)
- `lgpd` — Brazil LGPD
- `intl-privacy` — PIPEDA, PDPA, APPI

### Phase 1: Assess — Sector-Specific (6 skills)
- `hipaa` — HIPAA (healthcare)
- `hitrust` — HITRUST CSF
- `pci-dss` — PCI DSS (payment cards)
- `fedramp` — FedRAMP/StateRAMP (US government)
- `financial-compliance` — FINRA, SOX, SEC
- `dora` — DORA, PSD2, MiFID II (EU financial services)

### Phase 1: Assess — BaaS-Specific (3 skills)
- `kyc-aml` — KYC/AML/BSA
- `bank-partnership` — Partner bank compliance (OCC/FDIC)
- `payment-network` — Nacha, Visa/Mastercard, state MTLs

### Phase 1: Assess — AI & Emerging (3 skills)
- `eu-ai-act` — EU AI Act
- `iso42001` — ISO/IEC 42001 AI management
- `nist-ai-rmf` — NIST AI Risk Management Framework

### Phase 1: Assess — Accessibility (2 skills)
- `eaa-en301549` — EAA / EN 301 549
- `ada-wcag` — ADA Title III / WCAG 2.2 AA

### Phase 1: Assess — Operational (3 skills)
- `iso22301` — ISO 22301 business continuity
- `vendor-tprm` — Vendor/third-party risk management
- `breach-notification` — Breach notification requirements by jurisdiction

### Phase 2: Remediate (5 skills)
- `gap-analysis` — Aggregate findings into prioritized gap register
- `control-mapping` — Map remediations to unified controls satisfying multiple regs
- `evidence-plan` — Design evidence collection strategy
- `policy-gaps` — Identify missing/outdated policies
- `implementation-plan` — Phased control deployment plan

### Phase 3: Certify (4 skills)
- `audit-readiness` — Pre-audit readiness check
- `evidence-package` — Compile evidence packages per regulation
- `auditor-selection` — Evaluate and select audit firms
- `certification-tracker` — Track certification status and renewals

### Phase 4: Monitor (4 skills)
- `continuous-monitoring` — Automated compliance monitoring design
- `regulatory-watch` — Track regulatory changes and impact
- `renewal-calendar` — Certification renewal calendar
- `compliance-reporting` — Status reports for leadership/board/customers

### Utilities (4 skills)
- `compliance-questionnaire` — Answer customer security questionnaires (SIG, CAIQ)
- `cross-regulation-map` — Show control-to-regulation mapping
- `compliance-score` — Calculate overall compliance score
- `regulation-research` — Research specific regulation requirements

## Plugin Structure

```
plugins/compliance/
├── .claude-plugin/plugin.json
├── .mcp.json
├── hooks/ (hooks.json, check-scope-exists.sh)
├── shared/ (grc-lifecycle-guide.md, assessment-template.md, control-mapping-template.md, evidence-catalog-template.md)
├── skills/ (48 directories)
├── commands/
└── agents/
```

## Shared Templates
1. `grc-lifecycle-guide.md` — GRC lifecycle reference
2. `assessment-template.md` — Standard per-regulation assessment template
3. `control-mapping-template.md` — Unified control framework template
4. `evidence-catalog-template.md` — Evidence collection catalog

## MCP: Vanta integration (`VANTA_API_TOKEN`)
## Hooks: `check-scope-exists.sh` gates on `00-scope.md`, bypass: `COMPLIANCE_SKIP_CHECKS=1`

## Documentation
```
apps/docs/content/docs/compliance/
├── index.mdx, meta.json, scope.mdx, assess.mdx, remediate.mdx, certify.mdx, monitor.mdx, storage.mdx, examples.mdx, utilities.mdx
```

## Marketplace
```json
{
  "name": "compliance",
  "source": "./plugins/compliance",
  "description": "GRC Compliance Lifecycle — scope, assess, remediate, certify, monitor with 48 skills across 30+ regulations",
  "version": "0.1.0",
  "keywords": ["compliance", "grc", "soc2", "gdpr", "iso27001", "hipaa", "pci-dss", "fedramp", "audit"],
  "category": "compliance"
}
```
