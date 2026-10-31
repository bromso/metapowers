# Figma capabilities

A **capability** is one thing a design skill may ask a Figma MCP server for: read a file's tokens, find its components, read or screenshot a node, write to a Design file, a FigJam board or a Slides deck. This pack ships no server and makes no network calls. A skill names capabilities, never tools; at run time it binds each capability to whatever server the user has connected, and every step marked *Figma* says what it does when nothing is bound.

## Binding

Before the first step marked *Figma*, list the tools available to you and bind each capability that step names to **one** tool:

1. The official Figma server's tool named under that capability below (the server at `https://mcp.figma.com/mcp`, or Figma Desktop's), when a tool of that name is available.
2. Otherwise any tool whose description plainly does the same thing. Each capability states what the description must say it reads or writes; a tool that matches only on the word "Figma" does not qualify.
3. Otherwise the capability is **unbound**.

Bind once per run, before you ask the user anything and before any step marked *Figma*, and record the result (see Recording). Never call a tool you have not bound to a capability, and never write a tool's name into a skill's own text; the `## Tools` section of the artifact is where tool names belong.

## Finding the file and node

A bound capability that reads or writes a file needs a file key, and most need a node id. Take them from a Figma link:

| Link | File key | Node id |
| --- | --- | --- |
| `figma.com/design/<fileKey>/<name>?node-id=X-Y` | `<fileKey>` | `X-Y`, written `X:Y` |
| `figma.com/file/<fileKey>/<name>?node-id=X-Y` | `<fileKey>` | `X-Y`, written `X:Y` |
| `figma.com/design/<fileKey>/branch/<branchKey>/<name>` | `<branchKey>` | from `node-id` |
| `figma.com/board/<fileKey>/…` | a FigJam board: only `write-figjam` accepts it | |
| `figma.com/slides/<fileKey>/…` | a Slides deck: only `write-slides` accepts it | |

Look for the link in this order: a Figma link in the request or the conversation (a link the user gives now wins over a recorded one); then the `- file:` line of the `## Tools` section of the latest earlier artifact under `.singularskills/<folder>/<project>/` that has a real link (skip artifacts whose line says `none` or that carry the no-server sentence). `- file:` is always the Design file; a FigJam board or a Slides deck is recorded on its own `- board:` or `- deck:` line and is never read as the Design file. Only when a bound capability needs a link and none was found do you ask for it, once, in the same turn as any other question you ask. With nothing bound, never ask for a link: a project with no Figma file and a project with no server take the same path.

## What counts as read

Values the user gave, in the request or in files the request names (a brief, a token file, a pasted palette, a component folder), are the user's: use them as read, before any other *Without Figma* source. `not checked` is for what only Figma could have answered. Never invent a token name, a component list, a measurement or a check result that a tool would have returned.

## Recording

An artifact-writing skill adds a `## Tools` section after any `## Recalled` section (else after the title):

```markdown
## Tools
- file: https://www.figma.com/design/<fileKey>/<name>?node-id=12-34
- read-tokens: get_variable_defs (figma)
- write-design: use_figma (figma)
- created: 12:40 (DatePicker), 12:41 (DatePicker/State=Hover)
```

One `- file:` line (the Design file; `none` when no link was used); a `- board:` line in the ideation artifact and a `- deck:` line in the review deck, with the FigJam or Slides link or `none`; one line per bound capability as `- <capability>: <tool> (<server>)`; and a `- created:` line listing every node or slide id the skill made, with its name. When nothing is bound the whole section is the single line:

```markdown
No Figma server: steps marked Figma ran without one.
```

A skill that writes no artifact says the same, as one line, at the top of its summary.

## Capabilities

### read-tokens

**Returns:** the variables and styles of a node or a file: colours, spacing, typography, radii and effects, with names, values and modes.
**Official server:** `get_variable_defs(fileKey, nodeId)`; `search_design_system(queries: [{ entity: "variable" | "style", query }], fileKey)` for the file's libraries.
**Any other server:** a tool whose description says it returns the variables, tokens or styles of a Figma file or node.
**Without Figma:** read the project's own token sources: a `tokens` package, CSS custom properties, a Tailwind config (a stack-aware skill looks where its Stack section's `layout` says). For anything those do not hold, write `not checked`.

