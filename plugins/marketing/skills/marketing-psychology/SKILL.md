---
description: Apply behavioral psychology principles to marketing
---

# Marketing Psychology

Apply behavioral psychology and persuasion principles to "$ARGUMENTS". Identify which psychological triggers to use and how to implement them ethically.

## Prerequisites

Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.metapowers/marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/$ARGUMENTS/00-strategy.md` for audience and positioning
   - Read `.metapowers/marketing/$ARGUMENTS/02-act.md` if it exists

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
   - For each: specific implementation recommendation for "$ARGUMENTS"

4. **Ethical guardrails:**
   - Flag any dark patterns or manipulative implementations
   - Ensure all claims are truthful and verifiable
   - Recommend transparent use of urgency/scarcity

5. **Write the artifact** — append to `.metapowers/marketing/$ARGUMENTS/02-act.md` under a `## Marketing Psychology` section:
   - **Applicable Principles** — ranked by expected impact
   - **Implementation Recommendations** — specific, actionable per principle
   - **Ethical Considerations** — guardrails and transparency notes
   - **Priority Actions** — top 3 psychology-driven changes to make

## Output

Psychology recommendations appended to `.metapowers/marketing/$ARGUMENTS/02-act.md`. Present a summary highlighting:
- Top 3 applicable principles
- Highest-impact implementation recommendation
- Any ethical concerns to address
