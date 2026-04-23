---
description: Analyze legal requirements across jurisdictions (multi-country/state)
---

# Jurisdiction Analysis

Analyze legal requirements across all relevant jurisdictions for "$ARGUMENTS". Compare obligations, identify conflicts, and recommend a baseline standard.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

None — this is a Phase 0 Assess skill.

## Process

1. **Identify all relevant jurisdictions:**
   - Where the business has offices or physical presence
   - Where customers or users are located
   - Where data is stored or processed
   - Where employees or contractors are based
   - Where partners or vendors operate

2. **For each jurisdiction, document:**
   - **Key legal requirements** — primary laws governing business operations
   - **Registration and filing obligations** — business registration, tax filings, annual reports
   - **Data protection laws** — privacy regulations, data localization requirements, breach notification rules
   - **Employment laws** — hiring requirements, worker classification, benefits mandates, termination rules
   - **Consumer protection laws** — disclosure requirements, refund policies, advertising standards

3. **Compare requirements across jurisdictions:**
   - Create a comparison matrix (jurisdiction x requirement area)
   - Identify where requirements align across jurisdictions
   - Identify where requirements diverge or conflict

4. **Identify conflicts:**
   - Stricter vs. more permissive requirements for the same obligation
   - Mutually exclusive requirements (where complying with one violates another)
   - Data localization conflicts (data must stay in country A but also be accessible in country B)
   - Employment law conflicts across remote-work jurisdictions

5. **Recommend baseline standard:**
   - Typically adopt the strictest jurisdiction's standard as the baseline
   - Document where jurisdiction-specific exceptions or adaptations are needed
   - Identify cost and operational implications of the recommended baseline
   - Flag areas where legal counsel must resolve genuine conflicts

6. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/00-assess.md` with heading:

   ## Jurisdiction Analysis

   Include sections:
   - **Jurisdiction Inventory** — all jurisdictions with basis for inclusion
   - **Requirements by Jurisdiction** — legal obligations per jurisdiction
   - **Comparison Matrix** — side-by-side comparison of key requirements
   - **Conflicts and Tensions** — where requirements diverge or conflict
   - **Recommended Baseline** — proposed standard with rationale
   - **Jurisdiction-Specific Exceptions** — where the baseline needs adaptation

## Output

The jurisdiction analysis written to `.metapowers/legal/$ARGUMENTS/00-assess.md`. Present a summary to the user highlighting:
- Total jurisdictions analyzed
- Key conflicts or tensions identified
- Recommended baseline jurisdiction and rationale
