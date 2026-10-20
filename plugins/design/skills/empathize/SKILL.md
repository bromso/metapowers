---
name: empathize
description: Research user needs, existing patterns, and accessibility requirements before designing a component
argument-hint: "[project] [--skip-checks]"
---

# Empathize

Research the problem space for "$ARGUMENTS" before any design work begins. Gather user needs, existing patterns, accessibility requirements, and contextual constraints.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.metapowers/design/<project>/skip-log.md`: `- <ISO timestamp> — <skill name> skipped prerequisite check for <artifact file> — reason: <reason or "none given">`.

## Prerequisites

None — this is the first phase.

## Process

1. **Read the design system** via MCP tools:
   - Call `figma_get_design_system` to fetch existing components, tokens, and styles
   - Call `figma_get_components` to list all published components
   - Identify components that overlap with or relate to "<project>"

2. **Inspect existing components** (if found):
   - Call `figma_get_component` and `figma_get_component_for_dev` for related components
   - Call `figma_export_image` to get visual references
   - Document what exists, what works well, and what's missing

3. **Review accessibility requirements:**
   - Read `${CLAUDE_PLUGIN_ROOT}/shared/wcag-criteria.md` for applicable WCAG criteria
   - Call `figma_a11y_contrast_check` on any existing color pairs used in related components
   - Note specific accessibility requirements for this component type

4. **Synthesize findings** into a research brief covering:
   - User needs and common use cases for this component type
   - Existing patterns found in the design system
   - Accessibility requirements and considerations
   - Contextual constraints (design tokens available, conventions established)
   - Gaps and opportunities

5. **Write the artifact** to `.metapowers/design/<project>/01-empathize.md`

## Output

The research brief written to `.metapowers/design/<project>/01-empathize.md`. Present a summary to the user highlighting:
- Key user needs identified
- Existing components found (if any)
- Critical accessibility requirements
- Recommended approach for the Define phase
