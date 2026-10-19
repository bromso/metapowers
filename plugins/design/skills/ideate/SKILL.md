---
description: Explore multiple design approaches for a component before committing to an implementation
---

# Ideate

Generate multiple design options for "$ARGUMENTS" before committing to a single approach. Encourage creative exploration by producing at least 3 distinct options.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/design/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

Read `.metapowers/design/<project>/02-define.md`. If this file does not exist, tell the user:

> Phase 2 (Define) has not been completed for "<project>". Run `/design:define <project>` first, or use `--skip-checks` to bypass.

## Process

1. **Read context files:**
   - Read `.metapowers/design/<project>/01-empathize.md` for research findings (if exists)
   - Read `.metapowers/design/<project>/02-define.md` for the component contract
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/wcag-criteria.md` for accessibility constraints

2. **Read the design system** via MCP tools:
   - Call `figma_get_design_system` to understand available tokens and patterns
   - Call `figma_get_variables` with `exportFormat: "json"` to get token values

3. **Generate 3+ design options.** For each option:
   - Describe the visual approach and layout strategy
   - Map which tokens from the design system would be used
   - Evaluate against the component contract's constraints
   - Assess accessibility compliance
   - Note trade-offs (complexity, flexibility, consistency)

4. **Create a FigJam brainstorming board** (if FigJam is available):
   - Call `figjam_create_stickies` with each option as a sticky note
   - Call `figjam_create_table` with a comparison matrix

5. **Recommend one approach** with clear rationale explaining why it best satisfies the component contract.

6. **Write the artifact** to `.metapowers/design/<project>/03-ideate.md`

## Output

The ideation document written to `.metapowers/design/<project>/03-ideate.md`. Present a summary to the user highlighting:
- Number of options explored
- Recommended approach and rationale
- Key trade-offs between options
- Any contract constraints that were difficult to satisfy
