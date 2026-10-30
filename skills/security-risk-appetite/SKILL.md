---
name: security-risk-appetite
description: Set how much security risk the organization will accept — tolerance thresholds per risk category, who may accept each level, time limits and an acceptance workflow. Use when the user must decide who can sign off on a known risk, or leadership asks how much risk the company is willing to carry. Not for scoring individual risks; see /security-risk-assessment.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 0
  artifact: 00-govern.md
---

# Risk Appetite

Establish risk tolerance levels and acceptance criteria for "$ARGUMENTS". Define how much risk the organization is willing to accept across different categories, and create a structured workflow for risk acceptance decisions.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-risk-appetite","workflow":"security","phase":0,"project":"<project>","event":"skipped","artifact":"00-govern.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 0 (Govern) of the NIST CSF workflow (`security`); cross-domain workflows run it too. First check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If one exists, the conductor is running you: continue here. Otherwise, if the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`; it runs this phase in order, asks before it writes and records the run. Otherwise, unless the user named this skill, ask one question, since this is the first phase of its workflow: "Just this step, or the whole NIST CSF workflow?" End your turn and wait; on the whole workflow, hand off the same way; on just this step, continue here.

**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches or maps this repository (a memory or repo-map server such as `repo_map` or `entities`), query it for `<project>` and this phase's subject and read what it returns, keeping only results from this repository; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. After your section's italic line, add a `### Recalled` subsection of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.

Before you start work, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-risk-appetite","workflow":"security","phase":0,"project":"<project>","event":"started","artifact":"00-govern.md","note":""}`.

None — this is a Phase 0 Govern skill.

## Process

1. **Define risk categories:**
   - **Operational risk** — system outages, process failures, human error
   - **Data breach risk** — unauthorized access, exfiltration, exposure of sensitive data
   - **Compliance risk** — regulatory violations, audit findings, legal penalties
   - **Reputational risk** — public incidents, customer trust erosion, media exposure
   - **Financial risk** — direct losses, remediation costs, insurance gaps
   - **Third-party risk** — vendor breaches, supply chain compromises, dependency failures

2. **Set tolerance thresholds per category:**
   - For each risk category, define four threshold levels:
     - **Critical** — unacceptable; immediate action required, escalate to executive leadership
     - **High** — requires mitigation plan within defined timeframe, senior management approval to accept
     - **Medium** — managed through standard controls, department-level acceptance
     - **Low** — accepted as cost of doing business, monitored through routine processes
   - Express thresholds in measurable terms where possible (financial impact ranges, downtime limits, data record counts)

3. **Define acceptance criteria and authority levels:**
   - **Who can accept what level** — map risk levels to required approval authority:
     - Critical: board/executive committee only
     - High: CISO or CTO with documented justification
     - Medium: department head or risk owner
     - Low: team lead or security champion
   - **Required documentation** — what must be recorded for each acceptance (risk description, justification, compensating controls, review date)
   - **Time-bound acceptance** — maximum duration before re-evaluation (critical: 30 days, high: 90 days, medium: 180 days, low: 365 days)

4. **Create risk acceptance workflow:**
   - Define the end-to-end process: identification, assessment, escalation, approval, documentation, monitoring
   - Specify required artifacts at each stage (risk register entry, impact analysis, approval record)
   - Define escalation triggers (risk level increase, new threat intelligence, audit findings)
   - Establish override and emergency procedures for time-sensitive decisions

5. **Align with business strategy:**
   - Map risk appetite to business maturity and growth stage
   - Identify areas where higher risk tolerance enables business objectives (speed to market, innovation)
   - Identify areas where zero tolerance is required (customer data protection, regulatory compliance)
   - Document trade-offs between risk reduction and business agility

6. **Write the artifact** — append to `.singularskills/security/<project>/00-govern.md` under a `## Risk Appetite` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Risk Appetite` section already exists, replace only that section. The section contains:

   ### Risk Appetite Statement

   Include sections:
   - **Risk Categories** — all categories with definitions
   - **Tolerance Thresholds** — threshold matrix per category and level
   - **Acceptance Authority** — who can accept which risk levels
   - **Acceptance Workflow** — step-by-step process with required artifacts
   - **Strategic Alignment** — how risk appetite supports business objectives

## Output

The risk appetite statement appended to `.singularskills/security/<project>/00-govern.md`. Present a summary to the user highlighting:
- Risk categories and their tolerance thresholds
- Acceptance authority matrix
- Key trade-offs between risk and business objectives
- Recommended next steps for operationalizing risk appetite

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-risk-appetite","workflow":"security","phase":0,"project":"<project>","event":"finished","artifact":"00-govern.md","note":""}`.

This artifact is shared by every skill of phase 0 (Govern). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished`.

```yaml
---
skill: Govern
workflow: security
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Risk Appetite` section with one italic line, `*<skill name> · <ISO timestamp> · gate: none*` (your skill name is `security-risk-appetite`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Risk Appetite` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
