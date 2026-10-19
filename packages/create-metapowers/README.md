# create-metapowers

[![npm version](https://img.shields.io/npm/v/create-metapowers.svg)](https://www.npmjs.com/package/create-metapowers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Set up [Metapowers](https://bromso.github.io/metapowers/) skills in any project. Structured workflows for digital production domains — powered by proven methodologies.

## Quick Start

```bash
npx create-metapowers
```

Pick your tool, or pass it directly:

```bash
npx create-metapowers --tool claude --all     # prints the /plugin commands for Claude Code
npx create-metapowers --tool codex --all      # or opencode, cursor
```

## What It Does

- **Claude Code**: prints (and, if `claude` is on your PATH, offers to run) the marketplace commands:
  `/plugin marketplace add bromso/metapowers` followed by `/plugin install <domain>@metapowers` for each selected domain. No files are copied.
- **Codex CLI / OpenCode**: copies the selected domains to `.metapowers/plugins/<domain>/` and creates `AGENTS.md`.
- **Cursor**: copies the selected domains to `.cursor/skills/metapowers/<domain>/` and creates `.cursorrules`.

For the file-copy tools, `${CLAUDE_PLUGIN_ROOT}` references in skills and hooks are rewritten to the installed directory, and `.metapowers/config.json` records the domains and the CLI version.

## Available Domains

All 16 domains; see the [docs site](https://bromso.github.io/metapowers/) for the current list and skill counts.

## Compatibility

| Tool | How It Works |
|------|--------------|
| [Claude Code](https://claude.ai/code) | Hands off to `/plugin marketplace add bromso/metapowers` |
| [Codex CLI](https://github.com/openai/codex) | Skills in `.metapowers/plugins/`, `AGENTS.md` auto-loaded |
| [OpenCode](https://opencode.ai) | Skills in `.metapowers/plugins/`, `AGENTS.md` auto-loaded |
| [Cursor](https://cursor.com) | Skills in `.cursor/skills/metapowers/`, `.cursorrules` auto-loaded |

## After Installation

Try a skill:

```
/design:define-component button
/research:discover user-onboarding
/development:plan auth-system
/coaching:code src/auth/
/metapowers:detect
```

## Adaptive Skills

Metapowers can detect your tech stack and create custom skills:

```
/metapowers:detect                              # Scan project tech stack
/metapowers:find-skill flutter widget testing    # Search skill marketplaces
/metapowers:create-skill dart code patterns      # Create a custom skill
/metapowers:improve-skill flutter-testing        # Refine based on feedback
```

## Cross-Domain Workflows

Pre-built workflow templates chain multiple domains:

```
/metapowers:workflow launch-product      # 23 steps across 6 domains
/metapowers:workflow build-feature       # 9 steps
/metapowers:workflow rebrand             # 11 steps
/metapowers:workflow compliance-audit    # 13 steps
```

## Documentation

Full documentation: [bromso.github.io/metapowers](https://bromso.github.io/metapowers/)

## License

[MIT](https://github.com/bromso/metapowers/blob/main/LICENSE) — Jonas Broms
