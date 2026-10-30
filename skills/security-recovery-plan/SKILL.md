---
name: security-recovery-plan
description: Design disaster recovery for IT systems — restore priorities and dependencies, restoration steps for databases, applications and infrastructure, RTO and RPO per system, and verification. Use when the user asks how to restore their systems after an outage, attack or region failure, and in what order. Not for keeping business functions running; see /security-business-continuity.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 5
  artifact: 05-recover.md
---

# Recovery Plan

Design disaster recovery and system restoration procedures for "$ARGUMENTS" with recovery priorities, restoration procedures per system type, RTO/RPO targets, and recovery verification.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-recovery-plan","workflow":"security","phase":5,"project":"<project>","event":"skipped","artifact":"05-recover.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 5 (Recover) of the NIST CSF workflow (`security`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-recovery-plan","workflow":"security","phase":5,"project":"<project>","event":"refused","artifact":"05-recover.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-recovery-plan","workflow":"security","phase":5,"project":"<project>","event":"started","artifact":"05-recover.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/incident-response-template.md` for recovery workflow reference
   - Read `.singularskills/security/<project>/00-govern.md` for organizational context and business impact analysis

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

7. **Write the artifact** — append to `.singularskills/security/<project>/05-recover.md` under a `## Recovery Plan` section. Create the file with a `# Recover — <project>` heading if it does not exist; if a `## Recovery Plan` section already exists, replace only that section. The section contains:

   - **Recovery Priorities** — tiered system ranking with dependencies and critical path
   - **Restoration Procedures** — step-by-step per system type (database, application, infrastructure)
   - **RTO/RPO Targets** — per system with justification
   - **Communication Plan** — stakeholder updates during recovery
   - **Recovery Verification** — functional, data, performance, and security checks
   - **Failback Plan** — return to primary site procedures

## Output

The recovery plan appended to `.singularskills/security/<project>/05-recover.md`. Present a summary to the user highlighting:
- System recovery priorities and critical path dependencies
- RTO/RPO targets per tier
- Key restoration procedures per system type
- Recovery verification checkpoints

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-recovery-plan","workflow":"security","phase":5,"project":"<project>","event":"finished","artifact":"05-recover.md","note":""}`.

This artifact is shared by every skill of phase 5 (Recover). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Recover
workflow: security
phase: 5
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Recovery Plan` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-recovery-plan`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Recovery Plan` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
