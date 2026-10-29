---
name: leadership-vision
description: Define a team's purpose, 3-5 values with concrete behaviors, and the target culture for decisions, communication and conflict. Use when the user wants to articulate what their team stands for, write team values, or reset the team's culture.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: leadership
  phase: 2
  artifact: 02-vision.md
---

# Vision

Define the vision for "$ARGUMENTS". Establish the team's purpose, values, and the culture you want to cultivate.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"leadership-vision","workflow":"leadership","phase":2,"project":"<project>","event":"skipped","artifact":"02-vision.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/leadership/<project>/01-assess.md`. If this file does not exist, tell the user:

> Phase 1 (Assess) has not been completed for "<project>". Run `/leadership-assess <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/leadership/<project>/01-assess.md` for team assessment and challenges

2. **Define team purpose:**
   - Why does this team exist? What unique value does it deliver?
   - How does the team's work connect to the broader organization's mission?

3. **Establish team values:**
   - Ask the user: What behaviors do you want to see every day?
   - Define 3-5 team values with concrete behavioral examples
   - For each value: "We value X, which means we do Y and never do Z"

4. **Define target culture:**
   - What does a great day on this team look like?
   - How should decisions be made? (see decision-frameworks.md)
   - How should conflicts be handled?
   - What's the communication style? (async-first, meetings, docs)

5. **Write the artifact** to `.singularskills/leadership/<project>/02-vision.md` with sections:
   - **Team Purpose** — why the team exists
   - **Values** — 3-5 values with behavioral examples
   - **Culture Blueprint** — decision-making, communication, conflict norms
   - **Success Vision** — what "great" looks like in 6 months

## Output

The vision written to `.singularskills/leadership/<project>/02-vision.md`. Present a summary highlighting:
- Team purpose statement
- Core values
- Key cultural norms

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"leadership-vision","workflow":"leadership","phase":2,"project":"<project>","event":"started","artifact":"02-vision.md","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: leadership-vision
workflow: leadership
phase: 2
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
