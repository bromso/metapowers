# @metapowers/figma-mcp

An MCP server that lets Claude Code read and write Figma files. It combines the Figma REST API (for reading files, styles, and components) with a WebSocket bridge to a companion Figma plugin (in `plugin/`) for operations the REST API can't do, such as creating nodes, FigJam content, slides, and accessibility fixes directly on the canvas.

## Usage

Launch it with `npx` from a plugin's `.mcp.json`, matching `plugins/design/.mcp.json`:

```json
{
	"mcpServers": {
		"metapowers-figma": {
			"command": "npx",
			"args": ["-y", "@metapowers/figma-mcp@<version>"],
			"env": { "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}" }
		}
	}
}
```

Environment variables:

- `FIGMA_ACCESS_TOKEN` (required) — a Figma personal access token with REST API access.
- `FIGMA_BRIDGE_PORT` (optional, default `9000`) — the port the WebSocket bridge listens on for the companion Figma plugin.

## Development

```bash
bun install
bun run build
bun run test
```

## License

MIT
