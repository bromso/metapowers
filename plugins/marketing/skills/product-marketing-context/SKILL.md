---
name: product-marketing-context
description: Define a product's positioning statement, value proposition, messaging framework and go-to-market motion, compiled into a marketing brief. Use when the user needs to settle how to describe the product, which messages to lead with and for whom. Not for planning a specific launch; see /marketing:launch-strategy.
argument-hint: "[project] [--skip-checks]"
---

# Product Marketing Context

Define the core product marketing foundation for "$ARGUMENTS". Create value propositions, messaging framework, positioning statement, and go-to-market context.

See also `/branding:strategy` for the brand platform — purpose, vision, mission, values and personality — behind this positioning.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/marketing/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/marketing/<project>/00-strategy.md`. This skill works best after customer-research and competitor-profiling have been run, but can be used standalone.

## Process

1. **Read context:**
   - Read `.metapowers/marketing/<project>/00-strategy.md` for all prior strategy work
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/marketing-brief-template.md` for output structure
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/race-framework-guide.md` for methodology reference

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

6. **Write the artifact** — append to `.metapowers/marketing/<project>/00-strategy.md` under a `## Product Marketing Context` section. Create the file with a `# Strategy — <project>` heading if it does not exist; if a `## Product Marketing Context` section already exists, replace only that section. Also compile the full strategy into a marketing brief using the template structure:
   - **Positioning Statement** — the core positioning
   - **Value Proposition** — core + supporting benefits
   - **Messaging Framework** — messages, proof points, tone
   - **Go-to-Market Context** — channels, motion, milestones
   - **Marketing Brief Summary** — compiled brief following `marketing-brief-template.md`

## Output

Product marketing context appended to `.metapowers/marketing/<project>/00-strategy.md`. Present a summary highlighting:
- The positioning statement
- Top 3 key messages
- Recommended go-to-market motion
