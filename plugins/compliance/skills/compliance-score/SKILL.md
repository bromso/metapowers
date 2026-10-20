---
name: compliance-score
description: Calculate a weighted compliance score across all assessed regulations, with per-regulation and per-domain RAG ratings, weakest areas, trend and gap to target. Use when the user asks how compliant they are overall, wants a single compliance number, or asks which regulation is in the worst shape.
argument-hint: "[project] [--skip-checks]"
---

# Compliance Score

Calculate the overall compliance score for "$ARGUMENTS" across all assessed regulations, providing a weighted scorecard with per-regulation breakdowns and trend analysis.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is a utility skill.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read all assessment files from `.metapowers/compliance/<project>/01-assess/` if they exist
   - Read `.metapowers/compliance/<project>/00-scope.md` for compliance priorities and weights (if available)

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

The scorecard is the artifact; present it in chat and write no file. Highlight:
- Overall weighted compliance score
- Per-regulation scores with RAG ratings
- Top 3 weakest areas requiring attention
- Trend direction (if historical data available)
- Recommended next steps to improve score

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.
