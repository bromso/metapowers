---
name: analytics-number-check
description: Check one reported number — find or ask for its definition, reproduce it from the data with code, and report whether it matches, differs and why, or cannot be reproduced. Use when the user doubts a figure in a report, deck or dashboard and wants to know if it is right. Not for explaining why a metric moved; see /analytics-investigate.
metadata:
  argument-hint: "<number and where it came from> [project]"
---

# Number check

Check whether the number in "$ARGUMENTS" is right, by reproducing it.

**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally.

## Prerequisites

The number, where it was reported, and the data it should come from (a file or pasted table). Take a token that names a folder in `.singularskills/analytics/` as `<project>`; with none and exactly one folder there, use it; with several, ask which; with no folder at all, read none and continue.

Read `.singularskills/analytics/<project>/02-metrics.md` for the metric's definition when it exists.

## Process

1. **Pin the definition:** from `02-metrics.md`, the report's footnotes, or the user; ask once if none is available. Write it down as formula, filters, window and grain.

2. **Reproduce it** with a script, following the definition exactly. Work in a scratch location outside `.singularskills/`; this skill writes no file.

3. **When it does not match, find why:** recompute with the usual variations and see which one produces the reported number:
   - an average of averages instead of total ÷ total
   - a different window or time zone
   - included or excluded rows (refunds, test accounts, internal users)
   - a different denominator (sessions versus users, all versus active)
   - rounding or a stale extract

4. **Say which number is right** under the stated definition, and whether the reported one is wrong or just defined differently.

## Output

In chat: **match**, **mismatch** (the reproduced number, the reported one, and the variation that explains the difference) or **cannot reproduce** (what is missing). Then the definition used and the script. This skill writes no file.
