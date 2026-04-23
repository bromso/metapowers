---
description: Facilitate sprint retrospective with structured format and action items
---

# Retrospective

Facilitate a sprint retrospective for "$ARGUMENTS". Guide the team through a structured retrospective format, review previous action items, gather feedback, generate insights, and produce concrete action items with owners and deadlines.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for project context and team setup
   - Read `.project/$ARGUMENTS/03-review.md` if it exists (for sprint review results, metrics, and delivery data)
   - Read `.project/$ARGUMENTS/04-improve.md` if it exists (for previous retrospective action items to review)
   - Read `plugins/project-management/shared/retrospective-formats.md` for available format options

2. **Select retrospective format:**
   - Review the available formats from `retrospective-formats.md`: Start/Stop/Continue, 4Ls, Sailboat, Mad/Sad/Glad, Timeline
   - Consider the team's current situation to recommend a format:
     - **Start/Stop/Continue** — general-purpose, good for new teams or when no specific issue dominates
     - **4Ls** — balanced reflection covering positives and gaps, good for mid-project check-ins
     - **Sailboat** — visual and metaphor-driven, good for teams that enjoy creative exercises
     - **Mad/Sad/Glad** — quick emotional check-in, good for surfacing morale issues
     - **Timeline** — chronological reconstruction, good for long sprints or post-incident reflection
   - Ask the user which format they prefer, presenting the recommendation and alternatives
   - If the user does not specify, use the recommended format based on context

3. **Review previous action items:**
   - If `.project/$ARGUMENTS/04-improve.md` exists, read the most recent retrospective's action items
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

9. **Write the artifact** — append to `.project/$ARGUMENTS/04-improve.md` under a `## Retrospective: [Sprint/Date]` section:
   - **Format Used** — which retrospective format was selected and why
   - **Previous Action Items Review** — status of each action item from the last retrospective
   - **Check-In Summary** — overall team sentiment at the start
   - **Brainstorm Results** — items gathered per format category
   - **Themes Identified** — grouped themes with vote counts
   - **Action Items** — 1-3 specific actions with owner, deadline, and expected outcome
   - **Parking Lot** — themes not addressed that should be revisited

## Output

Retrospective appended to `.project/$ARGUMENTS/04-improve.md`. Present a summary highlighting:
- Format used and team sentiment
- Top themes identified with vote counts
- Action items with owners and deadlines
- Any carried-forward items from the previous retrospective
