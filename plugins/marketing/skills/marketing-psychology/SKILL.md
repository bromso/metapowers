---
name: marketing-psychology
description: Apply behavioral psychology principles to marketing
argument-hint: "[project] [--skip-checks]"
---

# Marketing Psychology

Apply behavioral psychology and persuasion principles to "$ARGUMENTS". Identify which psychological triggers to use and how to implement them ethically.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "<project>". Run `/marketing:customer-research <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for audience and positioning
   - Read `.metapowers/marketing/<project>/02-act.md` if it exists

2. **Audit current psychology usage:**
   - If a URL or existing content is provided, identify what principles are already in use
   - Identify missed opportunities

3. **Recommend applicable principles:**
   - **Social proof:** testimonials, user counts, logos, case studies
   - **Scarcity & urgency:** limited time, limited quantity, exclusive access
   - **Reciprocity:** free value before asking (lead magnets, tools, content)
   - **Authority:** credentials, press mentions, certifications, expert endorsements
   - **Loss aversion:** frame benefits as losses avoided
   - **Anchoring:** price anchoring, feature anchoring, comparison anchoring
   - **Commitment & consistency:** micro-commitments, progressive disclosure
   - **Default effect:** pre-selected options, recommended tiers
   - For each: specific implementation recommendation for "<project>"

4. **Ethical guardrails:**
   - Flag any dark patterns or manipulative implementations
   - Ensure all claims are truthful and verifiable
   - Recommend transparent use of urgency/scarcity

5. **Write the artifact** — append to `.metapowers/marketing/<project>/02-act.md` under a `## Marketing Psychology` section. Create the file with a `# Act — <project>` heading if it does not exist; if a `## Marketing Psychology` section already exists, replace only that section. The section contains:
   - **Applicable Principles** — ranked by expected impact
   - **Implementation Recommendations** — specific, actionable per principle
   - **Ethical Considerations** — guardrails and transparency notes
   - **Priority Actions** — top 3 psychology-driven changes to make

## Output

Psychology recommendations appended to `.metapowers/marketing/<project>/02-act.md`. Present a summary highlighting:
- Top 3 applicable principles
- Highest-impact implementation recommendation
- Any ethical concerns to address
