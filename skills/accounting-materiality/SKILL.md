---
name: accounting-materiality
description: Determine overall, performance and trivial materiality thresholds from a chosen benchmark plus qualitative factors, and apply them to known misstatements as adjust or pass. Use when the user asks whether a misstatement is big enough to fix or disclose, or needs a materiality level for an audit or close.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Materiality

Determine materiality thresholds for "$ARGUMENTS". Establish quantitative and qualitative benchmarks to guide which items require adjustment, disclosure, or further investigation.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"accounting-materiality","workflow":"accounting","phase":null,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

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

5. **Write the artifact** to `.singularskills/accounting/<project>/materiality.md` with sections:
   - **Materiality Calculation** — benchmark selected, base amount, and computed thresholds
   - **Qualitative Factors** — additional considerations that could lower thresholds
   - **Application** — list of items evaluated against materiality with adjust/pass recommendation
   - **Summary of Unadjusted Differences** — items passed on and their aggregate effect

## Output

The materiality assessment written to `.singularskills/accounting/<project>/materiality.md`. Present a summary highlighting:
- Overall and performance materiality thresholds
- Number of items evaluated
- Recommendations to adjust vs. pass

End the artifact with this paragraph, verbatim:

> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it.
