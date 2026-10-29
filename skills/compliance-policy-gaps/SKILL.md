---
name: compliance-policy-gaps
description: Identify which policies the applicable regulations require, which are missing or outdated, and produce a prioritized policy development list with effort estimates. Use when the user asks which security or privacy policies they need for an audit, or whether their existing policies are good enough.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 2
  artifact: 02-remediate.md
---

# Policy Gaps

Identify missing or outdated policies for "$ARGUMENTS" by reviewing policy requirements across all applicable regulations, inventorying existing policies, and creating a policy development priority list.

See also `/legal-compliance-review` for a line-by-line compliance rating and gap-closing language on one specific document.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-policy-gaps","workflow":"compliance","phase":2,"project":"<project>","event":"skipped","artifact":"02-remediate.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context
   - Read `.singularskills/compliance/<project>/02-remediate.md` for gap register and control mapping

2. **Policy requirements inventory:**
   - Review policy requirements across all applicable regulations
   - Must-have policies: information security policy, acceptable use policy, data protection/privacy policy, incident response plan, business continuity plan, access control policy, vendor/third-party management policy, data retention and disposal policy
   - Regulation-specific policies: HIPAA privacy practices notice, GDPR data processing records, PCI DSS cardholder data policy, SOC 2 change management policy
   - Map each required policy to the regulation(s) mandating it

3. **Existing policy inventory:**
   - Catalog existing policies (ask user or review available documentation)
   - Assess each existing policy: last review date, approval status, version, owner
   - Identify outdated policies — not reviewed within required cadence (typically annual)
   - Identify policies with scope gaps — exist but do not cover all required topics

4. **Gap identification:**
   - Missing policies — required but do not exist at all
   - Outdated policies — exist but not reviewed/updated within required period
   - Incomplete policies — exist but missing required sections or coverage
   - Orphaned policies — no assigned owner or reviewer

5. **Policy development priority list:**
   - Rank by: number of regulations requiring the policy, audit timeline proximity, gap severity
   - Identify policies that can be combined (e.g., data protection + privacy into one)
   - Estimate effort per policy (draft: 2-5 days, review cycle: 1-2 weeks, approval: 1 week)
   - Identify templates available for each policy type

6. **Write the artifact** — append to `.singularskills/compliance/<project>/02-remediate.md` under a `## Policy Gaps` section. Create the file with a `# Remediate — <project>` heading if it does not exist; if a `## Policy Gaps` section already exists, replace only that section. The section contains:
   - **Policy Requirements Matrix** — table of required policies mapped to regulations
   - **Existing Policy Inventory** — current state assessment
   - **Missing Policies** — policies that must be created, ranked by priority
   - **Outdated Policies** — policies requiring review/update
   - **Policy Development Timeline** — sequenced plan with effort estimates
   - **Template Recommendations** — suggested templates or frameworks for each policy

## Output

The policy gap analysis appended to `.singularskills/compliance/<project>/02-remediate.md`. Present a summary to the user highlighting:
- Number of missing vs. outdated vs. adequate policies
- Top 3 priority policies to develop
- Estimated total effort for policy remediation
- Policies with highest cross-regulation impact

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"compliance-policy-gaps","workflow":"compliance","phase":2,"project":"<project>","event":"started","artifact":"02-remediate.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

This artifact is shared by every skill of phase 2 (Remediate). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Remediate
workflow: compliance
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Policy Gaps` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-policy-gaps`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Policy Gaps` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.
