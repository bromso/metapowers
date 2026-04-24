---
description: Calculate overall compliance score across all assessed regulations
---

# Compliance Score

Calculate the overall compliance score for "$ARGUMENTS" across all assessed regulations, providing a weighted scorecard with per-regulation breakdowns and trend analysis.

## Prerequisites

None — this is a utility skill.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read all assessment files from `.metapowers/compliance/$ARGUMENTS/01-assess/` if they exist
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for compliance priorities and weights (if available)

2. **Per-regulation scoring:**
   - For each regulation with an assessment: count controls by status — compliant, partially compliant, non-compliant, not applicable
   - Calculate percentage compliance score per regulation
   - Partially compliant controls count as 50% compliant
   - Not applicable controls are excluded from the denominator
   - Document the scoring methodology transparently

3. **Weighted overall score:**
   - If compliance priorities exist (from Phase 0): use business importance weights
   - If no priorities exist: weight equally across all assessed regulations
   - Calculate weighted overall compliance score
   - Present as percentage with confidence indicator (based on assessment completeness)

4. **Analysis:**
   - Identify weakest areas — regulations or control domains with lowest scores
   - Identify strongest areas — regulations where compliance is highest
   - Calculate gap-to-target — how much improvement is needed to reach target score (e.g., 90%)
   - If previous scores exist: show trend analysis (improving, stable, declining)

5. **Scorecard presentation:**
   - Overall weighted score with RAG rating
   - Per-regulation score with RAG rating
   - Per-domain score (access control, data protection, incident response, etc.)
   - Comparison to industry benchmarks where available

6. **Present scorecard to user** with:
   - **Overall Compliance Score** — weighted score with confidence level
   - **Per-Regulation Breakdown** — individual regulation scores
   - **Weakest Areas** — domains and regulations needing the most attention
   - **Strongest Areas** — domains and regulations in good standing
   - **Trend Analysis** — improvement over time (if previous data exists)
   - **Gap-to-Target** — effort needed to reach compliance goals

## Output

Present the compliance scorecard directly to the user highlighting:
- Overall weighted compliance score
- Per-regulation scores with RAG ratings
- Top 3 weakest areas requiring attention
- Trend direction (if historical data available)
- Recommended next steps to improve score
