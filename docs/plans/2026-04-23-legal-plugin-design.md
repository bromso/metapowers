# Legal Plugin Design

**Date:** 2026-04-23
**Status:** Approved
**Methodology:** Legal Lifecycle Framework

## Overview

A comprehensive legal operations plugin for Metapowers implementing the Legal Lifecycle Framework. Provides 35 skills organized across 5 phases (Assess + Draft + Review + Comply + Govern) plus utilities, covering the full legal ops lifecycle from risk assessment to ongoing governance.

## Methodology: Legal Lifecycle Framework

The Legal Lifecycle follows how legal departments operate — from understanding the legal landscape to ongoing governance and compliance monitoring.

```
Assess → Draft → Review → Comply → Govern
(Phase 0) (Phase 1) (Phase 2) (Phase 3) (Phase 4)
```

- **Assess (Phase 0):** Understand the legal landscape — audit posture, identify risks, map regulations, analyze jurisdictions.
- **Draft (Phase 1):** Create legal documents — contracts, policies, terms, agreements, and licenses.
- **Review (Phase 2):** Analyze and negotiate — review contracts, detect red flags, prepare negotiation positions.
- **Comply (Phase 3):** Implement compliance — GDPR, CCPA, cookie consent, accessibility, SOC2, incident response.
- **Govern (Phase 4):** Ongoing management — track contracts, monitor compliance, handle regulatory changes, build playbooks.

## Artifact Structure

All skills write markdown artifacts to `.legal/$ARGUMENTS/`:

| File | Phase | Description |
|------|-------|-------------|
| `00-assess.md` | Assess | Legal landscape, risks, regulatory mapping, jurisdiction |
| `01-draft.md` | Draft | Contracts, policies, terms, agreements |
| `02-review.md` | Review | Contract review, clause analysis, negotiation prep |
| `03-comply.md` | Comply | GDPR, CCPA, cookie consent, data processing, SOC2 |
| `04-govern.md` | Govern | Contract management, renewals, monitoring, playbook |
| `skip-log.md` | — | Log of skipped prerequisite checks |

## Skill Inventory (35 skills)

### Phase 0: Assess (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `legal-audit` | `/legal:legal-audit <topic>` | Audit current legal posture — identify gaps in policies, contracts, and compliance |
| `risk-assessment` | `/legal:risk-assessment <topic>` | Identify and score legal risks by likelihood, impact, and jurisdiction |
| `regulatory-map` | `/legal:regulatory-map <topic>` | Map applicable regulations by jurisdiction, industry, and data type |
| `jurisdiction-analysis` | `/legal:jurisdiction-analysis <topic>` | Analyze legal requirements across jurisdictions (multi-country/state) |
| `stakeholder-needs` | `/legal:stakeholder-needs <topic>` | Identify legal needs per business unit, product, and stakeholder group |

### Phase 1: Draft (8 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `terms-of-service` | `/legal:terms-of-service <topic>` | Draft or update Terms of Service for digital products |
| `privacy-policy` | `/legal:privacy-policy <topic>` | Draft GDPR/CCPA-compliant privacy policy |
| `nda` | `/legal:nda <topic>` | Generate Non-Disclosure Agreement (mutual or one-way) |
| `saas-agreement` | `/legal:saas-agreement <topic>` | Draft SaaS subscription or licensing agreement |
| `employment-agreement` | `/legal:employment-agreement <topic>` | Draft employment contract or contractor agreement |
| `vendor-agreement` | `/legal:vendor-agreement <topic>` | Draft vendor/supplier services agreement |
| `open-source-policy` | `/legal:open-source-policy <topic>` | Create open-source usage and contribution policy |
| `cookie-policy` | `/legal:cookie-policy <topic>` | Draft cookie consent policy and banner implementation guide |

### Phase 2: Review (6 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `contract-review` | `/legal:contract-review <topic>` | Review a contract for risks, missing clauses, and unfavorable terms |
| `clause-analysis` | `/legal:clause-analysis <topic>` | Deep-dive analysis of specific contract clauses with risk scoring |
| `red-flag-detection` | `/legal:red-flag-detection <topic>` | Scan agreements for high-risk clauses and non-standard terms |
| `negotiation-prep` | `/legal:negotiation-prep <topic>` | Prepare negotiation strategy with fallback positions per clause |
| `ip-review` | `/legal:ip-review <topic>` | Review intellectual property assignments, licenses, and ownership |
| `compliance-review` | `/legal:compliance-review <topic>` | Review document for regulatory compliance (GDPR, CCPA, SOC2, etc.) |

### Phase 3: Comply (7 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `gdpr-compliance` | `/legal:gdpr-compliance <topic>` | Assess and implement GDPR compliance (data mapping, DPIA, DPA) |
| `ccpa-compliance` | `/legal:ccpa-compliance <topic>` | Assess and implement CCPA/CPRA compliance requirements |
| `data-processing-agreement` | `/legal:data-processing-agreement <topic>` | Draft Data Processing Agreement (DPA) for data processors |
| `cookie-consent` | `/legal:cookie-consent <topic>` | Design cookie consent implementation (categories, banners, tracking) |
| `accessibility-compliance` | `/legal:accessibility-compliance <topic>` | Assess legal accessibility requirements (ADA, EAA, WCAG legal) |
| `soc2-prep` | `/legal:soc2-prep <topic>` | Prepare for SOC 2 audit — policies, controls, evidence collection |
| `incident-response-plan` | `/legal:incident-response-plan <topic>` | Create data breach and security incident response plan |

