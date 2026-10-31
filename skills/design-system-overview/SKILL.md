---
name: design-system-overview
description: Summarize a Figma file's design system — components, styles, token collections and modes, and page structure — in one structured overview. Use when the user is new to a Figma design system or wants to know what it contains before working with it. Not for exporting tokens as code; see /design-export-tokens.
metadata:
  figma-aware: true
---

# System Overview

Get a comprehensive overview of the design system in a Figma file.

## Prerequisites

**Figma.** Steps marked *Figma* use a Figma MCP server you connect to this agent yourself; this pack ships none and makes no network calls. Before you ask the user anything or run the first such step, list the tools available to you and bind each capability the step names to one tool, as `references/figma-capabilities.md`, bundled with this skill, describes: the official Figma server's tool named there, else any tool whose description plainly does the same thing. With a capability bound, take the file key and node id from a Figma link in the request or the conversation, else from the `file:` line of the `## Tools` section of the latest earlier artifact of this project that has one; when a bound capability needs one and there is none, ask for the link once, with any other question you ask. With nothing bound, never ask for a link. Record the result in a `## Tools` section after any `## Recalled` section: a `- file:` line (the Design file; a board or a deck goes on a `- board:` or `- deck:` line), one line per bound capability (`- read-tokens: get_variable_defs (figma)`), and a `- created:` line for node ids you created; or the single line `No Figma server: steps marked Figma ran without one.`; a skill with no artifact says the same in its summary. For an unbound capability do what the step's *Without Figma* line says, using first any values the user gave in the request or in files it names: never ask the user to connect a server, never invent values a tool would have returned, and never report a step as run when it was not.

## Process

1. **Identify the Figma file.** Take the Figma link from the request or the conversation; with nothing bound, go to step 2.

2. **Read the system.** *Figma (read-tokens, find-components, read-node):* read the file's variables and styles with their collections and modes, search its libraries for components, and read each page's top-level structure. *Without Figma:* say so and stop.

3. **Compile the overview:**
   - **File info:** Name, last modified, page count
   - **Components:** Total count, listed by name with descriptions
   - **Styles:** Counts by type (fill, text, effect, grid), listed with names
   - **Tokens:** Collection count, variable count by type (color, float, string, boolean), mode names
   - **Structure:** Page names and what each page contains

4. **Present the overview** to the user in a clear, structured format, opening with the tool binding: one line per bound capability, or the no-server sentence.

## Output

A structured design system overview presented to the user, useful for onboarding or auditing the design system state.
