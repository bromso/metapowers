---
name: legal-clause-analysis
description: Analyze one or a few contract clauses in depth — legal effect, market comparison, hidden triggers and carve-outs, a 1-5 risk score, alternative wording and enforceability by jurisdiction. Use when the user quotes a specific clause and asks what it really means, whether it is standard, or how to reword it. Not for reviewing a whole contract; see /legal-contract-review.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 2
  artifact: 02-review.md
---

# Clause Analysis

Perform a deep-dive analysis of specific contract clauses for "$ARGUMENTS". Interpret legal effect, compare to market standards, identify hidden risks, and suggest alternative language where needed.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"legal-clause-analysis","workflow":"legal","phase":2,"project":"<project>","event":"skipped","artifact":"02-review.md","note":"<reason or \"none given\">"}`.

## Prerequisites

**Part of a workflow.** This skill is phase 2 (Review) of the Legal Lifecycle workflow (`legal`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `legal` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).

Run this skill's gate before writing: `sh <this skill's folder>/scripts/gate.sh <project> <project root>`, where `<project root>` is the folder that contains `.singularskills/` (use `.` when you are already there). If it exits non-zero, stop and tell the user what it printed, unless `--skip-checks` was given (see Arguments). On a refusal, before you stop, append this line to `.singularskills/log.jsonl` (create the folder and file if missing): `{"ts":"<ISO timestamp>","skill":"legal-clause-analysis","workflow":"legal","phase":2,"project":"<project>","event":"refused","artifact":"02-review.md","note":"<what the gate printed>"}`. Once the gate has passed, or under `--skip-checks` once you have appended the `skipped` line, append this line before you start work: `{"ts":"<ISO timestamp>","skill":"legal-clause-analysis","workflow":"legal","phase":2,"project":"<project>","event":"started","artifact":"02-review.md","note":""}`.

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for risk and jurisdiction context
   - Identify the clause(s) to analyze from user input (quote, section reference, or topic)

2. **Interpret the clause's legal effect:**
   - What obligations does this clause create for each party?
   - What rights does it grant or limit?
   - What triggers activate the clause (conditions precedent, events of default)?
   - What are the consequences of breach or non-compliance?

3. **Compare to market standard language:**
   - Read `references/contract-template.md` for baseline comparison
   - Is this clause more favorable, neutral, or less favorable than market standard?
   - Which specific elements deviate from standard practice?

4. **Identify hidden obligations or risks:**
   - **Triggers** — conditions that activate obligations (notice requirements, time limits)
   - **Conditions** — prerequisites that must be met for rights to apply
   - **Exceptions** — carve-outs that narrow protections
   - **Cascading effects** — how this clause interacts with other provisions
   - **Ambiguity** — terms that could be interpreted against either party

5. **Score risk (1-5):**
   - **1 — Minimal risk** — standard language, well-balanced, no hidden issues
   - **2 — Low risk** — minor deviations from standard, easily addressed
   - **3 — Moderate risk** — notable concerns requiring negotiation or revision
   - **4 — High risk** — significant exposure, strongly favors counterparty
   - **5 — Critical risk** — unacceptable terms, potential for material harm

6. **Suggest alternative language:**
   - If risk score is 3 or above, provide redline suggestions
   - Draft replacement language that is more balanced
   - Explain why the alternative is preferable

7. **Flag enforceability concerns by jurisdiction:**
   - Identify jurisdictions where the clause may be unenforceable
   - Note any statutory overrides that nullify contractual terms
   - Flag unconscionability or public policy concerns

8. **Write the artifact** — append to `.singularskills/legal/<project>/02-review.md` under a `## Clause Analysis` section. Create the file with a `# Review — <project>` heading if it does not exist; if a `## Clause Analysis` section already exists, replace only that section. The section contains:

   - **Clause Text** — the original clause(s) being analyzed
   - **Legal Effect** — obligations, rights, triggers, and consequences
   - **Market Comparison** — how the clause compares to standard language
   - **Hidden Risks** — identified triggers, conditions, exceptions, and ambiguities
   - **Risk Score** — score (1-5) with detailed explanation
   - **Suggested Alternatives** — redline language where applicable
   - **Enforceability Notes** — jurisdiction-specific concerns

## Output

The clause analysis appended to `.singularskills/legal/<project>/02-review.md`. Present a summary to the user highlighting:
- Risk score and primary risk factors
- Key deviations from market standard language
- Recommended alternative language (if applicable)
- Jurisdictions where enforceability may be challenged

**Record the run.** After you have written your section, append this line to `.singularskills/log.jsonl` (the `started` line of Prerequisites, with `"event":"finished"`): `{"ts":"<ISO timestamp>","skill":"legal-clause-analysis","workflow":"legal","phase":2,"project":"<project>","event":"finished","artifact":"02-review.md","note":""}`.

This artifact is shared by every skill of phase 2 (Review). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Review
workflow: legal
phase: 2
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Clause Analysis` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-clause-analysis`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Clause Analysis` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
