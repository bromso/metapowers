---
description: Conduct incident or project post-mortem with root cause analysis
---

# Post-Mortem

Conduct a post-mortem for "$ARGUMENTS". Define the incident or event, build a timeline, perform root cause analysis using the 5 Whys technique, and produce corrective actions at multiple levels with owners and review dates.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for project context, team setup, and stakeholder information
   - Read `.project/$ARGUMENTS/03-review.md` if it exists (for sprint metrics and delivery data around the incident period)
   - Read `.project/$ARGUMENTS/04-improve.md` if it exists (for previous post-mortems, retrospective themes, and known risks)
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for standup history and blocker log around the incident period)

2. **Define the incident or event:**
   - Ask the user to describe what happened — get the facts before analysis
   - Document clearly:
     - **What happened** — objective description of the incident or event
     - **When it happened** — start time, detection time, resolution time, total duration
     - **Who was affected** — users, customers, internal teams, stakeholders
     - **Impact** — quantify where possible (users affected, revenue lost, data compromised, SLA breached)
     - **Severity** — classify as critical (service down), major (significant degradation), minor (limited impact), or informational (near-miss)
   - Distinguish between the symptoms (what was observed) and the incident itself (what actually went wrong)

3. **Build timeline of events:**
   - Reconstruct the incident chronologically from earliest relevant event to resolution
   - For each event in the timeline, document:
     - **Timestamp** — when it happened (as precise as possible)
     - **What happened** — factual description of the event
     - **Who was involved** — which person or system took action or was affected
     - **Impact at this point** — how the situation changed
   - Key milestones to capture:
     - When the conditions for the incident were first introduced (the seed)
     - When the incident actually began (the trigger)
     - When the incident was first detected (by monitoring, users, or team)
     - When the first responder engaged
     - What diagnostic steps were taken and in what order
     - When the root cause was identified
     - When the fix was applied
     - When service was fully restored
     - When the incident was formally closed
   - Note any gaps in the timeline — periods where it is unclear what happened or why

4. **Identify root causes using 5 Whys:**
   - Start with the incident statement and ask "Why did this happen?"
   - For each answer, ask "Why?" again until reaching a systemic cause (typically 3-5 levels deep)
   - Continue until the answer points to a process, system, or organizational issue — not a person's mistake
   - Document each level of the 5 Whys chain clearly:
     - **Why 1:** [symptom-level cause]
     - **Why 2:** [deeper cause]
     - **Why 3:** [process or system gap]
     - **Why 4:** [organizational or structural cause]
     - **Why 5:** [root cause — the systemic issue]
   - If there are multiple causal chains (multiple contributing factors), run 5 Whys on each
   - Stop when the answer is something the team or organization can actually change

5. **Distinguish contributing factors from root causes:**
   - List all factors that contributed to the incident
   - Classify each as:
     - **Root cause** — the primary systemic issue that, if fixed, would have prevented the incident
     - **Contributing factor** — made the incident worse or more likely, but was not the primary cause
     - **Mitigating factor** — reduced the impact or duration of the incident
   - There is usually 1-2 root causes and several contributing factors
   - Common contributing factors: missing monitoring, unclear runbooks, single points of failure, inadequate testing, communication gaps

6. **Define corrective actions at 3 levels:**
   - **Immediate actions (fix the symptom):**
     - What was done to resolve this specific incident
     - Any temporary measures in place (workarounds, manual processes, increased monitoring)
     - Timeline for removing temporary measures
   - **Short-term actions (prevent recurrence):**
     - Specific changes to prevent this exact incident from happening again
     - Examples: add monitoring alert, write a test for the failure case, update the runbook, fix the specific bug
     - Target completion: within 1-2 sprints
   - **Long-term actions (fix the system):**
     - Structural changes to prevent this class of incidents
     - Examples: improve deployment pipeline, add chaos testing, redesign the architecture for resilience, establish review processes
     - Target completion: within 1-2 quarters
   - Each action item must have an owner and a deadline

7. **Identify what went well:**
   - Not everything in an incident is negative — capture the positives
   - Examples of things that went well:
     - Fast detection (monitoring worked as intended)
     - Quick response (on-call engineer engaged promptly)
     - Effective communication (stakeholders were informed, team coordinated well)
     - Graceful degradation (system failed partially rather than completely)
     - Good documentation (runbooks were helpful, previous post-mortems informed the response)
   - Recognizing what went well builds team confidence and reinforces good practices

8. **Write blameless summary:**
   - Write a concise summary of the incident and its resolution
   - Focus on systems and processes, not individual people's mistakes
   - Use language like "the process did not catch" rather than "person X failed to"
   - Frame findings as opportunities to strengthen the system, not as failures
   - Acknowledge that the people involved made reasonable decisions given the information they had at the time
   - If human error was involved, ask what about the system made that error possible or likely

9. **Assign action item owners and review dates:**
   - For each corrective action, assign a single owner (not a team — one person accountable)
   - Set a specific review date for each action (when to check if it has been completed)
   - Schedule a follow-up review meeting (typically 2-4 weeks after the post-mortem) to verify:
     - Immediate actions are complete
     - Short-term actions are in progress
     - Long-term actions are planned and resourced
   - Add action items to the team's backlog or issue tracker

10. **Write the artifact** — append to `.project/$ARGUMENTS/04-improve.md` under a `## Post-Mortem: [Incident/Event]` section:
    - **Incident Summary** — blameless description of what happened, when, and impact
    - **Severity** — classification with justification
    - **Timeline** — chronological reconstruction of events
    - **Root Cause Analysis** — 5 Whys chain(s) with root cause identification
    - **Contributing Factors** — factors that made the incident worse or more likely
    - **What Went Well** — positive aspects of detection, response, and resolution
    - **Corrective Actions** — immediate, short-term, and long-term actions with owners and deadlines
    - **Follow-Up Review** — date and agenda for the review meeting

## Output

Post-mortem appended to `.project/$ARGUMENTS/04-improve.md`. Present a summary highlighting:
- Incident summary with severity and duration
- Root cause (one sentence)
- Number of corrective actions by level (immediate, short-term, long-term)
- What went well (top 1-2 positives)
- Follow-up review date
