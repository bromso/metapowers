# Metapowers

[![npm version](https://img.shields.io/npm/v/create-metapowers.svg)](https://www.npmjs.com/package/create-metapowers)
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
[![Codex CLI](https://img.shields.io/badge/Codex_CLI-Compatible-10A37F?logo=openai&logoColor=white)](https://github.com/openai/codex)
[![OpenCode](https://img.shields.io/badge/OpenCode-Compatible-6366F1)](https://opencode.ai)
[![Cursor](https://img.shields.io/badge/Cursor-Compatible-000?logo=cursor&logoColor=white)](https://cursor.com)
[![Figma MCP](https://img.shields.io/badge/Figma-MCP_Server-F24E1E?logo=figma&logoColor=white)](https://www.figma.com)

Structured, repeatable workflows for digital production domains. **275+ skills across 16 domains** — powered by proven methodologies. Works with any AI coding assistant — Claude Code, Codex CLI, OpenCode, Cursor, and more.

## Quick Start

```bash
npx create-metapowers
```

Or install everything at once:

```bash
npx create-metapowers --all
```

Then try a skill:

```
/design:empathize button
/research:discover user-onboarding
/development:plan auth-system
```

## Domains

| Domain | Methodology | Skills | Description |
|--------|-------------|--------|-------------|
| [Design](https://bromso.github.io/metapowers/docs/design) | Design Thinking | 9 | Component design with Figma MCP integration |
| [Research](https://bromso.github.io/metapowers/docs/research) | Double Diamond | 4 | Structured discovery and validation |
| [Development](https://bromso.github.io/metapowers/docs/development) | Dev Workflow | 6 | Plan, build, test, debug, review, ship |
| [Marketing](https://bromso.github.io/metapowers/docs/marketing) | RACE Framework | 33 | Full growth marketing lifecycle |
| [Branding](https://bromso.github.io/metapowers/docs/branding) | Brand Lifecycle | 6 | Brand creation and compliance auditing |
| [Accessibility](https://bromso.github.io/metapowers/docs/accessibility) | WCAG-EM | 6 | Accessibility audit and remediation |
| [Project Management](https://bromso.github.io/metapowers/docs/project-management) | Scrum | 32 | Sprint-based project management |
| [Coaching](https://bromso.github.io/metapowers/docs/coaching) | Domain Coaching | 5 | Expert feedback across 5 disciplines |
| [Leadership](https://bromso.github.io/metapowers/docs/leadership) | Leadership Dev | 12 | Team building and management tools |
| [Legal](https://bromso.github.io/metapowers/docs/legal) | Legal Lifecycle | 35 | Contracts, compliance, governance |
| [Security](https://bromso.github.io/metapowers/docs/security) | NIST CSF 2.0 | 39 | Cybersecurity framework |
| [Compliance](https://bromso.github.io/metapowers/docs/compliance) | GRC Lifecycle | 48 | 30+ regulatory frameworks |
| [Bookkeeping](https://bromso.github.io/metapowers/docs/bookkeeping) | Bookkeeping Cycle | 9 | Transaction recording and reporting |
| [Accounting](https://bromso.github.io/metapowers/docs/accounting) | Accounting Cycle | 13 | Full 8-phase accounting cycle |
| [Finance](https://bromso.github.io/metapowers/docs/finance) | FP&A | 11 | Financial planning and analysis |
| [Metapowers](https://bromso.github.io/metapowers/docs/overview) | Cross-domain | 7 | Status, init, report, workflow, detect, find, create |

## How It Works

Each domain provides:

- **Phases** — ordered steps in a proven methodology
- **Skills** — slash commands that guide you through each phase
- **Quality gates** — checks that enforce phase ordering
- **Artifacts** — structured output stored in `.metapowers/<domain>/`

## Cross-Domain Features

```bash
/metapowers:detect                    # Scan project tech stack, suggest skills
/metapowers:find-skill <topic>        # Search skill marketplaces
/metapowers:create-skill <topic>      # Create a custom skill
/metapowers:improve-skill <name>      # Refine based on feedback
/metapowers:workflow launch-product   # 23-step cross-domain workflow
/metapowers:status                    # View all projects across domains
/metapowers:report                    # Cross-domain summary report
```

## Compatibility

| Tool | Status | How It Works |
|------|--------|--------------|
| [Claude Code](https://claude.ai/code) | Native | `claude install bromso/metapowers` |
| [Codex CLI](https://github.com/openai/codex) | Compatible | `AGENTS.md` auto-loaded |
| [OpenCode](https://opencode.ai) | Compatible | `AGENTS.md` auto-loaded |
| [Cursor](https://cursor.com) | Compatible | `.cursorrules` auto-loaded |

## Documentation

Full documentation: **[bromso.github.io/metapowers](https://bromso.github.io/metapowers/)**

## Project Structure

```
metapowers/
├── apps/docs/                 # Documentation site (Fumadocs + Next.js)
├── packages/
│   ├── create-metapowers/     # CLI — npx create-metapowers
│   ├── figma-mcp/             # Figma MCP server
│   ├── scoring-harness/       # Skill output scoring
│   └── skill-validator/       # SKILL.md validation
├── plugins/                   # 16 domain plugins with 275+ skills
└── docs/plans/                # Design and implementation plans
```

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.3
- One of: Claude Code, Codex CLI, OpenCode, Cursor, or any SKILL.md-compatible assistant

### Setup

```bash
git clone https://github.com/bromso/metapowers.git
cd metapowers
bun install
```

### Commands

```bash
bun run build          # Build all packages
bun run test           # Run all tests
bun run lint:skills    # Validate all 275+ SKILL.md files
bun run check          # Biome check
bun run format         # Biome format
bun run changeset      # Create a changeset for releasing
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

[MIT](LICENSE) — Jonas Broms
