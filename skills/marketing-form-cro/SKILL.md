---
name: marketing-form-cro
description: Optimize a web form for completion — cut fields, choose single or multi-step, fix labels, validation, button copy and trust signals. Use when people start a lead, contact, demo or checkout form but abandon it before submitting. Not for the whole signup-to-trial journey; see /marketing-signup-flow-cro.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 2
  artifact: 02-act.md
---

# Form CRO

Optimize forms for "$ARGUMENTS" to maximize completion rate. Analyze form design, field selection, and user experience to reduce abandonment.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-form-cro","workflow":"marketing","phase":2,"project":"<project>","event":"skipped","artifact":"02-act.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-form-cro","workflow":"marketing","phase":2,"project":"<project>","event":"refused","artifact":"02-act.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"marketing-form-cro","workflow":"marketing","phase":2,"project":"<project>","event":"started","artifact":"02-act.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience context
   - Read `.singularskills/marketing/<project>/02-act.md` if it exists

2. **Form audit (if URL or form provided):**
   - Evaluate number of fields (every field is friction)
   - Check field labels and placeholder text clarity
   - Analyze validation feedback and error messages
   - Review mobile form experience

3. **Field optimization:**
   - Which fields are truly necessary? Remove everything else
   - Multi-step vs. single-step form decision
   - Smart defaults and auto-fill opportunities
   - Progressive profiling (ask more over time, not all at once)

4. **UX improvements:**
   - Clear form title and context (why should they fill this out?)
   - Progress indicators for multi-step forms
   - Inline validation vs. submit-time validation
   - Submit button copy (specific benefit, not "Submit")
   - Social proof near the form (trust signals)
   - Privacy assurance near email fields

5. **Write the artifact** — append to `.singularskills/marketing/<project>/02-act.md` under a `## Form CRO` section. Create the file with a `# Act — <project>` heading if it does not exist; if a `## Form CRO` section already exists, replace only that section. The section contains:
   - **Current Form Assessment** — field count, friction points
   - **Field Recommendations** — what to keep, remove, add
   - **UX Improvements** — layout, validation, copy
   - **Multi-Step Recommendation** — if applicable
   - **Expected Impact** — estimated completion rate improvement

## Output

Form CRO analysis appended to `.singularskills/marketing/<project>/02-act.md`. Present a summary highlighting:
- Number of unnecessary fields identified
- Top UX improvement
- Recommended form structure

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-form-cro","workflow":"marketing","phase":2,"project":"<project>","event":"finished","artifact":"02-act.md","note":""}`.

This artifact is shared by every skill of phase 2 (Act). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Act
workflow: marketing
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Form CRO` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-form-cro`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Form CRO` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
