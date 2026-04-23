---
description: Assess team health across dimensions — morale, pace, collaboration, clarity
---

# Team Health Check

Assess team health across key dimensions for "$ARGUMENTS". Evaluate 8 dimensions of team effectiveness, identify strengths and concerns, and recommend targeted interventions for improvement.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for project context, team setup, and ways of working
   - Read `.project/$ARGUMENTS/03-review.md` if it exists (for sprint metrics, velocity trends, and delivery performance)
   - Read `.project/$ARGUMENTS/04-improve.md` if it exists (for retrospective themes, previous health checks, and process improvements)
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for standup history, blocker patterns, and daily team interactions)

2. **Assess 8 dimensions:**
   - For each dimension, gather input from the user (or team members) and rate on a 1-5 scale
   - Apply a traffic light indicator based on the rating: green (4-5), amber (3), red (1-2)
   - Support the rating with specific evidence from sprint data, retrospectives, and observations

   **Dimension 1 — Mission clarity:**
   - Does everyone on the team understand the project's purpose and goals?
   - Can each team member articulate why the current work matters?
   - Are sprint goals connected to a larger product vision?
   - Evidence to look for: clear project charter, consistent sprint goals, team members pulling in the same direction

   **Dimension 2 — Pace sustainability:**
   - Is the team working at a pace they can maintain long-term?
   - Are people regularly working overtime or feeling burned out?
   - Has velocity been stable, or are there signs of exhaustion (declining velocity, increasing sick days)?
   - Evidence to look for: consistent velocity, no weekend work, people taking breaks and holidays

   **Dimension 3 — Collaboration quality:**
   - Do team members help each other proactively?
   - Is knowledge shared or siloed in individuals?
   - Are code reviews constructive and timely?
   - Evidence to look for: pair programming, shared ownership of code areas, quick PR turnaround, cross-training

   **Dimension 4 — Technical health:**
   - Is the codebase manageable and well-maintained?
   - Is technical debt being addressed or accumulating?
   - Are deployments smooth and low-risk?
   - Evidence to look for: test coverage trends, deployment frequency, incident rate, tech debt backlog size

   **Dimension 5 — Learning and growth:**
   - Are team members developing new skills and knowledge?
   - Is there time for experimentation and learning?
   - Do people have clear growth paths?
   - Evidence to look for: conference attendance, learning sprints, new technologies adopted, mentoring happening

   **Dimension 6 — Organizational support:**
   - Does the broader organization help or hinder the team's work?
   - Are dependencies on other teams managed effectively?
   - Does leadership shield the team from unnecessary disruptions?
   - Evidence to look for: quick decision-making from stakeholders, minimal mid-sprint scope changes, adequate tooling and infrastructure

   **Dimension 7 — Fun and engagement:**
   - Do people enjoy their work and look forward to contributing?
   - Is there a positive team culture with trust and psychological safety?
   - Do people volunteer for tasks and bring energy to discussions?
   - Evidence to look for: participation in meetings, initiative taking, social interactions, low turnover intent

   **Dimension 8 — Delivery confidence:**
   - Does the team believe it can deliver what it commits to?
   - Are estimates accurate and commitments realistic?
   - Does the team feel in control of its delivery process?
   - Evidence to look for: commitment ratio trends, sprint goal achievement rate, team's own confidence assessment

3. **Identify top strength and top concern:**
   - Select the highest-rated dimension as the team's top strength
   - Explain why this is a strength and how the team can leverage and protect it
   - Select the lowest-rated dimension as the team's top concern
   - Explain the impact of this weakness on the team's overall effectiveness
   - If multiple dimensions tie, consider which has the most downstream impact on other dimensions

4. **Compare to previous health checks:**
   - If `.project/$ARGUMENTS/04-improve.md` contains previous team health check data, compare ratings
   - Note which dimensions improved, declined, or stayed the same
   - Correlate changes with events or interventions from the interim period
   - Flag any dimension that has been red for 2 or more consecutive health checks — this requires escalation

5. **Recommend targeted interventions:**
   - For the weakest dimension (or the two weakest if they are close), recommend 1-2 specific interventions
   - Each intervention must be:
     - **Specific** — not "improve communication" but "hold a 15-minute daily sync focused on cross-team dependencies"
     - **Actionable** — something the team can start in the next sprint
     - **Measurable** — with a clear indicator of whether it is working
     - **Time-boxed** — try it for 2-4 sprints before evaluating
   - Consider both quick fixes (address symptoms now) and root cause fixes (address underlying issues)
   - Note any interventions that require support from outside the team

6. **Write the artifact** — append to `.project/$ARGUMENTS/04-improve.md` under a `## Team Health Check` section:
   - **Assessment Date** — when this health check was conducted
   - **Dimension Ratings** — table with all 8 dimensions, their 1-5 rating, traffic light, and key evidence
   - **Top Strength** — highest-rated dimension with explanation
   - **Top Concern** — lowest-rated dimension with impact analysis
   - **Trend Comparison** — changes from previous health check (if available)
   - **Recommended Interventions** — 1-2 specific actions for the weakest dimension(s) with success criteria
   - **Next Health Check** — recommended date for the follow-up assessment

## Output

Team health check appended to `.project/$ARGUMENTS/04-improve.md`. Present a summary highlighting:
- All 8 dimensions with ratings and traffic lights in a table
- Top strength and top concern
- Trend direction from previous health check (if available)
- Recommended interventions with expected outcomes
