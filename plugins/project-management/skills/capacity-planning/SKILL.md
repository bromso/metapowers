---
description: Plan team capacity across sprints accounting for holidays and availability
---

# Capacity Planning

Plan team capacity for "$ARGUMENTS" across upcoming sprints. List team members, calculate available working days accounting for holidays and leave, apply focus factors, estimate capacity in story points, and identify capacity risks over the next 3-6 sprints.

## Prerequisites

None — this is a utility skill. It can be run at any time, with or without existing project artifacts.

If `.project/$ARGUMENTS/` exists, read any available artifacts for context (especially team setup, sprint metrics, and velocity data). If it does not exist, proceed based on information the user provides.

## Process

1. **Gather context:**
   - If `.project/$ARGUMENTS/` exists, read available artifacts for team composition, velocity history, and sprint cadence
   - If no artifacts exist, ask the user for: team members, sprint length, and upcoming sprint dates
   - Determine the planning horizon: typically 3-6 sprints ahead

2. **List team members with their roles:**
   - For each team member, document:
     - **Name** and **role** (developer, designer, QA, etc.)
     - **Allocation** — full-time (100%) or part-time (specify percentage)
     - **Individual velocity** — if known from historical data (story points per sprint)
     - **Skills or specialties** — useful for identifying single points of failure
   - Note any planned team changes: new hires joining, members departing, role changes

3. **For each sprint period, calculate available working days:**
   - **Total business days** in the sprint (exclude weekends)
   - **Minus public holidays** — list specific holidays that fall in the sprint
   - **Minus known PTO and leave** — planned vacations, sick leave patterns, parental leave, training days
   - **Minus company events** — offsites, all-hands, hackathons, conferences
   - Calculate per person and as a team total
   - Present as a table: team member x sprint with available days in each cell

4. **Subtract overhead:**
   - **Meetings and ceremonies** — sprint planning, standup, review, retro, backlog refinement (typically 15-20% of time)
   - **Support and maintenance** — on-call duties, production support, bug triage (estimate based on historical patterns)
   - **Administrative tasks** — code reviews, documentation, mentoring, hiring interviews
   - Default overhead: 20% of available time, adjust based on team's actual experience
   - Document the overhead percentage used and rationale

5. **Apply focus factor:**
   - Focus factor accounts for context switching, interruptions, and ramp-up time
   - **0.8 (high focus):** dedicated team, minimal interruptions, mature processes
   - **0.7 (normal):** typical team with some interruptions and context switching
   - **0.6 (low focus):** frequent interruptions, multiple projects, many ad-hoc requests
   - Select the appropriate factor based on the team's working environment
   - Document the chosen factor and rationale

6. **Calculate capacity in story points per sprint:**
   - **Formula:** available days x (1 - overhead%) x focus factor x individual velocity factor
   - If individual velocity is unknown, use a default of 1 story point per productive day as a starting point
   - If team historical velocity is known, use it as a cross-check:
     - Calculate capacity bottom-up (sum of individual capacities)
     - Compare with top-down (historical team velocity adjusted for availability)
     - Use the lower of the two estimates for safer planning
   - Present capacity per person and as a team total for each sprint

7. **Sum team capacity per sprint:**
   - Create a summary table: sprint x total capacity (story points)
   - Show the range: minimum (pessimistic), expected (realistic), maximum (optimistic)
   - Compare with backlog demand if known — is there enough capacity to deliver the planned work?
   - Highlight sprints with significantly reduced capacity (holidays, leaves)

8. **Identify capacity risks across the planning horizon:**
   - **Holiday clusters** — sprints with multiple holidays reducing capacity significantly
   - **Planned leaves** — periods where multiple team members are out simultaneously
   - **Key-person dependencies** — sprints where a specialist is unavailable and work depends on them
   - **Ramp-up periods** — new team members who will not be at full velocity initially (expect 25-50% for first sprint, 50-75% for second)
   - **Competing priorities** — known events that will pull team members away (releases, on-call rotations, company events)
   - For each risk, note the impact on capacity and suggest mitigation (shift work, cross-train, adjust scope)

9. **Recommend commitment levels per sprint:**
   - Based on calculated capacity, recommend how many story points to commit to in each sprint
   - **Commitment guideline:** commit to 80% of calculated capacity to leave room for unknowns
   - Flag sprints where capacity is below 70% of normal — consider reducing scope or extending timelines
   - Flag sprints where commitment should be especially conservative (first sprint of a new team, post-holiday sprints)
   - Suggest which work to prioritize or defer based on capacity constraints

10. **Write the artifact** — save to `.project/$ARGUMENTS/capacity-planning.md`:
    - **Team Roster** — members, roles, allocation, and velocity
    - **Sprint Calendar** — dates, business days, holidays, and PTO for each sprint
    - **Capacity Table** — available days, overhead, focus factor, and story points per person per sprint
    - **Team Capacity Summary** — total capacity per sprint with min/expected/max range
    - **Capacity Risks** — identified risks with impact and mitigation
    - **Commitment Recommendations** — recommended story point commitment per sprint
    - **Assumptions** — overhead percentage, focus factor, velocity factors used

## Output

Capacity plan saved to `.project/$ARGUMENTS/capacity-planning.md`. Present a summary highlighting:
- Team size and total capacity across the planning horizon
- Sprints with significantly reduced capacity and why
- Top capacity risk and recommended mitigation
- Commitment recommendations per sprint
