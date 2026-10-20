---
name: budget
description: Allocate the forecast into department budgets with headcount plans, spending authority levels, variance thresholds and a budget owner per department. Use when the user has a forecast and needs to decide how much each team can spend and who approves what.
argument-hint: "[project] [--skip-checks]"
---

# Budget

Allocate the budget for "$ARGUMENTS". Break down the forecast into departmental budgets with spending limits, approval thresholds, and accountability.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/finance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/finance/<project>/03-forecast.md`. If this file does not exist, tell the user:

> Phase 3 (Forecast) has not been completed for "<project>". Run `/finance:forecast <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/finance/<project>/02-plan.md` for strategic objectives
   - Read `.metapowers/finance/<project>/03-forecast.md` for expense projections

2. **Define budget structure:**
   - List all departments or cost centers
   - Categorize expenses: personnel, tools/software, marketing, infrastructure, professional services, other
   - Determine budget period (monthly, quarterly, annual)

3. **Allocate by department:**
   - For each department:
     - Personnel costs (headcount x compensation)
     - Non-personnel costs (tools, travel, contractors, etc.)
     - Growth investments vs maintenance spend
   - Ensure allocations sum to the forecast total
   - Identify which departments have the most budget flexibility

4. **Set guardrails:**
   - Define spending authority levels (who can approve what amounts)
   - Set variance thresholds that trigger review (e.g., >10% over budget)
   - Identify protected vs discretionary line items
   - Define the reallocation process

5. **Create accountability framework:**
   - Assign a budget owner to each department
   - Define reporting cadence (monthly actuals vs budget)
   - Set up variance explanation requirements

6. **Write the artifact** to `.metapowers/finance/<project>/04-budget.md` with sections:
   - **Budget Summary** — total budget by period, split by department
   - **Department Budgets** — detailed allocation per department
   - **Headcount Budget** — planned hires, timing, and cost
   - **Spending Guardrails** — authority levels, thresholds, protected items
   - **Accountability** — owners, reporting cadence, variance rules

## Output

The budget written to `.metapowers/finance/<project>/04-budget.md`. Present a summary highlighting:
- Total budget and department breakdown
- Largest budget categories
- Key guardrails and approval thresholds
- Headcount plan
