---
name: leadership-build
description: Structure a team's roles, ownership areas, RAPID decision rights, per-person delegation levels and collaboration norms. Use when the user's team has unclear ownership, duplicated work or everything escalating to them, and needs to settle who owns what. Not for handing off a single task; see /leadership-delegate.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: leadership
  phase: 3
  artifact: 03-build.md
---

# Build

Structure the team for "$ARGUMENTS". Define roles, responsibilities, ownership areas, and establish a delegation framework.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"leadership-build","workflow":"leadership","phase":3,"project":"<project>","event":"skipped","artifact":"03-build.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/leadership/<project>/01-assess.md` and `.singularskills/leadership/<project>/02-vision.md`. If `02-vision.md` does not exist, tell the user:

> Phase 2 (Vision) has not been completed for "<project>". Run `/leadership-vision <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/leadership/<project>/01-assess.md` for team assessment
   - Read `.singularskills/leadership/<project>/02-vision.md` for values and culture
   - Read `references/decision-frameworks.md`

2. **Define team structure:**
   - Map each team member's role and primary responsibilities
   - Identify ownership areas — who owns what?
   - Clarify decision rights using the RAPID framework
   - Identify gaps: any roles or skills missing?

3. **Create delegation framework:**
   - For each team member: what can they own autonomously?
   - What needs consultation before deciding?
   - What do you retain as leader?
   - Match delegation level to team member maturity (from Assess)

4. **Define collaboration norms:**
   - How does work get assigned and tracked?
   - What's the escalation path for blockers?
   - How do team members collaborate across ownership areas?

5. **Write the artifact** to `.singularskills/leadership/<project>/03-build.md` with sections:
   - **Team Structure** — roles, responsibilities, ownership map
   - **Decision Rights** — RAPID matrix for key decision types
   - **Delegation Framework** — per-person autonomy levels
   - **Collaboration Norms** — assignment, tracking, escalation

## Output

The team structure written to `.singularskills/leadership/<project>/03-build.md`. Present a summary highlighting:
- Ownership map
- Key delegation decisions
- Any gaps identified

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"leadership-build","workflow":"leadership","phase":3,"project":"<project>","event":"started","artifact":"03-build.md","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: leadership-build
workflow: leadership
phase: 3
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
