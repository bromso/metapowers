---
description: Create demo script, talking points, and audience-specific framing
---

# Demo Prep

Create a demo script for "$ARGUMENTS". Define the audience, build a narrative flow, write talking points for each feature, prepare for questions, and create a fallback plan.

## Prerequisites

Check that `.project/$ARGUMENTS/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

If the user passes `--skip-checks`, skip the prerequisite check and log the skip to `.project/$ARGUMENTS/skip-log.md` with a timestamp and reason.

## Process

1. **Read existing context:**
   - Read `.project/$ARGUMENTS/00-initiate.md` for stakeholder map and project context
   - Read `.project/$ARGUMENTS/03-review.md` if it exists (for sprint review and completed features)
   - Read `.project/$ARGUMENTS/02-sprint.md` if it exists (for sprint state and delivery details)
   - Read `.project/$ARGUMENTS/01-plan.md` if it exists (for backlog and feature descriptions)

2. **Define demo audience and what they care about:**
   - Identify who will attend the demo (executives, engineers, users, product team, external stakeholders)
   - For each audience segment, define what they care about:
     - **Executives:** outcomes, business impact, timeline, budget implications
     - **Engineers:** how it works, architecture decisions, technical trade-offs
     - **Users:** what it does for them, workflow improvements, ease of use
     - **Product team:** alignment with roadmap, user feedback, next priorities
   - Choose a primary audience to optimize the framing for (adjust depth and language accordingly)

3. **Create demo flow:**
   - Select features to demo and order them to build a narrative (do not just list features randomly)
   - Start with the most impactful or visible feature to hook the audience
   - Build logically: show features in the order a user would encounter them, or by theme
   - End with a forward-looking item (what is coming next) to maintain momentum
   - Allocate time per feature: 2-3 minutes each, total demo 15-20 minutes
   - Leave 10 minutes for questions and discussion at the end

4. **Write talking points for each feature:**
   - For each feature in the demo flow, write:
     - **Opening line:** benefit-first statement ("This lets users do X 50% faster")
     - **What to show:** specific actions to perform in the demo (click here, enter this, see that)
     - **Key takeaway:** the one thing the audience should remember about this feature
     - **Transition:** how to smoothly move to the next feature
   - Keep talking points concise — bullet points, not paragraphs
   - Avoid jargon for non-technical audiences; use precise terms for technical audiences

5. **Prepare for common questions and objections:**
   - Anticipate 5-10 questions the audience is likely to ask
   - For each question, prepare a concise answer (2-3 sentences maximum)
   - Common categories: timeline ("when will this be in production?"), scope ("can it also do X?"), risk ("what if Y fails?"), comparison ("how is this different from Z?")
   - Prepare deflection responses for questions that need follow-up ("Great question — let's schedule time to dig into that")
   - Identify any sensitive topics to avoid or handle carefully

6. **Create fallback plan if live demo fails:**
   - Prepare screenshots or screen recordings of the demo flow as backup
   - If using a staging environment, have a local or pre-recorded backup ready
   - Know which features are most stable and which are risky to demo live
   - Have a recovery script: if something breaks mid-demo, what do you say and do?
   - Test the demo environment before the meeting (connectivity, data, credentials)

7. **Time the demo:**
   - Target total time: 15-20 minutes for demo, 10 minutes for questions (30 minutes total)
   - Allocate time per section: intro (2 min), features (2-3 min each), wrap-up (2 min), Q&A (10 min)
   - Mark optional features that can be skipped if running long
   - Mark must-show features that cannot be cut

8. **Write the artifact** — append to `.project/$ARGUMENTS/03-review.md` under a `## Demo Prep` section:
   - **Audience** — who is attending and what they care about
   - **Demo Flow** — ordered list of features with time allocation
   - **Talking Points** — per-feature opening line, what to show, key takeaway, and transition
   - **Q&A Preparation** — anticipated questions with answers
   - **Fallback Plan** — backup strategy if live demo fails
   - **Timing** — total time, per-section allocation, must-show vs. optional features

## Output

Demo prep appended to `.project/$ARGUMENTS/03-review.md`. Present a summary highlighting:
- Target audience and framing approach
- Number of features in the demo flow
- Total demo time and Q&A allocation
- Top 3 anticipated questions
- Fallback plan status (screenshots/recordings ready or needed)
