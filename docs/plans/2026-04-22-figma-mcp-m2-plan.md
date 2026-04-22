# Figma MCP Server — Milestone 2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the Desktop Bridge Plugin and WebSocket server to `@metapowers/figma-mcp`, then implement 12 node creation/manipulation tools that execute via the bridge.

**Architecture:** The MCP server starts a WebSocket server on localhost. A Figma plugin (running inside Figma Desktop) connects to it. When Claude calls a write tool, the MCP server sends a command over WebSocket to the plugin's ui.html, which relays it to code.js via postMessage. code.js executes the Figma Plugin API call and sends the result back.

**Tech Stack:** TypeScript, WebSocket (Node.js `ws` package), Figma Plugin API, Vitest

---

### Task 1: Add `ws` dependency and WebSocket bridge server

**Files:**
- Modify: `packages/figma-mcp/package.json` — add `ws` and `@types/ws`
- Create: `packages/figma-mcp/src/figma/bridge.ts`
- Create: `packages/figma-mcp/src/figma/bridge.test.ts`

**Step 1: Add ws dependency**

In `packages/figma-mcp/package.json`, add `"ws": "^8.18.0"` to dependencies and `"@types/ws": "^8.5.0"` to devDependencies. Run `bun install` from monorepo root.

**Step 2: Write the bridge test**

Test that:
- FigmaBridge starts WebSocket server on a specified port
- Reports `isConnected: false` when no plugin connected
- `execute()` rejects with "No Figma plugin connected" when no plugin connected

**Step 3: Write `bridge.ts`**

A `FigmaBridge` class:
- Constructor takes `{ port?, timeout? }` options
- `start()` creates a `WebSocketServer` and listens for connections
- `isConnected` getter checks if a client WebSocket is open
- `execute(code)` sends `{ id, method: "EXECUTE_CODE", params: { code } }` over WebSocket, returns a Promise that resolves when the plugin responds with the matching `id`
- `sendCommand(method, params)` sends `{ id, method, params }` over WebSocket
- `close()` cleans up all pending requests and closes the server
- Uses request ID correlation with timeout (15s default)

**Step 4: Run tests, commit**

```bash
git commit -m "feat(figma-mcp): add WebSocket bridge server for Figma plugin communication"
```

---

### Task 2: Create the Figma Desktop Bridge Plugin

**Files:**
- Create: `packages/figma-mcp/plugin/manifest.json`
- Create: `packages/figma-mcp/plugin/code.js`
- Create: `packages/figma-mcp/plugin/ui.html`

**Step 1: Create `plugin/manifest.json`**

Figma plugin manifest with:
- `editorType: ["figma", "figjam", "slides"]`
- `networkAccess.allowedDomains` for `ws://localhost:9000` through `9004`
- `documentAccess: "dynamic-page"`

**Step 2: Create `plugin/code.js`**

Plugin sandbox code that receives commands from UI and executes Figma Plugin API:

Command handlers via switch statement:
- `CREATE_FRAME` — `figma.createFrame()` with name, size, position, fills
- `CREATE_COMPONENT` — `figma.createComponent()` with name, size, position
- `CREATE_INSTANCE` — find component by ID, call `.createInstance()`
- `CREATE_TEXT` — `figma.createText()` with font loading, text content, styling
- `CREATE_SHAPE` — create RECTANGLE/ELLIPSE/POLYGON/STAR/LINE
- `MODIFY_NODE` — find node by ID, apply property changes
- `DELETE_NODE` — find node by ID, call `.remove()`
- `ARRANGE_COMPONENT_SET` — `figma.combineAsVariants()`
- `GROUP_NODES` — `figma.group()`
- `SET_AUTO_LAYOUT` — set `layoutMode`, spacing, padding
- `APPLY_STYLES` — set fills, strokes, effects, opacity, cornerRadius
- `GET_SELECTION` — return `figma.currentPage.selection` info
- `GET_CURRENT_PAGE` — return current page info
- `EXECUTE_CODE` — evaluate Plugin API code dynamically

Uses `safeClone()` to strip Symbols before serialization. Communication via `figma.ui.postMessage()` / `figma.ui.onmessage`.

**Step 3: Create `plugin/ui.html`**

Bridge UI that:
- Scans ports 9000-9004 for the MCP server's WebSocket
- Auto-reconnects on disconnect (3s delay)
- Relays WebSocket messages to plugin code via `parent.postMessage({ pluginMessage: ... })`
- Relays plugin results back over WebSocket
- Shows connection status (green dot = connected, red = disconnected, yellow = connecting)
- Displays a log of recent messages

