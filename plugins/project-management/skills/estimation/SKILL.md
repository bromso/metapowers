---
description: Estimate work using story points, T-shirt sizing, or planning poker
---

# Estimation

Estimate the work for "$ARGUMENTS". Select an estimation method, establish reference stories for calibration, estimate each story relative to references, flag stories needing splitting, and calculate total backlog size and sprint projections.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for charter and team context
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for backlog, user stories, and roadmap)
   - Read `plugins/project-management/shared/scrum-guide.md` for Scrum alignment

2. **Select the estimation method:**
   - **Story points with Fibonacci scale (recommended):** 1, 2, 3, 5, 8, 13, 21 — measures relative complexity, effort, and uncertainty
   - **T-shirt sizing:** XS, S, M, L, XL — useful for early rough estimation before detailed planning
   - **Planning poker:** team-based estimation using story points with discussion rounds
   - Document the selected method and rationale
   - If the team has an existing preference, use that

3. **Establish reference stories (calibration):**
   - Select 2-3 well-understood stories from the backlog as reference points:
     - **"1" story** — the simplest meaningful change (e.g., update a label, add a tooltip)
     - **"5" story** — moderate complexity (e.g., build a form with validation, add a new API endpoint)
     - **"8" story** — significant complexity (e.g., implement a multi-step workflow, add a new integration)
   - Document why each reference story was chosen and what makes it that size
   - These references anchor all subsequent estimates

4. **Estimate each story relative to references:**
   - Compare each story to the reference stories: is it simpler, similar, or more complex?
   - Assign a story point value from the Fibonacci scale
   - Consider three dimensions: complexity (how hard?), effort (how much work?), uncertainty (how unknown?)
   - Document brief rationale for estimates that may be surprising (very high or very low)
   - For T-shirt sizing: map XS=1, S=2, M=3-5, L=8, XL=13+

5. **Flag stories that need splitting:**
   - Any story estimated at >13 points should be flagged for splitting
   - Stories at 13 points should be reviewed — can they be split for lower risk?
   - For flagged stories, suggest splitting strategies (by workflow, data variation, operation, or persona)
   - Re-estimate the split stories

6. **Calculate total backlog size:**
   - Sum all story points across the entire backlog
   - Break down by epic, theme, priority (Must/Should/Could), and release milestone
   - Calculate MVP size (total points for Must-have or Release 1 stories)
   - Identify the largest epics and any estimation outliers

7. **Estimate sprint and timeline projections:**
   - For new teams: assume velocity of 20-30 points per sprint (start conservative at 20)
   - For existing teams: use average of last 3 sprints as velocity baseline
   - Calculate: number of sprints = total backlog size / expected velocity
   - Project timeline: number of sprints x sprint length
   - Calculate MVP delivery estimate separately
   - Add buffer: +20% for known risks, +40% for high-uncertainty projects
   - Compare projected timeline with roadmap milestones — flag misalignments

8. **Write the artifact** — append to `.project/$ARGUMENTS/01-plan.md` under a `## Estimation` section:
   - **Method** — selected estimation approach and rationale
   - **Reference Stories** — calibration stories with point values and rationale
   - **Estimated Backlog** — each story with its estimate, organized by epic
   - **Stories to Split** — flagged stories with recommended splitting strategies
   - **Backlog Size Summary** — total points, breakdown by epic/priority/release
   - **Sprint Projections** — velocity assumption, number of sprints, projected timeline, buffer

## Output

Estimation appended to `.project/$ARGUMENTS/01-plan.md`. Present a summary highlighting:
- Estimation method used and reference stories selected
- Total backlog size in story points
- MVP size and estimated delivery timeline
- Number of stories flagged for splitting
- Projected number of sprints with buffer
