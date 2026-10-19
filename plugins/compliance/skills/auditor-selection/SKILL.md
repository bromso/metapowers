---
description: Evaluate and select audit firms
---

# Auditor Selection

Evaluate and select audit firms for "$ARGUMENTS" based on industry expertise, regulation experience, cost, and timeline to find the best fit for the organization's certification goals.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.metapowers/compliance/<project>/03-certify.md` for audit readiness status

2. **Define selection criteria:**
   - Industry expertise — experience with organization's sector
   - Regulation experience — certifications the firm can audit (SOC 2, ISO 27001, HIPAA, etc.)
   - Geographic coverage — can they audit all relevant locations?
   - Team size and availability — can they staff the engagement in the desired window?
   - Cost — engagement fees, travel costs, additional charges
   - Timeline — availability for desired audit window
   - References — client references in similar industry/size
   - Combined audit capability — can they audit multiple standards simultaneously?

3. **Create shortlist:**
   - Identify 3-5 candidate audit firms
   - Research firm reputation, specializations, and recent engagements
   - Consider Big 4, mid-tier, and boutique firms based on organization size and needs
   - Check for conflicts of interest

4. **Prepare RFP:**
   - Define scope — regulations, locations, systems in scope
   - Define timeline — desired audit window, report delivery date
   - Define deliverables — audit report, management letter, certificate
   - Request pricing structure — fixed fee vs. hourly, payment terms
   - Request team qualifications — lead auditor experience, certifications held
   - Request references — 2-3 comparable clients

5. **Evaluation framework:**
   - Score each firm against selection criteria (weighted scoring)
   - Evaluate RFP responses for completeness and quality
   - Check references — ask about responsiveness, thoroughness, communication
   - Negotiate terms — scope, timeline, pricing, re-audit clauses
   - Consider combined audits (SOC 2 + ISO 27001 with same firm for efficiency and cost savings)

6. **Write the artifact** — append to `.metapowers/compliance/<project>/03-certify.md` under a `## Auditor Selection` section. Create the file with a `# Certify — <project>` heading if it does not exist; if a `## Auditor Selection` section already exists, replace only that section. The section contains:
   - **Selection Criteria** — weighted criteria with scoring methodology
   - **Candidate Shortlist** — firms under consideration with profiles
   - **RFP Template** — prepared RFP for distribution
   - **Evaluation Matrix** — scoring framework for comparing responses
   - **Combined Audit Opportunities** — multi-standard audit possibilities
   - **Recommended Next Steps** — timeline for RFP distribution, evaluation, and selection

## Output

The auditor selection plan appended to `.metapowers/compliance/<project>/03-certify.md`. Present a summary to the user highlighting:
- Selection criteria and weights
- Recommended number of firms to evaluate
- Combined audit opportunities identified
- Suggested timeline for selection process
