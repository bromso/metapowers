---
name: leadership-feedback
description: Prepare feedback for one person using Situation-Behavior-Impact, with feedforward, an opening line and how to handle likely reactions. Use when the user needs to give a team member praise or constructive feedback about something specific they did.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Feedback

Prepare structured feedback for "$ARGUMENTS". Use the SBI (Situation, Behavior, Impact) model to deliver clear, actionable feedback.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"leadership-feedback","workflow":"leadership","phase":null,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

None — utility skill, run anytime.

## Process

1. **Read context:**
   - Read `references/cfr-model.md` for the feedback framework
   - Ask: What happened? Who is the feedback for? Is this positive or constructive?

2. **Structure the feedback using SBI:**
   - **Situation:** When and where did this happen? Be specific.
   - **Behavior:** What exactly did the person do? Observable actions, not interpretations.
   - **Impact:** What was the effect? On the team, project, or you.

3. **Add feedforward:**
   - What should happen differently next time? (constructive)
   - What should continue? (positive)
   - Be specific and actionable

4. **Prepare delivery notes:**
   - Tone guidance: direct but empathetic
   - Conversation opening suggestion
   - Anticipated reactions and how to handle them

5. **Write the artifact** to `.singularskills/leadership/<project>/feedback.md`

## Output

The feedback prep written to `.singularskills/leadership/<project>/feedback.md`. Present the structured feedback to the user.
