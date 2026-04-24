# Cybersecurity Plugin Design

**Date:** 2026-04-24
**Status:** Approved
**Methodology:** NIST Cybersecurity Framework 2.0

## Overview

A comprehensive cybersecurity plugin for Metapowers implementing the NIST CSF 2.0. Provides 39 skills organized across 6 phases (Govern + 5 NIST functions) plus utilities, covering application security, cloud security, incident response, compliance, and security operations.

## Methodology: NIST CSF 2.0

```
Govern → Identify → Protect → Detect → Respond → Recover
(Phase 0) (Phase 1)  (Phase 2) (Phase 3) (Phase 4) (Phase 5)
```

- **Govern (Phase 0):** Establish security governance — policies, risk appetite, roles, supply chain, culture.
- **Identify (Phase 1):** Understand your security posture — assets, threats, vulnerabilities, attack surface, data classification.
- **Protect (Phase 2):** Implement safeguards — secure coding, dependencies, secrets, access, encryption, APIs, containers, IaC.
- **Detect (Phase 3):** Discover threats — monitoring, logging, anomaly detection, security testing, SIEM.
- **Respond (Phase 4):** Act on incidents — response plans, forensics, communication, containment, lessons learned.
- **Recover (Phase 5):** Restore operations — recovery plans, backups, business continuity, resilience improvements.

## Artifact Structure

All skills write to `.metapowers/security/$ARGUMENTS/`:

| File | Phase | Description |
|------|-------|-------------|
| `00-govern.md` | Govern | Security policy, risk appetite, roles, supply chain, culture |
| `01-identify.md` | Identify | Assets, threats, vulnerabilities, attack surface, data classification |
| `02-protect.md` | Protect | Secure coding, dependencies, secrets, access, encryption, APIs |
| `03-detect.md` | Detect | Monitoring, logging, anomaly detection, security testing |
| `04-respond.md` | Respond | Incident response, forensics, containment, communication |
| `05-recover.md` | Recover | Recovery plans, backups, business continuity, improvements |
| `skip-log.md` | — | Log of skipped prerequisite checks |

## Skill Inventory (39 skills)

### Phase 0: Govern (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `security-policy` | `/security:security-policy <topic>` | Define organizational security policies, standards, and procedures |
| `risk-appetite` | `/security:risk-appetite <topic>` | Establish risk tolerance levels and acceptance criteria |
| `security-roles` | `/security:security-roles <topic>` | Define security roles, responsibilities, and RACI matrix |
| `supply-chain-security` | `/security:supply-chain-security <topic>` | Assess and manage third-party and supply chain security risks |
| `security-culture` | `/security:security-culture <topic>` | Design security awareness program and culture-building initiatives |

### Phase 1: Identify (7 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `asset-inventory` | `/security:asset-inventory <topic>` | Catalog hardware, software, data, and service assets with criticality |
| `threat-model` | `/security:threat-model <topic>` | Model threats using STRIDE, PASTA, or attack trees |
| `vulnerability-assessment` | `/security:vulnerability-assessment <topic>` | Identify and classify vulnerabilities across systems and code |
| `risk-assessment` | `/security:risk-assessment <topic>` | Score and prioritize security risks (likelihood x impact) |
| `attack-surface` | `/security:attack-surface <topic>` | Map and minimize the attack surface (endpoints, APIs, ports, services) |
| `data-classification` | `/security:data-classification <topic>` | Classify data by sensitivity (public, internal, confidential, restricted) |
| `compliance-gap` | `/security:compliance-gap <topic>` | Assess gaps against security frameworks (ISO 27001, NIST, SOC 2, CIS) |

### Phase 2: Protect (8 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `secure-coding` | `/security:secure-coding <topic>` | Review code for OWASP Top 10 vulnerabilities and secure coding practices |
| `dependency-scan` | `/security:dependency-scan <topic>` | Audit dependencies for known CVEs and license risks |
| `secrets-management` | `/security:secrets-management <topic>` | Design secrets management strategy (rotation, storage, access) |
| `access-control` | `/security:access-control <topic>` | Design IAM, RBAC/ABAC, least privilege, and MFA strategy |
| `encryption-strategy` | `/security:encryption-strategy <topic>` | Plan encryption at rest, in transit, and key management |
| `api-security` | `/security:api-security <topic>` | Audit API security (auth, rate limiting, input validation, CORS) |
| `container-security` | `/security:container-security <topic>` | Secure container images, registries, runtime, and orchestration |
| `iac-security` | `/security:iac-security <topic>` | Scan infrastructure-as-code for misconfigurations |

