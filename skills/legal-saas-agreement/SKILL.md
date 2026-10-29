---
name: legal-saas-agreement
description: Draft a SaaS subscription or licensing agreement for a software provider — license grant, subscription and billing, SLA and service credits, data ownership, security, suspension, data export and liability cap. Use when the user sells software as a service and needs the customer contract their business buyers sign. Not for public click-through terms; see /legal-terms-of-service.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 1
  artifact: 01-draft.md
---

# SaaS Agreement

Draft a SaaS subscription or licensing agreement for "$ARGUMENTS". Generate a comprehensive agreement covering subscription terms, service levels, data handling, and liability.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-saas-agreement","workflow":"legal","phase":1,"project":"<project>","event":"skipped","artifact":"01-draft.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-saas-agreement","workflow":"legal","phase":1,"project":"<project>","event":"refused","artifact":"01-draft.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-saas-agreement","workflow":"legal","phase":1,"project":"<project>","event":"started","artifact":"01-draft.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Read `references/contract-template.md` for standard contract provisions

2. **Identify service context:**
   - Nature of the SaaS product and core functionality
   - Target customers (B2B, B2C, or both)
   - Pricing model (per-seat, usage-based, tiered, flat-rate)
   - Deployment model (multi-tenant, single-tenant, hybrid)
   - Data sensitivity level and regulatory requirements

3. **Draft the following sections:**

   - **License Grant** — scope of access rights (non-exclusive, non-transferable, subscription-based), permitted users, restrictions (no sublicensing, no reverse engineering, no competitive use)
   - **Subscription Terms** — plan descriptions, billing cycle (monthly/annual), auto-renewal terms, upgrade/downgrade procedures, free trial terms (if applicable)
   - **SLA and Uptime Commitments** — uptime target (e.g., 99.9%), measurement methodology, scheduled maintenance windows, service credits for downtime, exclusions from SLA
   - **Data Ownership and Processing** — customer retains ownership of customer data, provider's limited license to process, data processing agreement reference (GDPR Article 28), data location and transfer restrictions
   - **Security Obligations** — provider security standards (SOC 2, ISO 27001, encryption at rest and in transit), breach notification timelines and procedures, security audit rights
   - **Acceptable Use Policy** — prohibited uses, resource limits, abuse handling, account suspension triggers
   - **Support and Maintenance** — support tiers and response times, included vs. paid support, maintenance windows and update policy, end-of-life and deprecation notice periods
   - **Payment Terms** — fees and payment schedule, invoicing procedures, late payment consequences (interest, suspension), price change notice requirements, taxes and withholding
   - **Suspension Rights** — grounds for suspension (non-payment, AUP violation, security threat), notice requirements, data preservation during suspension, reinstatement procedures
   - **Termination and Data Export/Deletion** — termination for cause and convenience, notice periods, data export period post-termination (typically 30-90 days), data deletion certification, survival clauses
   - **Limitation of Liability** — aggregate liability cap (typically 12 months of fees), exclusion of consequential damages, carve-outs (IP indemnification, confidentiality breach, willful misconduct)
   - **IP Ownership and Feedback** — provider owns all IP in the service, customer feedback license (if customer suggestions are incorporated), no implied IP rights
   - **Compliance with Laws** — each party's obligation to comply with applicable laws, specific regulatory compliance commitments (GDPR, HIPAA, SOX as applicable)
   - **Governing Law** — choice of law, dispute resolution mechanism, venue selection

4. **Write the artifact** — append to `.singularskills/legal/<project>/01-draft.md` under a `## SaaS Agreement` section. Create the file with a `# Draft — <project>` heading if it does not exist; if a `## SaaS Agreement` section already exists, replace only that section.

## Output

The SaaS agreement draft appended to `.singularskills/legal/<project>/01-draft.md`. Present a summary to the user highlighting:
- Service type and pricing model addressed
- SLA commitments proposed
- Data handling and security provisions included
- Key liability limitations and carve-outs
- Areas flagged for attorney review

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-saas-agreement","workflow":"legal","phase":1,"project":"<project>","event":"finished","artifact":"01-draft.md","note":""}`.

This artifact is shared by every skill of phase 1 (Draft). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Draft
workflow: legal
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## SaaS Agreement` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-saas-agreement`).

End your section with `### Decisions` and `### Open questions` (one level under your `## SaaS Agreement` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
