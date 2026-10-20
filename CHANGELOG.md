# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Design plugin with five-phase design thinking workflow
- Figma MCP server for design integration
- Documentation site with domain-based navigation
- Scoring harness for skill output quality
- Skill validator for plugin validation

### Marketplace 0.3.0

- All 283 skills carry `name`, `argument-hint` and `disable-model-invocation` frontmatter; the skill-validator enforces the description shape. `find-skill`, `create-skill`, `improve-skill` and `init` are now invoked only by the user typing them (`disable-model-invocation: true`).
- All 283 skill descriptions rewritten trigger-style ("… Use when …"), with "Not for …; see /x:y" disambiguation on every colliding or overlapping skill.
- Finance, accounting, bookkeeping, compliance and security skills end their artifact output with a disclaimer; the 33 money skills also carry "Compute with code" — both validator-enforced.
- Content fixes: `finance/ratios` formulas (DIO, EBIT interest coverage), the overall compliance score formula in ~21 skills, removed legal artifact frontmatter, and coaching wording corrections.
- `create-skill`, `improve-skill` and `find-skill` install to `.claude/skills/<name>/`; `find-skill` reviews a downloaded skill before installing it.
- Migrating from 0.2.0: skills created with `create-skill` or `find-skill` under 0.2.0 live in `.metapowers/plugins/custom/skills/<name>/`, which Claude Code never loads — move each to `.claude/skills/<name>/SKILL.md`.
- See-also cross-references added between overlapping skills.
- Docs pages added for the four design utility skills, plus a new evals overview page.
- The design plugin's Figma access token moves from the `FIGMA_ACCESS_TOKEN` environment variable to plugin `userConfig` (keychain-backed). Claude Code asks for the Figma access token when you enable the design plugin; you can set or change it later from the plugin's configuration in the `/plugin` menu. The `FIGMA_ACCESS_TOKEN` environment variable is no longer used.
- `claude plugin eval` suites added for all 16 plugins, run via `bun run evals` (`--dry`, `--report`, `EVALS_ALLOW_BASH`, `EVALS_MAX_COST_USD`); `packages/scoring-harness` removed.
- First eval run recorded: all 16 cases route to their skill; results and caveats in `docs/superpowers/plans/2026-10-20-skill-quality-acceptance.md`.

### Marketplace 0.2.0

- Plugin manifests pass `claude plugin validate --strict`
- Skills reference shared files via `${CLAUDE_PLUGIN_ROOT}` so templates load when installed
- figma-mcp launches via `npx @metapowers/figma-mcp`; five phantom MCP configs removed
- Shared phase files are appended per skill section instead of overwritten
- `--skip-checks` never lands in generated paths
- Project management artifacts live under `.metapowers/project-management/`. Migrating from 0.1.0: `mkdir -p .metapowers/project-management && mv .project/* .metapowers/project-management/`
- Broken `/plugin:skill` references fixed and the domain registry completed (security, compliance, bookkeeping, accounting, finance)
- Table-driven phase-gate hooks generated from each skill's Prerequisites
- Install docs corrected to match the real phase-gate mechanism
- `create-metapowers` hands Claude Code installs to the plugin marketplace
- Skill counts checked in CI and corrected everywhere
- CI runs `claude plugin validate --strict`, the skill-validator plugin-level rules, and the plugin-tools `--check` commands
