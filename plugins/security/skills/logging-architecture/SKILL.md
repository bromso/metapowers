---
description: Plan centralized logging, retention, and audit trail design
---

# Logging Architecture

Plan centralized logging, retention, and audit trail design for "$ARGUMENTS". Define log sources, standardize formats, design aggregation infrastructure, and establish retention policies aligned with compliance requirements.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

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

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/03-detect.md` with heading:

   ## Logging Architecture

   Include sections:
   - **Log Sources** — all sources with type, volume estimate, and sensitivity
   - **Log Format Standard** — mandatory fields, correlation ID strategy, and sanitization rules
   - **Aggregation Architecture** — platform selection, collection design, and capacity plan
   - **Retention Policy** — retention periods by log type with storage tier strategy
   - **Log Integrity** — immutability, checksums, and tamper protection measures
   - **Access Control** — role-based log access and PII masking approach

## Output

The logging architecture written to `.metapowers/security/$ARGUMENTS/03-detect.md`. Present a summary to the user highlighting:
- Log sources to be aggregated and estimated volume
- Chosen aggregation platform and architecture
- Retention periods by log type and compliance alignment
- Log integrity and access control measures
