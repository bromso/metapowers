---
description: Define or refine the sprint goal and commitment
---

# Sprint Goal

Define or refine the sprint goal for "$ARGUMENTS". Craft a clear goal statement, define success criteria, and distinguish committed work from stretch goals.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for project vision and objectives
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for backlog, roadmap, and sprint planning artifacts)
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for previous sprint goals and outcomes)

2. **Craft the sprint goal statement:**
   - Write one clear sentence describing what the team will deliver and why it matters
   - The goal should be outcome-oriented, not task-oriented
   - It should answer: "At the end of this sprint, what will be true that is not true today?"
   - Good examples: "Users can complete checkout end-to-end" or "Search returns relevant results within 200ms"
   - Bad examples: "Complete tickets PROJ-101 through PROJ-115" or "Work on the backend"
   - The goal must be achievable within the sprint timebox

3. **Define success criteria:**
   - List 3-5 specific, measurable criteria that define "what does success look like at sprint end"
   - Each criterion should be verifiable: someone can look at it and say yes or no
   - Include both functional criteria (features work) and quality criteria (tests pass, no regressions)
   - Examples: "User can sign up with email and password," "API response time under 500ms," "All acceptance criteria for stories X, Y, Z are met"

4. **Distinguish committed vs. stretch work:**
   - **Committed work:** stories the team is confident they will complete (80% confidence or higher)
   - **Stretch goals:** stories the team will attempt if committed work finishes early
   - Committed work should directly support the sprint goal
   - Stretch goals may support the sprint goal or address other priorities
   - Be explicit about the boundary — the team should know exactly what is committed

5. **Create a rallying statement:**
   - Distill the sprint goal into a short phrase the team can rally around
   - This is the elevator pitch version: if someone asks "what are you working on this sprint?" the answer is this phrase
   - It should be memorable and motivating, not bureaucratic

6. **Write the artifact** — append to `.project/$ARGUMENTS/02-sprint.md` under a `## Sprint Goal` section:
   - **Sprint Goal Statement** — one clear sentence
   - **Success Criteria** — 3-5 measurable criteria
   - **Committed Work** — stories the team commits to completing
   - **Stretch Goals** — stories to attempt if capacity allows
   - **Rallying Statement** — short phrase for the team

## Output

Sprint goal appended to `.project/$ARGUMENTS/02-sprint.md`. Present a summary highlighting:
- The sprint goal statement
- Number of success criteria defined
- Committed story count and point total
- Stretch goal count and point total
- The rallying statement
