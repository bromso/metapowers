---
name: evidence-plan
description: Design the evidence collection strategy for each control — evidence type, format, frequency, owner, storage and retention, plus a collection calendar and automation options. Use when the user asks what evidence auditors will want for each control, who should collect it, or how to automate evidence collection.
argument-hint: "[project] [--skip-checks]"
---

# Evidence Plan

Design an evidence collection strategy for "$ARGUMENTS" defining what evidence is needed for each control, how to collect it, how often, and who owns it.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/evidence-catalog-template.md` for evidence structure
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and control framework context
   - Read `.metapowers/compliance/<project>/02-remediate.md` for control mapping

2. **Define evidence per control:**
   - For each control: identify evidence type — policy document, configuration export, system log, screenshot, attestation form, training record, meeting minutes, risk register entry
   - Specify format requirements based on auditor expectations (PDF, CSV export, system screenshot with timestamp, signed attestation)
   - Document evidence sufficiency — what makes this evidence convincing to an auditor

3. **Collection logistics:**
   - Define collection frequency per evidence item — continuous (automated), monthly, quarterly, semi-annually, annually
   - Assign evidence owner — who is responsible for collecting and maintaining each item
   - Define storage location — GRC tool, shared drive, document management system
   - Set retention period per regulation requirement (typically 3-7 years)

4. **Evidence collection calendar:**
   - Create monthly calendar of evidence collection activities
   - Identify peak collection periods (align with audit windows)
   - Set reminder cadences for recurring collections
   - Flag evidence items approaching expiry or staleness

5. **Automation opportunities:**
   - Identify evidence that can be collected automatically (config scans, access reviews, log exports)
   - Map to GRC tooling capabilities (Vanta, Drata, Secureframe)
   - Estimate manual effort for non-automatable evidence
   - Calculate total evidence maintenance burden (hours/month)

6. **Write the artifact** — append to `.metapowers/compliance/<project>/02-remediate.md` under a `## Evidence Plan` section. Create the file with a `# Remediate — <project>` heading if it does not exist; if a `## Evidence Plan` section already exists, replace only that section. The section contains:
   - **Evidence Catalog** — table with control, evidence type, format, frequency, owner, storage, retention
   - **Collection Calendar** — month-by-month evidence collection schedule
   - **Automation Plan** — evidence items suitable for automated collection
   - **Effort Estimate** — total hours/month for evidence maintenance
   - **Evidence Gap Alert** — controls currently lacking any evidence

## Output

The evidence plan appended to `.metapowers/compliance/<project>/02-remediate.md`. Present a summary to the user highlighting:
- Total evidence items required
- Percentage automatable vs. manual
- Estimated monthly maintenance effort
- Evidence items requiring immediate attention

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.
