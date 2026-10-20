---
name: strategy
description: Define a brand platform — purpose, vision, mission, values, positioning, personality and differentiation. Use when the user asks what their brand stands for, what personality it should have, or how it should stand apart from competitors. Not for voice, product messaging or critiquing a strategy; see /branding:verbal, /marketing:product-marketing-context or /coaching:strategy.
argument-hint: "[project] [--skip-checks]"
---

# Strategy

Define the brand strategy for "$ARGUMENTS". Synthesize discovery findings into a clear positioning, values, personality, and differentiation framework.

See also `/marketing:product-marketing-context` for the product positioning, messaging framework and go-to-market context built on this brand platform.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/branding/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/branding/<project>/01-discover.md`. If this file does not exist, tell the user:

> Phase 1 (Discover) has not been completed for "<project>". Run `/branding:discover <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.metapowers/branding/<project>/01-discover.md` for research findings
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/brand-platform-template.md` for output structure
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/brand-prism-guide.md` for the six brand facets

2. **Define brand purpose, vision, and mission:**
   - Purpose: why does this brand exist?
   - Vision: where is the brand going?
   - Mission: what does it do, for whom, and how?

3. **Define brand values:**
   - 3-5 core values that guide all brand decisions
   - For each value: description and how it manifests in behavior

4. **Craft positioning statement:**
   - For [target audience] who [need], [brand] is the [category] that [benefit] because [reason]

5. **Define brand personality:**
   - 3-5 personality traits (e.g., bold, approachable, expert, playful)
   - For each trait: how it influences communication

6. **Map competitive differentiation:**
   - What sets this brand apart from each key competitor?
   - The unique value proposition

7. **Write the artifact** to `.metapowers/branding/<project>/02-strategy.md` following the brand platform template.

## Output

The brand strategy written to `.metapowers/branding/<project>/02-strategy.md`. Present a summary to the user highlighting:
- The positioning statement
- Core values
- Key personality traits
- Primary differentiator
