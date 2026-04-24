---
description: Track regulatory changes and assess impact
---

# Regulatory Watch

Track regulatory changes relevant to "$ARGUMENTS" and assess their impact on the organization's compliance posture, controls, and policies.

## Prerequisites

Read `.metapowers/compliance/$ARGUMENTS/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "$ARGUMENTS". Run `/compliance:regulatory-landscape $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check.

## Process

1. **Read context files:**
   - Read `plugins/compliance/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/$ARGUMENTS/00-scope.md` for scope and applicable regulations
   - Read `.metapowers/compliance/$ARGUMENTS/04-monitor.md` for current monitoring status

2. **Identify regulatory changes:**
   - Use WebSearch to identify recent and upcoming regulatory changes relevant to the organization
   - Search for amendments, new guidance, enforcement actions, and industry interpretations
   - Check regulatory body announcements (EU, NIST, AICPA, ISO, sector-specific bodies)
   - Review industry association publications and legal advisory updates

3. **Impact assessment per change:**
   - Summarize the change — what is new, modified, or removed
   - Effective date — when does compliance become mandatory
   - Impact classification — new requirements, modified requirements, removed requirements
   - Determine if current controls/policies need updating
   - Identify new controls or evidence that may be required
   - Estimate remediation effort (days/weeks/months)

4. **Action planning:**
   - For each impactful change: assign owner, set implementation deadline
   - Prioritize by effective date and organizational impact
   - Identify changes that affect multiple regulations simultaneously
   - Flag changes requiring legal review or board approval

5. **Monitoring sources recommendation:**
   - Recommend regulatory body newsletters and RSS feeds
   - Industry associations with compliance updates
   - Legal advisors specializing in relevant regulations
   - GRC vendor regulatory update services
   - Peer industry groups and compliance communities

6. **Write the artifact** to `.metapowers/compliance/$ARGUMENTS/04-monitor.md` (append to existing) with sections:
   - **Regulatory Change Log** — table of identified changes with effective dates
   - **Impact Assessments** — per-change analysis of organizational impact
   - **Action Items** — required changes to controls, policies, or evidence
   - **Monitoring Sources** — recommended sources for ongoing regulatory intelligence
   - **Review Cadence** — recommended frequency for regulatory watch reviews

## Output

The regulatory watch report appended to `.metapowers/compliance/$ARGUMENTS/04-monitor.md`. Present a summary to the user highlighting:
- Number of regulatory changes identified
- High-impact changes requiring immediate action
- Upcoming effective dates within 6 months
- Recommended monitoring sources
