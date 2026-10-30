---
name: security-encryption-strategy
description: Plan encryption at rest and in transit plus key management — algorithms per store, TLS and mTLS, KMS choice, key hierarchy and rotation, client- versus server-side encryption. Use when the user asks how their data should be encrypted, which TLS settings to require, or how to manage encryption keys. Not for API keys, passwords and tokens; see /security-secrets-management.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 2
  artifact: 02-protect.md
---

# Encryption Strategy

Plan encryption at rest, in transit, and key management for "$ARGUMENTS". Define encryption requirements based on data classification, select appropriate algorithms, and design the key management lifecycle.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-encryption-strategy","workflow":"security","phase":2,"project":"<project>","event":"skipped","artifact":"02-protect.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Protect) of the NIST CSF workflow (`security`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-encryption-strategy","workflow":"security","phase":2,"project":"<project>","event":"refused","artifact":"02-protect.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-encryption-strategy","workflow":"security","phase":2,"project":"<project>","event":"started","artifact":"02-protect.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Inventory data requiring encryption:**
   - Map data types to classification levels (public, internal, confidential, restricted)
   - Identify regulatory encryption requirements (PCI DSS, HIPAA, GDPR, SOC 2)
   - Catalog data storage locations (databases, object storage, file systems, backups, caches)
   - Identify data flows between systems, services, and external parties

2. **Plan encryption at rest:**
   - Select encryption algorithm (AES-256 recommended for symmetric encryption)
   - Evaluate database-level encryption (TDE) vs. application-level encryption
   - Database-level: simpler to implement, protects against physical media theft
   - Application-level: protects against database administrator access, enables field-level encryption
   - Plan encryption for file storage and object storage (S3 SSE, Azure Storage encryption)
   - Define encryption requirements for backup media and archives

3. **Plan encryption in transit:**
   - Require TLS 1.3 minimum for all external communications (deprecate TLS 1.2 where possible)
   - Define certificate management strategy (public CA vs. internal CA, certificate lifecycle)
   - Plan mutual TLS (mTLS) for service-to-service communication where appropriate
   - Configure cipher suite preferences (forward secrecy required, disable weak ciphers)
   - Implement certificate pinning for critical mobile and API connections if applicable

4. **Design key management:**
   - Select KMS solution (AWS KMS, Azure Key Vault, GCP Cloud KMS, HashiCorp Vault)
   - Define key hierarchy (master key, data encryption keys, key encryption keys)
   - Set key rotation schedule (master keys: annually, data encryption keys: quarterly or per-use)
   - Plan key backup and recovery procedures
   - Define key access controls (who can create, rotate, and revoke keys)
   - Document key compromise response procedure (re-encryption plan)

5. **Evaluate client-side vs. server-side encryption:**
   - Client-side encryption for data the server should never see (zero-knowledge scenarios)
   - Server-side encryption for simpler key management and transparent encryption
   - End-to-end encryption for messaging and communication features
   - Document the decision rationale for each data type

6. **Plan encryption for backups:**
   - Ensure all backups are encrypted with separate keys from production
   - Define backup key escrow and recovery procedures
   - Test backup decryption as part of disaster recovery exercises
   - Set retention-aligned key lifecycle (keys must outlive encrypted backup retention)

7. **Write the artifact** — append to `.singularskills/security/<project>/02-protect.md` under a `## Encryption Strategy` section. Create the file with a `# Protect — <project>` heading if it does not exist; if a `## Encryption Strategy` section already exists, replace only that section. The section contains:

   - **Data Encryption Requirements** — data types, classification levels, and regulatory requirements
   - **Encryption at Rest** — algorithms, implementation approach per storage type
   - **Encryption in Transit** — TLS configuration, certificate management, mTLS plan
   - **Key Management** — KMS selection, key hierarchy, rotation schedule, and access controls
   - **Client-Side vs. Server-Side** — decisions per data type with rationale
   - **Backup Encryption** — backup-specific encryption and key escrow plan

## Output

The encryption strategy appended to `.singularskills/security/<project>/02-protect.md`. Present a summary to the user highlighting:
- Data types requiring encryption and their classification levels
- Encryption approach per storage and transit scenario
- Key management solution and rotation schedule
- Critical decisions on client-side vs. server-side encryption

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-encryption-strategy","workflow":"security","phase":2,"project":"<project>","event":"finished","artifact":"02-protect.md","note":""}`.

This artifact is shared by every skill of phase 2 (Protect). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Protect
workflow: security
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Encryption Strategy` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-encryption-strategy`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Encryption Strategy` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
