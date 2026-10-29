---
name: project-management-retrospective
description: Facilitate a sprint retrospective — pick a format, review last sprint's actions, gather items, group themes, dot-vote and commit to 1-3 owned action items. Use when a sprint has ended and the team is holding its retro ceremony. Not for an incident review or a leader's team-development reflection; see /project-management-post-mortem or /leadership-retro.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 4
  artifact: 04-improve.md
---

# Retrospective

Facilitate a sprint retrospective for "$ARGUMENTS". Guide the team through a structured retrospective format, review previous action items, gather feedback, generate insights, and produce concrete action items with owners and deadlines.

See also `/leadership-retro` for a leader's Start/Stop/Continue reflection on how the team works together, rather than the sprint ceremony.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-retrospective","workflow":"project-management","phase":4,"project":"<project>","event":"skipped","artifact":"04-improve.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for project context and team setup
   - Read `.singularskills/project-management/<project>/03-review.md` if it exists (for sprint review results, metrics, and delivery data)
   - Read `.singularskills/project-management/<project>/04-improve.md` if it exists (for previous retrospective action items to review)
   - Read `references/retrospective-formats.md` for available format options

2. **Select retrospective format:**
   - Review the available formats from `retrospective-formats.md`: Start/Stop/Continue, 4Ls, Sailboat, Mad/Sad/Glad, Timeline
   - Consider the team's current situation to recommend a format:
     - **Start/Stop/Continue** — general-purpose, good for new teams or when no specific issue dominates
     - **4Ls** — balanced reflection covering positives and gaps, good for mid-project check-ins
     - **Sailboat** — visual and metaphor-driven, good for teams that enjoy creative exercises
     - **Mad/Sad/Glad** — quick emotional check-in, good for surfacing morale issues
     - **Timeline** — chronological reconstruction, good for long or eventful sprints
   - Ask the user which format they prefer, presenting the recommendation and alternatives
   - If the user does not specify, use the recommended format based on context

3. **Review previous action items:**
   - If `.singularskills/project-management/<project>/04-improve.md` exists, read the most recent retrospective's action items
   - For each previous action item, determine its status: completed, in progress, not started, abandoned
   - Discuss why any action items were not completed — was it deprioritized, forgotten, or blocked?
   - Carry forward any incomplete action items that are still relevant
   - Note patterns: are the same action items appearing repeatedly without resolution?

4. **Phase 1 — Set the stage (check-in):**
   - Open the retrospective with a brief check-in to set the tone
   - Ask each participant (or the user representing the team) to share one word or phrase describing how the sprint felt
   - Remind the team of the Prime Directive: "Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills and abilities, the resources available, and the situation at hand"
   - State the time-box for the retrospective and the chosen format

5. **Phase 2 — Gather data (brainstorm per format's categories):**
   - Using the selected format's categories, facilitate a brainstorming session
   - Prompt the user for items in each category with the format-specific questions
   - Encourage specific observations over vague complaints (not "communication was bad" but "we did not know about the API change until the day before release")
   - Capture all items without judgment or discussion at this stage
   - Reference sprint data from review and metrics artifacts to prompt reflection on specific events

6. **Phase 3 — Generate insights (group and discuss themes):**
   - Group related items across categories into themes (e.g., multiple items about code review delays become a "code review bottleneck" theme)
   - Name each theme clearly and concisely
   - For each theme, discuss:
     - Is this a new issue or a recurring pattern?
     - What is the impact on the team (velocity, morale, quality)?
     - What is the root cause, not just the symptom?
   - Rank themes by how many individual items contribute to each

7. **Phase 4 — Decide what to do (vote on top items):**
   - Apply dot voting: each person gets 3 dots to allocate across themes (can put multiple dots on one theme)
   - Tally votes and rank themes by total dots received
   - Focus discussion on the top 2-3 voted themes
   - For each top theme, brainstorm potential actions the team could take
   - Evaluate each potential action for feasibility and expected impact

8. **Phase 5 — Close (generate action items):**
   - From the discussion, commit to 1-3 specific action items (no more — fewer is better)
   - Each action item must have:
     - **What:** a clear, specific, measurable action (not "improve communication" but "create a shared Slack channel for API changes and post there before merging breaking changes")
     - **Who:** a single owner responsible for driving the action (not "the team")
     - **When:** a deadline or checkpoint date (usually before the next retrospective)
   - Confirm each action item with the team to ensure buy-in
   - Note any themes that were not addressed but should be revisited in the next retrospective

9. **Write the artifact** — append to `.singularskills/project-management/<project>/04-improve.md` under a `## Retrospective: [Sprint/Date]` section. Create the file with a `# Improve — <project>` heading if it does not exist; if a `## Retrospective: [Sprint/Date]` section already exists, replace only that section. The section contains:
   - **Format Used** — which retrospective format was selected and why
   - **Previous Action Items Review** — status of each action item from the last retrospective
   - **Check-In Summary** — overall team sentiment at the start
   - **Brainstorm Results** — items gathered per format category
   - **Themes Identified** — grouped themes with vote counts
   - **Action Items** — 1-3 specific actions with owner, deadline, and expected outcome
   - **Parking Lot** — themes not addressed that should be revisited

## Output

Retrospective appended to `.singularskills/project-management/<project>/04-improve.md`. Present a summary highlighting:
- Format used and team sentiment
- Top themes identified with vote counts
- Action items with owners and deadlines
- Any carried-forward items from the previous retrospective

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"project-management-retrospective","workflow":"project-management","phase":4,"project":"<project>","event":"started","artifact":"04-improve.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

This artifact is shared by every skill of phase 4 (Improve). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Improve
workflow: project-management
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Retrospective: [Sprint/Date]` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-retrospective`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Retrospective: [Sprint/Date]` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
