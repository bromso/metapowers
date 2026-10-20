---
name: regulatory-watch
description: Track regulatory changes relevant to the business and assess each change's impact on controls and policies, with action plans and monitoring sources. Use when the user asks what is changing in their regulations, whether a new law or amendment affects them, or how to keep up with regulatory updates. Not for a dated plan for one known law; see /legal:regulatory-updates.
argument-hint: "[project] [--skip-checks]"
---

# Regulatory Watch

Track regulatory changes relevant to "$ARGUMENTS" and assess their impact on the organization's compliance posture, controls, and policies.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/compliance/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance:regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.metapowers/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.metapowers/compliance/<project>/04-monitor.md` for current monitoring status

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

6. **Write the artifact** — append to `.metapowers/compliance/<project>/04-monitor.md` under a `## Regulatory Watch` section. Create the file with a `# Monitor — <project>` heading if it does not exist; if a `## Regulatory Watch` section already exists, replace only that section. The section contains:
   - **Regulatory Change Log** — table of identified changes with effective dates
   - **Impact Assessments** — per-change analysis of organizational impact
   - **Action Items** — required changes to controls, policies, or evidence
   - **Monitoring Sources** — recommended sources for ongoing regulatory intelligence
   - **Review Cadence** — recommended frequency for regulatory watch reviews

## Output

The regulatory watch report appended to `.metapowers/compliance/<project>/04-monitor.md`. Present a summary to the user highlighting:
- Number of regulatory changes identified
- High-impact changes requiring immediate action
- Upcoming effective dates within 6 months
- Recommended monitoring sources
