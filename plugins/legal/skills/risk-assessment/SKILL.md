---
description: Identify and score legal risks by likelihood, impact, and jurisdiction
---

# Risk Assessment

Identify and score legal risks for "$ARGUMENTS". Evaluate each risk by likelihood, impact, and jurisdictional factors, then define mitigation strategies for the highest-priority items.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

None — this is a Phase 0 Assess skill.

## Process

1. **Brainstorm risks across categories:**
   - **Regulatory** — non-compliance with applicable laws and regulations
   - **Contractual** — breaches, unfavorable terms, missing agreements
   - **Intellectual property** — infringement, inadequate protection, trade secrets
   - **Employment** — misclassification, discrimination, workplace safety
   - **Data privacy** — unauthorized processing, breach exposure, consent gaps
   - **Litigation** — pending or potential lawsuits, dispute exposure

2. **Score each risk:**
   - Read `plugins/legal/shared/risk-matrix-template.md` for reference
   - **Likelihood** (1-5): 1 = rare, 2 = unlikely, 3 = possible, 4 = likely, 5 = almost certain
   - **Impact** (1-5): 1 = negligible, 2 = minor, 3 = moderate, 4 = major, 5 = catastrophic
   - **Jurisdiction modifier** (1.0-1.5x): adjust based on regulatory strictness of applicable jurisdictions
   - **Risk score** = likelihood x impact x jurisdiction modifier

3. **Plot on risk matrix:**
   - Create a 5x5 likelihood vs. impact matrix
   - Place each risk on the matrix
   - Identify clusters of risk in high-severity zones

4. **Define mitigation strategies for top risks:**
   - **Avoid** — eliminate the activity creating the risk
   - **Transfer** — shift risk via insurance, indemnification, or outsourcing
   - **Mitigate** — reduce likelihood or impact through controls
   - **Accept** — acknowledge and monitor risks below threshold
   - Assign an owner for each top risk

5. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/00-assess.md` with heading:

   ## Risk Assessment

   Include sections:
   - **Risk Inventory** — all identified risks by category
   - **Risk Scoring** — likelihood, impact, jurisdiction modifier, and total score per risk
   - **Risk Matrix** — visual 5x5 matrix with risk placement
   - **Top Risks** — highest-scoring risks with detailed analysis
   - **Mitigation Strategies** — action plan for each top risk with assigned owners

## Output

The risk assessment written to `.metapowers/legal/$ARGUMENTS/00-assess.md`. Present a summary to the user highlighting:
- Total risks identified and distribution across categories
- Top 5 highest-scoring risks
- Recommended mitigation strategies for critical items
