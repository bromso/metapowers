---
name: research-deliver
description: Validate the leading solution concept against evidence and success criteria and turn it into a final recommendation with action items and risks. Use when a preferred solution has emerged and the user wants to know whether it holds up and what to do next.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: research
  phase: 4
  artifact: 04-deliver.md
---

# Deliver

Converge on the final recommendation for "$ARGUMENTS". Validate the top solution concept(s) with evidence, refine the approach, and produce actionable recommendations.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"research","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/research/<project>/01-discover.md`, `.singularskills/research/<project>/02-define.md`, and `.singularskills/research/<project>/03-design.md`.

If `03-design.md` does not exist, tell the user:

> Phase 3 (Design) has not been completed for "<project>". Run `/research-design <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read all prior artifacts:**
   - Read `.singularskills/research/<project>/01-discover.md` for original research
   - Read `.singularskills/research/<project>/02-define.md` for problem statement and success criteria
   - Read `.singularskills/research/<project>/03-design.md` for recommended solutions and validation plan

2. **Validate the top solution(s):**
   - Use WebSearch to find evidence supporting or contradicting the recommended approach
   - Use WebFetch to read detailed case studies of similar implementations
   - Look for: success stories, failure modes, edge cases, unintended consequences
   - Test each assumption identified in the Design phase

3. **Assess against success criteria:**
   - Review each success criterion from the Define phase
   - For each criterion, document evidence that the solution meets it (or doesn't)
   - Flag any criteria that can't be validated with desk research alone

4. **Refine recommendations:**
   - Adjust the solution based on validation findings
   - Add implementation considerations discovered during validation
   - Identify quick wins vs. long-term investments
   - Note dependencies and prerequisites

5. **Write the artifact** to `.singularskills/research/<project>/04-deliver.md` with sections:
   - **Executive Summary** — one-paragraph recommendation
   - **Validation Findings** — evidence for/against the solution, organized by assumption
   - **Success Criteria Assessment** — each criterion with evidence status
   - **Final Recommendation** — refined solution with implementation approach
   - **Action Items** — prioritized next steps with owners/timelines if applicable
   - **Risks & Mitigations** — remaining risks and how to handle them
   - **Research Journey** — brief timeline of what was discovered across all 4 phases

## Output

The final deliverable written to `.singularskills/research/<project>/04-deliver.md`. Present a summary to the user highlighting:
- The final recommendation (1-2 sentences)
- Confidence level based on evidence strength
- Top 3 action items
- Key risks to watch

**Record the run.** Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: research-deliver
workflow: research
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```
