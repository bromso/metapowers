# Metapowers Pivot — Architecture Design

**Date:** 2026-04-22
**Status:** Approved
**Repo:** bromso/metapowers (GitHub org, to be created)
**Replaces:** designpowers

## Overview

Metapowers is a Claude Code plugin marketplace that applies the "superpowers" metaprompting approach across digital production domains. Each domain (design, coding, research, marketing, etc.) is a self-contained plugin with domain-specific phases, skills, agents, and artifacts. The LLM drives the process by asking questions, and users select their context via namespaced commands (e.g., `/design:brainstorm`, `/coding:plan`).

M1 ships one domain (design) to prove the architecture. Additional domains are added collaboratively, each defining their own phase structure.

## Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Relationship to M1 | Start fresh, carry learnings | Scope changed fundamentally; architecture patterns proven |
| Phase model | Hybrid — some universal, some domain-specific | Universal phases would produce bad fits across domains |
| M1 scope | One domain (design) | Prove architecture before expanding |
| GitHub | `metapowers` org, `bromso/metapowers` repo | Clean org for marketplace distribution |
| Package manager | Bun + Turborepo | Bun for speed/install, Turbo for task caching |
| Testing | vitest | More mature assertion patterns than Bun's test runner |
| Plugin architecture | Domain-as-Plugin | Users install only domains they need |
| Core package | Deferred until second domain | YAGNI — extract when duplication appears |

## Repository Structure

```
metapowers/
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   └── design/
│       ├── .claude-plugin/plugin.json
│       ├── skills/
│       │   ├── empathize/SKILL.md
│       │   ├── define-component/SKILL.md
│       │   ├── prototype-in-figma/SKILL.md
│       │   └── test-component/SKILL.md
│       ├── agents/
│       │   └── component-ideator.md
│       ├── commands/
│       │   ├── design.md
│       │   ├── design-empathize.md
│       │   ├── design-define.md
│       │   ├── design-prototype.md
│       │   └── design-test.md
│       ├── hooks/
│       │   ├── hooks.json
│       │   └── check-define-exists.sh
│       ├── shared/
│       │   ├── wcag-criteria.md
│       │   └── component-contract-template.md
│       └── .mcp.json
├── packages/
│   ├── skill-validator/
│   │   └── src/
│   └── scoring-harness/
│       └── src/
├── fixtures/
│   └── design/
│       ├── button-brief.md
│       └── expected/
├── turbo.json
├── package.json
├── tsconfig.base.json
└── biome.json
```

## Design Domain Plugin

Five phases producing artifacts in `.design/<component-name>/`.

### Phase Flow

| # | Phase | Type | Output | Prerequisites |
|---|-------|------|--------|---------------|
| 1 | empathize | skill | `01-empathize.md` | none |
| 2 | define-component | skill | `02-define.md` | `01-empathize.md` |
| 3 | ideate-variations | agent (worktree) | `03-ideate.md` | `02-define.md` |
| 4 | prototype-in-figma | skill | `04-prototype.md` | `02-define.md` + `03-ideate.md` |
| 5 | test-component | skill | `05-test.md` | `04-prototype.md` |

### Commands

- `/design <component>` — orchestrator, runs all phases with pause points
- `/design:empathize <component>` — individual phase
- `/design:define <component>`
- `/design:prototype <component>`
- `/design:test <component>`

### Quality System

Three layers carried forward from designpowers:
1. **Soft gate** — skills check for prerequisite artifacts
2. **Hard gate** — PreToolUse hooks block Figma writes without `02-define.md`
3. **Scoring gate** — CI runs scoring harness on skill changes

### Artifact Directory

`.design/<component>/` — namespaced by run, committed to repo.

## Namespace & Tooling

### Package Scope

`@metapowers/` replaces `@designpowers/`:
- `@metapowers/skill-validator`
- `@metapowers/scoring-harness`

### GitHub

- Org: `metapowers`
- Repo: `bromso/metapowers`
- Remote: `https://github.com/bromso/metapowers.git`

### Package Manager

Bun replaces pnpm:
- `bun.lock` replaces `pnpm-lock.yaml`
- Root `package.json` uses `"workspaces"` field
- Turborepo still orchestrates task pipelines and caching
- vitest for testing

### Marketplace

```json
{
  "name": "metapowers",
  "owner": { "name": "Jonas Broms" },
  "plugins": [
    {
      "name": "design",
      "source": "./plugins/design",
      "description": "Five-phase design thinking process for component design, writing to Figma canvas via MCP"
    }
  ]
}
```

Install: `/plugin marketplace add bromso/metapowers` then `/plugin install design@metapowers`

## What Gets Deleted from designpowers

- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `plugins/double-diamond/` (deferred to own domain plugin)
- `plugins/design-thinking/` (replaced by `plugins/design/`)

## What Gets Renamed

- `@designpowers/*` → `@metapowers/*` in all package.json files
- `designpowers` → `metapowers` in marketplace.json, plugin.json
- `bromso/designpowers` → `bromso/metapowers` in repository URLs
- `.dt/` → `.design/` in SKILL.md, hooks, and docs
- `plugins/design-thinking/` → `plugins/design/`

## Future Domain Pattern

When adding domains, each follows:

```
plugins/<domain>/
├── .claude-plugin/plugin.json
├── skills/
├── agents/
├── commands/
├── hooks/
└── shared/
```

Conventions:
- Artifacts in `.<domain-name>/`
- Commands namespaced: `/<domain>:<phase>`
- Phases defined collaboratively per domain
- Fixtures under `fixtures/<domain>/`
- `@metapowers/core` extracted when second domain reveals shared patterns

## Implementation Scope

**M1:** Fresh repo under `bromso/metapowers`. Scaffold with Bun + Turbo. Port skill-validator and scoring-harness under `@metapowers/`. Port design plugin with renamed artifacts/commands. One golden fixture, passing tests, passing skill validation.

This is a port-and-rename, not a rewrite of the TypeScript packages. The skill-validator and scoring-harness logic is proven — just repackage under the new scope.
