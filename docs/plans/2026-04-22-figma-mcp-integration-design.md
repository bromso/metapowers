# Custom Figma MCP Server + Design Domain Integration

**Date:** 2026-04-22
**Status:** Approved

## Goal

Build a custom Figma MCP server (`@metapowers/figma-mcp`) as a package in the monorepo, then integrate it into the design domain plugin with all 5 design phases + 4 bonus skills. Update `apps/docs` with full documentation.

## Audience

End users of the metapowers design plugin who work with Figma.

## Non-Goals

- No dependency on `figma-console-mcp` — all code is original
- No cloud relay or remote SSE modes
- No Figma Desktop Bridge Plugin — REST API only
- Node creation/manipulation not possible (Figma REST API limitation — requires Plugin API)

## Architecture

Two deliverables:

### 1. `packages/figma-mcp` — Custom MCP Server

TypeScript MCP server built with `@modelcontextprotocol/sdk`. Communicates with Figma via the **REST API** only (no Desktop Bridge Plugin).

Runs as: `npx @metapowers/figma-mcp` or `node dist/index.js`

Requires: `FIGMA_ACCESS_TOKEN` environment variable.

**Limitation:** Without a Desktop Bridge Plugin, node creation/manipulation on the Figma canvas is not possible. The REST API supports reading design data, exporting images, and managing variables/tokens. Write operations are limited to what the REST API supports (variables via `POST /v1/files/:key/variables`).

### 2. `plugins/design/` — Updated Design Domain Plugin

- Swap `.mcp.json` to use `@metapowers/figma-mcp`
- Build 4 new phase skills + update existing `define-component`
- Add 4 bonus skills
- Update hooks for new tool names

## MCP Server Tool Inventory (46 tools)

### Design System (8 tools)

| Tool | Description |
|------|-------------|
| `figma_get_design_system` | Full design system in one call (tokens, styles, components) |
| `figma_get_variables` | Design tokens with export to CSS/Tailwind/Sass/JSON |
| `figma_get_styles` | Color, text, and effect styles |
| `figma_get_component` | Component metadata + reconstruction spec |
| `figma_get_component_image` | Export component as PNG/SVG |
| `figma_get_component_for_dev` | Visual reference + implementation specs |
| `figma_get_design_system_summary` | High-level overview of the system |
| `figma_create_variable` | Create new design tokens |

### Visual Context (3 tools)

| Tool | Description |
|------|-------------|
| `figma_get_file_info` | File metadata (name, last modified, pages) |
| `figma_get_node` | Get specific node(s) by ID with full properties |
| `figma_export_image` | Render node(s) as PNG/SVG/JPG/PDF |

### Variables Write (2 tools — REST API supported)

| Tool | Description |
|------|-------------|
| `figma_create_variable` | Create new design tokens |
| `figma_update_variable` | Update existing design token values |

> **Note:** Node creation/manipulation (frames, components, text, shapes), FigJam, and Slides tools are NOT possible via the REST API alone. These would require a Figma Desktop Bridge Plugin, which is out of scope.

### Accessibility (5 tools — computed from design data)

| Tool | Description |
|------|-------------|
| `figma_a11y_lint` | WCAG design checks on node tree (contrast, text size, touch targets) |
| `figma_a11y_scorecard` | Component accessibility scorecard |
| `figma_a11y_color_blind_sim` | Simulate color blindness on extracted colors |
| `figma_a11y_contrast_check` | Check color pairs against AA/AAA |
| `figma_a11y_focus_order` | Validate tab/focus order from node tree |

## Design Plugin Skills

### 5 Core Phases

| Phase | Skill | Key MCP Tools | Artifact |
|-------|-------|---------------|----------|
| 1. Empathize | `empathize` | `figma_get_design_system`, `figma_get_component`, `figma_get_component_for_dev` | `01-empathize.md` |
| 2. Define | `define-component` (update) | `figma_get_design_system`, `figma_get_variables` | `02-define.md` |
| 3. Ideate | `ideate` | `figjam_create_stickies`, `figjam_create_connector`, `figjam_create_table` | `03-ideate.md` + FigJam board |
| 4. Prototype | `prototype` | `figma_create_component`, `figma_create_frame`, `figma_arrange_component_set` | `04-prototype.md` + Figma component |
| 5. Test | `test` | `figma_a11y_lint`, `figma_a11y_scorecard`, `figma_a11y_color_blind_sim` | `05-test.md` |

### 4 Bonus Skills

| Skill | Purpose | Key MCP Tools |
|-------|---------|---------------|
| `export-tokens` | Export design tokens to CSS/Tailwind/Sass/JSON | `figma_get_variables` |
| `a11y-audit` | Full WCAG accessibility audit | All `figma_a11y_*` tools |
| `design-review` | Generate Figma Slides presentation from 5-phase artifacts | `figma_*_slide*`, `figma_capture_node` |
| `system-overview` | High-level design system summary | `figma_get_design_system_summary`, `figma_get_styles` |

### Updated Hooks

- **Matcher:** `mcp__metapowers_figma__figma_create_*` and `mcp__metapowers_figma__figma_execute`
- **Check:** Validates `02-define.md` exists before any Figma creation/execution tools
- **Bypass:** `DESIGN_SKIP_CHECKS=1`

## Documentation (apps/docs)

New and updated pages in the Fumadocs site:

- **MCP Server section** — setup guide, tool reference (all 46 tools), Desktop Bridge Plugin setup
- **Updated Design Domain Guide** — reflect new MCP tools in all 5 phase pages
- **New skill pages** — empathize, ideate, prototype, test, export-tokens, a11y-audit, design-review, system-overview
- **Updated Architecture** — document the MCP server architecture, Figma API strategy

## Package Structure

```
packages/figma-mcp/
  src/
    index.ts              # MCP server entry point
    server.ts             # Server setup and tool registration
    tools/
      design-system.ts    # 8 design system tools
      visual.ts           # 3 visual context tools
      variables.ts        # 2 variable write tools
      accessibility.ts    # 5 accessibility tools
    figma/
      rest-api.ts         # Figma REST API client
    utils/
      export.ts           # Token export formatters (CSS, Tailwind, Sass, JSON)
      wcag.ts             # WCAG checking logic
  package.json
  tsconfig.json
```

## Decisions

- No dependency on figma-console-mcp — all original code
- REST API only — no Desktop Bridge Plugin, no Figma desktop app dependency
- ~18 tools focused on what the REST API can do (read design data, export images, manage variables, accessibility analysis)
- MCP server publishable to npm as standalone tool
- Documentation included in apps/docs
