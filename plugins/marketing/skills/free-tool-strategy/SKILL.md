---
description: Plan free tools and calculators for acquisition
---

# Free Tool Strategy

Design a free tool or calculator strategy for "$ARGUMENTS". Plan tools that attract users, demonstrate product value, and drive conversions.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. If this file does not exist, tell the user:

> Phase 0 (Strategy) has not been completed for "$ARGUMENTS". Run `/marketing:customer-research $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for audience and product context

2. **Identify tool opportunities:**
   - What calculations, assessments, or tasks does the audience do manually?
   - Use WebSearch to find successful free tools in the category
   - What tools do competitors offer? What's missing?
   - Which tools naturally lead to the paid product? (product-led growth alignment)

3. **Design tool concepts:**
   - Create 2-3 free tool concepts with:
     - Tool name and description
     - Core functionality
     - Input/output design
     - How it connects to the paid product
     - SEO and viral potential (is it linkable? shareable?)
     - Build effort estimate

4. **Growth mechanics:**
   - SEO: will people search for this tool?
   - Virality: does the output encourage sharing?
   - Data capture: what user data does it naturally collect?
   - Upsell path: how does it lead to the paid product?

5. **Write the artifact** — append to `.marketing/$ARGUMENTS/02-act.md` under a `## Free Tool Strategy` section:
   - **Tool Concepts** — 2-3 concepts with details
   - **Recommended Tool** — which to build first and why
   - **Growth Mechanics** — SEO, virality, data capture
   - **Upsell Path** — how it leads to conversion
   - **Technical Requirements** — high-level build spec

## Output

Free tool strategy appended to `.marketing/$ARGUMENTS/02-act.md`. Present a summary highlighting:
- Recommended tool to build
- Expected traffic and conversion potential
- Connection to paid product
