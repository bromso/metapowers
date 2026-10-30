# singularskills

Instructions for agents working on this repository. singularskills is one pack of Agent Skills for digital production work: 283 skills across 16 domains, ordered into gated workflows. Users install it with `npx skills add bromso/singularskills` (any agent) or as the `singularskills` Claude Code plugin; this file is about changing the pack, not using it.

## Layout

```
skills/<domain>-<skill>/     # the pack, flat: SKILL.md, scripts/gate.sh (when gated), references/
skills/workflow/             # the conductor skill: runs a workflow phase by phase
workflows/<name>.yml         # one workflow: phases, member skills, artifact, requires
references/<domain>/         # canonical reference docs shared by several skills of a domain
references/stacks/           # stack profiles (empty until project 2; see "Stack" below)
evals/<skill>/               # claude plugin eval cases: prompt.md, graders/, fixtures, scaffold
adapters/claude/             # generated: command wrappers, gates.json, gate-hook.sh, hooks.json
adapters/gemini/commands/    # generated: Gemini CLI command wrappers
.claude-plugin/              # the one Claude plugin manifest and its marketplace entry
packages/skill-validator/    # validates every SKILL.md (lint:skills)
packages/pack-tools/         # pack checks and generators (check:pack, gen-*)
apps/docs/                   # the docs site (Fumadocs + Next.js, static export)
scripts/                     # run-evals.sh, smoke-install.sh, check-rename.sh
docs/superpowers/            # specs and plans (history; not rewritten)
```

The domains are `accessibility`, `accounting`, `bookkeeping`, `branding`, `coaching`, `compliance`, `design`, `development`, `finance`, `leadership`, `legal`, `marketing`, `project-management`, `research`, `security` and `singular` (the cross-domain skills). A skill's folder name is `<domain>-<skill>` and equals its frontmatter `name`; it is invoked as `/<domain>-<skill>`.

## How a skill, a workflow file and a gate relate

- A **workflow file** (`workflows/design.yml`) lists phases. Each phase names its member `skills`, the `artifact` it writes (for example `02-define.md`) under `.singularskills/<folder>/<project>/`, and the artifacts it `requires` from earlier phases.
- A **skill** carries `metadata.workflow`, `metadata.phase` and `metadata.artifact` in its frontmatter, matching its workflow file. Its Prerequisites section tells the agent to run `scripts/gate.sh <project>` and to stop if it fails; the prose names the required files too, so the gate holds in agents that do not run scripts.
- A **gate** (`skills/<skill>/scripts/gate.sh`) is generated from the workflow file by `gen-gates`: it exits 1 naming each missing required artifact, else 0. In Claude Code, `adapters/claude/gate-hook.sh` (with `gates.json`, also generated) blocks the write itself. `--skip-checks` bypasses a gate and appends a `skipped` line to the run log, `.singularskills/log.jsonl`.
- The **conductor** (`skills/workflow`) reads the workflow file, runs each phase's members, and records `run-started` and `phase-approved` lines in the run log; a phase is complete only when approved. A member skill hands off to the conductor when you ask for the whole process rather than one step: its Prerequisites open with a generated handoff paragraph that checks the run log for an open run.

Edit the workflow file, never a generated gate or adapter, then regenerate.

## Checks

Run from the repository root:

```bash
bun install
bun run lint:skills    # skill-validator over every SKILL.md
bun run check:pack     # pack-tools: workflows, gen-gates/gen-references/gen-adapters --check, fixers --check, counts
bun run test           # Vitest in every package
bun run evals --dry    # list the eval cases; fails if a prompt names its own skill (spends nothing)
bun run check          # Biome (tabs, width 100)
```

`bun run evals` without `--dry` runs `claude plugin eval` and spends credits (capped by `EVALS_MAX_COST_USD`). `scripts/check-rename.sh` fails on any mention of the old project name outside the history allowlist.

Inside `claude plugin eval` runs the sandbox denies reads of the plugin's own files: skills cannot open their `references/`, and the conductor uses the workflows block built into its SKILL.md instead of the workflow files. Reported upstream; see the conductor handoff acceptance record for the issue link.

To regenerate after editing workflows, references or skill frontmatter, from `packages/pack-tools` (after `bun run build`): `bun run gen:gates`, `bun run gen:references`, `bun run gen:adapters`. For the docs site, from `apps/docs`: `bun run gen:data`.

## Stack

A project that uses the pack can describe its stack once, in a "Stack" section of its own `AGENTS.md`, so that skills which build, test or lint can use its commands instead of guessing. The section is one fenced block of `key: value` lines: `stack` names the language, framework and runtime; `test` and `lint` are the exact commands to run; `layout` says where source, tests and docs live. No skill reads it yet; this is the shape only.

```yaml
stack: TypeScript, Next.js 16, Bun 1.3
test: bun run test
lint: bun run check
layout: src/ for source, src/**/*.test.ts for tests, docs/ for documentation
```

Project 2 fills `references/stacks/`.