### Phase 3: Detect (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `monitoring-strategy` | `/security:monitoring-strategy <topic>` | Design security monitoring, alerting, and observability |
| `logging-architecture` | `/security:logging-architecture <topic>` | Plan centralized logging, retention, and audit trail design |
| `anomaly-detection` | `/security:anomaly-detection <topic>` | Define behavioral baselines and anomaly detection rules |
| `security-testing` | `/security:security-testing <topic>` | Plan SAST, DAST, SCA, and penetration testing program |
| `siem-setup` | `/security:siem-setup <topic>` | Design SIEM architecture, correlation rules, and dashboards |

### Phase 4: Respond (5 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `incident-response` | `/security:incident-response <topic>` | Create incident response plan with severity levels and playbooks |
| `forensic-readiness` | `/security:forensic-readiness <topic>` | Design forensic data collection, preservation, and chain of custody |
| `incident-communication` | `/security:incident-communication <topic>` | Draft communication templates (internal, customers, regulators, media) |
| `containment-strategy` | `/security:containment-strategy <topic>` | Define containment, eradication, and isolation procedures |
| `lessons-learned` | `/security:lessons-learned <topic>` | Conduct post-incident review with root cause and improvement actions |

### Phase 5: Recover (4 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| `recovery-plan` | `/security:recovery-plan <topic>` | Design disaster recovery and system restoration procedures |
| `backup-validation` | `/security:backup-validation <topic>` | Plan backup strategy, testing, and restoration verification |
| `business-continuity` | `/security:business-continuity <topic>` | Create business continuity plan with RPO/RTO targets |
| `resilience-improvement` | `/security:resilience-improvement <topic>` | Identify and implement improvements from incidents and tests |

### Utilities (5 skills — no phase gating)

| Skill | Command | Description |
|-------|---------|-------------|
| `security-checklist` | `/security:security-checklist <topic>` | Generate security checklist for a specific context |
| `threat-intel` | `/security:threat-intel <topic>` | Research threat intelligence for a specific technology or threat actor |
| `compliance-map` | `/security:compliance-map <topic>` | Map controls to compliance frameworks (ISO 27001, NIST, SOC 2, CIS) |
| `security-training` | `/security:security-training <topic>` | Design security training program by role |
| `pentest-plan` | `/security:pentest-plan <topic>` | Plan penetration testing scope, methodology, and rules of engagement |

## Plugin Structure

```
plugins/security/
├── .claude-plugin/plugin.json
├── .mcp.json
├── hooks/
│   ├── hooks.json
│   └── check-govern-exists.sh
├── shared/
│   ├── nist-csf-guide.md
│   ├── threat-model-template.md
│   ├── incident-response-template.md
│   └── security-controls-matrix.md
├── skills/ (39 directories)
├── commands/
└── agents/
```

## Shared Templates

1. **nist-csf-guide.md** — NIST CSF 2.0 reference guide
2. **threat-model-template.md** — STRIDE-based threat model template
3. **incident-response-template.md** — IR plan template with severity levels
4. **security-controls-matrix.md** — Controls mapped to NIST, ISO 27001, SOC 2, CIS

## Hooks

- `check-govern-exists.sh` — Gates Phase 1+ on `00-govern.md`. Bypass: `SECURITY_SKIP_CHECKS=1`
- `hooks.json` — Empty

## MCP Integration

- Package: `packages/security-mcp/`
- Snyk integration for vulnerability scanning
- `SNYK_API_TOKEN` env var

## Documentation

```
apps/docs/content/docs/security/
├── index.mdx, meta.json
├── govern.mdx, identify.mdx, protect.mdx, detect.mdx, respond.mdx, recover.mdx
├── storage.mdx, examples.mdx, utilities.mdx
```

## Additional Updates

- Add domain card to landing page `app/(home)/page.tsx`
- Add `"security"` to root `apps/docs/content/docs/meta.json`
- Register in `.claude-plugin/marketplace.json`

## Marketplace Registration

```json
{
  "name": "security",
  "source": "./plugins/security",
  "description": "NIST CSF 2.0 cybersecurity framework — govern, identify, protect, detect, respond, recover with 39 skills",
  "version": "0.1.0",
  "keywords": ["security", "cybersecurity", "nist", "owasp", "appsec", "incident-response"],
  "category": "security"
}
```
