---
name: project-management-process-improvement
description: Analyze process bottlenecks across sprints — recurring retro themes, flow bottlenecks, a value stream map with flow efficiency — into a prioritized improvement backlog. Use when the same problems keep coming up sprint after sprint and the user wants to find the constraint and decide what to change. Not for running a single retro; see /project-management-retrospective.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 4
  artifact: 04-improve.md
---

# Process Improvement

Analyze process bottlenecks and propose improvements for "$ARGUMENTS". Identify recurring themes across retrospectives, map the value stream, and create a prioritized improvement backlog based on impact and effort.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-process-improvement","workflow":"project-management","phase":4,"project":"<project>","event":"skipped","artifact":"04-improve.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 4 (Improve) of the Scrum workflow (`project-management`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `project-management` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-process-improvement","workflow":"project-management","phase":4,"project":"<project>","event":"refused","artifact":"04-improve.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-process-improvement","workflow":"project-management","phase":4,"project":"<project>","event":"started","artifact":"04-improve.md","note":""}`.

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for project context and team setup
   - Read `.singularskills/project-management/<project>/03-review.md` if it exists (for sprint review results, sprint metrics, velocity trends, and commitment ratios)
   - Read `.singularskills/project-management/<project>/04-improve.md` if it exists (for retrospective action items, previous process improvements, and team health data)
   - Read `.singularskills/project-management/<project>/02-sprint.md` if it exists (for standup history, blocker log, and daily flow patterns)
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for sprint planning data and estimation accuracy)

2. **Identify recurring themes across retrospectives:**
   - Review all retrospective action items and themes from `.singularskills/project-management/<project>/04-improve.md`
   - Flag any blocker, complaint, or theme that has appeared in 2 or more retrospectives
   - Categorize recurring themes: process issues, tooling gaps, communication breakdowns, skill gaps, external dependencies
   - Note which action items were committed to but never completed — these represent systemic resistance to change
   - Identify the top 3 recurring themes by frequency and severity

3. **Analyze flow bottlenecks:**
   - Examine where work piles up in the team's workflow by reviewing sprint data
   - Check each stage for signs of bottleneck:
     - **Backlog refinement** — are stories entering sprints without clear requirements?
     - **Development** — are developers blocked waiting for decisions, designs, or dependencies?
     - **Code review** — are PRs sitting in review for more than 1 day on average?
     - **Testing** — is QA a single point of failure? Are bugs found late in the cycle?
     - **Deployment** — is the release process manual, risky, or infrequent?
   - Quantify each bottleneck where possible: average wait time, number of items stuck, frequency of occurrence
   - Rank bottlenecks by their impact on overall flow (the biggest constraint limits the whole system)

4. **Map the current value stream:**
   - Document the journey of a typical story from idea to production
   - For each stage, estimate:
     - **Process time** — how long active work takes at this stage
     - **Wait time** — how long the item sits idle between stages
     - **Rework rate** — how often items are sent back to a previous stage
   - Calculate total lead time (idea to production) and total process time (actual work)
   - Calculate flow efficiency: process time / lead time x 100% (typical teams are 15-25% efficient)
   - Identify the stages with the highest wait time — these are the improvement opportunities

5. **Propose specific process changes:**
   - For each identified bottleneck or recurring theme, propose a concrete process change
   - Each proposal must include:
     - **Problem statement** — what is happening and its measurable impact
     - **Proposed change** — what specifically to do differently
     - **Expected outcome** — what improvement to expect and how to measure it
     - **Risks** — what could go wrong with this change
   - Ensure proposals are actionable by the team (not "management should do X" but things the team controls)
   - Consider both technical solutions (automation, tooling) and process solutions (ceremonies, agreements)

6. **Estimate effort for each change:**
   - Rate each proposed change on implementation effort: Low (< 1 day), Medium (1-5 days), High (> 5 days)
   - Consider the type of effort required: tooling setup, habit change, organizational approval, training
   - Note which changes require buy-in from outside the team (stakeholders, other teams, leadership)
   - Identify any changes that can be tried as experiments with easy rollback

7. **Prioritize improvements by impact/effort ratio:**
   - Score each improvement on impact (1-5) and effort (1-5, where 1 is lowest effort)
   - Calculate the impact/effort ratio for each improvement
   - Categorize into quadrants:
     - **Quick wins** (high impact, low effort) — do these first
     - **Strategic investments** (high impact, high effort) — plan and schedule these
     - **Easy fills** (low impact, low effort) — do when convenient
     - **Avoid** (low impact, high effort) — deprioritize or discard
   - Recommend the top 3 improvements to pursue in the next sprint or iteration

8. **Create improvement backlog:**
   - List all proposed improvements as backlog items, ordered by priority
   - For each item, include: description, expected impact, effort estimate, owner (if assigned), target date
   - Mark which items are experiments (time-boxed trials) vs. permanent changes
   - Note dependencies between improvements (e.g., "automate deployment" before "increase release frequency")
   - Schedule a review checkpoint to evaluate whether implemented changes had the expected effect

9. **Write the artifact** — append to `.singularskills/project-management/<project>/04-improve.md` under a `## Process Improvement` section. Create the file with a `# Improve — <project>` heading if it does not exist; if a `## Process Improvement` section already exists, replace only that section. The section contains:
   - **Recurring Themes** — top themes from retrospectives with frequency and severity
   - **Flow Bottlenecks** — ranked bottlenecks with quantified impact
   - **Value Stream Map** — stages from idea to production with process time, wait time, and flow efficiency
   - **Proposed Changes** — each proposal with problem, solution, expected outcome, and risks
   - **Impact/Effort Matrix** — all improvements plotted by impact and effort with quadrant classification
   - **Improvement Backlog** — prioritized list of improvements with owners and target dates
   - **Review Checkpoint** — date and criteria for evaluating whether changes are working

## Output

Process improvement analysis appended to `.singularskills/project-management/<project>/04-improve.md`. Present a summary highlighting:
- Top 3 recurring themes across retrospectives
- Biggest flow bottleneck and its measured impact
- Flow efficiency percentage (process time vs. lead time)
- Top 3 recommended improvements (quick wins first)
- Review checkpoint date for evaluating results

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-process-improvement","workflow":"project-management","phase":4,"project":"<project>","event":"finished","artifact":"04-improve.md","note":""}`.

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

Open your `## Process Improvement` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-process-improvement`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Process Improvement` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
