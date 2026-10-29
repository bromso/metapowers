---
name: marketing-pricing-strategy
description: Evaluate pricing models against competitors and the product's value metric, then recommend tiers, price points, packaging and discounts. Use when the user is deciding what to charge, choosing per-seat, usage-based or freemium, or restructuring plans. Not for making an existing paywall or upgrade prompt convert better; see /marketing-paywall-upgrade-cro.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: marketing
  phase: 0
  artifact: 00-strategy.md
---

# Pricing Strategy

Evaluate and recommend pricing strategy for "$ARGUMENTS". Analyze pricing models, tier structures, packaging, and competitive pricing.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"marketing","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

## Prerequisites

Read `.singularskills/marketing/<project>/00-strategy.md`. If this file does not exist, suggest running `/marketing-customer-research <project>` first to understand the audience.

## Process

1. **Read context:**
   - Read `.singularskills/marketing/<project>/00-strategy.md` for audience and competitor data
   - Read `references/race-framework-guide.md` for methodology reference

2. **Analyze current pricing landscape:**
   - Use WebSearch to research competitor pricing for "<project>" category
   - Use WebFetch to read pricing pages of top competitors
   - Document: pricing models (flat, usage, per-seat, freemium), price points, tier structures

3. **Evaluate pricing models:**
   - Which model aligns with the value metric? (what do users pay for?)
   - Flat rate vs. usage-based vs. per-seat vs. hybrid
   - Free tier / freemium considerations
   - Annual vs. monthly pricing and discount strategy

4. **Design tier structure:**
   - Recommend tier names, price points, and feature allocation
   - Apply the "good-better-best" framework
   - Identify the anchor tier (where most users should land)
   - Define upgrade triggers between tiers

5. **Pricing psychology:**
   - Anchoring: which tier makes the target tier look like a deal?
   - Charm pricing vs. round numbers for the category
   - Annual discount percentage recommendations
   - Free trial vs. freemium decision

6. **Write the artifact** — append to `.singularskills/marketing/<project>/00-strategy.md` under a `## Pricing Strategy` section. Create the file with a `# Strategy — <project>` heading if it does not exist; if a `## Pricing Strategy` section already exists, replace only that section. The section contains:
   - **Competitive Pricing Landscape** — what competitors charge and how
   - **Recommended Model** — pricing model with rationale
   - **Tier Structure** — tiers, price points, features per tier
   - **Pricing Psychology** — anchoring, discount strategy
   - **Risks & Considerations** — potential issues with recommended approach

## Output

Pricing strategy appended to `.singularskills/marketing/<project>/00-strategy.md`. Present a summary highlighting:
- Recommended pricing model and why
- Proposed tier structure with price points
- Key pricing psychology tactics to apply

**Record the run.** This artifact is shared by every skill of phase 0 (Strategy). The frontmatter is written once, by whoever creates the file: if you create it, open it with the block below (`skill` is the phase title, `started` the time of that first write; `gate` is `none`, as this phase has no gate); if it already exists, leave the block alone except to update `finished` and to set `gate` to the worst value among the sections (`skipped` over `passed`).

```yaml
---
skill: Strategy
workflow: marketing
phase: 0
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

Open your `## Pricing Strategy` section with one italic line, `*<skill name> · <ISO timestamp> · gate: <passed|skipped>*` (your skill name is `marketing-pricing-strategy`).

End your section with `### Decisions` and `### Open questions` (one level under your `## Pricing Strategy` heading, so the section stays one block), in this shape:

```markdown
### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
