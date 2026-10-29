---
name: marketing-free-tool-strategy
description: Plan free tools and calculators that attract search traffic, get shared and lead into the paid product, with two or three concepts and a build spec. Use when the user is thinking of building a free calculator, grader or generator as an acquisition channel. Not for downloadable gated content; see /marketing-lead-magnets.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 2
  artifact: 02-act.md
---

# Free Tool Strategy

Design a free tool or calculator strategy for "$ARGUMENTS". Plan tools that attract users, demonstrate product value, and drive conversions.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"marketing","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing-customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and product context

2. **Identify tool opportunities:**
   - What calculations, assessments, or tasks does the audience do manually?
   - Use WebSearch to find successful free tools in the category
   - What tools do competitors offer? What's missing?
   - Which tools naturally lead to the paid product? (product-led growth alignment)

3. **Design tool concepts:**
   - Create 2-3 free tool concepts with:
     - Tool name and description
     - Core functionality
     - Input/output design
     - How it connects to the paid product
     - SEO and viral potential (is it linkable? shareable?)
     - Build effort estimate

4. **Growth mechanics:**
   - SEO: will people search for this tool?
   - Virality: does the output encourage sharing?
   - Data capture: what user data does it naturally collect?
   - Upsell path: how does it lead to the paid product?

5. **Write the artifact** — append to `.singularskills/marketing/<project>/02-act.md` under a `## Free Tool Strategy` section. Create the file with a `# Act — <project>` heading if it does not exist; if a `## Free Tool Strategy` section already exists, replace only that section. The section contains:
   - **Tool Concepts** — 2-3 concepts with details
   - **Recommended Tool** — which to build first and why
   - **Growth Mechanics** — SEO, virality, data capture
   - **Upsell Path** — how it leads to conversion
   - **Technical Requirements** — high-level build spec

## Output

Free tool strategy appended to `.singularskills/marketing/<project>/02-act.md`. Present a summary highlighting:
- Recommended tool to build
- Expected traffic and conversion potential
- Connection to paid product

**Record the run.** This artifact is shared by every skill of phase 2 (Act). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

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

Open your `## Free Tool Strategy` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-free-tool-strategy`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Free Tool Strategy` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
