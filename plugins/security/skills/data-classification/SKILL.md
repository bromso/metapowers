---
name: data-classification
description: Classify data by sensitivity level
argument-hint: "[project] [--skip-checks]"
---

# Data Classification

Classify data by sensitivity level for "$ARGUMENTS". Define classification levels, inventory data types, and establish handling requirements that protect data proportionate to its sensitivity.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/security/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security:security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Define classification levels:**
   - **Public** — information intended for public consumption; no impact if disclosed (marketing materials, public docs, open-source code)
   - **Internal** — general business information not intended for public release; minor impact if disclosed (internal memos, org charts, non-sensitive reports)
   - **Confidential** — sensitive business information; significant impact if disclosed (financial data, strategic plans, employee records, source code, customer lists)
   - **Restricted** — highest sensitivity; severe impact if disclosed (credentials, encryption keys, PII/PHI/PCI data, trade secrets, security configurations)

2. **Create classification criteria per level:**
   - For each level, define clear criteria to determine classification:
     - What types of data belong at this level?
     - What is the business impact of unauthorized disclosure?
     - What is the regulatory impact?
     - What is the reputational impact?
   - Provide examples for each level to aid consistent classification decisions
   - Define how to handle data that spans multiple levels (classify at the highest applicable level)

3. **Inventory data types and classify each:**
   - Enumerate all data types the organization creates, processes, or stores
   - For each data type, record: description, classification level, owner, storage locations, retention period
   - Common data types to evaluate: customer PII, employee records, financial transactions, health information, authentication credentials, logs, analytics data, intellectual property, communications

4. **Define handling requirements per level:**
   - For each classification level, specify requirements across:
     - **Storage** — encryption at rest, access controls, approved storage locations
     - **Transmission** — encryption in transit (TLS/mTLS), approved transfer methods, DLP controls
     - **Access** — who can access, authentication requirements, need-to-know basis
     - **Retention** — how long to keep, archival procedures, legal hold considerations
     - **Disposal** — secure deletion methods, certificate of destruction, media sanitization
   - Define escalating controls as sensitivity increases

5. **Identify data with regulatory requirements:**
   - **PII (Personally Identifiable Information)** — GDPR, CCPA, state privacy laws
   - **PHI (Protected Health Information)** — HIPAA, HITECH
   - **PCI (Payment Card Industry data)** — PCI DSS requirements
   - **Financial data** — SOX, GLBA requirements
   - Map each regulated data type to: applicable regulations, specific requirements, compliance deadlines, penalties for non-compliance

6. **Write the artifact** — append to `.metapowers/security/<project>/01-identify.md` under a `## Data Classification` section. Create the file with a `# Identify — <project>` heading if it does not exist; if a `## Data Classification` section already exists, replace only that section. The section contains:

   - **Classification Levels** — definitions, criteria, and examples per level
   - **Data Inventory** — all data types with assigned classification and owner
   - **Handling Requirements** — storage, transmission, access, retention, and disposal per level
   - **Regulatory Mapping** — regulated data types with applicable frameworks and requirements
   - **Implementation Guidance** — how to label, handle, and monitor classified data

## Output

The data classification appended to `.metapowers/security/<project>/01-identify.md`. Present a summary to the user highlighting:
- Classification levels defined with key criteria
- Distribution of data types across classification levels
- Data types with regulatory requirements and applicable frameworks
- Critical handling requirements for Restricted and Confidential data
