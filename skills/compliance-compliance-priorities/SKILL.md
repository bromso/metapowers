---
name: compliance-compliance-priorities
description: Prioritize the applicable regulations by business impact, deadline urgency and effort into three tiers, with quick wins and certification dependencies. Use when the user has a list of regulations or certifications and asks which ones to tackle first or which customers will demand soonest.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 0
  artifact: 00-scope.md
---

# Compliance Priorities

Prioritize the applicable regulations for "$ARGUMENTS" by business impact, enforcement deadlines, and customer demand to determine the optimal compliance sequence.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"compliance-compliance-priorities","workflow":"compliance","phase":0,"project":"<project>","event":"skipped","artifact":"00-scope.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"compliance-compliance-priorities","workflow":"compliance","phase":0,"project":"<project>","event":"started","artifact":"00-scope.md","note":""}`.

None — this is a Phase 0 (Scope) skill.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for the regulation inventory

2. **Business impact scoring:**
   - For each applicable regulation, score revenue at risk without certification (0-10)
   - Assess deal-blocking potential — how often is this certification requested in sales cycles?
   - Estimate market access impact — does non-compliance lock out entire markets or verticals?

3. **Urgency scoring:**
   - Score enforcement deadline proximity (0-10) — active enforcement vs. upcoming vs. future
   - Score customer deadline pressure (0-10) — immediate customer requirements vs. nice-to-have
   - Flag any regulations with imminent deadlines or recent enforcement actions

4. **Effort scoring:**
   - Score implementation complexity (0-10) — scope of changes needed
   - Estimate time to certification (months)
   - Assess internal capability gaps — can this be done in-house or requires external help?

5. **Priority ranking:**
   - Calculate weighted priority score (business impact 40%, urgency 35%, inverse effort 25%)
   - Rank regulations from highest to lowest priority
   - Identify quick wins (high impact, low effort) vs. strategic investments (high impact, high effort)
   - Group into tiers: Tier 1 (immediate), Tier 2 (next 6 months), Tier 3 (12+ months)

6. **Write the artifact** — append to `.singularskills/compliance/<project>/00-scope.md` under a `## Compliance Priorities` section. Create the file with a `# Scope — <project>` heading if it does not exist; if a `## Compliance Priorities` section already exists, replace only that section. The section contains:
   - **Scoring Matrix** — table with impact, urgency, effort, and weighted scores per regulation
   - **Priority Tiers** — Tier 1/2/3 groupings with rationale
   - **Quick Wins** — low-effort, high-impact regulations to tackle first
   - **Strategic Investments** — high-effort certifications that unlock major business value
   - **Dependencies** — regulations that build on each other (e.g., ISO 27001 before CSA STAR)

## Output

The priority analysis appended to `.singularskills/compliance/<project>/00-scope.md`. Present a summary to the user highlighting:
- Top 3 priority regulations and why
- Identified quick wins
- Key dependencies between certifications
- Recommended next step: run `/compliance-control-framework <project>`

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"compliance-compliance-priorities","workflow":"compliance","phase":0,"project":"<project>","event":"finished","artifact":"00-scope.md","note":""}`.

This artifact is shared by every skill of phase 0 (Scope). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Scope
workflow: compliance
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Compliance Priorities` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `compliance-compliance-priorities`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Compliance Priorities` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.
