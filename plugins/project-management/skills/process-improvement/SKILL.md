---
description: Analyze process bottlenecks and propose improvements
---

# Process Improvement

Analyze process bottlenecks and propose improvements for "$ARGUMENTS". Identify recurring themes across retrospectives, map the value stream, and create a prioritized improvement backlog based on impact and effort.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for project context and team setup
   - Read `.project/$ARGUMENTS/03-review.md` if it exists (for sprint review results, sprint metrics, velocity trends, and commitment ratios)
   - Read `.project/$ARGUMENTS/04-improve.md` if it exists (for retrospective action items, previous process improvements, and team health data)
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for standup history, blocker log, and daily flow patterns)
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for sprint planning data and estimation accuracy)

2. **Identify recurring themes across retrospectives:**
   - Review all retrospective action items and themes from `.project/$ARGUMENTS/04-improve.md`
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

9. **Write the artifact** — append to `.project/$ARGUMENTS/04-improve.md` under a `## Process Improvement` section:
   - **Recurring Themes** — top themes from retrospectives with frequency and severity
   - **Flow Bottlenecks** — ranked bottlenecks with quantified impact
   - **Value Stream Map** — stages from idea to production with process time, wait time, and flow efficiency
   - **Proposed Changes** — each proposal with problem, solution, expected outcome, and risks
   - **Impact/Effort Matrix** — all improvements plotted by impact and effort with quadrant classification
   - **Improvement Backlog** — prioritized list of improvements with owners and target dates
   - **Review Checkpoint** — date and criteria for evaluating whether changes are working

## Output

Process improvement analysis appended to `.project/$ARGUMENTS/04-improve.md`. Present a summary highlighting:
- Top 3 recurring themes across retrospectives
- Biggest flow bottleneck and its measured impact
- Flow efficiency percentage (process time vs. lead time)
- Top 3 recommended improvements (quick wins first)
- Review checkpoint date for evaluating results
