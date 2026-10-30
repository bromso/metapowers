---
name: design-export-tokens
description: Export the design tokens (variables) from a Figma file as CSS custom properties, Tailwind config or JSON, optionally saved to a file. Use when the user wants Figma colors, spacing and type values in code, or gives a Figma URL and asks for its tokens. Not for an inventory of the whole design system; see /design-system-overview.
metadata:
  stack-aware: true
---

# Export Tokens

> **Note:** Figma steps require a Figma MCP server; see the design workflow page.

Export design tokens from the Figma design system to a code-ready format.

## Prerequisites

**Stack.** Before you build, test, lint, run or generate code, read the `Stack` section of the project's `AGENTS.md`, or of `CLAUDE.md` when the project keeps its agent instructions there. Use its commands exactly as written, its `layout` for where files go and its `rules` as requirements. If it names a `profile`, also read the file `<profile>.md` in the `stacks` folder of this skill's bundled references for the full commands, layout and rules; the project's own keys win where both speak. If there is no `Stack` section, run the `singular-detect` skill, state what you inferred in one line, and offer to write the section with `singular-init`. Never assume a package manager, test runner or formatter the project did not declare.

## Process

1. **Identify the Figma file.** The user should provide a Figma file key or URL. Extract the file key from the URL if needed (the key is the string between `/design/` or `/file/` and the next `/`).

2. **Fetch design tokens:**
   - Call `figma_get_variables` with the file key
   - If the user specified a format, pass `exportFormat` as "css", "tailwind", or "json"
   - Default to "css" if no format is specified

3. **Present the exported tokens** to the user.

4. **Optionally save to file.** If the user requests, write the output to a file:
   - CSS: `tokens.css`
   - Tailwind: `tailwind.tokens.json`
   - JSON: `tokens.json`

## References

- `references/stacks/bun-react-ts.md` and `references/stacks/rust-gpui.md`: the shipped stack profiles

## Output

The exported tokens displayed to the user and optionally saved to a file.
