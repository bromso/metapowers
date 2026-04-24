---
description: Design disaster recovery and system restoration procedures
---

# Recovery Plan

Design disaster recovery and system restoration procedures for "$ARGUMENTS" with recovery priorities, restoration procedures per system type, RTO/RPO targets, and recovery verification.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `plugins/security/shared/incident-response-template.md` for recovery workflow reference
   - Read `.metapowers/security/$ARGUMENTS/00-govern.md` for organizational context and business impact analysis

2. **Define recovery priorities:**
   - Rank systems by business criticality (Tier 1: mission-critical, Tier 2: important, Tier 3: supporting)
   - **Tier 1** — systems whose failure causes immediate revenue loss or safety risk (payment processing, authentication, core API)
   - **Tier 2** — systems causing significant operational impact within hours (email, internal tools, monitoring)
   - **Tier 3** — systems with lower urgency (development environments, reporting, analytics)
   - Map dependencies between systems to determine restoration order
   - Identify critical path: which systems must be restored first to unblock others

3. **Create restoration procedures per system type:**

   **Database restoration:**
   - Point-in-time recovery from transaction logs
   - Full restore from latest backup plus replay of transaction logs
   - Failover to read replica promoted to primary
   - Data integrity verification after restoration (checksum validation, row counts, referential integrity)

   **Application restoration:**
   - Redeployment from container images or build artifacts (known-good version)
   - Configuration restoration from version-controlled config
   - Secret and credential restoration from vault/KMS
   - Health check verification before accepting traffic

   **Infrastructure restoration:**
   - Infrastructure-as-code redeployment (Terraform, CloudFormation, Pulumi)
   - DNS failover to disaster recovery site
   - Network configuration restoration (VPN, firewall rules, load balancer config)
   - Certificate and key restoration

4. **Set RTO and RPO per system:**
   - **RTO (Recovery Time Objective)** — maximum acceptable downtime
     - Tier 1: 15 minutes to 1 hour
     - Tier 2: 1–4 hours
     - Tier 3: 4–24 hours
   - **RPO (Recovery Point Objective)** — maximum acceptable data loss
     - Tier 1: zero to 5 minutes (real-time replication)
     - Tier 2: 1–4 hours (frequent backups)
     - Tier 3: 24 hours (daily backups)
   - Document justification for each target based on business impact

5. **Plan communication during recovery:**
   - Define status page updates and customer communication cadence
   - Internal communication: recovery progress updates every 30 minutes for Tier 1
   - Stakeholder notifications: who to inform at each recovery milestone
   - Define go/no-go decision points for failover and failback

6. **Define recovery verification:**
   - **Functional verification** — automated test suites against restored systems
   - **Data verification** — integrity checks, sampling, and reconciliation
   - **Performance verification** — load testing to confirm restored systems meet SLAs
   - **Security verification** — confirm patching, credential rotation, and monitoring are active
   - Define observation period before declaring recovery complete
   - Plan for failback from DR site to primary (if applicable)

7. **Write the artifact** to `.metapowers/security/$ARGUMENTS/05-recover.md` with heading:

   ## Recovery Plan

   Include sections:
   - **Recovery Priorities** — tiered system ranking with dependencies and critical path
   - **Restoration Procedures** — step-by-step per system type (database, application, infrastructure)
   - **RTO/RPO Targets** — per system with justification
   - **Communication Plan** — stakeholder updates during recovery
   - **Recovery Verification** — functional, data, performance, and security checks
   - **Failback Plan** — return to primary site procedures

## Output

The recovery plan written to `.metapowers/security/$ARGUMENTS/05-recover.md`. Present a summary to the user highlighting:
- System recovery priorities and critical path dependencies
- RTO/RPO targets per tier
- Key restoration procedures per system type
- Recovery verification checkpoints
