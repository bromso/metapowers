---
description: Design A/B tests with hypothesis, measurement, and statistical rigor
---

# A/B Test Setup

Design rigorous A/B tests for "$ARGUMENTS". Create testable hypotheses, define variants, calculate sample sizes, and plan measurement.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for business context
   - Read `.marketing/$ARGUMENTS/02-act.md` and `.marketing/$ARGUMENTS/03-convert.md` if they exist (for CRO recommendations that need testing)

2. **Define the test:**
   - What are you testing? (headline, CTA, layout, pricing, flow)
   - Hypothesis format: "If we [change], then [metric] will [improve/decrease] by [amount], because [rationale]"
   - Primary metric (one clear success metric)
   - Secondary metrics (guard-rail metrics to watch)

3. **Design variants:**
   - Control (A): current experience
   - Treatment (B): specific change — one variable only
   - If multivariate: document variable matrix
   - Screenshots or mockups of each variant

4. **Statistical planning:**
   - Current baseline metric (conversion rate, click rate, etc.)
   - Minimum detectable effect (MDE): what improvement is meaningful?
   - Required sample size calculation
   - Expected test duration based on traffic
   - Statistical significance threshold (typically 95%)

5. **Implementation plan:**
   - Testing tool recommendation (if not already decided)
   - Traffic split: 50/50 or other
   - Segment targeting: who sees the test?
   - QA checklist before launch

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/03-convert.md` under a `## A/B Test: [Test Name]` section:
   - **Hypothesis** — structured hypothesis statement
   - **Variants** — control and treatment descriptions
   - **Metrics** — primary and secondary
   - **Statistical Plan** — sample size, duration, significance
   - **Implementation** — tool, targeting, QA steps
   - **Decision Framework** — what to do based on results

## Output

A/B test plan written to `.marketing/$ARGUMENTS/03-convert.md`. Present the hypothesis and expected timeline to the user.