### find-components

**Returns:** the components and component sets the file can use, with names, library and description.
**Official server:** `search_design_system(queries: [{ entity: "component", query }], fileKey)`; `get_libraries(fileKey)` to list the libraries first.
**Any other server:** a tool whose description says it lists or searches the components of a Figma file or its libraries.
**Without Figma:** read the project's component folders the same way as `read-tokens`; else `not checked`.

### read-node

**Returns:** a node's structure: layout, children, text, sizes and applied tokens.
**Official server:** `get_design_context(fileKey, nodeId)`; `get_metadata(fileKey, nodeId)` for a sparse tree of ids, names and sizes.
**Any other server:** a tool whose description says it returns the layout, structure or design context of a Figma node.
**Without Figma:** `not checked`.

### screenshot

**Returns:** an image of a node.
**Official server:** `get_screenshot(fileKey, nodeId)`.
**Any other server:** a tool whose description says it renders, exports or screenshots a Figma node.
**Without Figma:** `not checked`.

### write-design

**Returns:** new frames, components, text and variant sets in a Design file (`figma.com/design/…`), with the ids it created.
**Official server:** `use_figma` with Plugin API code (editor `figma`); `generate_figma_design` for a first draft from a description.
**Any other server:** a tool whose description says it creates or modifies nodes, frames or components in a Figma file.
**Without Figma:** write a **build sheet** into the artifact instead: one table per variant axis and one per state with the exact token (or `not checked`) for every fill, stroke, text style, spacing and radius, the auto layout settings, and the variant grid, in the order a designer would build it.

### write-figjam

**Returns:** stickies, tables, connectors or a diagram on a FigJam board (`figma.com/board/…`).
**Official server:** `use_figma` (editor `figjam`); `generate_diagram` from Mermaid.
**Any other server:** a tool whose description says it creates stickies, shapes or diagrams on a FigJam board.
**Without Figma:** skip the step; the comparison already lives in the artifact.

### write-slides

**Returns:** slides with text and images in a Figma Slides deck (`figma.com/slides/…`).
**Official server:** `use_figma` (editor `slides`).
**Any other server:** a tool whose description says it creates slides in Figma Slides.
**Without Figma:** skip the step; the Markdown deck in the artifact is the deliverable.

## Patterns for write-design

With the official server, `use_figma` runs Plugin API code in the open file. The few patterns a component prototype needs:

- **A component with auto layout:** `const c = figma.createComponent(); c.name = "DatePicker"; c.layoutMode = "VERTICAL"; c.paddingTop = c.paddingBottom = 12; c.layoutSizingHorizontal = "HUG";`
- **A container:** `figma.createAutoLayout("VERTICAL", { name: "Row", itemSpacing: 8 })`; children appended to it may set `layoutSizingHorizontal = "FILL"`.
- **Text:** `await figma.loadFontAsync({ family: "Inter", style: "Regular" })` before `const t = figma.createText(); t.characters = "…"`.
- **Variants:** build one component per combination, named by its axes (`State=Hover, Size=Large`), then `const set = figma.combineAsVariants(components, figma.currentPage)`; the variants land at (0, 0), so position each in a grid from its measured `width` and `height`, then `set.resizeWithoutConstraints(w, h)`.
- **Tokens:** bind fills and spacing to the variables read with `read-tokens` rather than raw values; where a token is missing, use the raw value and note it in the artifact.
- **Return the ids:** end the script with `return { ids: [...] }` and copy them into the `## Tools` `created:` line.

When Figma's own `figma-use` or `figma-generate-library` skill is installed in the agent, follow it for anything beyond these patterns; it is the authority on the Plugin API's current shape.

## Checks that need no server

Contrast, colour-vision simulation, focus order, target size and text size are computed by the skill from the values it read or was given, as `references/a11y-checks.md` describes; no capability provides them.
