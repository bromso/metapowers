---
name: compliance-us-state-privacy
description: Assess compliance with US state comprehensive privacy laws such as Virginia, Colorado, Connecticut, Utah and newer states, with a cross-state matrix and common baseline. Use when the user has US consumers outside California and wants to assess which state privacy laws apply and how their own program meets all of them.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 1
  artifact: 01-assess/
---

# US State Privacy Law Assessment

Assess US state privacy law compliance for "$ARGUMENTS". Map applicable state laws, compare requirements, and create a cross-state compliance matrix.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-us-state-privacy","workflow":"compliance","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess/","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-us-state-privacy","workflow":"compliance","phase":1,"project":"<project>","event":"refused","artifact":"01-assess/","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-us-state-privacy","workflow":"compliance","phase":1,"project":"<project>","event":"started","artifact":"01-assess/","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `references/assessment-template.md` for output structure
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context

2. **Applicable state law mapping:**
   - Determine which state laws apply based on organizational operations and customer base
   - Assess applicability for established laws: Virginia VCDPA, Colorado CPA, Connecticut CTDPA, Utah UCPA
   - Assess applicability for newer laws: Texas TDPSA, Oregon OCPA, Montana MCDPA, Iowa ICDPA, Delaware DPDPA, New Jersey NJDPA, New Hampshire, Kentucky, Nebraska, Maryland, Minnesota, and others
   - Document applicability thresholds per state (consumer count, revenue, data processing volume)

3. **Cross-state requirement comparison:**
   - Compare consumer rights across states (access, delete, correct, portability, opt-out)
   - Identify opt-out vs opt-in consent models per state
   - Compare right to cure periods (30 days, 60 days, or none)
   - Map enforcement mechanisms (AG only vs private right of action)
   - Assess universal opt-out signal requirements per state

4. **Common baseline identification:**
   - Identify the most restrictive state as the compliance floor
   - Map common requirements shared across all applicable states
   - Highlight unique or unusual state-specific requirements
   - Assess whether a single compliance program can satisfy all states

5. **Unique state requirements:**
   - Assess Data Protection Impact Assessment (DPIA) requirements by state
   - Evaluate profiling and automated decision-making rights per state
   - Review sensitive data definitions and consent requirements (varies by state)
   - Assess children's data protections by state
   - Evaluate data broker registration requirements where applicable

6. **State-by-state compliance matrix:**
   - Create matrix: state vs requirement category (rights, notice, consent, DPIAs, enforcement)
   - Score compliance per state per category
   - Identify states with highest compliance gap
   - Prioritize remediation by enforcement risk and gap severity

7. **Write the artifact** to `.singularskills/compliance/<project>/01-assess/us-state-privacy.md` following the assessment template structure with:
   - **Applicable States** — list of states with applicability rationale
   - **Cross-State Matrix** — requirements comparison across all applicable states
   - **Common Baseline** — most restrictive floor requirements
   - **Unique Requirements** — state-specific obligations not covered by baseline
   - **Per-State Compliance Score** — per state, score = (Compliant + 0.5 × Partial) ÷ applicable requirements (N/A excluded), as a percentage
   - **Gap Analysis** — areas where current practices fall short per state
   - **Evidence Inventory** — existing evidence and evidence gaps
   - **Remediation Priorities** — ranked list of gaps to address

## Output

The US state privacy law assessment written to `.singularskills/compliance/<project>/01-assess/us-state-privacy.md`. Present a summary to the user highlighting:
- Number of applicable state laws and highest-risk states
- Common baseline compliance score — score = (Compliant + 0.5 × Partial) ÷ applicable common-baseline requirements (N/A excluded), as a percentage
- States with the largest compliance gaps
- Top 3 gaps requiring remediation

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-us-state-privacy","workflow":"compliance","phase":1,"project":"<project>","event":"finished","artifact":"01-assess/","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: compliance-us-state-privacy
workflow: compliance
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.
