---
description: Set and track objectives and key results
---

# OKRs

Create or review OKRs for "$ARGUMENTS". Set clear objectives with measurable key results aligned to team and organizational goals.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/leadership/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — utility skill, run anytime.

## Process

1. **Understand the context:**
   - What period are these OKRs for? (quarter, half, year)
   - What are the organizational or team-level goals?
   - If reviewing existing OKRs, read them first

2. **Define objectives:**
   - 2-3 objectives per team or individual
   - Each objective is qualitative, inspirational, and time-bound
   - Objectives should be ambitious but achievable (aim for 70% completion)

3. **Define key results:**
   - 3-5 key results per objective
   - Each key result is quantitative and measurable
   - Define the starting point, target, and how to measure
   - Must be outcomes, not activities ("Reduce churn to 3%" not "Run 5 campaigns")

4. **Align and prioritize:**
   - Do OKRs connect upward to organizational goals?
   - Are they realistic given capacity?
   - What will you NOT do to focus on these?

5. **Write the artifact** to `.metapowers/leadership/<project>/okrs.md`

## Output

The OKRs written to `.metapowers/leadership/<project>/okrs.md`. Present the objectives and key results to the user.
