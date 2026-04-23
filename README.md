# Metapowers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3-fbf0df?logo=bun&logoColor=000)](https://bun.sh)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.4-EF4444?logo=turborepo&logoColor=white)](https://turbo.build)
[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)](https://react.dev)
[![Biome](https://img.shields.io/badge/Biome-1.9-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev)
[![Vitest](https://img.shields.io/badge/Vitest-3.2-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![Fumadocs](https://img.shields.io/badge/Fumadocs-16-F5A623)](https://fumadocs.vercel.app)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Plugin-CC785C?logo=anthropic&logoColor=white)](https://claude.ai/code)
[![Figma MCP](https://img.shields.io/badge/Figma-MCP_Server-F24E1E?logo=figma&logoColor=white)](https://www.figma.com)

Structured, repeatable workflows for digital production domains in [Claude Code](https://claude.ai/code).

## What is Metapowers?

Metapowers is a collection of Claude Code plugins that bring structured, repeatable workflows to digital production domains. Each plugin adds a set of slash commands that guide you through a proven methodology.

The first plugin — **Design** — implements a five-phase design thinking process for building UI components, writing artifacts to Figma via MCP.

## Quick Start

Install the metapowers marketplace in Claude Code:

```bash
claude install bromso/metapowers
```

Then start a design workflow:

```
/design:empathize button
```

This kicks off the empathize phase for a "button" component, creating research artifacts in `.design/button/`.

## How It Works

Each domain plugin provides:

- **Phases** — ordered steps in a methodology (e.g., empathize → define → ideate → prototype → test)
- **Skills** — slash commands that execute each phase with structured prompts
- **Quality gates** — checks that enforce phase ordering and artifact completeness
- **Artifacts** — markdown files generated at each phase, stored in a domain-specific directory

## Documentation

Full documentation is available at the [Metapowers Docs](https://bromso.github.io/metapowers/docs/overview).

## Project Structure

```
metapowers/
├── apps/
│   └── docs/              # Documentation site (Fumadocs + Next.js)
├── packages/
│   ├── figma-mcp/         # Figma MCP server for design integration
│   ├── scoring-harness/   # Skill output scoring
│   └── skill-validator/   # Skill validation utilities
├── plugins/
│   └── design/            # Design thinking plugin (5 phases)
└── docs/
    └── plans/             # Design and implementation plans
```

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.3
- [Claude Code](https://claude.ai/code) CLI

### Setup

```bash
git clone https://github.com/bromso/metapowers.git
cd metapowers
bun install
```

### Commands

```bash
bun run build        # Build all packages
bun run test         # Run all tests
bun run lint         # Lint all packages
bun run check        # Biome check
bun run format       # Biome format
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and how to submit changes.

## License

[MIT](LICENSE) — Jonas Broms
