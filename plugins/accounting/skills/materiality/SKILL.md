---
description: Determine significance thresholds for reporting and adjustment decisions
---

# Materiality

Determine materiality thresholds for "$ARGUMENTS". Establish quantitative and qualitative benchmarks to guide which items require adjustment, disclosure, or further investigation.

## Prerequisites

None — utility skill, run anytime. Most effective after Phase 4 (trial balance) or Phase 7 (statements) when financial totals are available.

## Process

1. **Select materiality benchmarks:**
   - Common quantitative benchmarks:
     - 5-10% of pre-tax income (for-profit entities)
     - 0.5-1% of total revenue
     - 0.5-1% of total assets
     - 1-2% of total equity
   - Choose the benchmark most relevant to the entity's circumstances
   - For nonprofits, consider total expenses or total contributions

2. **Calculate materiality levels:**
   - **Overall materiality** — the threshold for the financial statements as a whole
   - **Performance materiality** — a reduced threshold (typically 50-75% of overall) used during testing to allow for undetected misstatements
   - **Trivial threshold** — below this amount, items are clearly inconsequential (typically 5% of overall materiality)

3. **Apply qualitative factors:**
   - Even below quantitative thresholds, items may be material if they:
     - Involve fraud or illegal acts
     - Affect compliance with debt covenants or regulatory requirements
     - Change a trend (e.g., turn a profit into a loss)
     - Affect management compensation or bonuses
     - Involve related-party transactions
     - Were previously communicated as significant

4. **Document materiality decisions:**
   - Apply thresholds to known misstatements and adjustments
   - Recommend which items to adjust and which to pass on
   - Aggregate unadjusted items and assess whether the total is material

5. **Write the artifact** to `.metapowers/accounting/$ARGUMENTS/materiality.md` with sections:
   - **Materiality Calculation** — benchmark selected, base amount, and computed thresholds
   - **Qualitative Factors** — additional considerations that could lower thresholds
   - **Application** — list of items evaluated against materiality with adjust/pass recommendation
   - **Summary of Unadjusted Differences** — items passed on and their aggregate effect

## Output

The materiality assessment written to `.metapowers/accounting/$ARGUMENTS/materiality.md`. Present a summary highlighting:
- Overall and performance materiality thresholds
- Number of items evaluated
- Recommendations to adjust vs. pass
