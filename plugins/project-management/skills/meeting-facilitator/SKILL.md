---
description: Plan and structure any meeting with agenda, roles, and follow-ups
---

# Meeting Facilitator

Plan and structure a meeting for "$ARGUMENTS". Define the meeting purpose, set an agenda with time-boxes, assign roles, determine attendees, define desired outcomes, and suggest a meeting format. After the meeting, capture decisions, action items, and parking lot items.

## Prerequisites

None — this is a utility skill. It can be run at any time, with or without existing project artifacts.

If `.project/$ARGUMENTS/` exists, read any available artifacts for context. If it does not exist, proceed based on information the user provides.

## Process

1. **Gather context:**
   - If `.project/$ARGUMENTS/` exists, read available artifacts for project context
   - Ask the user what the meeting is about and who needs to attend
   - Determine if this is a recurring meeting or a one-off

2. **Define meeting purpose:**
   - Write the purpose as one clear sentence — if you cannot state it in one sentence, the meeting scope is too broad
   - If the purpose is unclear, help the user sharpen it or suggest splitting into multiple meetings
   - Ask: "Could this be an email or async message instead?" — only meet when synchronous discussion adds value
   - Common purposes: make a decision, solve a problem, align on direction, share information, brainstorm ideas, review work

3. **Suggest meeting format:**
   - **Standup (15 min):** quick sync on progress, blockers, and plans — keep it tight, no problem-solving
   - **Decision meeting (30-45 min):** present options, discuss trade-offs, make a decision — requires pre-read
   - **Working session (60-90 min):** collaborative problem-solving or design — needs a clear problem statement
   - **Brainstorm (45-60 min):** divergent thinking to generate ideas — separate from evaluation
   - **Review/demo (30-60 min):** present completed work for feedback — prepare demo flow in advance
   - **Retrospective (60-90 min):** reflect on what worked and what to improve — needs psychological safety
   - **All-hands/update (30 min):** one-to-many information sharing — keep it concise, allow Q&A
   - Match the format to the purpose — do not use a meeting format that does not fit the goal

4. **Set agenda with time-boxes:**
   - Every agenda item gets a time-box — no open-ended items
   - Include buffer time (5 minutes per hour) for overruns and transitions
   - Structure the agenda to put the most important items first (in case time runs short)
   - Typical structure:
     - Opening (2-3 min): state the purpose, review the agenda, confirm desired outcomes
     - Main items (bulk of time): discussion, decisions, or working time
     - Closing (5 min): summarize decisions, confirm action items, collect feedback
   - For each item, note: topic, owner/presenter, time allocation, and desired outcome (decision, input, awareness)

5. **Assign roles:**
   - **Facilitator** — keeps discussion on track, manages time-boxes, ensures everyone is heard, parks off-topic items
   - **Note-taker** — captures decisions, action items, and key discussion points (not a transcript)
   - **Timekeeper** — tracks time-boxes and gives warnings (5 min, 1 min remaining)
   - Rotate roles in recurring meetings so the burden is shared
   - The facilitator should not also be the primary presenter — they need to focus on the process

6. **Determine attendees:**
   - **Required** — people who must be there for the meeting to achieve its purpose (decision makers, key contributors)
   - **Optional** — people who would benefit from attending but whose absence does not block progress
   - Keep the meeting small — every person added reduces discussion quality (ideal: 3-7 for decisions, up to 15 for updates)
   - For each attendee, note what they need to prepare or bring to the meeting
   - Ask: "Does this person need to be in the room, or can they be informed after?"

7. **Define desired outcomes:**
   - List 2-4 specific outcomes the meeting should produce
   - Examples: "Decision on X," "Aligned on approach for Y," "Action items assigned for Z," "Risks identified for W"
   - Outcomes should be verifiable — at the end of the meeting, you can check if each outcome was achieved
   - If desired outcomes cannot be clearly stated, reconsider whether the meeting is necessary

8. **Prepare pre-read or pre-work (if applicable):**
   - Identify any materials attendees should review before the meeting
   - Send pre-reads at least 24 hours in advance (48 hours for complex topics)
   - Keep pre-reads concise — no one reads a 20-page document before a meeting
   - Specify what attendees should do with the pre-read: "Read and come with questions," "Review and form an opinion on option A vs B"

9. **After the meeting — capture outcomes:**
   - **Decisions made** — clear statement of what was decided, by whom
   - **Action items** — each with a single owner and a specific deadline (not "soon" or "next week")
   - **Parking lot** — topics raised but deferred for follow-up (with who will follow up)
   - **Key discussion points** — brief notes on important arguments or concerns raised
   - Send the summary to all attendees and relevant stakeholders within 24 hours

## Output

Present the meeting plan directly to the user. Do not write an artifact file. The output should include:
- Meeting purpose (one sentence)
- Suggested format and duration
- Agenda with time-boxes
- Roles (facilitator, note-taker, timekeeper)
- Required and optional attendees with their preparation
- Desired outcomes
- Pre-read requirements (if any)
