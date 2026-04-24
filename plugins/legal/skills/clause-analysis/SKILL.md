---
description: Analyze specific contract clauses with deep-dive risk scoring
---

# Clause Analysis

Perform a deep-dive analysis of specific contract clauses for "$ARGUMENTS". Interpret legal effect, compare to market standards, identify hidden risks, and suggest alternative language where needed.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.metapowers/legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.metapowers/legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for clause-analysis".

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/$ARGUMENTS/00-assess.md` for risk and jurisdiction context
   - Identify the clause(s) to analyze from user input (quote, section reference, or topic)

2. **Interpret the clause's legal effect:**
   - What obligations does this clause create for each party?
   - What rights does it grant or limit?
   - What triggers activate the clause (conditions precedent, events of default)?
   - What are the consequences of breach or non-compliance?

3. **Compare to market standard language:**
   - Read `plugins/legal/shared/contract-template.md` for baseline comparison
   - Is this clause more favorable, neutral, or less favorable than market standard?
   - Which specific elements deviate from standard practice?

4. **Identify hidden obligations or risks:**
   - **Triggers** — conditions that activate obligations (notice requirements, time limits)
   - **Conditions** — prerequisites that must be met for rights to apply
   - **Exceptions** — carve-outs that narrow protections
   - **Cascading effects** — how this clause interacts with other provisions
   - **Ambiguity** — terms that could be interpreted against either party

5. **Score risk (1-5):**
   - **1 — Minimal risk** — standard language, well-balanced, no hidden issues
   - **2 — Low risk** — minor deviations from standard, easily addressed
   - **3 — Moderate risk** — notable concerns requiring negotiation or revision
   - **4 — High risk** — significant exposure, strongly favors counterparty
   - **5 — Critical risk** — unacceptable terms, potential for material harm

6. **Suggest alternative language:**
   - If risk score is 3 or above, provide redline suggestions
   - Draft replacement language that is more balanced
   - Explain why the alternative is preferable

7. **Flag enforceability concerns by jurisdiction:**
   - Identify jurisdictions where the clause may be unenforceable
   - Note any statutory overrides that nullify contractual terms
   - Flag unconscionability or public policy concerns

8. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/02-review.md` with frontmatter:

   ```
   ---
   description: Clause analysis for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Clause Text** — the original clause(s) being analyzed
   - **Legal Effect** — obligations, rights, triggers, and consequences
   - **Market Comparison** — how the clause compares to standard language
   - **Hidden Risks** — identified triggers, conditions, exceptions, and ambiguities
   - **Risk Score** — score (1-5) with detailed explanation
   - **Suggested Alternatives** — redline language where applicable
   - **Enforceability Notes** — jurisdiction-specific concerns

## Output

The clause analysis written to `.metapowers/legal/$ARGUMENTS/02-review.md`. Present a summary to the user highlighting:
- Risk score and primary risk factors
- Key deviations from market standard language
- Recommended alternative language (if applicable)
- Jurisdictions where enforceability may be challenged
