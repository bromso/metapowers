# Figma MCP Server — Milestone 3 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add FigJam tools (8) and Slides tools (9) to `@metapowers/figma-mcp`, with corresponding command handlers in the Bridge Plugin.

**Architecture:** Same bridge pattern as M2 — MCP tools call `bridge.sendCommand()`, which sends over WebSocket to the Figma plugin's code.js. New tool files register on the server, new command handlers added to plugin/code.js.

**Tech Stack:** TypeScript, Figma Plugin API (FigJam + Slides), Vitest

---

### Task 1: Add FigJam command handlers to Bridge Plugin

**Files:**
- Modify: `packages/figma-mcp/plugin/code.js`

Add these cases to the switch statement in `figma.ui.onmessage`:

- `FIGJAM_CREATE_STICKY` — `figma.createSticky()`, load font, set text, position, color
- `FIGJAM_CREATE_STICKIES` — batch create multiple stickies from an array
- `FIGJAM_CREATE_CONNECTOR` — `figma.createConnector()`, set start/end endpoints by node ID
- `FIGJAM_CREATE_SHAPE_WITH_TEXT` — `figma.createShapeWithText()`, set shape type and text
- `FIGJAM_CREATE_TABLE` — `figma.createTable(rows, cols)`, populate cells
- `FIGJAM_CREATE_CODE_BLOCK` — `figma.createCodeBlock()`, set code text
- `FIGJAM_GET_BOARD_CONTENTS` — read `figma.currentPage.children` and return node info
- `FIGJAM_GET_CONNECTIONS` — find all ConnectorNodes and return their endpoints

Commit: `feat(figma-mcp): add FigJam command handlers to Bridge Plugin`

---

### Task 2: Register FigJam MCP tools

**Files:**
- Create: `packages/figma-mcp/src/tools/figjam.ts`
- Create: `packages/figma-mcp/src/tools/figjam.test.ts`
- Modify: `packages/figma-mcp/src/server.ts` — import and call `registerFigJamTools`

Register 8 tools that call `bridge.sendCommand()`:

1. `figjam_create_sticky` — Input: `text`, `color?`, `x?`, `y?`
2. `figjam_create_stickies` — Input: `stickies` (array of {text, color?, x?, y?})
3. `figjam_create_connector` — Input: `startNodeId`, `endNodeId`, `label?`
4. `figjam_create_shape_with_text` — Input: `shapeType` (DIAMOND|ELLIPSE|ROUNDED_RECTANGLE|TRIANGLE_UP|TRIANGLE_DOWN), `text`, `x?`, `y?`
5. `figjam_create_table` — Input: `rows` (number), `columns` (number), `data?` (string[][])
6. `figjam_create_code_block` — Input: `code` (string), `x?`, `y?`
7. `figjam_get_board_contents` — Input: (none, reads current page)
8. `figjam_get_connections` — Input: (none, finds all connectors)

Commit: `feat(figma-mcp): add 8 FigJam tools`

---

### Task 3: Add Slides command handlers to Bridge Plugin

**Files:**
- Modify: `packages/figma-mcp/plugin/code.js`

Add these cases:

- `FIGMA_LIST_SLIDES` — iterate `figma.currentPage.children`, filter SlideNodes, return list
- `FIGMA_GET_SLIDE_CONTENT` — find slide by ID, return its children info
- `FIGMA_CREATE_SLIDE` — `figma.createSlide()`, set name
- `FIGMA_DUPLICATE_SLIDE` — find slide, clone it
- `FIGMA_DELETE_SLIDE` — find slide, remove it
- `FIGMA_REORDER_SLIDES` — reorder children in parent
- `FIGMA_ADD_TEXT_TO_SLIDE` — find slide, create text node as child
- `FIGMA_ADD_SHAPE_TO_SLIDE` — find slide, create shape as child
- `FIGMA_SET_SLIDE_TRANSITION` — call `slide.setSlideTransition()`

Commit: `feat(figma-mcp): add Slides command handlers to Bridge Plugin`

---

### Task 4: Register Slides MCP tools

**Files:**
- Create: `packages/figma-mcp/src/tools/slides.ts`
- Create: `packages/figma-mcp/src/tools/slides.test.ts`
- Modify: `packages/figma-mcp/src/server.ts` — import and call `registerSlidesTools`

Register 9 tools:

1. `figma_list_slides` — Input: (none)
2. `figma_get_slide_content` — Input: `slideId` (string)
3. `figma_create_slide` — Input: `name?`
4. `figma_duplicate_slide` — Input: `slideId`
5. `figma_delete_slide` — Input: `slideId`. `destructiveHint: true`
6. `figma_reorder_slides` — Input: `slideIds` (string[] in desired order)
7. `figma_add_text_to_slide` — Input: `slideId`, `text`, `x?`, `y?`, `fontSize?`
8. `figma_add_shape_to_slide` — Input: `slideId`, `type` (RECTANGLE|ELLIPSE), `width?`, `height?`, `x?`, `y?`, `fills?`
9. `figma_set_slide_transition` — Input: `slideId`, `style` (DISSOLVE|SLIDE_FROM_LEFT|SLIDE_FROM_RIGHT|PUSH_FROM_LEFT|SMART_ANIMATE|NONE), `duration?` (number), `curve?` (string)

Commit: `feat(figma-mcp): add 9 Slides tools`

---

### Task 5: Build and verify

Build, run tests, verify server starts. Push.

---

## Summary

| Task | Commit |
|------|--------|
| 1 | `feat(figma-mcp): add FigJam command handlers to Bridge Plugin` |
| 2 | `feat(figma-mcp): add 8 FigJam tools` |
| 3 | `feat(figma-mcp): add Slides command handlers to Bridge Plugin` |
| 4 | `feat(figma-mcp): add 9 Slides tools` |
| 5 | fix commit if needed |

## What Comes Next

- **M4:** Accessibility tools (5)
- **M5:** Design phase skills + bonus skills
- **M6:** Documentation
