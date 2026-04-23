---
description: Scan agreements for high-risk clauses and non-standard terms
---

# Red Flag Detection

Scan the agreement for "$ARGUMENTS" to identify high-risk clauses and non-standard terms. Systematically check for common contractual red flags and score each finding using a RAG (Red/Amber/Green) framework.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.metapowers/legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.metapowers/legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for red-flag-detection".

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/$ARGUMENTS/00-assess.md` for risk and jurisdiction context
   - Read the agreement from the source provided by the user

2. **Scan systematically for red flags across categories:**

   **Liability and Indemnification:**
   - Unlimited liability exposure (no cap on damages)
   - Broad indemnification obligations (disproportionate to party's role)
   - Missing limitation of liability cap
   - Indemnification for third-party claims without control of defense

   **Amendment and Renewal:**
   - Unilateral amendment rights (one party can change terms without consent)
   - Automatic renewal with penalty (difficult or costly to exit)
   - Silent renewal clauses with short opt-out windows

   **Restrictive Covenants:**
   - Non-compete overreach (excessive scope, geography, or duration)
   - Non-solicit provisions extending beyond reasonable limits
   - Exclusivity requirements disproportionate to the relationship

   **Intellectual Property:**
   - IP assignment beyond the scope of work
   - Overly broad license grants (perpetual, irrevocable, sublicensable)
   - Missing background IP carve-outs
   - Work-for-hire misclassification

   **Termination:**
   - One-sided termination rights (asymmetric rights favoring counterparty)
   - Termination for convenience without reasonable notice
   - Punitive post-termination obligations

   **Data and Audit:**
   - Ambiguous data ownership provisions
   - Unreasonable audit rights (scope, frequency, cost allocation)
   - Missing data breach notification requirements

   **Dispute Resolution:**
   - Missing governing law clause
   - Missing dispute resolution mechanism
   - Mandatory arbitration with unfavorable forum or rules
   - Class action waiver in consumer contracts

3. **RAG score each finding:**
   - **Red** — immediate risk requiring resolution before signing; material exposure
   - **Amber** — should be negotiated; risk is manageable but not ideal
   - **Green** — acceptable; standard or low-risk provision

4. **Summarize overall risk profile:**
   - Count of Red/Amber/Green findings
   - Overall recommendation (sign/negotiate/walk away)
   - Priority-ordered list of items to address

5. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/02-review.md` with frontmatter:

   ```
   ---
   description: Red flag detection for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Scan Summary** — total findings by RAG category
   - **Red Flags** — all Red-scored items with clause reference, risk explanation, and recommended action
   - **Amber Items** — all Amber-scored items with clause reference and negotiation suggestion
   - **Green Items** — all Green-scored items (brief confirmation)
   - **Overall Risk Profile** — aggregate assessment and recommendation
   - **Priority Action List** — ordered items to address before execution

## Output

The red flag analysis written to `.metapowers/legal/$ARGUMENTS/02-review.md`. Present a summary to the user highlighting:
- Total Red/Amber/Green count
- All Red-flagged items with brief risk descriptions
- Overall recommendation (sign, negotiate, or walk away)
- Top 3 priority items to address
