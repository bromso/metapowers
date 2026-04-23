# Metapowers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Structured, repeatable workflows for digital production domains in [Claude Code](https://claude.ai/code).

## What is Metapowers?

Metapowers is a collection of Claude Code plugins that bring structured, repeatable workflows to digital production domains. Each plugin adds a set of slash commands that guide you through a proven methodology.

The first plugin — **Design** — implements a five-phase design thinking process for building UI components, writing artifacts to Figma via MCP.

## Quick Start

Install the metapowers marketplace in Claude Code:

```bash
claude install metapowers/metapowers
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
