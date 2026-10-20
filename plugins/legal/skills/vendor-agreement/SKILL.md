---
name: vendor-agreement
description: Draft a vendor or supplier services agreement from the buyer's side — scope and SOW, SLAs, key personnel, pricing, change orders, data protection, indemnities, insurance, termination and transition. Use when the user is hiring an outside vendor, agency or supplier and needs a services contract that protects them.
argument-hint: "[project] [--skip-checks]"
---

# Vendor Agreement

Draft a vendor or supplier services agreement for "$ARGUMENTS". Generate a comprehensive agreement covering scope of services, performance standards, data protection, and risk allocation.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/legal/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Check that `.metapowers/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/contract-template.md` for standard contract provisions

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

4. **Write the artifact** — append to `.metapowers/legal/<project>/01-draft.md` under a `## Vendor Agreement` section. Create the file with a `# Draft — <project>` heading if it does not exist; if a `## Vendor Agreement` section already exists, replace only that section.

## Output

The vendor agreement draft appended to `.metapowers/legal/<project>/01-draft.md`. Present a summary to the user highlighting:
- Service type and engagement model
- Key performance standards and SLA provisions
- Data protection and security obligations
- Insurance and indemnification requirements
- Termination and transition provisions
- Areas flagged for attorney review
