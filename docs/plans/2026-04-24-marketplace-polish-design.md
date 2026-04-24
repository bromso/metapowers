# Claude Code Marketplace Polish Design

**Date:** 2026-04-24
**Status:** Approved

## Goal

Polish the Claude Code marketplace distribution so the plugin is ready for users to install via `/plugin marketplace add bromso/metapowers`.

## Changes

### 1. Fix design plugin repository URL

`plugins/design/.claude-plugin/plugin.json` has `"repository": "https://github.com/metapowers/metapowers"` — change to `"https://github.com/bromso/metapowers"`.

### 2. Add missing fields to all 16 plugin.json files

Add to each:
- `"homepage": "https://bromso.github.io/metapowers/"`
- `"keywords"` — mirror from marketplace.json entries

### 3. Add missing fields to marketplace.json plugin entries

Add to each plugin entry:
- `"homepage": "https://bromso.github.io/metapowers/"`
- `"license": "MIT"`
- `"repository": "https://github.com/bromso/metapowers"`

### 4. Keep version strategy

Keep explicit `"version": "0.1.0"` — bump manually on releases since this is a monorepo.

### 5. Validate

Run `claude plugin validate .` to catch remaining issues.

## Out of Scope

- Multi-LLM marketplace distribution (future work)
- Third-party directory listings (future work)
- Version bumps (keep at 0.1.0 for now)
