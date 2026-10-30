---
name: legal-jurisdiction-analysis
description: Analyze legal requirements across every country or state a business touches — registration, data protection, employment and consumer law — with a comparison matrix, conflicts and a recommended baseline. Use when the user operates, hires or stores data in several countries or states and asks how their obligations differ or conflict.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 0
  artifact: 00-assess.md
---

# Jurisdiction Analysis

Analyze legal requirements across all relevant jurisdictions for "$ARGUMENTS". Compare obligations, identify conflicts, and recommend a baseline standard.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-jurisdiction-analysis","workflow":"legal","phase":0,"project":"<project>","event":"skipped","artifact":"00-assess.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Assess) of the Legal Lifecycle workflow (`legal`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `legal` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole Legal Lifecycle workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches or maps this repository (a memory or repo-map server such as `repo_map` or `entities`), query it for `<project>` and this phase's subject and read what it returns, keeping only results from this repository; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. After your section's italic line, add a `### Recalled` subsection of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-jurisdiction-analysis","workflow":"legal","phase":0,"project":"<project>","event":"started","artifact":"00-assess.md","note":""}`.

None — this is a Phase 0 Assess skill.

## Process

1. **Identify all relevant jurisdictions:**
   - Where the business has offices or physical presence
   - Where customers or users are located
   - Where data is stored or processed
   - Where employees or contractors are based
   - Where partners or vendors operate

2. **For each jurisdiction, document:**
   - **Key legal requirements** — primary laws governing business operations
   - **Registration and filing obligations** — business registration, tax filings, annual reports
   - **Data protection laws** — privacy regulations, data localization requirements, breach notification rules
   - **Employment laws** — hiring requirements, worker classification, benefits mandates, termination rules
   - **Consumer protection laws** — disclosure requirements, refund policies, advertising standards

3. **Compare requirements across jurisdictions:**
   - Create a comparison matrix (jurisdiction x requirement area)
   - Identify where requirements align across jurisdictions
   - Identify where requirements diverge or conflict

4. **Identify conflicts:**
   - Stricter vs. more permissive requirements for the same obligation
   - Mutually exclusive requirements (where complying with one violates another)
   - Data localization conflicts (data must stay in country A but also be accessible in country B)
   - Employment law conflicts across remote-work jurisdictions

5. **Recommend baseline standard:**
   - Typically adopt the strictest jurisdiction's standard as the baseline
   - Document where jurisdiction-specific exceptions or adaptations are needed
   - Identify cost and operational implications of the recommended baseline
   - Flag areas where legal counsel must resolve genuine conflicts

6. **Write the artifact** — append to `.singularskills/legal/<project>/00-assess.md` under a `## Jurisdiction Analysis` section. Create the file with a `# Assess — <project>` heading if it does not exist; if a `## Jurisdiction Analysis` section already exists, replace only that section. The section contains:

   - **Jurisdiction Inventory** — all jurisdictions with basis for inclusion
   - **Requirements by Jurisdiction** — legal obligations per jurisdiction
   - **Comparison Matrix** — side-by-side comparison of key requirements
   - **Conflicts and Tensions** — where requirements diverge or conflict
   - **Recommended Baseline** — proposed standard with rationale
   - **Jurisdiction-Specific Exceptions** — where the baseline needs adaptation

## Output

The jurisdiction analysis appended to `.singularskills/legal/<project>/00-assess.md`. Present a summary to the user highlighting:
- Total jurisdictions analyzed
- Key conflicts or tensions identified
- Recommended baseline jurisdiction and rationale

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-jurisdiction-analysis","workflow":"legal","phase":0,"project":"<project>","event":"finished","artifact":"00-assess.md","note":""}`.

This artifact is shared by every skill of phase 0 (Assess). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Assess
workflow: legal
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Jurisdiction Analysis` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `legal-jurisdiction-analysis`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Jurisdiction Analysis` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
