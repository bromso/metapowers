---
name: marketing-marketing-psychology
description: Apply persuasion principles — social proof, scarcity, anchoring, loss aversion, defaults — to a product's marketing, with dark-pattern guardrails. Use when the user asks why people would buy, how to make an offer more persuasive or which cognitive biases to use. Not for rewriting the copy or reworking a page; see /marketing-copy-editing or /marketing-page-cro.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 2
  artifact: 02-act.md
---

# Marketing Psychology

Apply behavioral psychology and persuasion principles to "$ARGUMENTS". Identify which psychological triggers to use and how to implement them ethically.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-marketing-psychology","workflow":"marketing","phase":2,"project":"<project>","event":"skipped","artifact":"02-act.md","note":"<reason or \"none given\">"}`.

## Prerequisites

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments).

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and positioning
   - Read `.singularskills/marketing/<project>/02-act.md` if it exists

2. **Audit current psychology usage:**
   - If a URL or existing content is provided, identify what principles are already in use
   - Identify missed opportunities

3. **Recommend applicable principles:**
   - **Social proof:** testimonials, user counts, logos, case studies
   - **Scarcity & urgency:** limited time, limited quantity, exclusive access
   - **Reciprocity:** free value before asking (lead magnets, tools, content)
   - **Authority:** credentials, press mentions, certifications, expert endorsements
   - **Loss aversion:** frame benefits as losses avoided
   - **Anchoring:** price anchoring, feature anchoring, comparison anchoring
   - **Commitment & consistency:** micro-commitments, progressive disclosure
   - **Default effect:** pre-selected options, recommended tiers
   - For each: specific implementation recommendation for "<project>"

4. **Ethical guardrails:**
   - Flag any dark patterns or manipulative implementations
   - Ensure all claims are truthful and verifiable
   - Recommend transparent use of urgency/scarcity

5. **Write the artifact** — append to `.singularskills/marketing/<project>/02-act.md` under a `## Marketing Psychology` section. Create the file with a `# Act — <project>` heading if it does not exist; if a `## Marketing Psychology` section already exists, replace only that section. The section contains:
   - **Applicable Principles** — ranked by expected impact
   - **Implementation Recommendations** — specific, actionable per principle
   - **Ethical Considerations** — guardrails and transparency notes
   - **Priority Actions** — top 3 psychology-driven changes to make

## Output

Psychology recommendations appended to `.singularskills/marketing/<project>/02-act.md`. Present a summary highlighting:
- Top 3 applicable principles
- Highest-impact implementation recommendation
- Any ethical concerns to address

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work (once the gate has passed or `--skip-checks` was given): `{"ts":"<ISO timestamp>","skill":"marketing-marketing-psychology","workflow":"marketing","phase":2,"project":"<project>","event":"started","artifact":"02-act.md","note":""}`
- After you have written your section: the same line with `"event":"finished"`.
- If the gate refused and the user did not bypass it: the same line with `"event":"refused"` and `"note"` set to what the gate printed, instead of the other two; then stop.

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

Open your `## Marketing Psychology` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-marketing-psychology`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Marketing Psychology` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
