# create-metapowers

[![npm version](https://img.shields.io/npm/v/create-metapowers.svg)](https://www.npmjs.com/package/create-metapowers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Set up [Metapowers](https://bromso.github.io/metapowers/) skills in any project. Structured workflows for digital production domains — powered by proven methodologies.

## Quick Start

```bash
npx create-metapowers
```

Or install everything at once:

```bash
npx create-metapowers --all
```

## What It Does

1. Creates a `.metapowers/` directory in your project
2. Lets you choose which domains to install
3. Copies skill files for your selected domains
4. Sets up `AGENTS.md` (Codex CLI, OpenCode) and `.cursorrules` (Cursor) for multi-tool compatibility

## Available Domains

| Domain | Methodology | Skills |
|--------|-------------|--------|
| **Design** | Design Thinking | 9 skills |
| **Research** | Double Diamond | 4 skills |
| **Development** | Plan-Build-Test-Ship | 6 skills |
| **Marketing** | RACE Framework | 33 skills |
| **Branding** | Brand Identity Process | 6 skills |
| **Accessibility** | WCAG-EM | 6 skills |
| **Project Management** | Scrum | 32 skills |
| **Coaching** | Domain Mentorship | 5 skills |
| **Leadership** | Leadership Development | 12 skills |
| **Legal** | Legal Lifecycle | 35 skills |
| **Security** | NIST CSF 2.0 | 39 skills |
| **Compliance** | GRC Lifecycle | 48 skills |
| **Bookkeeping** | Bookkeeping Cycle | 9 skills |
| **Accounting** | Accounting Cycle | 13 skills |
| **Finance** | FP&A Process | 11 skills |
| **Metapowers** | Cross-domain meta-skills | 7 skills |

**Total: 275+ skills across 16 domains.**

## Compatibility

| Tool | Status | How It Works |
|------|--------|--------------|
| [Claude Code](https://claude.ai/code) | Native | Skills loaded from `.metapowers/plugins/` |
| [Codex CLI](https://github.com/openai/codex) | Compatible | `AGENTS.md` auto-loaded |
| [OpenCode](https://opencode.ai) | Compatible | `AGENTS.md` auto-loaded |
| [Cursor](https://cursor.com) | Compatible | `.cursorrules` auto-loaded |

## After Installation

Try a skill:

```
/design:empathize button
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
