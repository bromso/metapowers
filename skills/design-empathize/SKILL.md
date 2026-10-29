---
name: design-empathize
description: Research a UI component before designing it — user needs, related components in the Figma design system and applicable WCAG requirements — into a research brief. Use when the user wants to design a new component and has nothing yet beyond its name or idea.
metadata:
  argument-hint: "[project] [--skip-checks]"
  workflow: design
  phase: 1
  artifact: 01-empathize.md
---

# Empathize

> **Note:** Figma steps require a Figma MCP server; see the design workflow page.

Research the problem space for "$ARGUMENTS" before any design work begins. Gather user needs, existing patterns, accessibility requirements, and contextual constraints.

**Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"design-empathize","workflow":"design","phase":1,"project":"<project>","event":"skipped","artifact":"01-empathize.md","note":"<reason or \"none given\">"}`.

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
   - Read `references/wcag-criteria.md` for applicable WCAG criteria
   - Call `figma_a11y_contrast_check` on any existing color pairs used in related components
   - Note specific accessibility requirements for this component type

4. **Synthesize findings** into a research brief covering:
   - User needs and common use cases for this component type
   - Existing patterns found in the design system
   - Accessibility requirements and considerations
   - Contextual constraints (design tokens available, conventions established)
   - Gaps and opportunities

5. **Write the artifact** to `.singularskills/design/<project>/01-empathize.md`

## Output

The research brief written to `.singularskills/design/<project>/01-empathize.md`. Present a summary to the user highlighting:
- Key user needs identified
- Existing components found (if any)
- Critical accessibility requirements
- Recommended approach for the Define phase

**Record the run.** Append each of these events to `.singularskills/log.jsonl` as one line (create the folder and file if missing):

- Before you start work: `{"ts":"<ISO timestamp>","skill":"design-empathize","workflow":"design","phase":1,"project":"<project>","event":"started","artifact":"01-empathize.md","note":""}`
- After you have written the artifact: the same line with `"event":"finished"`.

Open the artifact with this frontmatter (`agent` is the agent you run in, or `unknown`; `gate` is `none`, as this phase has no gate):

```yaml
---
skill: design-empathize
workflow: design
phase: 1
project: <project>
started: <ISO timestamp>
finished: <ISO timestamp>
agent: <the agent you run in, or "unknown">
gate: none
---
```

End the artifact with `## Decisions` and `## Open questions`, in this shape:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```
