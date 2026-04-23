---
description: Set up contract management — renewals, expirations, obligations
---

# Contract Tracker

Set up contract management for "$ARGUMENTS". Create a contract register, configure renewal and expiration alerts, identify contracts needing renegotiation, and track ongoing obligations.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for contract-tracker".

## Process

1. **Read inputs:**
   - Read `.legal/$ARGUMENTS/00-assess.md` for risk context, jurisdiction, and regulatory landscape
   - Gather information about the organization's existing contracts and management processes

2. **Create contract register:**
   - Define register fields:
     - **Contract ID** — unique identifier for each contract
     - **Parties** — all parties to the contract
     - **Type** — contract category (SaaS, vendor, employment, NDA, etc.)
     - **Effective date** — when the contract takes effect
     - **Expiration date** — when the contract ends
     - **Auto-renewal terms** — whether the contract auto-renews and under what conditions
     - **Notice period for non-renewal** — deadline to provide notice to prevent auto-renewal
     - **Contract value** — total or annual contract value
     - **Key obligations** — critical deliverables and commitments per party
     - **Assigned owner** — internal owner responsible for managing the contract

3. **Set up renewal and expiration alert schedule:**
   - **90 days before expiration** — initial alert to assigned owner for review and planning
   - **60 days before expiration** — escalation alert for renegotiation or renewal decision
   - **30 days before expiration** — final alert with action deadline
   - For contracts with non-renewal notice periods, align alerts to precede the notice deadline
   - Flag auto-renewing contracts that require proactive cancellation

4. **Identify contracts needing renegotiation:**
   - **Unfavorable terms** — contracts with terms flagged during prior review phases
   - **Market changes** — contracts where pricing or terms no longer reflect market conditions
   - **Business changes** — contracts misaligned with current business strategy or operations
   - Prioritize renegotiation candidates by contract value and risk exposure

5. **Track ongoing obligations and deliverables:**
   - For each active contract, list all ongoing obligations per party
   - Set milestone dates for deliverables and compliance checkpoints
   - Identify obligations at risk of non-performance
   - Define consequence triggers for missed obligations

6. **Recommend contract management tool or process:**
   - Evaluate organization size and contract volume
   - Recommend appropriate solution (spreadsheet tracker for small portfolios, dedicated CLM software for large portfolios)
   - Define workflow for contract intake, review, approval, and storage
   - Establish naming conventions and filing structure

7. **Write the artifact** to `.legal/$ARGUMENTS/04-govern.md` with frontmatter:

   ```
   ---
   description: Contract tracker for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Contract Register Template** — field definitions and sample entries
   - **Alert Schedule** — renewal and expiration notification timeline
   - **Renegotiation Candidates** — prioritized list with rationale
   - **Obligation Tracker** — ongoing obligations by contract
   - **Recommended Tools and Process** — contract management recommendations

## Output

The contract tracker written to `.legal/$ARGUMENTS/04-govern.md`. Present a summary to the user highlighting:
- Total contracts catalogued and their distribution by type
- Upcoming expirations requiring immediate attention
- Contracts flagged for renegotiation with priority ranking
- Recommended contract management approach
