---
description: Get a high-level overview of a Figma design system — components, styles, tokens, and structure
---

# System Overview

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
