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
