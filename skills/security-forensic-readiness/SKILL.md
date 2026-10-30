---
name: security-forensic-readiness
description: Prepare for forensic investigation before an incident — evidence sources by volatility, a pre-positioned toolkit, hashing and preservation, chain of custody, legal hold and cloud-specific collection. Use when the user wants evidence from a future breach to hold up, or asks how to preserve logs, disks and memory for an investigation.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 4
  artifact: 04-respond.md
---

# Forensic Readiness

Design forensic readiness for "$ARGUMENTS" covering data collection sources, evidence preservation procedures, chain of custody documentation, and cloud-specific forensic considerations.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-forensic-readiness","workflow":"security","phase":4,"project":"<project>","event":"skipped","artifact":"04-respond.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Respond) of the NIST CSF workflow (`security`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-forensic-readiness","workflow":"security","phase":4,"project":"<project>","event":"refused","artifact":"04-respond.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-forensic-readiness","workflow":"security","phase":4,"project":"<project>","event":"started","artifact":"04-respond.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/incident-response-template.md` for forensic workflow reference
   - Read `.singularskills/security/<project>/00-govern.md` for organizational context and compliance requirements

2. **Define forensic data sources:**
   - **System logs** — OS logs, application logs, authentication logs, audit trails
   - **Network captures** — firewall logs, IDS/IPS logs, DNS query logs, NetFlow data, packet captures (PCAP)
   - **Memory dumps** — volatile memory from affected systems (RAM acquisition)
   - **Disk images** — full disk images or targeted partition images of compromised systems
   - **Cloud-specific sources** — CloudTrail, Azure Activity Log, GCP Audit Logs, VPC Flow Logs, container logs
   - **Endpoint telemetry** — EDR data, process execution history, file system changes, registry modifications
   - Prioritize sources by volatility (most volatile first: memory → network connections → running processes → disk)

3. **Pre-position collection tools:**
   - Define forensic toolkit contents (memory acquisition tools, disk imaging tools, log collection scripts)
   - Store toolkit in secure, tamper-evident location accessible to incident responders
   - Ensure tools are tested and validated on target operating systems and environments
   - Maintain offline copies of tools (USB drives) for air-gapped or compromised network scenarios
   - Document tool versions and hashes for integrity verification

4. **Create evidence preservation procedures:**
   - **Hashing** — calculate and record cryptographic hashes (SHA-256) of all evidence immediately upon collection
   - **Timestamping** — record collection time in UTC with reference to authoritative time source (NTP)
   - **Secure storage** — store evidence in write-protected, encrypted, access-controlled storage
   - **Imaging** — create bit-for-bit forensic images, never work on original evidence
   - **Integrity verification** — re-verify hashes at each transfer point and before analysis
   - **Retention** — define evidence retention periods aligned with legal and regulatory requirements

5. **Define chain of custody documentation:**
   - Create chain of custody form template: evidence ID, description, collected by, date/time, location, hash values
   - Record every transfer: from whom, to whom, date/time, purpose, condition of evidence
   - Maintain custody log in tamper-evident format (signed, append-only)
   - Define acceptable handlers (trained forensic personnel, authorized investigators)
   - Plan for legal admissibility requirements in relevant jurisdictions

6. **Plan legal hold procedures:**
   - Define triggers for legal hold (litigation anticipated, regulatory investigation, internal investigation)
   - Identify custodians and data sources subject to hold
   - Suspend automated deletion (log rotation, backup expiration, data retention policies)
   - Notify custodians of preservation obligations
   - Document hold scope, duration, and release criteria

7. **Plan for cloud-specific forensics:**
   - **Ephemeral resources** — capture container state before termination, snapshot serverless execution logs
   - **Multi-tenant isolation** — understand shared responsibility boundaries for evidence collection
   - **API-based collection** — script cloud API calls for log retrieval and snapshot creation
   - **Cross-region evidence** — plan for evidence collection across geographic regions and data sovereignty
   - **Provider cooperation** — document cloud provider forensic support processes and SLAs

8. **Establish forensic specialist relationships:**
   - Identify and pre-engage external forensic firms (retainer agreements)
   - Define engagement criteria (incident types requiring external expertise)
   - Ensure NDA and data handling agreements are in place
   - Document contact information and activation procedures

9. **Write the artifact** — append to `.singularskills/security/<project>/04-respond.md` under a `## Forensic Readiness` section. Create the file with a `# Respond — <project>` heading if it does not exist; if a `## Forensic Readiness` section already exists, replace only that section. The section contains:

   - **Forensic Data Sources** — prioritized list of evidence sources by volatility
   - **Collection Toolkit** — tools, storage location, and validation procedures
   - **Evidence Preservation** — hashing, timestamping, imaging, and storage procedures
   - **Chain of Custody** — documentation template and transfer procedures
   - **Legal Hold** — triggers, scope, and release criteria
   - **Cloud Forensics** — cloud-specific collection and preservation considerations
   - **External Specialists** — pre-engaged firms and engagement criteria

## Output

The forensic readiness plan appended to `.singularskills/security/<project>/04-respond.md`. Present a summary to the user highlighting:
- Key forensic data sources prioritized by volatility
- Evidence preservation and chain of custody procedures
- Cloud-specific forensic considerations
- Legal hold triggers and external specialist arrangements

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-forensic-readiness","workflow":"security","phase":4,"project":"<project>","event":"finished","artifact":"04-respond.md","note":""}`.

This artifact is shared by every skill of phase 4 (Respond). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Respond
workflow: security
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Forensic Readiness` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-forensic-readiness`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Forensic Readiness` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
