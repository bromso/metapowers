---
description: Draft vendor/supplier services agreement
---

# Vendor Agreement

Draft a vendor or supplier services agreement for "$ARGUMENTS". Generate a comprehensive agreement covering scope of services, performance standards, data protection, and risk allocation.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for vendor-agreement".

## Process

1. **Read inputs:**
   - Read `.legal/$ARGUMENTS/00-assess.md` for risk and jurisdiction context
   - Read `plugins/legal/shared/contract-template.md` for standard contract provisions

2. **Identify engagement context:**
   - Nature of services being procured
   - Vendor type (technology, consulting, staffing, facilities, etc.)
   - Engagement duration and renewal expectations
   - Data access and sensitivity level
   - Criticality to business operations

3. **Draft the following sections:**

   - **Scope of Services** — detailed description of services with reference to Statement of Work (SOW), deliverables and acceptance criteria, out-of-scope items explicitly excluded
   - **Performance Standards and SLAs** — measurable performance metrics, reporting frequency and format, remedies for failure to meet SLAs (service credits, termination right), benchmarking rights
   - **Key Personnel** — named key personnel (if applicable), replacement notice and approval requirements, non-solicitation of key personnel
   - **Pricing and Payment Terms** — fee structure (fixed, T&M, milestone-based), payment schedule and invoicing requirements, late payment terms, price escalation provisions, most-favored-customer clause (if applicable)
   - **Expenses** — reimbursable expense categories, pre-approval requirements and thresholds, documentation and receipting requirements
   - **Change Order Process** — procedure for requesting changes to scope, impact assessment requirements (cost, timeline, resources), written approval requirements, dispute resolution for change order disagreements
   - **Confidentiality** — mutual confidentiality obligations, definition of confidential information, permitted disclosures, return/destruction on termination
   - **Data Protection Obligations** — data processing agreement (if vendor processes personal data), data security standards and certifications, breach notification requirements and timelines, data handling restrictions (location, subprocessing), audit and inspection rights
   - **Representations and Warranties** — vendor authority and capacity, compliance with applicable laws, non-infringement of third-party IP, quality of services (professional standards, industry best practices), personnel qualifications and background checks
   - **Indemnification** — IP infringement indemnification, negligence and willful misconduct, data breach costs and liabilities, third-party claims arising from vendor's services, indemnification process and control of defense
   - **Insurance Requirements** — required coverage types (general liability, professional liability/E&O, cyber liability, workers' compensation), minimum coverage amounts, certificate of insurance requirements, additional insured status
   - **Termination** — termination for convenience (notice period, wind-down fees), termination for cause (cure period, material breach triggers), termination for insolvency, partial termination rights (individual SOWs)
   - **Transition Assistance** — vendor obligations during transition period, knowledge transfer requirements, cooperation with successor vendor, duration and cost of transition services
   - **Limitation of Liability** — aggregate liability cap (typically total fees under the agreement), exclusion of consequential damages, carve-outs (IP indemnification, confidentiality breach, data breach, willful misconduct, bodily injury)
   - **Governing Law** — choice of law, dispute resolution (escalation ladder: negotiation, mediation, arbitration/litigation), venue selection

4. **Write the artifact** to `.legal/$ARGUMENTS/01-draft.md` with frontmatter:

   ```
   ---
   description: Vendor agreement draft for $ARGUMENTS
   ---
   ```

## Output

The vendor agreement draft written to `.legal/$ARGUMENTS/01-draft.md`. Present a summary to the user highlighting:
- Service type and engagement model
- Key performance standards and SLA provisions
- Data protection and security obligations
- Insurance and indemnification requirements
- Termination and transition provisions
- Areas flagged for attorney review
