---
description: Prepare negotiation strategy with fallback positions per clause
---

# Negotiation Prep

Prepare a negotiation strategy for "$ARGUMENTS". Define ideal positions, acceptable compromises, and walk-away points for each contentious clause, with counter-arguments and redline suggestions.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.metapowers/legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.metapowers/legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for negotiation-prep".

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/$ARGUMENTS/00-assess.md` for risk and jurisdiction context
   - Read `.metapowers/legal/$ARGUMENTS/02-review.md` if it exists (contract review or red-flag analysis)
   - Read any additional context provided by the user (business priorities, relationship dynamics)

2. **Identify contentious clauses:**
   - Extract highest-risk items from prior review or red-flag analysis
   - If no prior review exists, identify contentious clauses from the contract directly
   - Rank by business impact and legal risk

3. **For each contentious clause, define three positions:**
   - **Ideal position** — the best outcome; what you would propose in opening negotiation
   - **Acceptable compromise** — a middle ground that adequately protects interests
   - **Walk-away point** — the minimum acceptable terms; below this, decline or escalate

4. **Prepare counter-arguments for anticipated pushback:**
   - Identify likely counterparty objections to each ideal position
   - Draft responses grounded in market standards, legal precedent, or business logic
   - Prepare supporting evidence (industry benchmarks, comparable deals)

5. **Draft redline suggestions:**
   - For each contentious clause, provide specific alternative language
   - Mark additions and deletions clearly
   - Explain the rationale for each proposed change

6. **Identify trade-offs:**
   - Map concession pairs (concede X to win Y)
   - Identify low-cost concessions that have high perceived value to counterparty
   - Flag non-negotiable items that cannot be traded

7. **Define overall negotiation priorities:**
   - **Must-have** — terms that are non-negotiable; deal-breakers if not included
   - **Nice-to-have** — preferred terms that can be conceded if needed
   - **Tradeable** — terms available for concession in exchange for must-haves

8. **Prepare BATNA (Best Alternative To Negotiated Agreement):**
   - Define what happens if negotiation fails
   - Assess strength of BATNA relative to proposed deal
   - Identify whether BATNA strengthens or weakens negotiating position

9. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/02-review.md` with frontmatter:

   ```
   ---
   description: Negotiation prep for $ARGUMENTS
   ---
   ```

   Include sections:
   - **Contentious Clauses** — ranked list of clauses requiring negotiation
   - **Position Matrix** — ideal / compromise / walk-away for each clause
   - **Counter-Arguments** — anticipated objections and prepared responses
   - **Redline Suggestions** — specific alternative language per clause
   - **Trade-off Map** — concession pairs and non-negotiable items
   - **Negotiation Priorities** — must-have / nice-to-have / tradeable classification
   - **BATNA Analysis** — alternatives and their impact on negotiating leverage

## Output

The negotiation strategy written to `.metapowers/legal/$ARGUMENTS/02-review.md`. Present a summary to the user highlighting:
- Number of contentious clauses identified and their ranking
- Must-have items that are non-negotiable
- Key trade-offs available (concede X to win Y)
- BATNA strength assessment
