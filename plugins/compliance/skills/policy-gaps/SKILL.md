---
name: policy-gaps
description: Identify which policies the applicable regulations require, which are missing or outdated, and produce a prioritized policy development list with effort estimates. Use when the user asks which security or privacy policies they need for an audit, or whether their existing policies are good enough.
argument-hint: "[project] [--skip-checks]"
---

# Policy Gaps

Identify missing or outdated policies for "$ARGUMENTS" by reviewing policy requirements across all applicable regulations, inventorying existing policies, and creating a policy development priority list.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and control framework context
   - Read `.metapowers/compliance/<project>/02-remediate.md` for gap register and control mapping

2. **Policy requirements inventory:**
   - Review policy requirements across all applicable regulations
   - Must-have policies: information security policy, acceptable use policy, data protection/privacy policy, incident response plan, business continuity plan, access control policy, vendor/third-party management policy, data retention and disposal policy
   - Regulation-specific policies: HIPAA privacy practices notice, GDPR data processing records, PCI DSS cardholder data policy, SOC 2 change management policy
   - Map each required policy to the regulation(s) mandating it

3. **Existing policy inventory:**
   - Catalog existing policies (ask user or review available documentation)
   - Assess each existing policy: last review date, approval status, version, owner
   - Identify outdated policies — not reviewed within required cadence (typically annual)
   - Identify policies with scope gaps — exist but do not cover all required topics

4. **Gap identification:**
   - Missing policies — required but do not exist at all
   - Outdated policies — exist but not reviewed/updated within required period
   - Incomplete policies — exist but missing required sections or coverage
   - Orphaned policies — no assigned owner or reviewer

5. **Policy development priority list:**
   - Rank by: number of regulations requiring the policy, audit timeline proximity, gap severity
   - Identify policies that can be combined (e.g., data protection + privacy into one)
   - Estimate effort per policy (draft: 2-5 days, review cycle: 1-2 weeks, approval: 1 week)
   - Identify templates available for each policy type

6. **Write the artifact** — append to `.metapowers/compliance/<project>/02-remediate.md` under a `## Policy Gaps` section. Create the file with a `# Remediate — <project>` heading if it does not exist; if a `## Policy Gaps` section already exists, replace only that section. The section contains:
   - **Policy Requirements Matrix** — table of required policies mapped to regulations
   - **Existing Policy Inventory** — current state assessment
   - **Missing Policies** — policies that must be created, ranked by priority
   - **Outdated Policies** — policies requiring review/update
   - **Policy Development Timeline** — sequenced plan with effort estimates
   - **Template Recommendations** — suggested templates or frameworks for each policy

## Output

The policy gap analysis appended to `.metapowers/compliance/<project>/02-remediate.md`. Present a summary to the user highlighting:
- Number of missing vs. outdated vs. adequate policies
- Top 3 priority policies to develop
- Estimated total effort for policy remediation
- Policies with highest cross-regulation impact

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.
