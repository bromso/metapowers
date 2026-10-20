---
description: Design A/B tests with hypothesis, measurement, and statistical rigor
---

# A/B Test Setup

Design rigorous A/B tests for "$ARGUMENTS". Create testable hypotheses, define variants, calculate sample sizes, and plan measurement.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for business context
   - Read `.metapowers/marketing/<project>/02-act.md` and `.metapowers/marketing/<project>/03-convert.md` if they exist (for CRO recommendations that need testing)

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

6. **Write the artifact** — append to `.metapowers/marketing/<project>/03-convert.md` under a `## A/B Test: [Test Name]` section. Create the file with a `# Convert — <project>` heading if it does not exist; if a `## A/B Test: [Test Name]` section already exists, replace only that section. The section contains:
   - **Hypothesis** — structured hypothesis statement
   - **Variants** — control and treatment descriptions
   - **Metrics** — primary and secondary
   - **Statistical Plan** — sample size, duration, significance
   - **Implementation** — tool, targeting, QA steps
   - **Decision Framework** — what to do based on results

## Output

A/B test plan appended to `.metapowers/marketing/<project>/03-convert.md`. Present the hypothesis and expected timeline to the user.
