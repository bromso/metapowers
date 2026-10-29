---
name: design-system-overview
description: Summarize a Figma file's design system — components, styles, token collections and modes, and page structure — in one structured overview. Use when the user is new to a Figma design system or wants to know what it contains before working with it. Not for exporting tokens as code; see /design-export-tokens.
---

# System Overview

> **Note:** Figma steps require a Figma MCP server; see the design workflow page.

Get a comprehensive overview of the design system in a Figma file.

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
