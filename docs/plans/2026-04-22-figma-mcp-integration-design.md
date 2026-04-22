# Custom Figma MCP Server + Design Domain Integration

**Date:** 2026-04-22
**Status:** Approved (revised — Desktop Bridge Plugin added back)

## Goal

Build a custom Figma MCP server (`@metapowers/figma-mcp`) as a package in the monorepo, then integrate it into the design domain plugin with all 5 design phases + 4 bonus skills. Update `apps/docs` with full documentation.

## Audience

End users of the metapowers design plugin who work with Figma.

## Non-Goals

- No dependency on `figma-console-mcp` — all code is original
- No cloud relay or remote SSE modes (local-first only for v1)

## Architecture

Two deliverables:

### 1. `packages/figma-mcp` — Custom MCP Server

TypeScript MCP server built with `@modelcontextprotocol/sdk`. Communicates with Figma via:

- **Figma REST API** for read operations (tokens, styles, components, screenshots)
- **Desktop Bridge Plugin** (WebSocket) for write operations (create/modify nodes via Plugin API)

Runs as: `npx @metapowers/figma-mcp` or `node dist/index.js`

Requires: `FIGMA_ACCESS_TOKEN` environment variable, Figma Desktop with Bridge Plugin for write operations.

**Desktop Bridge Plugin:** A Figma plugin that runs inside Figma Desktop and communicates with the MCP server over WebSocket. The MCP server starts a local WebSocket server; the plugin connects to it. Write commands flow: Claude → MCP server → WebSocket → Figma Plugin → Plugin API. The plugin source lives inside `packages/figma-mcp/plugin/`.

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

### Node Creation & Manipulation (12 tools — via Bridge Plugin)

| Tool | Description |
|------|-------------|
| `figma_execute` | Run arbitrary Figma Plugin API code |
| `figma_create_frame` | Create frame with properties |
| `figma_create_component` | Create component with variants |
| `figma_create_instance` | Instantiate existing component |
| `figma_create_text` | Create text node with styling |
| `figma_create_shape` | Rectangle, ellipse, polygon, star, line |
| `figma_modify_node` | Update properties on existing node |
| `figma_delete_node` | Remove a node |
| `figma_arrange_component_set` | Organize variants with labels |
| `figma_group_nodes` | Group selection |
| `figma_set_auto_layout` | Apply auto-layout to frame |
| `figma_apply_styles` | Apply fills, strokes, effects |

### FigJam (8 tools — via Bridge Plugin)

| Tool | Description |
|------|-------------|
| `figjam_create_sticky` | Single sticky note |
| `figjam_create_stickies` | Batch sticky notes |
| `figjam_create_connector` | Connect nodes with labeled lines |
| `figjam_create_shape_with_text` | Diamond, ellipse, engineering shapes |
| `figjam_create_table` | Structured table with cell data |
| `figjam_create_code_block` | Code snippet block |
| `figjam_get_board_contents` | Read all board content |
| `figjam_get_connections` | Read connection graph |

### Slides (9 tools — via Bridge Plugin)

| Tool | Description |
|------|-------------|
| `figma_list_slides` | List all slides |
| `figma_get_slide_content` | Read slide content |
| `figma_create_slide` | Create new slide |
| `figma_duplicate_slide` | Copy existing slide |
| `figma_delete_slide` | Remove slide |
| `figma_reorder_slides` | Change slide order |
| `figma_add_text_to_slide` | Add text element |
| `figma_add_shape_to_slide` | Add shape element |
| `figma_set_slide_transition` | Set transition style + easing |

### Accessibility (5 tools — computed from design data)

| Tool | Description |
|------|-------------|
| `figma_a11y_lint` | WCAG design checks on node tree (contrast, text size, touch targets) |
| `figma_a11y_scorecard` | Component accessibility scorecard |
| `figma_a11y_color_blind_sim` | Simulate color blindness on extracted colors |
| `figma_a11y_contrast_check` | Check color pairs against AA/AAA |
| `figma_a11y_focus_order` | Validate tab/focus order from node tree |

### Visual Context (3 tools)

| Tool | Description |
|------|-------------|
| `figma_get_file_info` | File metadata (name, last modified, pages) |
| `figma_get_node` | Get specific node(s) by ID with full properties |
| `figma_export_image` | Render node(s) as PNG/SVG/JPG/PDF |

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
      creation.ts         # 12 node creation tools (via Bridge)
      figjam.ts           # 8 FigJam tools (via Bridge)
      slides.ts           # 9 slides tools (via Bridge)
      accessibility.ts    # 5 accessibility tools
      visual.ts           # 3 visual context tools
    figma/
      rest-api.ts         # Figma REST API client
      bridge.ts           # Desktop Bridge WebSocket server
    utils/
      export.ts           # Token export formatters (CSS, Tailwind, Sass, JSON)
      wcag.ts             # WCAG checking logic
  plugin/                 # Figma Desktop Bridge Plugin
    manifest.json
    code.ts               # Plugin main (connects to MCP server via WebSocket)
    ui.html               # Plugin UI (status display)
  package.json
  tsconfig.json
```

## Milestone Breakdown

| Milestone | Scope |
|-----------|-------|
| **M1** | Package scaffold, Figma REST API client, MCP server foundation, design system tools (8), visual tools (3) |
| **M2** | Desktop Bridge Plugin + WebSocket server, node creation tools (12) |
| **M3** | FigJam tools (8), Slides tools (9) |
| **M4** | Accessibility tools (5) |
| **M5** | 5 design phase skills + 4 bonus skills |
| **M6** | Documentation in apps/docs |

## Decisions

- No dependency on figma-console-mcp — all original code
- Desktop Bridge Plugin for write operations (Figma API limitation)
- 46 consolidated tools (vs figma-console-mcp's 94+ — we merge aliases and granular variants)
- MCP server publishable to npm as standalone tool
- Documentation included in apps/docs
