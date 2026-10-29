---
name: leadership-decision
description: Make a structured leadership decision — choose whether to decide alone, consult, delegate or seek consensus, compare options by risk and reversibility, and recommend one with a rollback plan. Use when the user is torn between options on a team or management call and wants a clear way to decide.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Decision

Work through a decision for "$ARGUMENTS". Use the appropriate decision-making framework based on impact, urgency, and stakeholders.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"leadership-decision","workflow":"leadership","phase":null,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

None — utility skill, run anytime.

## Process

1. **Read context:**
   - Read `references/decision-frameworks.md`
   - Ask: What's the decision? What are the options? Who's affected?

2. **Determine decision mode:**
   - Assess impact (high/low) and urgency (high/low)
   - Recommend: decide alone, consult, delegate, or consensus

3. **Analyze options:**
   - For each option: pros, cons, risks, effort, reversibility
   - Identify the key trade-offs
   - What information is missing?

4. **Make a recommendation:**
   - Which option and why
   - What to monitor after deciding
   - Rollback plan if it doesn't work

5. **Write the artifact** to `.singularskills/leadership/<project>/decision.md`

## Output

The decision analysis written to `.singularskills/leadership/<project>/decision.md`. Present the recommendation to the user.
