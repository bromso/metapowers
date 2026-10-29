---
name: security-data-classification
description: Classify an organization's data as public, internal, confidential or restricted — criteria, a data inventory, handling rules for storage, transfer, access, retention and disposal, and regulated types such as PII, PHI and card data. Use when the user asks which of their data is sensitive and how each kind must be stored, shared and deleted.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 1
  artifact: 01-identify.md
---

# Data Classification

Classify data by sensitivity level for "$ARGUMENTS". Define classification levels, inventory data types, and establish handling requirements that protect data proportionate to its sensitivity.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-data-classification","workflow":"security","phase":1,"project":"<project>","event":"skipped","artifact":"01-identify.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

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

6. **Write the artifact** — append to `.singularskills/security/<project>/01-identify.md` under a `## Data Classification` section. Create the file with a `# Identify — <project>` heading if it does not exist; if a `## Data Classification` section already exists, replace only that section. The section contains:

   - **Classification Levels** — definitions, criteria, and examples per level
   - **Data Inventory** — all data types with assigned classification and owner
   - **Handling Requirements** — storage, transmission, access, retention, and disposal per level
   - **Regulatory Mapping** — regulated data types with applicable frameworks and requirements
   - **Implementation Guidance** — how to label, handle, and monitor classified data

## Output

The data classification appended to `.singularskills/security/<project>/01-identify.md`. Present a summary to the user highlighting:
- Classification levels defined with key criteria
- Distribution of data types across classification levels
- Data types with regulatory requirements and applicable frameworks
- Critical handling requirements for Restricted and Confidential data

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"security-data-classification","workflow":"security","phase":1,"project":"<project>","event":"started","artifact":"01-identify.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

This artifact is shared by every skill of phase 1 (Identify). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Identify
workflow: security
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Data Classification` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-data-classification`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Data Classification` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
