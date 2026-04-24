---
description: Plan backup strategy, testing, and restoration verification
---

# Backup Validation

Plan backup strategy, testing, and restoration verification for "$ARGUMENTS" covering backup inventory, frequency, storage locations, test restoration schedule, and monitoring.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `plugins/security/shared/incident-response-template.md` for recovery reference
   - Read `.metapowers/security/$ARGUMENTS/00-govern.md` for organizational context and data classification

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

9. **Write the artifact** to `.metapowers/security/$ARGUMENTS/05-recover.md` with heading:

   ## Backup Validation

   Include sections:
   - **Backup Inventory** — what is backed up and what is not
   - **Backup Frequency** — per data type aligned with RPO targets
   - **Backup Types** — full, incremental, differential, snapshots with retention periods
   - **Storage Locations** — on-site, off-site, cloud, air-gapped with 3-2-1 compliance
   - **Test Restoration Schedule** — testing cadence and procedures per tier
   - **Monitoring and Alerting** — backup job monitoring and anomaly detection
   - **Restoration Procedures** — step-by-step per system type

## Output

The backup validation plan written to `.metapowers/security/$ARGUMENTS/05-recover.md`. Present a summary to the user highlighting:
- Backup inventory coverage and identified gaps
- Backup frequency aligned with RPO targets
- Storage strategy following 3-2-1 rule
- Test restoration schedule and monitoring approach
