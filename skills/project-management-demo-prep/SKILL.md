---
name: project-management-demo-prep
description: Create a demo script — audience framing, narrative flow, talking points per feature, likely questions with answers, timing and a fallback if the live demo fails. Use when the user has a demo coming up and wants to rehearse what to show and say. Not for assessing what the sprint delivered; see /project-management-sprint-review.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 3
  artifact: 03-review.md
---

# Demo Prep

Create a demo script for "$ARGUMENTS". Define the audience, build a narrative flow, write talking points for each feature, prepare for questions, and create a fallback plan.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"project-management","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for stakeholder map and project context
   - Read `.singularskills/project-management/<project>/03-review.md` if it exists (for sprint review and completed features)
   - Read `.singularskills/project-management/<project>/02-sprint.md` if it exists (for sprint state and delivery details)
   - Read `.singularskills/project-management/<project>/01-plan.md` if it exists (for backlog and feature descriptions)

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

8. **Write the artifact** — append to `.singularskills/project-management/<project>/03-review.md` under a `## Demo Prep` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Demo Prep` section already exists, replace only that section. The section contains:
   - **Audience** — who is attending and what they care about
   - **Demo Flow** — ordered list of features with time allocation
   - **Talking Points** — per-feature opening line, what to show, key takeaway, and transition
   - **Q&A Preparation** — anticipated questions with answers
   - **Fallback Plan** — backup strategy if live demo fails
   - **Timing** — total time, per-section allocation, must-show vs. optional features

## Output

Demo prep appended to `.singularskills/project-management/<project>/03-review.md`. Present a summary highlighting:
- Target audience and framing approach
- Number of features in the demo flow
- Total demo time and Q&A allocation
- Top 3 anticipated questions
- Fallback plan status (screenshots/recordings ready or needed)

**Record the run.** This artifact is shared by every skill of phase 3 (Review). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Review
workflow: project-management
phase: 3
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Demo Prep` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-demo-prep`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Demo Prep` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
