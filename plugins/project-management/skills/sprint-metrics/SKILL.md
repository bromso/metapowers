---
description: Calculate and analyze sprint metrics — velocity, burndown, cycle time
---

# Sprint Metrics

Calculate and analyze sprint metrics for "$ARGUMENTS". Measure velocity, analyze burndown, calculate cycle time and commitment ratio, identify outlier stories, and generate trend recommendations.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for project context and team setup
   - Read `.project/$ARGUMENTS/03-review.md` if it exists (for sprint review and completed stories)
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for sprint state, standup history, and daily progress)
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for sprint backlog, estimates, and velocity targets)

2. **Calculate velocity:**
   - Count total story points completed this sprint (only stories that met their definition of done)
   - Do not count partially completed stories — they carry over to the next sprint at full points
   - Note the committed velocity (what was planned) vs. actual velocity (what was delivered)
   - Express velocity as a single number: X story points completed in this sprint

3. **Compare velocity to last 3-5 sprints:**
   - If historical sprint data is available, list velocity for each of the last 3-5 sprints
   - Calculate the average velocity across those sprints
   - Calculate the velocity trend: improving (upward over 3+ sprints), declining (downward over 3+ sprints), or stable (within +/- 10% of average)
   - If this sprint's velocity is significantly different from the average (more than 20% higher or lower), note the likely cause
   - If no historical data is available, note this as the baseline sprint and skip trend analysis

4. **Analyze burndown:**
   - Compare actual burndown to ideal burndown line (linear from total points to zero over sprint days)
   - Identify patterns in the burndown:
     - **Flat start:** no points completed in the first few days (stories too large, slow ramp-up)
     - **Cliff at end:** most points completed in the last 1-2 days (stories not broken down enough, deadline pressure)
     - **Scope increase:** total points went up mid-sprint (late additions, scope creep)
     - **Smooth decline:** steady progress throughout (healthy sprint)
   - Note any scope changes: stories added or removed mid-sprint, with the reason
   - Calculate the gap between actual and ideal burndown at the midpoint of the sprint

5. **Calculate cycle time per story:**
   - For each completed story, calculate days from "in progress" to "done"
   - Calculate the average cycle time across all completed stories
   - Calculate the median cycle time (less affected by outliers than the average)
   - Break down cycle time by phase if data is available: development time, review time, testing time
   - Compare cycle time to story size: do larger stories (more points) take proportionally longer?

6. **Calculate commitment ratio:**
   - Commitment ratio = (completed story points / committed story points) x 100%
   - Interpret the ratio:
     - **> 100%:** team completed more than committed (stretch goals pulled in, or undercommitted)
     - **80-100%:** healthy range, team is committing accurately
     - **60-80%:** underperforming, investigate causes (overcommitment, blockers, estimation issues)
     - **< 60%:** significant gap, sprint was disrupted or estimates were far off
   - Compare to previous sprints' commitment ratios to see if accuracy is improving

7. **Identify outlier stories:**
   - Find stories that took significantly longer than estimated (actual cycle time > 2x expected)
   - For each outlier, document: the story, estimated vs. actual effort, and the root cause
   - Common causes: unclear requirements, unexpected technical complexity, dependency delays, scope expansion
   - Find stories completed much faster than estimated (actual < 0.5x expected) — these suggest overestimation
   - Use outlier analysis to improve future estimation accuracy

8. **Generate trend recommendations:**
   - Based on all metrics, provide 3-5 actionable recommendations:
     - If velocity is declining: investigate causes (team changes, technical debt, morale)
     - If commitment ratio is consistently low: reduce sprint scope or improve estimation
     - If cycle time is increasing: break stories smaller, reduce WIP, improve review speed
     - If burndown shows cliff pattern: encourage daily progress, break stories into smaller tasks
     - If scope changes are frequent: improve sprint planning and protect the sprint backlog
   - Prioritize recommendations by impact on team effectiveness
   - Note what is going well — metrics are not just about finding problems

9. **Write the artifact** — append to `.project/$ARGUMENTS/03-review.md` under a `## Sprint Metrics` section:
   - **Velocity** — this sprint's velocity, committed vs. actual
   - **Velocity Trend** — comparison to last 3-5 sprints with trend classification
   - **Burndown Analysis** — actual vs. ideal burndown pattern and observations
   - **Cycle Time** — average and median cycle time per story, breakdown by phase if available
   - **Commitment Ratio** — percentage with interpretation and trend
   - **Outlier Stories** — stories that deviated significantly from estimates with root causes
   - **Trend Recommendations** — 3-5 actionable recommendations based on metrics

## Output

Sprint metrics appended to `.project/$ARGUMENTS/03-review.md`. Present a summary highlighting:
- Sprint velocity (actual vs. committed)
- Velocity trend (improving/declining/stable)
- Average cycle time per story
- Commitment ratio with interpretation
- Top recommendation for improving team effectiveness
