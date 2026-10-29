---
name: singular-report
description: Generate a written cross-domain report for one project or all of them — key findings per domain, how the domains line up, readiness and next steps — saved for sharing. Use when the user wants everything their Metapowers work has found so far, across all domains, summarized for themselves or stakeholders. Not for a quick progress table; see /singular-status.
metadata:
  argument-hint: "[project] [--skip-checks]"
---

# Report

Generate a comprehensive cross-domain report for "$ARGUMENTS" (or the entire `.singularskills/` directory if no argument given). Summarize progress, findings, and readiness across all active domains.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"singular","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Requires `.singularskills/` directory with at least one domain's artifacts.

## Process

1. **Read the domain registry:**
   - Read the workflow files in `workflows/` for the list of workflows and their phase artifacts.
   - Read `.singularskills/config.md` if it exists for project context

2. **Scan all domain artifacts:**
   - For each domain with artifacts in `.singularskills/`:
     - Read the most recent/final artifact (e.g., the last completed phase)
     - Extract key findings, decisions, and outcomes
     - Note completion status

3. **Generate domain summaries:**

   For each active domain, extract the key insight:
   - **Research:** Problem statement and top recommendation
   - **Branding:** Positioning statement and brand personality
   - **Design:** Component contracts and design decisions
   - **Development:** Features built, test status, commits
   - **Accessibility:** Conformance level and outstanding issues
   - **Marketing:** Campaign strategy and channel plan
   - **Coaching:** Scores and top improvement areas
   - **Leadership:** Team structure and OKRs
   - **Project Management:** Sprint status and velocity
   - **Legal:** Compliance status and outstanding risks
   - **Security:** NIST CSF function coverage and open findings
   - **Compliance:** Regulatory coverage and certification/audit status
   - **Bookkeeping:** Reconciliation status and categorization accuracy
   - **Accounting:** Close status and statement readiness
   - **Finance:** Forecast/budget variance and runway

4. **Identify cross-domain connections:**
   - Is branding being followed in marketing?
   - Are accessibility issues addressed in development?
   - Does the design align with the research findings?
   - Are coaching recommendations being acted on?

5. **Generate readiness assessment:**
   - What's complete and ready?
   - What's in progress?
   - What's blocked or needs attention?
   - What domains haven't been started but should be?

6. **Write the report** to `.singularskills/reports/<project>-report.md` (or `.singularskills/reports/<date>-project-report.md` if no argument) with sections:
   - **Executive Summary** — one-paragraph project status
   - **Domain Status** — per-domain progress and key findings
   - **Cross-Domain Insights** — connections and alignment
   - **Readiness Assessment** — what's ready, in progress, blocked
   - **Recommended Next Steps** — prioritized actions

## Output

The report written to `.singularskills/reports/`. Present the executive summary and recommended next steps to the user.
