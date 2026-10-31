---
name: design-test
description: Test a built Figma component against its contract and WCAG — props, variants, states, tokens, contrast, color blindness, focus order — with a pass or fail report. Use when the component has been prototyped and the user wants to know whether it is ready to hand off. Not for a quick check of any frame without a contract; see /design-a11y-audit.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: design
  phase: 5
  artifact: 05-test.md
  figma-aware: true
---

# Test

Validate the "$ARGUMENTS" prototype against the component contract and WCAG accessibility criteria.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"design-test","workflow":"design","phase":5,"project":"<project>","event":"skipped","artifact":"05-test.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 5 (Test) of the Design Thinking workflow (`design`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `design` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise continue here: a later phase runs on its own, behind its gate.

**Figma.** Steps marked *Figma* use a Figma MCP server you connect to this agent yourself; this pack ships none and makes no network calls. Before you ask the user anything or run the first such step, list the tools available to you and bind each capability the step names to one tool, as `references/figma-capabilities.md`, bundled with this skill, describes: the official Figma server's tool named there, else any tool whose description plainly does the same thing. With a capability bound, take the file key and node id from a Figma link in the request or the conversation, else from the `file:` line of the `## Tools` section of the latest earlier artifact of this project that has one; when a bound capability needs one and there is none, ask for the link once, with any other question you ask. With nothing bound, never ask for a link. Record the result in a `## Tools` section after any `## Recalled` section: a `- file:` line (the Design file; a board or a deck goes on a `- board:` or `- deck:` line), one line per bound capability (`- read-tokens: get_variable_defs (figma)`), and a `- created:` line for node ids you created; or the single line `No Figma server: steps marked Figma ran without one.`; a skill with no artifact says the same in its summary. For an unbound capability do what the step's *Without Figma* line says, using first any values the user gave in the request or in files it names: never ask the user to connect a server, never invent values a tool would have returned, and never report a step as run when it was not.

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"design-test","workflow":"design","phase":5,"project":"<project>","event":"refused","artifact":"05-test.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"design-test","workflow":"design","phase":5,"project":"<project>","event":"started","artifact":"05-test.md","note":""}`.

Read `.singularskills/design/<project>/04-prototype.md`. If this file does not exist, tell the user:

> Phase 4 (Prototype) has not been completed for "<project>". Run `/design-prototype <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.singularskills/design/<project>/02-define.md` for the component contract
   - Read `.singularskills/design/<project>/04-prototype.md` for prototype notes, and its `## Tools` section for the file link and the created node ids; without them the build sheet is the thing under test
   - Read `references/wcag-criteria.md` for accessibility criteria

2. **Read the prototype.** *Figma (read-node, read-tokens):* read the structure, text, sizes and applied tokens of each created node. *Without Figma:* read the build sheet.

3. **Run the checks** described in `references/a11y-checks.md`: contrast for every foreground/background pair (normal and large text), colour-vision simulation for the primary pairs, focus order, target size and text size, alt text. Each line of the report ends with `computed`, `simulated` or `not checked`; structure checks are `not checked` without Figma.

4. **Verify contract compliance.** For each requirement in the component contract:
   - Props: Are all specified props represented in the component?
   - Variants: Does the component have all variant combinations?
   - States: Are all states (hover, focus, active, disabled, error, loading) represented?
   - Tokens: Are all visual values using design system tokens?

5. **Generate the test report** with:
   - Contract compliance checklist (pass/fail per requirement)
   - WCAG validation results (each line marked computed, simulated or not checked)
   - Color blindness simulation results
   - Issues found with remediation suggestions
   - Overall pass/fail status

6. **Write the artifact** to `.singularskills/design/<project>/05-test.md`

## Output

The test report written to `.singularskills/design/<project>/05-test.md`. Present to the user:
- Overall pass/fail status
- Number of issues found by category (contract, WCAG, color blindness)
- Critical issues requiring immediate attention
- Remediation suggestions for failed checks

**Record the run.** After you have written the artifact, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"design-test","workflow":"design","phase":5,"project":"<project>","event":"finished","artifact":"05-test.md","note":""}`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`):

```yaml
---
skill: design-test
workflow: design
phase: 5
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```
