---
description: Draft SaaS subscription or licensing agreement
---

# SaaS Agreement

Draft a SaaS subscription or licensing agreement for "$ARGUMENTS". Generate a comprehensive agreement covering subscription terms, service levels, data handling, and liability.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

## Prerequisites

Check that `.metapowers/legal/$ARGUMENTS/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment $ARGUMENTS`) to generate the prerequisite assessment artifact."

If the user passes `--skip-checks`, bypass this check and log the skip to `.metapowers/legal/$ARGUMENTS/skip-log.md` with a timestamp and the reason "Prerequisite check skipped for saas-agreement".

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/$ARGUMENTS/00-assess.md` for risk and jurisdiction context
   - Read `plugins/legal/shared/contract-template.md` for standard contract provisions

2. **Identify service context:**
   - Nature of the SaaS product and core functionality
   - Target customers (B2B, B2C, or both)
   - Pricing model (per-seat, usage-based, tiered, flat-rate)
   - Deployment model (multi-tenant, single-tenant, hybrid)
   - Data sensitivity level and regulatory requirements

3. **Draft the following sections:**

   - **License Grant** — scope of access rights (non-exclusive, non-transferable, subscription-based), permitted users, restrictions (no sublicensing, no reverse engineering, no competitive use)
   - **Subscription Terms** — plan descriptions, billing cycle (monthly/annual), auto-renewal terms, upgrade/downgrade procedures, free trial terms (if applicable)
   - **SLA and Uptime Commitments** — uptime target (e.g., 99.9%), measurement methodology, scheduled maintenance windows, service credits for downtime, exclusions from SLA
   - **Data Ownership and Processing** — customer retains ownership of customer data, provider's limited license to process, data processing agreement reference (GDPR Article 28), data location and transfer restrictions
   - **Security Obligations** — provider security standards (SOC 2, ISO 27001, encryption at rest and in transit), breach notification timelines and procedures, security audit rights
   - **Acceptable Use Policy** — prohibited uses, resource limits, abuse handling, account suspension triggers
   - **Support and Maintenance** — support tiers and response times, included vs. paid support, maintenance windows and update policy, end-of-life and deprecation notice periods
   - **Payment Terms** — fees and payment schedule, invoicing procedures, late payment consequences (interest, suspension), price change notice requirements, taxes and withholding
   - **Suspension Rights** — grounds for suspension (non-payment, AUP violation, security threat), notice requirements, data preservation during suspension, reinstatement procedures
   - **Termination and Data Export/Deletion** — termination for cause and convenience, notice periods, data export period post-termination (typically 30-90 days), data deletion certification, survival clauses
   - **Limitation of Liability** — aggregate liability cap (typically 12 months of fees), exclusion of consequential damages, carve-outs (IP indemnification, confidentiality breach, willful misconduct)
   - **IP Ownership and Feedback** — provider owns all IP in the service, customer feedback license (if customer suggestions are incorporated), no implied IP rights
   - **Compliance with Laws** — each party's obligation to comply with applicable laws, specific regulatory compliance commitments (GDPR, HIPAA, SOX as applicable)
   - **Governing Law** — choice of law, dispute resolution mechanism, venue selection

4. **Write the artifact** to `.metapowers/legal/$ARGUMENTS/01-draft.md` with frontmatter:

   ```
   ---
   description: SaaS agreement draft for $ARGUMENTS
   ---
   ```

## Output

The SaaS agreement draft written to `.metapowers/legal/$ARGUMENTS/01-draft.md`. Present a summary to the user highlighting:
- Service type and pricing model addressed
- SLA commitments proposed
- Data handling and security provisions included
- Key liability limitations and carve-outs
- Areas flagged for attorney review
