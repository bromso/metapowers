# Design

Five-phase design thinking process for component design, writing to Figma canvas via MCP: empathize, define-component, ideate, prototype, and test, plus a11y-audit, design-review, export-tokens, and system-overview.

## Figma MCP

Figma MCP is launched with `npx -y @metapowers/figma-mcp` and requires a Figma personal access token with file read/write scopes. Set the token with `/plugin config design@metapowers` or at install; the environment variable is no longer used.

## Status

Until `@metapowers/figma-mcp` is on npm the 9 Figma-dependent skills (define-component, empathize, design-review, a11y-audit, ideate, prototype, export-tokens, system-overview, test) cannot write to Figma.
