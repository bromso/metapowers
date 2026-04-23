---
description: Draft Data Processing Agreement for data processors
---

# Data Processing Agreement

Draft a Data Processing Agreement (DPA) for "$ARGUMENTS". Define controller/processor roles and obligations, covering all GDPR Article 28 requirements for data processing arrangements.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for data-processing-agreement".

## Process

1. **Read inputs:**
   - Read `.legal/$ARGUMENTS/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing contract templates or draft artifacts in `.legal/$ARGUMENTS/` for additional context

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

4. **Write the artifact** to `.legal/$ARGUMENTS/03-comply.md` with frontmatter:

   ```
   ---
   description: Data Processing Agreement for $ARGUMENTS
   ---
   ```

   Include sections:
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

The Data Processing Agreement written to `.legal/$ARGUMENTS/03-comply.md`. Present a summary to the user highlighting:
- Controller and processor roles defined
- Categories of data subjects and personal data covered
- Sub-processor management approach (specific vs. general authorization)
- International transfer mechanisms included
- Key areas flagged for attorney review (especially liability allocation and indemnification)