### Phase 4: Govern (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `contract-tracker` | `/legal:contract-tracker <topic>` | Set up contract management — renewals, expirations, obligations |
| `compliance-monitor` | `/legal:compliance-monitor <topic>` | Design ongoing compliance monitoring and reporting cadence |
| `regulatory-updates` | `/legal:regulatory-updates <topic>` | Track and assess impact of new/changing regulations |
| `legal-playbook` | `/legal:legal-playbook <topic>` | Create standardized legal playbook for recurring scenarios |
| `training-plan` | `/legal:training-plan <topic>` | Design legal compliance training program for the team |

### Utilities (4 skills — no phase gating)

| Skill | Command | Description |
|-------|---------|-------------|
| `legal-research` | `/legal:legal-research <topic>` | Research a specific legal question with jurisdiction context |
| `clause-library` | `/legal:clause-library <topic>` | Build or extend a library of approved contract clauses |
| `decision-memo` | `/legal:decision-memo <topic>` | Document a legal decision with rationale and risk acceptance |
| `legal-glossary` | `/legal:legal-glossary <topic>` | Generate or extend a glossary of legal terms for non-lawyers |

## Plugin Structure

```
plugins/legal/
├── .claude-plugin/
│   └── plugin.json
├── .mcp.json
├── hooks/
│   ├── hooks.json
│   └── check-assess-exists.sh
├── shared/
│   ├── legal-lifecycle-guide.md
│   ├── contract-template.md
│   ├── compliance-checklist.md
│   └── risk-matrix-template.md
├── skills/
│   ├── legal-audit/SKILL.md
│   ├── risk-assessment/SKILL.md
│   ├── regulatory-map/SKILL.md
│   ├── jurisdiction-analysis/SKILL.md
│   ├── stakeholder-needs/SKILL.md
│   ├── terms-of-service/SKILL.md
│   ├── privacy-policy/SKILL.md
│   ├── nda/SKILL.md
│   ├── saas-agreement/SKILL.md
│   ├── employment-agreement/SKILL.md
│   ├── vendor-agreement/SKILL.md
│   ├── open-source-policy/SKILL.md
│   ├── cookie-policy/SKILL.md
│   ├── contract-review/SKILL.md
│   ├── clause-analysis/SKILL.md
│   ├── red-flag-detection/SKILL.md
│   ├── negotiation-prep/SKILL.md
│   ├── ip-review/SKILL.md
│   ├── compliance-review/SKILL.md
│   ├── gdpr-compliance/SKILL.md
│   ├── ccpa-compliance/SKILL.md
│   ├── data-processing-agreement/SKILL.md
│   ├── cookie-consent/SKILL.md
│   ├── accessibility-compliance/SKILL.md
│   ├── soc2-prep/SKILL.md
│   ├── incident-response-plan/SKILL.md
│   ├── contract-tracker/SKILL.md
│   ├── compliance-monitor/SKILL.md
│   ├── regulatory-updates/SKILL.md
│   ├── legal-playbook/SKILL.md
│   ├── training-plan/SKILL.md
│   ├── legal-research/SKILL.md
│   ├── clause-library/SKILL.md
│   ├── decision-memo/SKILL.md
│   └── legal-glossary/SKILL.md
├── commands/
└── agents/
```

## Shared Templates

### legal-lifecycle-guide.md
Reference guide explaining the Legal Lifecycle Framework — purpose of each phase, key activities, deliverables. Covers the relationship between compliance and contracts.

### contract-template.md
Standard contract structure template:
- Recitals (background and purpose)
- Definitions (key terms)
- Scope of Services / Grant of Rights
- Term and Termination
- Payment Terms
- Representations and Warranties
- Indemnification
- Limitation of Liability
- Confidentiality
- Intellectual Property
- Governing Law and Dispute Resolution
- General Provisions (force majeure, assignment, notices, amendments)

### compliance-checklist.md
Cross-regulation compliance checklist covering GDPR, CCPA/CPRA, SOC 2, ADA/EAA, and general data protection requirements.

### risk-matrix-template.md
Legal risk scoring template with likelihood (1-5) x impact (1-5) matrix, jurisdiction modifier, risk categories, and mitigation strategy options (avoid, transfer, mitigate, accept).

## Hooks

### check-assess-exists.sh
- Checks for `.legal/$TOPIC/00-assess.md`
- Blocks Phase 1+ skills if Assess phase incomplete
- Bypass: `LEGAL_SKIP_CHECKS=1`
- Logs bypass to `.legal/$TOPIC/skip-log.md`

### hooks.json
Empty (same pattern as research/marketing/PM plugins).

## MCP Integration

### DocuSign / CLM
- Package: `packages/legal-mcp/`
- Provides document signing and contract lifecycle management
- Configured via `.mcp.json` with `DOCUSIGN_API_KEY` env var
- Skills work without MCP (graceful degradation)

## Documentation (apps/docs)

### Structure
```
apps/docs/content/docs/legal/
├── index.mdx              # Legal Lifecycle overview, getting started
├── meta.json              # Navigation
├── assess.mdx             # Phase 0: all 5 skills
├── draft.mdx              # Phase 1: all 8 skills
├── review.mdx             # Phase 2: all 6 skills
├── comply.mdx             # Phase 3: all 7 skills
├── govern.mdx             # Phase 4: all 5 skills
└── utilities.mdx          # Utility skills: all 4
```

## Marketplace Registration

Add to `.claude-plugin/marketplace.json`:
```json
{
  "name": "legal",
  "source": "./plugins/legal",
  "description": "Legal Lifecycle Framework — assess, draft, review, comply, govern with 35 skills",
  "version": "0.1.0",
  "keywords": ["legal", "compliance", "contracts", "gdpr", "privacy", "legal-ops"],
  "category": "legal"
}
```
