---
name: develop
description: Create quarterly team OKRs plus an individual growth plan for each team member, with a weekly, monthly and quarterly feedback cadence. Use when the user wants to plan how each person on their team will grow this quarter alongside the team's goals. Not for writing OKRs on their own; see /leadership:okrs.
argument-hint: "[project] [--skip-checks]"
---

# Develop

Create development plans for "$ARGUMENTS". Set OKRs, define growth paths, and establish how you'll support each team member's progression.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/leadership/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/leadership/<project>/03-build.md`. If this file does not exist, tell the user:

> Phase 3 (Build) has not been completed for "<project>". Run `/leadership:build <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/leadership/<project>/01-assess.md` for team member maturity
   - Read `.metapowers/leadership/<project>/02-vision.md` for values and success vision
   - Read `.metapowers/leadership/<project>/03-build.md` for roles and responsibilities
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/cfr-model.md` for feedback approach

2. **Set team OKRs:**
   - Define 2-3 team-level objectives for the quarter
   - Each objective has 3-5 measurable key results
   - Align with broader organizational goals
   - Make key results specific and time-bound

3. **Create individual growth plans:**
   - For each team member:
     - Current strengths and growth areas (from Assess)
     - 1-2 development goals for the quarter
     - Specific actions to achieve them (stretch assignments, mentoring, learning)
     - How you'll measure progress

4. **Define the feedback cadence:**
   - Weekly 1:1s using the CFR model
   - Monthly progress reviews
   - Quarterly OKR check-ins

5. **Write the artifact** to `.metapowers/leadership/<project>/04-develop.md` with sections:
   - **Team OKRs** — objectives and key results
   - **Individual Growth Plans** — per-person development goals
   - **Feedback Cadence** — 1:1, monthly, quarterly schedule
   - **Support Commitments** — what you'll do to enable growth

## Output

The development plan written to `.metapowers/leadership/<project>/04-develop.md`. Present a summary highlighting:
- Team OKRs
- Growth focus per person
- Feedback cadence
