---
name: security-risk-assessment
description: Score security risks by likelihood and impact into a risk register with a 5x5 matrix, treatment, owner and review date, drawing on threat and vulnerability findings. Use when the user asks which security threats matter most or what to mitigate, transfer or accept. Not for legal exposure or delivery risks; see /legal-risk-assessment or /project-management-risk-assessment.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: security
  phase: 1
  artifact: 01-identify.md
---

# Risk Assessment

Score and prioritize security risks by likelihood and impact for "$ARGUMENTS". Combine inputs from threat models and vulnerability assessments into a unified risk register with treatment strategies and assigned ownership.

See also `/legal-risk-assessment` for legal risks scored on a likelihood-impact matrix, or `/project-management-risk-assessment` for delivery risks to timeline and scope.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"security-risk-assessment","workflow":"security","phase":1,"project":"<project>","event":"skipped","artifact":"01-identify.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 1 (Identify) of the NIST CSF workflow (`security`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `security` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"security-risk-assessment","workflow":"security","phase":1,"project":"<project>","event":"refused","artifact":"01-identify.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"security-risk-assessment","workflow":"security","phase":1,"project":"<project>","event":"started","artifact":"01-identify.md","note":""}`.

Read `.singularskills/security/<project>/00-govern.md`. If this file does not exist, tell the user:

> Phase 0 (Govern) has not been completed for "<project>". Run a Govern skill first (e.g., `/security-security-policy <project>`), or use `--skip-checks` to bypass.

## Process

1. **Identify risks from available sources:**
   - Review threat model findings (if available in `.singularskills/security/<project>/01-identify.md`)
   - Review vulnerability assessment results (if available)
   - Consider operational risks: process gaps, staffing shortages, tooling limitations
   - Consider environmental risks: regulatory changes, emerging threat landscape, industry-specific threats
   - Deduplicate and consolidate related risks into distinct risk items

2. **Score each risk:**
   - **Likelihood** (1-5):
     - 1 = Rare — may occur only in exceptional circumstances
     - 2 = Unlikely — could occur but not expected
     - 3 = Possible — might occur at some time
     - 4 = Likely — will probably occur in most circumstances
     - 5 = Almost certain — expected to occur routinely
   - **Impact** (1-5):
     - 1 = Negligible — minimal effect on operations or data
     - 2 = Minor — limited impact, easily recoverable
     - 3 = Moderate — noticeable business disruption or data exposure
     - 4 = Major — significant financial, reputational, or operational damage
     - 5 = Catastrophic — existential threat, massive data breach, regulatory shutdown
   - **Risk score** = likelihood x impact (range: 1-25)

3. **Categorize risks:**
   - **Critical** (20-25) — requires immediate executive attention and action
   - **High** (12-19) — requires mitigation plan within 30 days
   - **Medium** (6-11) — managed through standard security controls and monitoring
   - **Low** (1-5) — accepted and monitored through routine processes
   - Plot risks on a 5x5 risk matrix for visual representation

4. **Define treatment strategy per risk:**
   - **Mitigate** — implement controls to reduce likelihood or impact (most common)
   - **Transfer** — shift risk to third party via insurance, outsourcing, or contractual terms
   - **Accept** — acknowledge and monitor, used when cost of mitigation exceeds potential impact
   - **Avoid** — eliminate the activity or technology creating the risk
   - For each risk, document the chosen strategy with specific actions and expected residual risk

5. **Assign risk owners and set review dates:**
   - Assign a named owner for each risk (individual, not team)
   - Set review dates based on risk level:
     - Critical: reviewed weekly until mitigated
     - High: reviewed monthly
     - Medium: reviewed quarterly
     - Low: reviewed annually
   - Define escalation criteria: when does a risk get re-scored or escalated?

6. **Write the artifact** — append to `.singularskills/security/<project>/01-identify.md` under a `## Risk Assessment` section. Create the file with a `# Identify — <project>` heading if it does not exist; if a `## Risk Assessment` section already exists, replace only that section. The section contains:

   - **Risk Register** — all risks with ID, description, likelihood, impact, score, and category
   - **Risk Matrix** — 5x5 visual matrix with risk placement
   - **Treatment Strategies** — action plan per risk with expected residual risk
   - **Risk Ownership** — assigned owners and review schedule
   - **Top Risks Summary** — detailed analysis of critical and high risks

## Output

The risk assessment appended to `.singularskills/security/<project>/01-identify.md`. Present a summary to the user highlighting:
- Total risks identified and distribution across categories
- Top 5 highest-scoring risks with treatment strategies
- Risk ownership assignments
- Recommended review cadence and next review date

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"security-risk-assessment","workflow":"security","phase":1,"project":"<project>","event":"finished","artifact":"01-identify.md","note":""}`.

This artifact is shared by every skill of phase 1 (Identify). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Identify
workflow: security
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Risk Assessment` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `security-risk-assessment`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Risk Assessment` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional.
