---
name: legal-data-processing-agreement
description: Draft a GDPR Article 28 Data Processing Agreement — controller and processor roles, processing details, processor obligations, sub-processors, breach notice, audit rights, deletion and international transfers. Use when a customer asks the user to sign a DPA, or the user needs one for a vendor that handles their personal data.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 3
  artifact: 03-comply.md
---

# Data Processing Agreement

Draft a Data Processing Agreement (DPA) for "$ARGUMENTS". Define controller/processor roles and obligations, covering all GDPR Article 28 requirements for data processing arrangements.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"legal","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing contract templates or draft artifacts in `.singularskills/legal/<project>/` for additional context

2. **Define controller/processor roles:**
   - Clearly identify which party is the controller and which is the processor
   - Address joint controller scenarios if applicable
   - Document the basis for the controller-processor relationship

3. **Draft DPA sections:**

   **a. Subject matter and duration of processing:**
   - Describe the service that involves personal data processing
   - Specify the duration (tied to the main service agreement or specific term)

   **b. Nature and purpose of processing:**
   - Types of processing operations (collection, storage, retrieval, use, disclosure, erasure)
   - Business purposes for each processing operation

   **c. Categories of data subjects and personal data:**
   - List all categories of data subjects (customers, employees, end users, etc.)
   - List all categories of personal data processed (identifiers, contact info, financial data, usage data, etc.)
   - Identify any special categories of data (health, biometric, racial/ethnic origin, etc.)

   **d. Controller's instructions to processor:**
   - Processing only on documented instructions from the controller
   - Procedure for processor to notify controller if an instruction infringes GDPR
   - Mechanism for providing additional or updated instructions

   **e. Processor's obligations:**
   - **Confidentiality** — ensure persons authorized to process have committed to confidentiality or are under statutory obligation
   - **Security measures** (Article 32) — appropriate technical and organizational measures (encryption, pseudonymization, access controls, resilience, regular testing)
   - **Sub-processor management** — prior specific or general written authorization, flow-down of obligations, list of current sub-processors, notification procedure for changes, controller's right to object
   - **Assistance with data subject rights** — assist controller in responding to data subject requests, timelines and procedures
   - **Breach notification** — notify controller without undue delay after becoming aware of a breach, information to include, cooperation obligations
   - **DPIA assistance** — assist controller with data protection impact assessments and prior consultation with supervisory authority
   - **Audit rights** — make available all information necessary to demonstrate compliance, allow for and contribute to audits and inspections by controller or mandated auditor

   **f. Data return or deletion on termination:**
   - Controller's choice: return all personal data or delete all copies
   - Timeline for return or deletion after termination
   - Certification of deletion
   - Exceptions (legal retention obligations)

   **g. International transfer provisions:**
   - Restrictions on transfers outside EEA
   - Approved transfer mechanisms (SCCs, adequacy decisions, BCRs)
   - Transfer impact assessment requirements
   - SCCs incorporated by reference or as annex

   **h. Liability allocation:**
   - Liability caps and limitations specific to data processing
   - Indemnification provisions
   - Allocation of regulatory fines (if permissible under applicable law)

4. **Write the artifact** — append to `.singularskills/legal/<project>/03-comply.md` under a `## Data Processing Agreement` section. Create the file with a `# Comply — <project>` heading if it does not exist; if a `## Data Processing Agreement` section already exists, replace only that section. The section contains:

   - **Definitions** — key terms (personal data, processing, controller, processor, sub-processor, data breach)
   - **Roles and Responsibilities** — controller/processor identification
   - **Subject Matter and Duration** — scope and term
   - **Nature, Purpose, and Categories** — processing details
   - **Controller Instructions** — instruction framework
   - **Processor Obligations** — all Article 28 obligations
   - **Sub-Processor Management** — authorization and flow-down
   - **Data Subject Rights** — assistance procedures
   - **Security Measures** — technical and organizational measures
   - **Breach Notification** — procedures and timelines
   - **Audit Rights** — scope and procedures
   - **International Transfers** — mechanisms and safeguards
   - **Term and Termination** — data return/deletion provisions
   - **Liability** — allocation and limitations

## Output

The Data Processing Agreement appended to `.singularskills/legal/<project>/03-comply.md`. Present a summary to the user highlighting:
- Controller and processor roles defined
- Categories of data subjects and personal data covered
- Sub-processor management approach (specific vs. general authorization)
- International transfer mechanisms included
- Key areas flagged for attorney review (especially liability allocation and indemnification)

**Record the run.** This artifact is shared by every skill of phase 3 (Comply). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Comply
workflow: legal
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Data Processing Agreement` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-data-processing-agreement`).

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```
