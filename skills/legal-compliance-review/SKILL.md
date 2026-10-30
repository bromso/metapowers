---
name: legal-compliance-review
description: Review one document — a contract, policy or terms — against GDPR, CCPA, SOC 2 and accessibility requirements, rating each Compliant, Partially or Non-Compliant with language to close each gap. Use when the user has a draft document and asks whether it is compliant or what it is missing for a regulation.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 2
  artifact: 02-review.md
---

# Compliance Review

Review the document for "$ARGUMENTS" against applicable regulatory frameworks. Check compliance with GDPR, CCPA, SOC2, and other relevant regulations, scoring compliance level and identifying specific gaps.

See also `/compliance-policy-gaps` for a prioritized list of which policies are missing or outdated across all applicable regulations, rather than a line-by-line review of one document.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-compliance-review","workflow":"legal","phase":2,"project":"<project>","event":"skipped","artifact":"02-review.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Review) of the Legal Lifecycle workflow (`legal`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `legal` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-compliance-review","workflow":"legal","phase":2,"project":"<project>","event":"refused","artifact":"02-review.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-compliance-review","workflow":"legal","phase":2,"project":"<project>","event":"started","artifact":"02-review.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Read `references/compliance-checklist.md` for reference requirements
   - Read the document from the source provided by the user

2. **Determine applicable regulations:**
   - Based on jurisdiction, industry, and data types identified in the assessment
   - Prioritize regulations by relevance and enforcement risk

3. **Check GDPR compliance (if applicable):**
   - **Lawful basis** — is a lawful basis for processing identified (consent, legitimate interest, contract, etc.)?
   - **Data processing provisions** — are controller/processor roles defined with adequate DPA terms?
   - **Data subject rights** — are rights addressed (access, rectification, erasure, portability, objection)?
   - **International transfers** — are transfer mechanisms in place (SCCs, adequacy decisions, BCRs)?
   - **Breach notification** — are notification obligations defined (72-hour timeline, authority and data subject notification)?
   - **Data Protection Impact Assessment** — is a DPIA referenced or required for high-risk processing?
   - **Records of processing** — are record-keeping obligations addressed?

4. **Check CCPA/CPRA compliance (if applicable):**
   - **Notice at collection** — are categories of personal information and purposes disclosed?
   - **Opt-out rights** — is the right to opt out of sale/sharing of personal information addressed?
   - **Deletion rights** — are consumer deletion request procedures defined?
   - **Non-discrimination** — is there a commitment not to discriminate against consumers exercising rights?
   - **Service provider obligations** — are contractual restrictions on use of personal information included?
   - **Sensitive personal information** — are additional protections for sensitive categories addressed?

5. **Check SOC2 compliance (if applicable):**
   - **Security controls** — are security measures documented (encryption, access controls, monitoring)?
   - **Availability commitments** — are uptime and recovery commitments defined?
   - **Incident response** — is an incident response plan referenced or required?
   - **Change management** — are change control procedures addressed?
   - **Vendor management** — are sub-processor or subcontractor controls defined?

6. **Check accessibility compliance (if applicable):**
   - WCAG 2.1 AA compliance commitments
   - Accessibility testing obligations
   - Remediation timelines for accessibility issues

7. **Score compliance level per regulation:**
   - **Compliant** — all material requirements addressed with adequate provisions
   - **Partially Compliant** — some requirements addressed but with notable gaps
   - **Non-Compliant** — critical requirements missing or inadequately addressed

8. **Identify specific gaps and suggest compliant alternatives:**
   - For each gap, reference the specific regulatory requirement
   - Provide draft language or provisions that would close the gap
   - Prioritize gaps by enforcement risk and potential penalty exposure

9. **Write the artifact** — append to `.singularskills/legal/<project>/02-review.md` under a `## Compliance Review` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Compliance Review` section already exists, replace only that section. The section contains:

   - **Applicable Regulations** — list of regulations checked and rationale for inclusion
   - **GDPR Assessment** — item-by-item compliance check (if applicable)
   - **CCPA/CPRA Assessment** — item-by-item compliance check (if applicable)
   - **SOC2 Assessment** — item-by-item compliance check (if applicable)
   - **Accessibility Assessment** — item-by-item compliance check (if applicable)
   - **Compliance Scorecard** — Compliant/Partially Compliant/Non-Compliant per regulation
   - **Gap Analysis** — specific gaps with regulatory reference and risk level
   - **Remediation Recommendations** — suggested language or provisions per gap

## Output

The compliance review appended to `.singularskills/legal/<project>/02-review.md`. Present a summary to the user highlighting:
- Compliance scorecard across all applicable regulations
- Critical gaps (Non-Compliant items) requiring immediate attention
- Number of gaps per regulation and overall compliance posture
- Top 3 remediation priorities

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-compliance-review","workflow":"legal","phase":2,"project":"<project>","event":"finished","artifact":"02-review.md","note":""}`.

This artifact is shared by every skill of phase 2 (Review). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Review
workflow: legal
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Compliance Review` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-compliance-review`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Compliance Review` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
