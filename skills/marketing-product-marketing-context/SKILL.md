---
name: marketing-product-marketing-context
description: Define a product's positioning statement, value proposition, messaging framework and go-to-market motion, compiled into a marketing brief. Use when the user needs to settle how to describe the product, which messages to lead with and for whom. Not for planning a specific launch; see /marketing-launch-strategy.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 0
  artifact: 00-strategy.md
---

# Product Marketing Context

Define the core product marketing foundation for "$ARGUMENTS". Create value propositions, messaging framework, positioning statement, and go-to-market context.

See also `/branding-strategy` for the brand platform — purpose, vision, mission, values and personality — behind this positioning.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"marketing-product-marketing-context","workflow":"marketing","phase":0,"project":"<project>","event":"skipped","artifact":"00-strategy.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Strategy) of the RACE Framework workflow (`marketing`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `marketing` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole RACE Framework workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches or maps this repository (a memory or repo-map server such as `repo_map` or `entities`), query it for `<project>` and this phase's subject and read what it returns, keeping only results from this repository; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. After your section's italic line, add a `### Recalled` subsection of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"marketing-product-marketing-context","workflow":"marketing","phase":0,"project":"<project>","event":"started","artifact":"00-strategy.md","note":""}`.

Read `.singularskills/marketing/<project>/00-strategy.md`. This skill works best after customer-research and competitor-profiling have been run, but can be used standalone.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for all prior strategy work
   - Read `references/marketing-brief-template.md` for output structure
   - Read `references/race-framework-guide.md` for methodology reference

2. **Craft the positioning statement:**
   - Use the format: For [target], who [need], [product] is a [category] that [key benefit]. Unlike [alternatives], we [differentiator].
   - Test it against: Is it specific? Defensible? Meaningful to the audience?

3. **Build the messaging framework:**
   - Define 3-5 key messages, each with proof points
   - Map messages to personas (which message resonates with which audience?)
   - Define tone and voice guidelines for this product/campaign
   - Create a message hierarchy: primary → supporting → proof points

4. **Define the value proposition:**
   - What is the core value delivered?
   - What are the functional, emotional, and social benefits?
   - What is the "so what?" for each feature?

5. **Go-to-market context:**
   - What channels will be used? (informed by competitor analysis)
   - What is the launch or growth motion?
   - What are the key milestones and success metrics?

6. **Write the artifact** — append to `.singularskills/marketing/<project>/00-strategy.md` under a `## Product Marketing Context` section. Create the file with a `# Strategy — <project>` heading if it does not exist; if a `## Product Marketing Context` section already exists, replace only that section. Also compile the full strategy into a marketing brief using the template structure:
   - **Positioning Statement** — the core positioning
   - **Value Proposition** — core + supporting benefits
   - **Messaging Framework** — messages, proof points, tone
   - **Go-to-Market Context** — channels, motion, milestones
   - **Marketing Brief Summary** — compiled brief following `marketing-brief-template.md`

## Output

Product marketing context appended to `.singularskills/marketing/<project>/00-strategy.md`. Present a summary highlighting:
- The positioning statement
- Top 3 key messages
- Recommended go-to-market motion

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"marketing-product-marketing-context","workflow":"marketing","phase":0,"project":"<project>","event":"finished","artifact":"00-strategy.md","note":""}`.

This artifact is shared by every skill of phase 0 (Strategy). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Strategy
workflow: marketing
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Product Marketing Context` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `marketing-product-marketing-context`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Product Marketing Context` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
