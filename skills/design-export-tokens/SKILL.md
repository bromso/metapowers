---
name: design-export-tokens
description: Export the design tokens (variables) from a Figma file as CSS custom properties, Tailwind config or JSON, optionally saved to a file. Use when the user wants Figma colors, spacing and type values in code, or gives a Figma URL and asks for its tokens. Not for an inventory of the whole design system; see /design-system-overview.
metadata:
  stack-aware: true
  figma-aware: true
---

# Export Tokens

Export design tokens from the Figma design system to a code-ready format.

## Prerequisites

**Stack.** Before you build, test, lint, run or generate code, read the `Stack` section of the project's `AGENTS.md`, or of `CLAUDE.md` when `AGENTS.md` has none. Use its commands exactly as written, its `layout` for where files go and its `rules` as requirements. If it names a `profile`, also read the file `<profile>.md` in the `stacks` folder of this skill's bundled references for the full commands, layout and rules; the project's own keys win where both speak. If there is no `Stack` section, run the `singular-detect` skill, state what you inferred in one line, and offer to write the section with `singular-init`. Never assume a package manager, test runner or formatter the project did not declare.

**Figma.** Steps marked *Figma* use a Figma MCP server you connect to this agent yourself; this pack ships none and makes no network calls. Before the first such step, list the tools available to you and bind each capability the step names to one tool, as `references/figma-capabilities.md`, bundled with this skill, describes: the official Figma server's tool named there, else any tool whose description plainly does the same thing. With a capability bound, take the file key and node id from the `file:` line of the `## Tools` section of the project's latest earlier artifact, else from the Figma link the user gave; when a bound capability needs one and there is none, ask for the link once, with any other question you ask. With nothing bound, never ask for a link. Record the result in a `## Tools` section after any `## Recalled` section: a `- file:` line, one line per bound capability (`- read-tokens: get_variable_defs (figma)`), and a `- created:` line for node ids you created; or the single line `No Figma server: steps marked Figma ran without one.`; a skill with no artifact says the same in its summary. For an unbound capability do what the step's *Without Figma* line says: never ask the user to connect a server, never invent values a tool would have returned, and never report a step as run when it was not.

## Process

1. **Identify the Figma file.** The user should provide a Figma file key or URL. Extract the file key from the URL if needed (the key is the string between `/design/` or `/file/` and the next `/`).

2. **Read the tokens.** *Figma (read-tokens):* read the file's variables and styles with their collections and modes. *Without Figma:* say the file could not be read and export nothing.

3. **Convert** what you read into the requested format yourself (CSS custom properties by default; a Tailwind config; JSON keeping collections and modes), one entry per variable with its name and its value per mode; no server exports these.

4. **Present the exported tokens** to the user, opening with the tool binding: one line per bound capability, or the no-server sentence.

5. **Optionally save to file.** If the user requests, write the output to a file:
   - CSS: `tokens.css`
   - Tailwind: `tailwind.tokens.json`
   - JSON: `tokens.json`

## References

- `references/stacks/bun-react-ts.md` and `references/stacks/rust-gpui.md`: the shipped stack profiles

## Output

The exported tokens displayed to the user and optionally saved to a file.
