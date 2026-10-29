---
name: legal-ccpa-compliance
description: Analyze CCPA/CPRA obligations legally — applicability thresholds, consumer-rights procedures, notice at collection, the Do Not Sell or Share link, and service-provider contract terms. Use when the user needs to know whether CCPA applies and what their notices, request procedures and vendor contracts must say. Not for a scored control-gap assessment; see /compliance-ccpa.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 3
  artifact: 03-comply.md
---

# CCPA/CPRA Compliance

Assess and implement CCPA/CPRA compliance for "$ARGUMENTS". Determine applicability, map consumer rights procedures, define notice requirements, and establish service provider agreements.

See also `/compliance-ccpa` for a scored control-gap assessment of CCPA/CPRA request handling, opt-outs and vendor terms.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-ccpa-compliance","workflow":"legal","phase":3,"project":"<project>","event":"skipped","artifact":"03-comply.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-ccpa-compliance","workflow":"legal","phase":3,"project":"<project>","event":"refused","artifact":"03-comply.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-ccpa-compliance","workflow":"legal","phase":3,"project":"<project>","event":"started","artifact":"03-comply.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing draft or review artifacts in `.singularskills/legal/<project>/` for additional context

2. **Determine CCPA applicability:**
   - Annual gross revenue exceeds $25 million
   - Annually buys, sells, or shares personal information of 100,000 or more consumers, households, or devices
   - Derives 50% or more of annual revenue from selling or sharing consumers' personal information
   - Document which threshold(s) are met or potentially met

3. **Map consumer rights procedures:**
   - **Right to know** (categories and specific pieces of personal information collected, sold, or disclosed) — verification procedures, response timeline (45 days, extendable by 45)
   - **Right to delete** — verification procedures, exceptions (complete transaction, security, legal obligation, etc.), service provider notification requirements
   - **Right to opt-out of sale/sharing** — mechanism for submitting opt-out requests, Global Privacy Control signal recognition
   - **Right to correct** — process for submitting and verifying correction requests
   - **Right to limit use of sensitive personal information** — categories of sensitive PI, link to limit use, processing restrictions
   - Designated methods for submitting requests (at minimum: toll-free number and website)

4. **Notice at collection requirements:**
   - Categories of personal information collected
   - Purposes for each category
   - Whether personal information is sold or shared
   - Retention period per category
   - Link to full privacy policy

5. **Service provider vs. contractor agreements:**
   - Distinguish service provider, contractor, and third-party roles
   - Required contractual provisions for service providers (prohibit selling/sharing, limit use to contracted purpose, compliance obligations, grant audit rights)
   - Required contractual provisions for contractors (same as service providers plus certification requirements)

6. **Financial incentive disclosures:**
   - Identify any loyalty programs, discounts, or price differences tied to personal information
   - Document the value of consumer data and methodology
   - Notice and opt-in consent requirements

7. **Do-not-sell/share link requirements:**
   - Clear and conspicuous "Do Not Sell or Share My Personal Information" link on homepage
   - Alternative opt-out link if using unified approach
   - Technical implementation requirements

8. **Data retention schedules:**
   - Define retention periods per category of personal information
   - Justify retention periods based on business necessity
   - Document deletion or de-identification procedures

9. **Employee and B2B data obligations:**
   - Full CCPA rights now apply to employee, applicant, and B2B data
   - Document handling procedures for these categories
   - HR and recruitment process compliance

10. **Privacy policy requirements specific to CCPA:**
    - Categories of personal information collected, sold, and shared in preceding 12 months
    - Categories of sources and third parties
    - Business or commercial purpose for collection
    - Consumer rights description and how to exercise them
    - Annual update requirement

11. **Write the artifact** — append to `.singularskills/legal/<project>/03-comply.md` under a `## CCPA/CPRA Compliance` section. Create the file with a `# Comply — <project>` heading if it does not exist; if a `## CCPA/CPRA Compliance` section already exists, replace only that section. The section contains:

    - **Applicability Determination** — threshold analysis
    - **Consumer Rights Procedures** — detailed procedures for each right
    - **Notice at Collection** — required disclosures
    - **Service Provider/Contractor Agreements** — contractual requirements
    - **Financial Incentives** — disclosures and opt-in requirements
    - **Do-Not-Sell/Share Implementation** — link and mechanism requirements
    - **Data Retention Schedule** — per-category retention periods
    - **Employee/B2B Data** — handling procedures
    - **Privacy Policy Updates** — CCPA-specific content requirements
    - **Compliance Gaps** — identified gaps with remediation recommendations

## Output

The CCPA/CPRA compliance assessment appended to `.singularskills/legal/<project>/03-comply.md`. Present a summary to the user highlighting:
- Whether CCPA applies and which thresholds are triggered
- Consumer rights procedures defined
- Notice and disclosure requirements identified
- Service provider agreement requirements
- Critical compliance gaps requiring immediate attention

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-ccpa-compliance","workflow":"legal","phase":3,"project":"<project>","event":"finished","artifact":"03-comply.md","note":""}`.

This artifact is shared by every skill of phase 3 (Comply). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## CCPA/CPRA Compliance` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-ccpa-compliance`).

End your section with `### Decisions` and `### Open questions` (one level under your `## CCPA/CPRA Compliance` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
