---
name: design-system-overview
description: Summarize a Figma file's design system — components, styles, token collections and modes, and page structure — in one structured overview. Use when the user is new to a Figma design system or wants to know what it contains before working with it. Not for exporting tokens as code; see /design-export-tokens.
metadata:
  figma-aware: true
---

# System Overview

Get a comprehensive overview of the design system in a Figma file.

## Prerequisites

**Figma.** Steps marked *Figma* use a Figma MCP server you connect to this agent yourself; this pack ships none and makes no network calls. Before the first such step, list the tools available to you and bind each capability the step names to one tool, as `references/figma-capabilities.md`, bundled with this skill, describes: the official Figma server's tool named there, else any tool whose description plainly does the same thing. With a capability bound, take the file key and node id from the `file:` line of the `## Tools` section of the project's latest earlier artifact, else from the Figma link the user gave; when a bound capability needs one and there is none, ask for the link once, with any other question you ask. With nothing bound, never ask for a link. Record the result in a `## Tools` section after any `## Recalled` section: a `- file:` line, one line per bound capability (`- read-tokens: get_variable_defs (figma)`), and a `- created:` line for node ids you created; or the single line `No Figma server: steps marked Figma ran without one.`; a skill with no artifact says the same in its summary. For an unbound capability do what the step's *Without Figma* line says: never ask the user to connect a server, never invent values a tool would have returned, and never report a step as run when it was not.

## Process

1. **Identify the Figma file.** The user should provide a file key or URL.

2. **Fetch the design system summary:**
   - Call `figma_get_design_system_summary` to get counts and page structure
   - Call `figma_get_styles` to list all published styles
   - Call `figma_get_components` to list all published components
   - Call `figma_get_variables` with `exportFormat: "json"` to get token structure

3. **Compile the overview:**
   - **File info:** Name, last modified, page count
   - **Components:** Total count, listed by name with descriptions
   - **Styles:** Counts by type (fill, text, effect, grid), listed with names
   - **Tokens:** Collection count, variable count by type (color, float, string, boolean), mode names
   - **Structure:** Page names and what each page contains

4. **Present the overview** to the user in a clear, structured format.

## Output

A structured design system overview presented to the user, useful for onboarding or auditing the design system state.
