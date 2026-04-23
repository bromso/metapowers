---
description: Define value propositions, messaging framework, and go-to-market context
---

# Product Marketing Context

Define the core product marketing foundation for "$ARGUMENTS". Create value propositions, messaging framework, positioning statement, and go-to-market context.

## Prerequisites

Read `.marketing/$ARGUMENTS/00-strategy.md`. This skill works best after customer-research and competitor-profiling have been run, but can be used standalone.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.marketing/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context:**
   - Read `.marketing/$ARGUMENTS/00-strategy.md` for all prior strategy work
   - Read `plugins/marketing/shared/marketing-brief-template.md` for output structure
   - Read `plugins/marketing/shared/race-framework-guide.md` for methodology reference

2. **Craft the positioning statement:**
   - Use the format: For [target], who [need], [product] is a [category] that [key benefit]. Unlike [alternatives], we [differentiator].
   - Test it against: Is it specific? Defensible? Meaningful to the audience?

3. **Build the messaging framework:**
   - Define 3-5 key messages, each with proof points
   - Map messages to personas (which message resonates with which audience?)
   - Define tone and voice guidelines for this product/campaign
   - Create a message hierarchy: primary → supporting → proof points

4. **Define the value proposition:**
   - What is the core value delivered?
   - What are the functional, emotional, and social benefits?
   - What is the "so what?" for each feature?

5. **Go-to-market context:**
   - What channels will be used? (informed by competitor analysis)
   - What is the launch or growth motion?
   - What are the key milestones and success metrics?

6. **Write the artifact** — append to `.marketing/$ARGUMENTS/00-strategy.md` under a `## Product Marketing Context` section. Also compile the full strategy into a marketing brief using the template structure:
   - **Positioning Statement** — the core positioning
   - **Value Proposition** — core + supporting benefits
   - **Messaging Framework** — messages, proof points, tone
   - **Go-to-Market Context** — channels, motion, milestones
   - **Marketing Brief Summary** — compiled brief following `marketing-brief-template.md`

## Output

Product marketing context appended to `.marketing/$ARGUMENTS/00-strategy.md`. Present a summary highlighting:
- The positioning statement
- Top 3 key messages
- Recommended go-to-market motion
