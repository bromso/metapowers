---
name: leadership-assess
description: Assess your leadership style, each team member's maturity and the team's current challenges, and recommend what to tackle first. Use when the user is new to leading a team or has inherited one and wants to know where to start as its leader. Not for a health check of a delivery team; see /project-management-team-health.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: leadership
  phase: 1
  artifact: 01-assess.md
---

# Assess

Assess the leadership landscape for "$ARGUMENTS". Understand your leadership style, evaluate team maturity, and identify the key challenges to address.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"leadership-assess","workflow":"leadership","phase":1,"project":"<project>","event":"skipped","artifact":"01-assess.md","note":"<reason or \"none given\">"}`.

## Prerequisites

None — this is the first phase.

## Process

1. **Ask leadership assessment questions:**
   - What is your role? (team lead, manager, director, founder)
   - How large is your team? What are their experience levels?
   - What's your current leadership challenge? (new team, scaling, conflict, performance, culture)
   - How do you currently communicate with your team? (1:1s, standups, async)
   - What's working well? What's not?

2. **Assess team maturity:**
   - For each team member: how experienced are they in their role?
   - Who needs more direction vs. more autonomy? (Situational Leadership)
   - Where are the skill gaps?
   - What's the team's morale and engagement level?

3. **Identify leadership style:**
   - Based on answers, identify the user's natural leadership tendencies
   - Recommend style adjustments based on team maturity
   - Flag potential blind spots

4. **Write the artifact** to `.singularskills/leadership/<project>/01-assess.md` with sections:
   - **Leadership Profile** — role, style, strengths, blind spots
   - **Team Assessment** — each member's maturity level and needs
   - **Current Challenges** — prioritized list of issues to address
   - **Recommended Focus** — what to tackle first in the Vision phase

## Output

The assessment written to `.singularskills/leadership/<project>/01-assess.md`. Present a summary highlighting:
- Leadership style identified
- Team maturity overview
- Top 3 challenges to address

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work: `{"ts":"<ISO timestamp>","skill":"leadership-assess","workflow":"leadership","phase":1,"project":"<project>","event":"started","artifact":"01-assess.md","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: leadership-assess
workflow: leadership
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```
