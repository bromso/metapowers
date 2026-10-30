---
name: project-management-product-vision
description: Craft a product vision statement, 3-5 measurable product goals, a North Star metric and success criteria at 30, 60 and 90 days. Use when the user needs to say what the product is for and how they will know it is working before building a roadmap. Not for a team's purpose and values; see /leadership-vision.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: project-management
  phase: 1
  artifact: 01-plan.md
---

# Product Vision

Craft the product vision for "$ARGUMENTS". Define a clear vision statement, set measurable product goals, establish a North Star metric, and define success criteria at 30/60/90 days.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"project-management-product-vision","workflow":"project-management","phase":1,"project":"<project>","event":"skipped","artifact":"01-plan.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Plan) of the Scrum workflow (`project-management`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `project-management` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"project-management-product-vision","workflow":"project-management","phase":1,"project":"<project>","event":"refused","artifact":"01-plan.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"project-management-product-vision","workflow":"project-management","phase":1,"project":"<project>","event":"started","artifact":"01-plan.md","note":""}`.

Check that `.singularskills/project-management/<project>/00-initiate.md` exists. If it does not, tell the user to run an Initiate skill first (e.g., project-charter) and stop.

## Process

1. **Read existing context:**
   - Read `.singularskills/project-management/<project>/00-initiate.md` for charter, stakeholder, and scope context
   - Read `references/scrum-guide.md` for Scrum alignment

2. **Craft the vision statement:**
   - Use the format: "For [target customers], who [statement of need], [product name] is a [product category] that [key benefit]. Unlike [primary alternative], our product [primary differentiator]."
   - Ensure the vision is aspirational yet achievable
   - Validate that the vision aligns with the project charter objectives
   - Keep it to 1-2 sentences that the entire team can memorize

3. **Define product goals:**
   - Define 3-5 product goals that ladder up to the vision
   - For each goal: description, measurable success metric, target value, target date
   - Categorize goals: user acquisition, engagement, retention, revenue, quality
   - Ensure goals are outcome-oriented (not output-oriented)

4. **Establish the North Star metric:**
   - Identify the single metric that best captures the core value the product delivers to customers
   - Explain why this metric matters and how it connects to the vision
   - Define how it will be measured and at what frequency
   - Set a baseline (current state) and target (desired state)

5. **Define success at 30/60/90 days:**
   - **30 days:** early signals — what must be true to confirm the project is on track? (e.g., team onboarded, first sprint complete, key risks validated)
   - **60 days:** momentum indicators — what demonstrates meaningful progress? (e.g., MVP feature-complete, early user feedback collected, key integrations working)
   - **90 days:** outcome validation — what proves the product is delivering value? (e.g., North Star metric trending upward, user adoption targets hit, stakeholder satisfaction confirmed)
   - For each checkpoint: specific metrics, thresholds, and who evaluates

6. **Write the artifact** — append to `.singularskills/project-management/<project>/01-plan.md` under a `## Product Vision` section. Create the file with a `# Plan — <project>` heading if it does not exist; if a `## Product Vision` section already exists, replace only that section. The section contains:
   - **Vision Statement** — the crafted vision using the template format
   - **Product Goals** — table with goal, metric, target, date, category
   - **North Star Metric** — metric definition, measurement approach, baseline, target
   - **30/60/90-Day Success Criteria** — checkpoints with metrics and thresholds

## Output

Product vision appended to `.singularskills/project-management/<project>/01-plan.md`. Present a summary highlighting:
- The vision statement
- North Star metric with baseline and target
- Top 3 product goals
- First 30-day success criteria

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"project-management-product-vision","workflow":"project-management","phase":1,"project":"<project>","event":"finished","artifact":"01-plan.md","note":""}`.

This artifact is shared by every skill of phase 1 (Plan). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Plan
workflow: project-management
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Product Vision` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `project-management-product-vision`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Product Vision` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
