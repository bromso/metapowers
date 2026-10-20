---
name: customer-research
description: Research a product's target buyers for marketing — personas, jobs-to-be-done, pain points, objections and the buyer journey. Use when the user is starting marketing for a product and needs to know who buys it, why and in what words. Not for open-ended discovery on a problem or topic; see /research:discover.
argument-hint: "[project] [--skip-checks]"
---

# Customer Research

Research the target audience for "$ARGUMENTS". Build detailed personas, map jobs-to-be-done, identify pain points, and understand the buyer journey.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is typically the first Strategy skill to run.

## Process

1. **Web research** to understand the target audience:
   - Use WebSearch to find audience research, surveys, forum discussions, and industry reports about "<project>"
   - Use WebFetch to read the most relevant sources in depth (aim for 5-8 quality sources)
   - Look for: demographic data, behavioral patterns, purchase motivations, common objections

2. **Build personas:**
   - Create 2-3 detailed buyer personas based on findings
   - For each: demographics, goals, frustrations, current solutions, decision-making process
   - Identify the primary persona (highest value / most common)

3. **Map jobs-to-be-done:**
   - Identify the functional, social, and emotional jobs the audience is hiring for
   - Map the "when" — what triggers the need
   - Document desired outcomes and success metrics from the audience's perspective

4. **Identify pain points and objections:**
   - What frustrates them about current solutions?
   - What prevents them from switching or buying?
   - What questions do they ask before purchasing?
   - Mine forums, review sites, and social media for unfiltered language

5. **Map the buyer journey:**
   - Document awareness → consideration → decision stages
   - Identify touchpoints and information needs at each stage
   - Note where they research, who influences them, and what content they consume

6. **Write the artifact** — append to `.metapowers/marketing/<project>/00-strategy.md` under a `## Customer Research` section. Create the file with a `# Strategy — <project>` heading if it does not exist; if a `## Customer Research` section already exists, replace only that section. The section contains:
   - **Personas** — 2-3 detailed buyer personas
   - **Jobs to Be Done** — functional, social, emotional jobs
   - **Pain Points & Objections** — frustrations, barriers, common questions
   - **Buyer Journey** — stages, touchpoints, information needs
   - **Key Insights** — top 3-5 actionable insights

## Output

Customer research appended to `.metapowers/marketing/<project>/00-strategy.md`. Present a summary highlighting:
- Primary persona profile
- Top pain points discovered
- Most important insight for messaging
