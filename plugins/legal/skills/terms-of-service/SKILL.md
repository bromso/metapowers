---
description: Draft or update Terms of Service for digital products
---

# Terms of Service

Draft or update Terms of Service for "$ARGUMENTS". Generate a comprehensive, jurisdiction-aware ToS document tailored to the product type and user base.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for terms-of-service".

## Process

1. **Read inputs:**
   - Read `.legal/$ARGUMENTS/00-assess.md` for risk and jurisdiction context
   - Read `plugins/legal/shared/contract-template.md` for standard contract provisions

2. **Identify product context:**
   - Product type (web app, mobile app, marketplace, API, SaaS platform, etc.)
   - Target audience (consumers, businesses, or both)
   - Primary jurisdiction and any additional jurisdictions
   - Key features that require specific terms (payments, user content, subscriptions, etc.)

3. **Draft the following sections:**

   - **Acceptance Mechanism** — how users accept the terms (clickwrap, browsewrap, sign-in wrap) with enforceability considerations
   - **User Eligibility** — age requirements (COPPA/GDPR-K considerations), geographic restrictions, entity requirements
   - **Account Terms** — registration requirements, account security obligations, account sharing restrictions
   - **User Rights and Restrictions** — license grant to use the service, scope and limitations
   - **Prohibited Uses** — specific prohibited activities (illegal use, abuse, reverse engineering, scraping, etc.)
   - **Intellectual Property Ownership** — company IP rights, trademarks, copyright notices
   - **User-Generated Content** — if applicable: license grant from users, content moderation rights, DMCA/takedown procedures, content responsibility
   - **Disclaimers of Warranties** — "as is" / "as available" disclaimers, no warranty of uninterrupted service
   - **Limitation of Liability** — liability cap, exclusion of consequential damages, jurisdictional carve-outs where required
   - **Indemnification** — user indemnification obligations, process requirements
   - **Termination** — termination rights (by user, by company, automatic), effect of termination, data retention post-termination
   - **Governing Law and Dispute Resolution** — choice of law, forum selection or arbitration clause, class action waiver (where enforceable)
   - **Modification Procedure** — how changes are communicated, notice period, deemed acceptance mechanism

4. **Tailor to jurisdiction requirements:**
   - EU: consumer withdrawal rights, unfair terms directive compliance, GDPR cross-references
   - California: CCPA cross-references, additional consumer protections
   - Other jurisdictions identified in the assessment

5. **Write the artifact** to `.legal/$ARGUMENTS/01-draft.md` with frontmatter:

   ```
   ---
   description: Terms of Service draft for $ARGUMENTS
   ---
   ```

## Output

The Terms of Service draft written to `.legal/$ARGUMENTS/01-draft.md`. Present a summary to the user highlighting:
- Product type and primary jurisdiction identified
- Key sections included and any sections omitted with rationale
- Jurisdiction-specific provisions added
- Areas flagged for attorney review
