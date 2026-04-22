---
description: Define a component contract with props, variants, states, tokens, and accessibility criteria for design-system-quality components
---

# Define Component

Produce a complete component contract for "$ARGUMENTS" that serves as the single source of truth for prototyping, implementation, and testing.

## Prerequisites

Read `.design/$ARGUMENTS/01-empathize.md`. If this file does not exist, tell the user:

> Phase 1 (Empathize) has not been completed for "$ARGUMENTS". Run `/design:empathize $ARGUMENTS` first, or use `--skip-checks` to bypass.

If `--skip-checks` is present in $ARGUMENTS, skip this check and log to `.design/$ARGUMENTS/skip-log.md`.

## Process

1. **Read context files:**
   - Read `plugins/design/shared/component-contract-template.md` for the output structure
   - Read `plugins/design/shared/wcag-criteria.md` for accessibility requirements
   - Read `.design/$ARGUMENTS/01-empathize.md` for user needs and existing patterns (if exists)

2. **Read the design system** via MCP tools `figma_get_design_system` and `figma_get_variables`:
   - Existing components that overlap with this one
   - Available design tokens (colors, spacing, typography, radii)
   - Established patterns and conventions

3. **Produce the component contract** following the template structure. Every field must be filled — no placeholders, no TBDs. Specifically:
   - **Props:** Complete with TypeScript types. Every prop has a default value rationale.
   - **Variant matrix:** Enumerate all dimensions. Calculate total combinations. Flag any combinations that should be excluded and explain why.
   - **States:** All of: default, hover, focus, active, disabled, error, loading. For each state, specify visual changes (which tokens change) and ARIA updates.
   - **Token references:** Use only tokens from the design system. Never use raw color values, pixel values, or hardcoded strings. If a needed token doesn't exist, flag it as "MISSING TOKEN: [description]".
   - **Accessibility:** Map each WCAG criterion from the reference file. Specify keyboard interaction model, ARIA role, all ARIA attributes, focus management strategy.
   - **i18n:** Identify all translatable strings. Specify RTL behavior. State content expansion allowance (typically 30-50% for Western to CJK).

4. **Self-review the contract:**
   - Does every variant x state combination have defined token references?
   - Are there any raw values instead of tokens?
   - Is every interactive state keyboard-accessible?
   - Are ARIA attributes specified for every state change?

5. **Write the artifact** to `.design/$ARGUMENTS/02-define.md`

## Output

The component contract written to `.design/$ARGUMENTS/02-define.md`. Present a summary to the user highlighting:
- Total variant combinations
- Any missing tokens flagged
- Key accessibility decisions that need validation
