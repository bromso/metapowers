---
name: security-backup-validation
description: Plan backups and prove they restore — what is and is not backed up, frequency and backup types, 3-2-1 storage, a test restore schedule, backup monitoring and step-by-step restore procedures. Use when the user is unsure their backups work, asks how often to back up, or wants restore testing on a schedule.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 5
  artifact: 05-recover.md
---

# Backup Validation

Plan backup strategy, testing, and restoration verification for "$ARGUMENTS" covering backup inventory, frequency, storage locations, test restoration schedule, and monitoring.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"security","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/incident-response-template.md` for recovery reference
   - Read `.singularskills/security/<project>/00-govern.md` for organizational context and data classification

2. **Inventory what is backed up:**
   - **Databases** — production databases, read replicas, configuration databases
   - **File systems** — application data, user uploads, shared storage
   - **Configurations** — infrastructure-as-code, application config, environment variables
   - **Secrets** — encryption keys, certificates, API keys (backed up to separate secure vault)
   - **Code and artifacts** — source code repositories, build artifacts, container images
   - Identify what is NOT currently backed up and assess whether it should be

3. **Define backup frequency per data type:**
   - **Real-time replication** — production databases, critical state stores (synchronous or asynchronous replication)
   - **Hourly** — transaction logs, high-change-rate data stores
   - **Daily** — application data, file systems, configuration snapshots
   - **Weekly** — full database backups, complete system images
   - **On change** — infrastructure-as-code, secrets, certificates (version-controlled)
   - Align frequency with RPO targets from recovery plan

4. **Define backup types:**
   - **Full backups** — complete copy of all data (weekly or as baseline)
   - **Incremental backups** — only changes since last backup (daily, reduces storage and time)
   - **Differential backups** — changes since last full backup (mid-week, balances recovery speed and storage)
   - **Snapshots** — point-in-time snapshots for cloud resources (EBS, RDS, managed disks)
   - Define retention periods per backup type (daily: 30 days, weekly: 90 days, monthly: 1 year)

5. **Define storage locations:**
   - **On-site** — local storage for fastest recovery (hot standby)
   - **Off-site** — geographically separate facility for disaster protection
   - **Cloud** — cloud object storage (S3, Azure Blob, GCS) with cross-region replication
   - **Air-gapped** — offline storage disconnected from network for ransomware protection
   - Apply 3-2-1 rule: 3 copies, 2 different media types, 1 offsite
   - Encrypt all backups at rest with keys stored separately from backup data

6. **Define test restoration schedule:**
   - **Critical systems (Tier 1)** — monthly restoration test to isolated environment
   - **Important systems (Tier 2)** — quarterly restoration test
   - **Supporting systems (Tier 3)** — semi-annual restoration test
   - Test procedure: restore to isolated environment, verify data integrity, verify application functionality, measure restoration time
   - Document test results: success/failure, restoration time, issues encountered, corrective actions
   - Annual full disaster recovery exercise simulating complete environment restoration

7. **Define backup monitoring and alerting:**
   - Monitor backup job completion (success/failure/partial)
   - Alert on backup failures immediately (P2 for Tier 1, P3 for Tier 2–3)
   - Monitor backup size trends (detect anomalies — sudden growth or shrinkage)
   - Monitor storage capacity and forecast depletion
   - Track backup and restoration SLA compliance (backup window, retention compliance)

8. **Document restoration procedures step-by-step:**
   - Per system type: prerequisites, access requirements, step-by-step commands or console actions
   - Include rollback plan if restoration fails
   - Document known issues and workarounds from past restoration tests
   - Maintain runbook in accessible location (not only on systems that might be unavailable)

9. **Write the artifact** — append to `.singularskills/security/<project>/05-recover.md` under a `## Backup Validation` section. Create the file with a `# Recover — <project>` heading if it does not exist; if a `## Backup Validation` section already exists, replace only that section. The section contains:

   - **Backup Inventory** — what is backed up and what is not
   - **Backup Frequency** — per data type aligned with RPO targets
   - **Backup Types** — full, incremental, differential, snapshots with retention periods
   - **Storage Locations** — on-site, off-site, cloud, air-gapped with 3-2-1 compliance
   - **Test Restoration Schedule** — testing cadence and procedures per tier
   - **Monitoring and Alerting** — backup job monitoring and anomaly detection
   - **Restoration Procedures** — step-by-step per system type

## Output

The backup validation plan appended to `.singularskills/security/<project>/05-recover.md`. Present a summary to the user highlighting:
- Backup inventory coverage and identified gaps
- Backup frequency aligned with RPO targets
- Storage strategy following 3-2-1 rule
- Test restoration schedule and monitoring approach

**Record the run.** This artifact is shared by every skill of phase 5 (Recover). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## Backup Validation` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-backup-validation`).

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
