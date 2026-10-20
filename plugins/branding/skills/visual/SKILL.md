---
description: Define visual identity — colors, typography, logo usage, and imagery style
---

# Visual Identity

Define the visual identity system for "$ARGUMENTS". Create specifications for logo usage, color palette, typography, and imagery that express the brand visually.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/branding/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/branding/<project>/02-strategy.md` and `.metapowers/branding/<project>/03-verbal.md`. If `03-verbal.md` does not exist, tell the user:

> Phase 3 (Verbal) has not been completed for "<project>". Run `/branding:verbal <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.metapowers/branding/<project>/02-strategy.md` for personality and positioning
   - Read `.metapowers/branding/<project>/03-verbal.md` for voice and tone

2. **If the user has existing assets:**
   - Review logo files in `.metapowers/branding/<project>/assets/logo/`
   - Review fonts in `.metapowers/branding/<project>/assets/fonts/`
   - Review imagery in `.metapowers/branding/<project>/assets/imagery/`
   - Document and formalize what exists

3. **If creating from scratch, define:**

   **Logo usage rules:**
   - Minimum size, clear space requirements
   - Approved variations (primary, icon, monochrome, reversed)
   - Prohibited uses
   - Ask the user to provide/create logo files and place in `.metapowers/branding/<project>/assets/logo/`

   **Color palette:**
   - Primary colors (2-3) with hex, RGB values
   - Secondary colors (2-4) with hex, RGB values
   - Neutral colors for backgrounds and text
   - Accessibility: contrast ratios for text on each background

   **Typography:**
   - Primary typeface: name, weights, usage (headings vs. body)
   - Secondary typeface (if needed)
   - Type scale: sizes, weights, line heights for each level
   - Ask the user to provide font files and place in `.metapowers/branding/<project>/assets/fonts/`

   **Imagery style:**
   - Photography style (mood, composition, subjects)
   - Illustration style (if applicable)
   - Icon style
   - Do's and don'ts

4. **Write the artifact** to `.metapowers/branding/<project>/04-visual.md`

## Output

The visual identity written to `.metapowers/branding/<project>/04-visual.md`. Present a summary to the user highlighting:
- Primary color palette
- Typography choices
- Logo variations defined
- Imagery direction
