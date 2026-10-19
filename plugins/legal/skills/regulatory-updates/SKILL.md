---
description: Track and assess impact of new or changing regulations
---

# Regulatory Updates

Track and assess the impact of new or changing regulations for "$ARGUMENTS". Research recent regulatory changes, assess their impact on current compliance posture, and create implementation timelines.

> **Note:** AI-generated legal content does not constitute legal advice. Consult a qualified attorney.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/legal/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Check that `.metapowers/legal/<project>/00-assess.md` exists. If it does not exist, stop and tell the user:

> "Run an Assess skill first (e.g. `/legal:risk-assessment <project>`) to generate the prerequisite assessment artifact."

## Process

1. **Read inputs:**
   - Read `.metapowers/legal/<project>/00-assess.md` for current regulatory landscape, jurisdiction, and compliance status
   - Review any existing compliance artifacts in `.metapowers/legal/<project>/`

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

9. **Write the artifact** — append to `.metapowers/legal/<project>/04-govern.md` under a `## Regulatory Updates` section. Create the file with a `# Govern — <project>` heading if it does not exist; if a `## Regulatory Updates` section already exists, replace only that section. The section contains:

   ```
   ---
   description: Regulatory updates for <project>
   ---
   ```

   Include sections:
   - **Regulatory Change Summary** — table of all identified changes with status
   - **Impact Assessment** — detailed analysis per change with severity rating
   - **Priority Matrix** — changes ranked by urgency and impact
   - **Implementation Timeline** — milestones, owners, and target dates
   - **Legal Counsel Review Items** — flagged items requiring attorney input
   - **Monitoring Sources** — recommended sources and review frequency

## Output

The regulatory updates appended to `.metapowers/legal/<project>/04-govern.md`. Present a summary to the user highlighting:
- Number of regulatory changes identified and their impact distribution
- Most urgent changes requiring immediate action
- Items flagged for legal counsel review
- Recommended monitoring cadence going forward
