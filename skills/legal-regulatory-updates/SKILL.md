---
name: legal-regulatory-updates
description: Plan implementation of a specific new or amended law — impact rating, dated timeline, owners, resources and items for counsel to review. Use when a new or amended law takes effect soon and the user needs a dated plan with owners to be ready for it. Not for ongoing monitoring of regulatory change; see /compliance-regulatory-watch.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: legal
  phase: 4
  artifact: 04-govern.md
---

# Regulatory Updates

Track and assess the impact of new or changing regulations for "$ARGUMENTS". Research recent regulatory changes, assess their impact on current compliance posture, and create implementation timelines.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"legal","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments).

Check that `.singularskills/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal-risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.singularskills/legal/<project>/00-assess.md` for current regulatory landscape, jurisdiction, and compliance status
   - Review any existing compliance artifacts in `.singularskills/legal/<project>/`

2. **Research regulatory changes:**
   - Use WebSearch to find recent and upcoming regulatory changes relevant to "<project>"
   - Focus on the jurisdictions and regulation types identified in the assessment
   - Search for proposed legislation, final rules, guidance updates, and enforcement trends
   - Check regulatory body announcements, industry association updates, and legal news sources

3. **Summarize each regulatory change:**
   - **What is changing** — clear description of the new requirement or modification
   - **Effective date** — when the change takes effect or compliance is required
   - **Who it affects** — which teams, processes, or systems are impacted
   - **What action is needed** — specific steps required to comply

4. **Assess impact on current compliance:**
   - Rate each change as **High**, **Medium**, or **Low** impact:
     - **High** — requires significant process changes, new controls, or substantial investment
     - **Medium** — requires moderate adjustments to existing processes or policies
     - **Low** — requires minor updates or documentation changes
   - Map each change to existing controls and identify gaps

5. **Prioritize required changes:**
   - Rank by deadline urgency (nearest effective dates first)
   - Weight by impact severity (high-impact changes take priority)
   - Consider dependencies between changes
   - Flag any changes with penalties for non-compliance

6. **Create implementation timeline:**
   - For each required change, define milestones and target completion dates
   - Assign responsible owners for each implementation task
   - Identify resource requirements (budget, personnel, technology)
   - Build in buffer time for review and testing

7. **Flag items requiring legal counsel review:**
   - Ambiguous regulatory language requiring interpretation
   - Changes with significant financial or operational impact
   - Cross-jurisdictional conflicts or complexities
   - Novel regulatory requirements without established compliance patterns

8. **Recommend monitoring sources:**
   - **Regulatory bodies** — official government and agency websites
   - **Industry associations** — sector-specific compliance organizations
   - **Legal newsletters** — reputable legal update services
   - **Peer networks** — industry working groups and compliance forums
   - Suggest monitoring frequency for each source

9. **Write the artifact** — append to `.singularskills/legal/<project>/04-govern.md` under a `## Regulatory Updates` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Regulatory Updates` section already exists, replace only that section. The section contains:

   - **Regulatory Change Summary** — table of all identified changes with status
   - **Impact Assessment** — detailed analysis per change with severity rating
   - **Priority Matrix** — changes ranked by urgency and impact
   - **Implementation Timeline** — milestones, owners, and target dates
   - **Legal Counsel Review Items** — flagged items requiring attorney input
   - **Monitoring Sources** — recommended sources and review frequency

## Output

The regulatory updates appended to `.singularskills/legal/<project>/04-govern.md`. Present a summary to the user highlighting:
- Number of regulatory changes identified and their impact distribution
- Most urgent changes requiring immediate action
- Items flagged for legal counsel review
- Recommended monitoring cadence going forward

**Record the run.** This artifact is shared by every skill of phase 4 (Govern). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `passed` when the gate ran clean and `skipped` under `--skip-checks`); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Govern
workflow: legal
phase: 4
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: <passed|skipped>
---
```

Open your `## Regulatory Updates` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `legal-regulatory-updates`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Regulatory Updates` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
