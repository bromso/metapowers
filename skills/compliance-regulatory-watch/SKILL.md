---
name: compliance-regulatory-watch
description: Track regulatory changes relevant to the business and assess each change's impact on controls and policies, with action plans and monitoring sources. Use when the user asks what is changing in their regulations, whether a new law or amendment affects them, or how to keep up with regulatory updates. Not for a dated plan for one known law; see /legal-regulatory-updates.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: compliance
  phase: 4
  artifact: 04-monitor.md
---

# Regulatory Watch

Track regulatory changes relevant to "$ARGUMENTS" and assess their impact on the organization's compliance posture, controls, and policies.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"compliance","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Read `.singularskills/compliance/<project>/00-scope.md`. If this file does not exist, tell the user:

> Phase 0 (Scope) has not been completed for "<project>". Run `/compliance-regulatory-landscape <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `references/grc-lifecycle-guide.md` for GRC methodology reference
   - Read `.singularskills/compliance/<project>/00-scope.md` for scope and applicable regulations
   - Read `.singularskills/compliance/<project>/04-monitor.md` for current monitoring status

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

6. **Write the artifact** — append to `.singularskills/compliance/<project>/04-monitor.md` under a `## Regulatory Watch` section. Create the file with a `# Monitor — <project>` heading if it does not exist; if a `## Regulatory Watch` section already exists, replace only that section. The section contains:
   - **Regulatory Change Log** — table of identified changes with effective dates
   - **Impact Assessments** — per-change analysis of organizational impact
   - **Action Items** — required changes to controls, policies, or evidence
   - **Monitoring Sources** — recommended sources for ongoing regulatory intelligence
   - **Review Cadence** — recommended frequency for regulatory watch reviews

## Output

The regulatory watch report appended to `.singularskills/compliance/<project>/04-monitor.md`. Present a summary to the user highlighting:
- Number of regulatory changes identified
- High-impact changes requiring immediate action
- Upcoming effective dates within 6 months
- Recommended monitoring sources

**Record the run.** This artifact is shared by every skill of phase 4 (Monitor). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Monitor
workflow: compliance
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Regulatory Watch` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `compliance-regulatory-watch`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Regulatory Watch` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```

End the artifact with this paragraph, verbatim:

> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel.
