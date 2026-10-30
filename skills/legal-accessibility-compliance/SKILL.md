---
name: legal-accessibility-compliance
description: Map legal accessibility obligations across markets — ADA, Section 508, EAA, UK and Canadian law — with WCAG level, exposure, remediation and a draft accessibility statement. Use when the user sells in several countries and asks which accessibility laws apply in each. Not for one law or the audit; see /compliance-ada-wcag, /compliance-eaa-en301549 or /accessibility-scope.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 3
  artifact: 03-comply.md
---

# Accessibility Compliance

Assess legal accessibility requirements for "$ARGUMENTS". Identify applicable accessibility laws, determine WCAG conformance requirements, assess current compliance, and create a remediation plan.

See also `/accessibility-scope` for the audit itself, or `/compliance-ada-wcag` for a single-market (ADA) legal risk assessment, instead of this multi-market legal map.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-accessibility-compliance","workflow":"legal","phase":3,"project":"<project>","event":"skipped","artifact":"03-comply.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 3 (Comply) of the Legal Lifecycle workflow (`legal`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `legal` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-accessibility-compliance","workflow":"legal","phase":3,"project":"<project>","event":"refused","artifact":"03-comply.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-accessibility-compliance","workflow":"legal","phase":3,"project":"<project>","event":"started","artifact":"03-comply.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk, jurisdiction, and data practice context
   - Read any existing accessibility audit or review artifacts in `.singularskills/legal/<project>/` for additional context

2. **Identify applicable accessibility laws by jurisdiction:**
   - **United States:**
     - ADA Title III — public accommodations, DOJ web accessibility guidance, case law trends
     - Section 508 (Rehabilitation Act) — federal agencies and recipients of federal funding
     - State laws (California Unruh Act, New York accessibility requirements, etc.)
   - **European Union:**
     - European Accessibility Act (EAA) — effective June 2025, products and services requirements
     - Web Accessibility Directive — public sector websites and mobile apps
     - EN 301 549 standard
   - **United Kingdom:**
     - Equality Act 2010 — reasonable adjustments obligation
     - Public Sector Bodies Accessibility Regulations 2018
   - **Canada:**
     - Accessibility for Ontarians with Disabilities Act (AODA) — WCAG 2.0 AA for Ontario
     - Accessible Canada Act (ACA) — federal regulated organizations
   - **Other applicable jurisdictions** — document requirements based on assessment context

3. **Determine required WCAG conformance level:**
   - Identify which WCAG version applies (2.0, 2.1, 2.2) per jurisdiction
   - Typically Level AA is required by most regulations
   - Document any Level AAA requirements (rare but some jurisdictions or sectors)
   - Map WCAG success criteria to applicable legal requirements

4. **Assess current compliance status:**
   - Reference existing accessibility audit if available
   - Identify critical barriers by WCAG principle (Perceivable, Operable, Understandable, Robust)
   - Document automated scan results and manual testing findings
   - Catalog assistive technology compatibility (screen readers, keyboard navigation, voice control)

5. **Identify legal exposure:**
   - DOJ enforcement actions and guidance relevant to the business
   - Private litigation trends (ADA demand letters, structured negotiation)
   - EU fines and enforcement mechanisms under EAA and Web Accessibility Directive
   - Industry-specific enforcement (financial services, healthcare, education, government)
   - Insurance coverage considerations

6. **Create remediation priority list:**
   - **Critical barriers** (P1) — complete blockers preventing access (no keyboard access, missing alt text on critical images, inaccessible forms, no captions on essential video)
   - **Major barriers** (P2) — significant difficulty using features (poor contrast, missing form labels, inconsistent navigation)
   - **Minor barriers** (P3) — usability issues that don't block access (focus order anomalies, decorative image alt text, minor contrast issues)
   - Timeline and resource estimates for each priority level

7. **Draft accessibility statement:**
   - Commitment to accessibility and inclusion
   - Standards targeted (WCAG version and level)
   - Current conformance status
   - Known limitations and planned remediation timeline
   - Contact information for accommodation requests and feedback
   - Date of last review and update
   - Enforcement procedure references (where required by law)

8. **Design ongoing monitoring plan:**
   - Automated scanning cadence (recommended: weekly or with each deployment)
   - Manual testing schedule (recommended: quarterly)
   - User testing with people with disabilities (recommended: annually or with major changes)
   - Remediation tracking and reporting
   - Training program for development and content teams
   - Procurement requirements for third-party tools and content

9. **Write the artifact** — append to `.singularskills/legal/<project>/03-comply.md` under a `## Accessibility Compliance` section. Create the file with a `# Comply — <project>` heading if it does not exist; if a `## Accessibility Compliance` section already exists, replace only that section. The section contains:

   - **Applicable Laws** — jurisdiction-by-jurisdiction legal requirements
   - **WCAG Conformance Requirements** — version, level, and success criteria mapping
   - **Current Compliance Status** — assessment findings and barrier inventory
   - **Legal Exposure Analysis** — enforcement risk and litigation trends
   - **Remediation Priority List** — prioritized barriers with timelines
   - **Accessibility Statement** — draft statement for publication
   - **Ongoing Monitoring Plan** — testing cadence and responsibilities
   - **Compliance Gaps** — identified gaps with remediation recommendations

## Output

The accessibility compliance assessment appended to `.singularskills/legal/<project>/03-comply.md`. Present a summary to the user highlighting:
- Applicable accessibility laws and required WCAG level
- Current compliance status (if audit data available)
- Number of barriers identified by priority level
- Key legal exposure areas
- Top remediation priorities and estimated timeline

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-accessibility-compliance","workflow":"legal","phase":3,"project":"<project>","event":"finished","artifact":"03-comply.md","note":""}`.

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

Open your `## Accessibility Compliance` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-accessibility-compliance`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Accessibility Compliance` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
