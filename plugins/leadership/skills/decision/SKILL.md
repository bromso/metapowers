---
name: decision
description: Make structured decisions using the right decision mode
argument-hint: "[project] [--skip-checks]"
---

# Decision

Work through a decision for "$ARGUMENTS". Use the appropriate decision-making framework based on impact, urgency, and stakeholders.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/leadership/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — utility skill, run anytime.

## Process

1. **Read context:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/decision-frameworks.md`
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

5. **Write the artifact** to `.metapowers/leadership/<project>/decision.md`

## Output

The decision analysis written to `.metapowers/leadership/<project>/decision.md`. Present the recommendation to the user.
