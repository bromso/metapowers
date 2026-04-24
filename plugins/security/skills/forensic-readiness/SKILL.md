---
description: Design forensic data collection, preservation, and chain of custody
---

# Forensic Readiness

Design forensic readiness for "$ARGUMENTS" covering data collection sources, evidence preservation procedures, chain of custody documentation, and cloud-specific forensic considerations.

## Prerequisites

Read `.metapowers/security/$ARGUMENTS/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "$ARGUMENTS". Run a Govern skill first (e.g., `/security:security-policy $ARGUMENTS`), or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/security/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `plugins/security/shared/incident-response-template.md` for forensic workflow reference
   - Read `.metapowers/security/$ARGUMENTS/00-govern.md` for organizational context and compliance requirements

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

9. **Write the artifact** to `.metapowers/security/$ARGUMENTS/04-respond.md` with heading:

   ## Forensic Readiness

   Include sections:
   - **Forensic Data Sources** — prioritized list of evidence sources by volatility
   - **Collection Toolkit** — tools, storage location, and validation procedures
   - **Evidence Preservation** — hashing, timestamping, imaging, and storage procedures
   - **Chain of Custody** — documentation template and transfer procedures
   - **Legal Hold** — triggers, scope, and release criteria
   - **Cloud Forensics** — cloud-specific collection and preservation considerations
   - **External Specialists** — pre-engaged firms and engagement criteria

## Output

The forensic readiness plan written to `.metapowers/security/$ARGUMENTS/04-respond.md`. Present a summary to the user highlighting:
- Key forensic data sources prioritized by volatility
- Evidence preservation and chain of custody procedures
- Cloud-specific forensic considerations
- Legal hold triggers and external specialist arrangements
