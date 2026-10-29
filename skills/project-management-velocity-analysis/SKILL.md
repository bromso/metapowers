---
name: project-management-velocity-analysis
description: Analyze velocity over the last 5-10 sprints — average, variability, trend and causes — and forecast a delivery range for the next three. Use when the user has several sprints of history and asks how fast or how predictably the team delivers. Not for one sprint's results or choosing this sprint's stories; see /project-management-sprint-metrics or /project-management-sprint-planning.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 4
  artifact: 04-improve.md
---

# Velocity Analysis

Analyze velocity trends and predict capacity for "$ARGUMENTS". Chart historical velocity, calculate statistical measures, correlate changes with events, and recommend sprint commitment ranges.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"project-management","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for project context, team size, and sprint cadence
   - Read `.singularskills/project-management/<project>/03-review.md` if it exists (for sprint review results, sprint metrics, and historical velocity data)
   - Read `.singularskills/project-management/<project>/04-improve.md` if it exists (for retrospective action items and process changes that may have affected velocity)
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for sprint planning data, committed points, and estimation approach)
   - Read `.singularskills/project-management/<project>/02-sprint.md` if it exists (for sprint execution data and blocker history)

2. **Chart velocity over last 5-10 sprints:**
   - Collect completed story points for each of the last 5-10 sprints (or as many as are available)
   - Present velocity data as a table: sprint name/number, committed points, completed points, commitment ratio
   - Create a text-based chart showing velocity per sprint (horizontal bar chart or similar visualization)
   - If fewer than 5 sprints of data are available, note this limitation and adjust analysis accordingly
   - Separate velocity into categories if possible: new features, bug fixes, tech debt, unplanned work

3. **Calculate average velocity and standard deviation:**
   - Calculate the arithmetic mean of completed points across all available sprints
   - Calculate the standard deviation to measure velocity consistency
   - Calculate the coefficient of variation (standard deviation / mean x 100%) to express variability as a percentage
   - Interpret variability:
     - **< 15%** — highly predictable team, estimates are reliable
     - **15-30%** — normal variability, plan with a range
     - **> 30%** — high variability, investigate causes before relying on velocity for planning
   - If available, calculate a weighted moving average (more recent sprints weighted higher) for a more current picture

4. **Identify trends:**
   - Determine the overall velocity direction: improving, declining, or stable
   - Use linear regression direction across the data points to classify the trend:
     - **Improving** — positive slope, team is delivering more over time
     - **Declining** — negative slope, team is delivering less over time
     - **Stable** — slope near zero (within +/- 5% of average), consistent delivery
   - If the trend is improving, identify likely causes: team maturity, better estimation, process improvements, reduced tech debt
   - If the trend is declining, flag for investigation: team changes, increasing tech debt, morale issues, scope complexity growth
   - Note any outlier sprints (more than 2 standard deviations from the mean) and explain them separately

5. **Correlate velocity changes with events:**
   - Review the project timeline for events that may explain velocity changes:
     - **Team member changes** — new joins (ramp-up period reduces velocity), departures (knowledge loss)
     - **Holidays and vacations** — reduced capacity sprints
     - **Incidents and outages** — unplanned work displacing planned work
     - **Process changes** — new practices from retrospectives or process improvements
     - **Technical changes** — major refactors, platform migrations, new tools
   - Map each significant velocity change to its likely cause
   - Distinguish between temporary dips (holidays, incidents) and structural shifts (team size change, process change)
   - Note which events had the largest impact on velocity and how long recovery took

6. **Calculate sustainable velocity range:**
   - Define sustainable velocity as the range the team can reliably deliver without burnout
   - Calculate the range: average velocity +/- 1 standard deviation
   - This gives a low estimate (conservative) and high estimate (optimistic)
   - Exclude outlier sprints from the calculation if they were caused by one-time events
   - If the team has been consistently above average for 3+ sprints, consider updating the baseline upward
   - If the team has been consistently below average, investigate whether the average is still realistic

7. **Predict capacity for next 3 sprints:**
   - For each of the next 3 sprints, estimate expected capacity:
     - Start with the sustainable velocity range
     - Adjust for known factors: planned vacations, holidays, team changes, expected incidents
     - Express as a range: conservative (low end minus known reductions) to optimistic (high end with ideal conditions)
   - Flag any sprints with significantly reduced capacity (holidays, team members out)
   - If the team is mid-trend (improving or declining), factor the trend direction into predictions
   - Note confidence level for each prediction: high (stable team, good data), medium (some unknowns), low (major changes expected)

8. **Recommend sprint commitment range:**
   - Based on the analysis, recommend how many story points to commit to in the next sprint
   - Provide two numbers:
     - **Conservative commitment** — what the team can almost certainly deliver (low end of sustainable range, rounded down)
     - **Optimistic commitment** — what the team could deliver if everything goes well (average velocity, rounded to nearest whole number)
   - Recommend which number to use based on the team's situation:
     - Use conservative when: team is rebuilding confidence, new members are ramping up, high-risk work ahead
     - Use optimistic when: team is stable and predictable, work is well-understood, team has momentum
   - Note that velocity is a planning tool, not a performance metric — do not use it to pressure the team

9. **Write the artifact** — append to `.singularskills/project-management/<project>/04-improve.md` under a `## Velocity Analysis` section. Create the file with a `# Improve — <project>` heading if it does not exist; if a `## Velocity Analysis` section already exists, replace only that section. The section contains:
   - **Velocity History** — table and chart of velocity over last 5-10 sprints
   - **Statistical Summary** — average velocity, standard deviation, coefficient of variation
   - **Trend Analysis** — direction (improving/declining/stable) with supporting data
   - **Event Correlation** — velocity changes mapped to team and project events
   - **Sustainable Velocity Range** — calculated range with methodology
   - **Capacity Predictions** — next 3 sprints with expected ranges and confidence levels
   - **Commitment Recommendation** — conservative and optimistic commitment for next sprint with guidance on which to use

## Output

Velocity analysis appended to `.singularskills/project-management/<project>/04-improve.md`. Present a summary highlighting:
- Average velocity and variability (coefficient of variation)
- Trend direction with key contributing factors
- Sustainable velocity range
- Recommended commitment for next sprint (conservative and optimistic)
- Any sprints with reduced capacity in the next 3-sprint window

**Record the run.** This artifact is shared by every skill of phase 4 (Improve). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## Velocity Analysis` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-velocity-analysis`).

End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```
