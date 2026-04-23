---
description: Review a contract for risks, missing clauses, and unfavorable terms
---

# Contract Review

Review the contract for "$ARGUMENTS". Analyze each section against best practices, identify missing standard clauses, flag unfavorable terms, and score overall risk.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for contract-review".

## Process

1. **Read inputs:**
   - Read `.legal/$ARGUMENTS/00-assess.md` for risk and jurisdiction context
   - Read `plugins/legal/shared/contract-template.md` for standard contract provisions
   - Read the contract from the source provided by the user (file path, URL, or inline text)

2. **Check each section against best practices:**
   - Compare contract structure to the standard template
   - Verify each clause uses clear, unambiguous language
   - Confirm defined terms are used consistently throughout
   - Check that cross-references are accurate

3. **Identify missing standard clauses:**
   - **Indemnification** — mutual or one-sided indemnification obligations
   - **Limitation of liability** — liability cap and exclusions
   - **Intellectual property** — ownership, licensing, and assignment provisions
   - **Confidentiality** — scope, duration, and exceptions
   - **Termination** — rights, notice periods, and consequences

4. **Flag unfavorable terms:**
   - **Unlimited liability** — no cap on damages or liability exposure
   - **Broad indemnification** — disproportionate indemnification obligations
   - **Unilateral amendments** — one party can modify terms without consent
   - **Auto-renewal traps** — automatic renewal with punitive exit terms
   - **Excessive exclusivity** — unreasonable exclusivity scope or duration
   - **One-sided termination** — asymmetric termination rights

5. **Score overall risk:**
   - **Low** — contract follows best practices with minor improvements suggested
   - **Medium** — contract has notable gaps or moderately unfavorable terms requiring negotiation
   - **High** — contract contains significant risk exposure or multiple missing critical clauses

6. **Provide section-by-section commentary:**
   - For each contract section, note: status (acceptable/needs revision/missing), specific issues found, and concrete recommendations

7. **Write the artifact** to `.legal/$ARGUMENTS/02-review.md` with frontmatter:

   ```
   ---
   description: Contract review for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Contract Overview** — parties, type, effective date, term
   - **Section-by-Section Analysis** — commentary per contract section
   - **Missing Clauses** — standard clauses not present in the contract
   - **Unfavorable Terms** — flagged terms with risk explanation
   - **Overall Risk Score** — Low/Medium/High with justification
   - **Recommendations** — prioritized action items for revision

## Output

The contract review written to `.legal/$ARGUMENTS/02-review.md`. Present a summary to the user highlighting:
- Overall risk score and top contributing factors
- Missing standard clauses that should be added
- Most critical unfavorable terms requiring immediate attention
- Top 3 recommended revisions