**Step 4: Commit**

```bash
git commit -m "feat(figma-mcp): add Figma Desktop Bridge Plugin"
```

---

### Task 3: Wire bridge into the MCP server

**Files:**
- Modify: `packages/figma-mcp/src/server.ts`
- Modify: `packages/figma-mcp/src/index.ts`
- Modify: `packages/figma-mcp/src/server.test.ts`
- Create: `packages/figma-mcp/src/tools/creation.ts` (stub)

**Step 1: Update server.ts**

Change `createFigmaServer` to accept `{ token, bridgePort? }` options and return `{ server, bridge }`. Create FigmaBridge, pass it to `registerCreationTools`.

**Step 2: Update index.ts**

Start the bridge before connecting the MCP server. Log the bridge port to stderr.

**Step 3: Create creation.ts stub**

Empty `registerCreationTools` function.

**Step 4: Update server.test.ts**

Update to use new `{ token, bridgePort }` options and close bridge after test.

**Step 5: Run tests, commit**

```bash
git commit -m "feat(figma-mcp): wire bridge into MCP server with creation tools stub"
```

---

### Task 4: Node creation and manipulation tools (12 tools)

**Files:**
- Modify: `packages/figma-mcp/src/tools/creation.ts` (replace stub)
- Create: `packages/figma-mcp/src/tools/creation.test.ts`

**Step 1: Register 12 MCP tools**

Each tool calls `bridge.sendCommand(method, params)`. Use zod for input schemas.

1. **`figma_execute`** — Run Plugin API code. Input: `code` (string).
2. **`figma_create_frame`** — Input: `name?`, `width?`, `height?`, `x?`, `y?`, `fills?`
3. **`figma_create_component`** — Input: `name?`, `width?`, `height?`, `x?`, `y?`, `fills?`
4. **`figma_create_instance`** — Input: `componentId`, `x?`, `y?`
5. **`figma_create_text`** — Input: `text`, `name?`, `fontSize?`, `fontFamily?`, `fontStyle?`, `x?`, `y?`, `fills?`
6. **`figma_create_shape`** — Input: `type` (RECTANGLE|ELLIPSE|POLYGON|STAR|LINE), `name?`, `width?`, `height?`, `x?`, `y?`, `fills?`, `cornerRadius?`
7. **`figma_modify_node`** — Input: `nodeId`, `properties` (object)
8. **`figma_delete_node`** — Input: `nodeId`. `destructiveHint: true`.
9. **`figma_arrange_component_set`** — Input: `componentIds` (string[]), `name?`
10. **`figma_group_nodes`** — Input: `nodeIds` (string[]), `name?`
11. **`figma_set_auto_layout`** — Input: `nodeId`, `direction`, `spacing?`, `paddingHorizontal?`, `paddingVertical?`
12. **`figma_apply_styles`** — Input: `nodeId`, `fills?`, `strokes?`, `strokeWeight?`, `effects?`, `opacity?`, `cornerRadius?`

**Step 2: Run tests, commit**

```bash
git commit -m "feat(figma-mcp): add 12 node creation and manipulation tools via bridge"
```

---

### Task 5: Build and verify

**Step 1:** `NODE_OPTIONS="--max-old-space-size=8192" bun run build`

**Step 2:** `bun vitest run` — all tests pass

**Step 3:** Verify server starts: `FIGMA_ACCESS_TOKEN=test node dist/index.js` should print bridge port

**Step 4:** Commit any fixes

---

## Summary

| Task | Description | Commit |
|------|-------------|--------|
| 1 | WebSocket bridge server | `feat(figma-mcp): add WebSocket bridge server` |
| 2 | Figma Desktop Bridge Plugin | `feat(figma-mcp): add Figma Desktop Bridge Plugin` |
| 3 | Wire bridge into server | `feat(figma-mcp): wire bridge into MCP server` |
| 4 | 12 creation tools | `feat(figma-mcp): add 12 node creation tools via bridge` |
| 5 | Build and verify | fix commit if needed |

## What Comes Next

- **M3:** FigJam tools (8) + Slides tools (9)
- **M4:** Accessibility tools (5)
- **M5:** 5 design phase skills + 4 bonus skills
- **M6:** Documentation in apps/docs
