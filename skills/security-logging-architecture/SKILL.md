---
name: security-logging-architecture
description: Plan centralized logging — log sources, a structured format with correlation IDs, the aggregation platform, retention by log type, tamper-proof audit trails and access to log data. Use when the user asks how to centralize their logs, how long to keep them, or needs an audit trail that auditors will trust. Not for a SIEM product rollout; see /security-siem-setup.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 3
  artifact: 03-detect.md
---

# Logging Architecture

Plan centralized logging, retention, and audit trail design for "$ARGUMENTS". Define log sources, standardize formats, design aggregation infrastructure, and establish retention policies aligned with compliance requirements.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-logging-architecture","workflow":"security","phase":3,"project":"<project>","event":"skipped","artifact":"03-detect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-logging-architecture","workflow":"security","phase":3,"project":"<project>","event":"refused","artifact":"03-detect.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-logging-architecture","workflow":"security","phase":3,"project":"<project>","event":"started","artifact":"03-detect.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Define log sources:**
   - **Application logs** — request/response logs, business logic events, error logs
   - **Infrastructure logs** — server logs, container logs, load balancer logs, CDN logs
   - **Security tool logs** — WAF, IDS/IPS, endpoint protection, vulnerability scanners
   - **Cloud provider logs** — CloudTrail, Azure Activity Log, GCP Audit Logs, VPC flow logs
   - **Database logs** — query logs, slow query logs, access logs, replication logs
   - **Identity provider logs** — authentication events, token issuance, MFA events

2. **Standardize log format:**
   - Adopt structured logging format (JSON recommended)
   - Define mandatory fields: timestamp (ISO 8601 UTC), service name, environment, log level, correlation ID, user ID (when applicable), source IP
   - Implement correlation IDs across service boundaries for request tracing
   - Sanitize logs to prevent sensitive data in log entries (PII, credentials, tokens)
   - Define log level conventions (ERROR, WARN, INFO, DEBUG) with usage guidelines

3. **Design centralized log aggregation:**
   - Evaluate aggregation platforms (ELK/OpenSearch, Splunk, CloudWatch Logs, Datadog, Sumo Logic)
   - Design collection architecture (agents, sidecars, log forwarding, direct API ingestion)
   - Plan for log volume estimation and capacity planning
   - Implement log parsing and enrichment (geo-IP, threat intelligence lookup)
   - Design search and query capabilities for incident investigation

4. **Define retention policy:**
   - **Security logs** — 1 year minimum (authentication, authorization, access control events)
   - **Audit logs** — 7 years for compliance (SOX, PCI DSS, HIPAA as applicable)
   - **Application logs** — 90 days hot storage, 1 year cold storage
   - **Infrastructure logs** — 30 days hot storage, 6 months cold storage
   - Define storage tiers (hot/warm/cold/archive) with cost optimization
   - Set automated lifecycle policies for tier transitions and deletion

5. **Protect log integrity:**
   - Store logs in immutable storage (write-once, read-many) for audit trail
   - Implement checksums or digital signatures for log entries
   - Restrict access to log data (separate from application access controls)
   - Ensure log deletion requires multi-party approval
   - Design tamper-evident log chains for high-security requirements

6. **Define access control for log data:**
   - Restrict log access by role (security team: full access, developers: own service logs, auditors: read-only)
   - Implement PII masking in log views for non-privileged users
   - Audit log access itself (who searched what, when)
   - Define self-service log access for developers within guardrails

7. **Write the artifact** — append to `.singularskills/security/<project>/03-detect.md` under a `## Logging Architecture` section. Create the file with a `# Detect — <project>` heading if it does not exist; if a `## Logging Architecture` section already exists, replace only that section. The section contains:

   - **Log Sources** — all sources with type, volume estimate, and sensitivity
   - **Log Format Standard** — mandatory fields, correlation ID strategy, and sanitization rules
   - **Aggregation Architecture** — platform selection, collection design, and capacity plan
   - **Retention Policy** — retention periods by log type with storage tier strategy
   - **Log Integrity** — immutability, checksums, and tamper protection measures
   - **Access Control** — role-based log access and PII masking approach

## Output

The logging architecture appended to `.singularskills/security/<project>/03-detect.md`. Present a summary to the user highlighting:
- Log sources to be aggregated and estimated volume
- Chosen aggregation platform and architecture
- Retention periods by log type and compliance alignment
- Log integrity and access control measures

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-logging-architecture","workflow":"security","phase":3,"project":"<project>","event":"finished","artifact":"03-detect.md","note":""}`.

This artifact is shared by every skill of phase 3 (Detect). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Detect
workflow: security
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Logging Architecture` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-logging-architecture`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Logging Architecture` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
