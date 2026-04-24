---
description: Prioritize regulations by business impact, deadline, and customer demand
---

# Compliance Priorities

Prioritize the applicable regulations for "$ARGUMENTS" by business impact, enforcement deadlines, and customer demand to determine the optimal compliance sequence.

## Prerequisites

None — this is a Phase 0 (Scope) skill.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for the regulation inventory

2. **Business impact scoring:**
   - For each applicable regulation, score revenue at risk without certification (0-10)
   - Assess deal-blocking potential — how often is this certification requested in sales cycles?
   - Estimate market access impact — does non-compliance lock out entire markets or verticals?

3. **Urgency scoring:**
   - Score enforcement deadline proximity (0-10) — active enforcement vs. upcoming vs. future
   - Score customer deadline pressure (0-10) — immediate customer requirements vs. nice-to-have
   - Flag any regulations with imminent deadlines or recent enforcement actions

4. **Effort scoring:**
   - Score implementation complexity (0-10) — scope of changes needed
   - Estimate time to certification (months)
   - Assess internal capability gaps — can this be done in-house or requires external help?

5. **Priority ranking:**
   - Calculate weighted priority score (business impact 40%, urgency 35%, inverse effort 25%)
   - Rank regulations from highest to lowest priority
   - Identify quick wins (high impact, low effort) vs. strategic investments (high impact, high effort)
   - Group into tiers: Tier 1 (immediate), Tier 2 (next 6 months), Tier 3 (12+ months)

6. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/00-scope.md` (append to existing) with sections:
   - **Scoring Matrix** — table with impact, urgency, effort, and weighted scores per regulation
   - **Priority Tiers** — Tier 1/2/3 groupings with rationale
   - **Quick Wins** — low-effort, high-impact regulations to tackle first
   - **Strategic Investments** — high-effort certifications that unlock major business value
   - **Dependencies** — regulations that build on each other (e.g., ISO 27001 before CSA STAR)

## Output

The priority analysis appended to `.metapowers/compliance/$ARGUMENTS/00-scope.md`. Present a summary to the user highlighting:
- Top 3 priority regulations and why
- Identified quick wins
- Key dependencies between certifications
- Recommended next step: run `/compliance:control-framework $ARGUMENTS`
