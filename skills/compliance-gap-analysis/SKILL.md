---
name: compliance-gap-analysis
description: Aggregate the findings from every regulation assessment into one deduplicated gap register, scored by risk, effort and urgency, with quick wins and root causes. Use when several regulation assessments are done and the user asks which gaps to fix first across all of them. Not for a gap check against a single security framework; see /security-compliance-gap.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 2
  artifact: 02-remediate.md
---

# Gap Analysis

Aggregate findings across all assessments for "$ARGUMENTS" into a prioritized gap register. Deduplicate gaps that appear across multiple regulations and score by risk, effort, and regulatory urgency.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-gap-analysis","workflow":"compliance","phase":2,"project":"<project>","event":"skipped","artifact":"02-remediate.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-gap-analysis","workflow":"compliance","phase":2,"project":"<project>","event":"refused","artifact":"02-remediate.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"compliance-gap-analysis","workflow":"compliance","phase":2,"project":"<project>","event":"started","artifact":"02-remediate.md","note":""}`.

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and control framework context
   - Read all assessment files from `.singularskills/compliance/<project>/01-assess/` directory

2. **Aggregate findings:**
   - Extract all non-compliant and partially-compliant findings from each assessment
   - Normalize finding descriptions for consistent comparison
   - Identify common root causes across findings

3. **Deduplicate gaps:**
   - Identify the same gap appearing across multiple regulation assessments
   - Merge duplicates into a single gap entry listing all affected regulations
   - Preserve regulation-specific nuances in the merged entry

4. **Score each gap:**
   - **Risk score (1-10):** What happens if not addressed? Consider regulatory penalties, data breach exposure, business disruption, reputational damage
   - **Effort score (1-10):** Implementation complexity — technical difficulty, organizational change required, third-party dependencies, timeline
   - **Regulatory urgency (1-10):** Deadline proximity, active enforcement, customer-blocking potential

5. **Prioritize and categorize:**
   - Calculate weighted priority score (risk 40%, urgency 35%, inverse effort 25%)
   - Identify quick wins — low effort, high risk reduction
   - Identify critical gaps — high risk regardless of effort
   - Identify strategic improvements — high effort but significant long-term value

6. **Write the artifact** — append to `.singularskills/compliance/<project>/02-remediate.md` under a `## Gap Analysis` section. Create the file with a `# Remediate — <project>` heading if it does not exist; if a `## Gap Analysis` section already exists, replace only that section. The section contains:
   - **Gap Register** — table with gap ID, description, affected regulations, risk score, effort score, urgency score, weighted priority
   - **Quick Wins** — gaps that can be closed rapidly with high impact
   - **Critical Gaps** — highest risk items requiring immediate attention
   - **Root Cause Analysis** — common themes across gaps
   - **Cross-Regulation Impact** — gaps that affect the most regulations

## Output

The gap analysis appended to `.singularskills/compliance/<project>/02-remediate.md`. Present a summary to the user highlighting:
- Total number of unique gaps identified
- Number of quick wins
- Top 5 highest-priority gaps
- Cross-regulation coverage opportunities

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-gap-analysis","workflow":"compliance","phase":2,"project":"<project>","event":"finished","artifact":"02-remediate.md","note":""}`.

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

Open your `## Gap Analysis` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-gap-analysis`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Gap Analysis` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.
