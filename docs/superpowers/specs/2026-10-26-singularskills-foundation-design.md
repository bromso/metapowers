# Singularskills: Foundation (design)

Project 1 of 3. Projects 2 ("Stack and memory") and 3 ("Design without a bundled server") follow; this document names the seams they plug into and nothing more.

## 1. Intent and why

Metapowers becomes **singularskills**: a flat pack of skills, each following the Agent Skills specification, strung into workflows that run the same way in every major coding agent.

The reason people will adopt it is trust. Agents produce plausible output and nobody can tell afterwards what was decided, why, or what was skipped. Singularskills makes every piece of work follow one shape: a skill with a defined process, an artifact written to disk in a numbered sequence, a gate that refuses to skip a step, a run log anyone can read later, and a pause at every phase boundary where a person answers questions and approves the next step. The workflow angle is not decoration on top of the skills; it is the trust mechanism, and it stays.

The project must serve an individual with no accounts and no servers, a department that wants shared conventions, and an enterprise that wants an audit trail and a second reviewer at the gates. That constrains what the repo may depend on (files, nothing else) more than what it builds.

## 2. Goals, non-goals, anti-goals

**Goals**

- One repository, `bromso/singularskills`, that any spec-conformant agent can install skills from, with first-class support for seven agents (section 6).
- A flat skill pack: every skill is one folder with a `SKILL.md` within the spec, invokable on its own in any agent.
- Workflows as data plus one conductor skill: a workflow runs phase by phase, asks before it writes, pauses at every boundary, and resumes from disk.
- An artifact and run-log format that a person can read, a reviewer can audit, and a memory system can index (project 2).
- No bundled MCP server, no runtime network dependency, nothing that only works in one agent.
- The docs site, counts, validators, evals and CI keep working under the new names.

**Non-goals**

- Changing what the 283 skills do or say beyond what the new shape requires. Copy and process stay as they are; project 2 makes them stack-aware.
- A hosted service, dashboard, accounts or telemetry.
- Stack profiles, the memory contract and the Figma rewrite (projects 2 and 3). This project leaves their hooks in place and nothing else.
- Keeping backwards compatibility with the `metapowers` names, the `/domain:skill` command form or the `.metapowers/` folder. A one-time migration note is enough.

**Anti-goals** (a failure even if everything works)

- A skill that only works inside a workflow. Every skill must run alone.
- A workflow that proceeds past a phase boundary without a person saying so.
- Vendor-specific fields at the top level of any `SKILL.md`. Portability is the point.
- A second source of truth for skills (a generated copy per agent that drifts). Adapters are thin; the `skills/` folder is the only copy.
- Losing the audit trail: an artifact written without a run-log line, or a gate that can be bypassed silently.

## 3. Constraints

- Agent Skills specification (agentskills.io) for every skill: `SKILL.md` with `name` and `description` in frontmatter, optional `scripts/`, `references/`, `assets/`; anything vendor-specific under `metadata` or in a per-agent adapter file, never at the top level.
- The Codex and Cursor families discover project skills in `.agents/skills/`; Claude Code in `.claude/skills/`; the universal installer (`npx skills add`) knows the paths for about seventy agents. Singularskills uses those conventions and invents no install path of its own.
- Bun 1.3 and Turborepo stay as the monorepo tooling; Biome, Vitest and the existing validators stay. The docs site stays Next 16 and Fumadocs, deployed to GitHub Pages at a new base path.
- No MCP server in the repo. No skill may require one; a skill may use one that the user has installed (project 3 defines how).
- Skill descriptions keep today's rules (verb-first, "Use when …", 120–400 characters) and the validator keeps enforcing them.
- Commit conventions, CI gates and `bun run check:plugins` (renamed, section 9) remain the contract for every change.

## 4. Names

| Today | After |
| --- | --- |
| Repository `bromso/metapowers` | `bromso/singularskills` (GitHub rename; old URLs redirect) |
| Marketplace `metapowers`, plugins `design`, `research`, … | One Claude plugin `singularskills` (adapter, section 7); no per-domain plugins |
| Skill invocation `/design:empathize` | `/design-empathize` (skill `name` is the flat, hyphenated name) |
| Artifact folder `.metapowers/<domain>/<project>/` | `.singularskills/<workflow>/<project>/` |
| Package `create-metapowers` | Removed (section 8); `npx skills add bromso/singularskills` replaces it |
| Package `@metapowers/figma-mcp` | Removed (project 3 defines the external-server contract) |
| Package `@metapowers/skill-validator`, `@metapowers/plugin-tools` | `@singularskills/skill-validator`, `@singularskills/pack-tools` (private, unchanged purpose) |
| Docs at `bromso.github.io/metapowers` | `bromso.github.io/singularskills` (base path `/singularskills`) |
| Domain `metapowers` (the meta-skills) | Domain `singular` (skills `singular-*`) |

The sixteen domains survive as the first segment of every skill name and as the grouping in the docs and the catalogue. They are no longer packaging units.

## 5. Repository layout

```
singularskills/
├── skills/                       # the pack: one folder per skill, flat
│   ├── design-empathize/
│   │   ├── SKILL.md
│   │   ├── scripts/gate.sh       # phase gate (section 6.4), only where the skill has one
│   │   └── references/           # the former shared/ files this skill uses
│   ├── development-ship/
│   ├── workflow/                 # the conductor (section 6.3)
│   └── …                         # 283 + 1 skills
├── workflows/                    # one YAML per workflow (section 6.2)
│   ├── design.yml
│   ├── research.yml
│   └── …
├── references/                   # pack-level references shared by many skills
│   └── stacks/                   # empty in this project; project 2 fills it
├── evals/                        # unchanged content, re-keyed by skill name
├── adapters/                     # per-agent thin wrappers (section 7)
│   ├── claude/                   # commands/ wrappers, hooks.json, plugin.json
│   ├── codex/
│   ├── gemini/
│   └── copilot/
├── .claude-plugin/plugin.json    # Claude plugin manifest for the whole pack
├── .claude-plugin/marketplace.json
├── .codex-plugin/plugin.json
├── .agents/plugins/              # Codex marketplace registration
├── plugin.json                   # Copilot CLI root manifest
├── AGENTS.md, CLAUDE.md          # repo instructions (CLAUDE.md points at AGENTS.md)
├── packages/skill-validator, packages/pack-tools
├── apps/docs
└── docs/superpowers/…
```

What moves where:

- `plugins/<domain>/skills/<skill>/SKILL.md` → `skills/<domain>-<skill>/SKILL.md`. The `name` field becomes `<domain>-<skill>` (equal to the folder name, as the validator requires today).
- `plugins/<domain>/shared/*` → `skills/<skill>/references/` when one skill uses it; `references/<domain>/` when several do. The skill text's links are rewritten to the new relative paths. The `shared-refs` validator rule follows.
- `plugins/<domain>/hooks/phase-gate.sh` → becomes the per-skill `scripts/gate.sh` (section 6.4). The Claude-only `hooks.json` moves to `adapters/claude/hooks.json` and now calls the skill scripts.
- `plugins/<domain>/evals/<skill>/` → `evals/<domain>-<skill>/`.
- `plugins/<domain>/.claude-plugin/plugin.json` and the marketplace entries collapse into one plugin manifest.
- `plugins/design/.mcp.json` and the Figma hook matcher are deleted (project 3 brings the capability contract).

## 6. Skills, workflows, conductor, gates, artifacts

### 6.1 A skill

A skill is exactly today's skill with four changes:

1. Flat name: `name: design-empathize`. The `argument-hint` stays.
2. Workflow membership under `metadata`, when the skill is a phase:

   ```yaml
   metadata:
     workflow: design
     phase: 1
     artifact: 01-empathize.md
   ```

   Utility skills (ship, review, the `singular-*` skills) carry no `metadata.workflow`.
3. Paths: `.metapowers/<domain>/<project>/` becomes `.singularskills/<workflow>/<project>/`. Phase prerequisites keep their wording ("Read … 01-empathize.md. If this file does not exist, tell the user …") but the skill also runs its gate script when one exists (6.4).
4. Two fixed sections at the end of every phase artifact the skill writes (6.5): **Decisions** and **Open questions**. The skill's Output section tells it to write them.

Everything else in the 283 skills (process steps, copy, argument handling, "Not for … see /x:y" pointers, which are rewritten to the flat names) stays as it is.

### 6.2 A workflow file

`workflows/<name>.yml`, one per domain that has phases today (design, research, development, marketing, security, and the rest that use numbered artifacts; the builder derives the list from the existing phase-deps data in `pack-tools`):

```yaml
name: design
title: Design thinking
folder: design                     # .singularskills/design/<project>/
phases:
  - phase: 1
    skill: design-empathize
    artifact: 01-empathize.md
  - phase: 2
    skill: design-define-component
    artifact: 02-define-component.md
    requires: [01-empathize.md]
  - phase: 3
    skill: design-ideate
    artifact: 03-ideate.md
    requires: [02-define-component.md]
  # …
```

`requires` lists the artifacts that must exist before the phase may write. It is the single source for gates, for the conductor and for the `phase-deps` validator rule, which now checks that every skill's `metadata` matches its workflow file and that every `requires` names an earlier phase's artifact.

### 6.3 The conductor: skill `workflow`

Invocation: `/workflow <workflow> <project>` (for example `/workflow design date-picker`). Behaviour:

1. Read `workflows/<workflow>.yml`, the artifact folder `.singularskills/<workflow>/<project>/` and the run log.
2. Report where the run stands: phases complete (with each artifact's **Decisions** section quoted briefly), the first incomplete phase, and anything the log marks as refused or open.
3. Run the first incomplete phase by following that phase skill's `SKILL.md` as if the user had invoked it. The phase skill asks what it cannot infer before it writes, one question at a time, in plain language, menus only when the user is stuck (the brainstorming manner). It writes its artifact and appends its run-log line.
4. **Stop.** Play back the phase's Decisions and Open questions, say what the next phase will do, and ask whether to continue. Nothing proceeds without an answer. "Continue", "go on" and the like move to step 3 for the next phase; corrections re-run the phase; anything else ends the run with the state on disk.
5. When the last phase is complete, summarise the whole run from the artifacts and stop.

Resuming is the same command: step 1 finds the first incomplete phase. A run with no project name asks for one. A workflow name that does not exist lists the available workflows. The conductor never skips a gate and never writes an artifact itself; the phase skills do.

The conductor is a skill, so it works in every agent. Where an agent supports slash commands, the adapter adds `/workflow` as a command wrapper; where it does not, the user invokes the skill by name.

### 6.4 Gates

A phase skill with `requires` ships `scripts/gate.sh` (POSIX sh, no dependencies): given the project folder, it exits 0 when every required artifact exists and non-empty, otherwise prints which are missing and exits 1. The skill's Prerequisites section tells the agent to run the script and, on a non-zero exit, to stop and tell the user (today's wording), with `--skip-checks` as the explicit bypass. The bypass is recorded in the run log as `gate: skipped`.

The Claude adapter keeps a `PreToolUse` hook that runs the same script before any write into `.singularskills/` so Claude Code enforces the gate even when a skill is misread. Other agents rely on the script step in the skill text; the CI smoke test (section 9) verifies that each Tier 1 agent actually runs it.

### 6.5 Artifacts and the run log

Artifacts stay Markdown at `.singularskills/<workflow>/<project>/NN-<phase>.md`, with a frontmatter block the skills write:

```yaml
---
skill: design-empathize
workflow: design
phase: 1
project: date-picker
started: 2026-10-26T09:12:00Z
finished: 2026-10-26T09:20:31Z
agent: claude-code          # the agent the skill ran in, when the skill can tell; else "unknown"
gate: passed | skipped | none
---
```

and two fixed closing sections:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

The run log is `.singularskills/log.jsonl`, append-only, one JSON object per line: `{ "ts", "skill", "workflow", "phase", "project", "event": "started" | "finished" | "refused" | "skipped", "artifact", "note" }`. Skills append their own lines (the skill text says so, with the exact shape); the conductor appends `run-started`, `phase-approved` and `run-finished` events. No tooling reads the log in this project; it exists so that a person, a reviewer, the docs' "what happened" view later, and the memory system (project 2) can.

`.singularskills/` is meant to be committed to the project's repository. The README says so and why.

## 7. Agents and install

**Tier 1, tested per release:** Claude Code, Codex, OpenCode, Cursor, GitHub Copilot (VS Code and CLI), Gemini CLI, Kimi Code CLI.
**Tier 2, supported through the universal installer, not tested per release:** everything `npx skills add` supports (Windsurf, Zed, Cline, Antigravity, Roo Code, Qwen Code, Goose, Amp, Kilo Code, Trae and the rest).

Install paths (the README's first section):

- Universal: `npx skills add bromso/singularskills` (project) or `--global`. The installer copies `skills/` into each detected agent's folder (`.agents/skills/` for six of the seven Tier 1 agents, `.claude/skills/` for Claude Code).
- Claude Code: `/plugin marketplace add bromso/singularskills` then `/plugin install singularskills@singularskills`, which also installs the command wrappers and the gate hook.
- Codex: `codex plugin marketplace add bromso/singularskills` and `codex plugin add singularskills@singularskills`.
- Copilot CLI and Gemini CLI: the universal installer; Gemini additionally gets command wrappers from `adapters/gemini/`.

Adapters are thin and generated where possible: the Claude command wrappers (`/design-empathize` → the skill), the Gemini TOML wrappers, the Codex plugin metadata and the Copilot `plugin.json` are produced by a `pack-tools` script from `skills/` and `workflows/`, committed, and checked in CI the way `gen:data --check` is today. Nothing in an adapter duplicates skill text.

## 8. What is removed

- `packages/create-metapowers` and its npm package. The README's "Install" section and the docs' installation page send users to `npx skills add` and to the two marketplace commands. The npm package gets a final release whose `postinstall` prints the new command (the builder decides whether that is worth a release or a README note on npm).
- `packages/figma-mcp`, `plugins/design/.mcp.json`, the Figma hook matcher, the four MCP docs pages (`development/mcp-server/*`), the `figma_access_token` user config. The nine Figma-dependent design skills keep their text for now with a one-line note at the top ("Figma steps require a Figma MCP server; see the design workflow page") until project 3 rewrites them.
- Per-domain plugin manifests, the per-domain hooks folders, the marketplace entries.
- The Release workflow's publish step for the removed packages; it still versions and publishes `@singularskills/skill-validator` if it is ever made public, otherwise only creates version PRs.

## 9. Tooling, docs, CI

- `pack-tools` (renamed from `plugin-tools`): rules re-pointed at `skills/`, `workflows/` and `evals/`; `phase-deps` reads the workflow files; `counts` checks the docs' domain table and site data against the flat pack; a new rule checks that every `requires` artifact is produced by an earlier phase and that every `metadata.workflow` has a workflow file; a new `gen:adapters --check`.
- `skill-validator`: unchanged rules plus the `metadata` block's shape; names must match folder names (already enforced).
- Docs site: the domain pages and skill pages are regenerated from the flat pack by the existing `gen:data` and codemod with new paths; the installation page is rewritten for section 7; a new "Workflows" page explains the conductor, the artifact format and the run log, with one real run as the example; the homepage trace and install tabs change their commands and names; the base path becomes `/singularskills`.
- CI: `validate-skills` and `check:pack` (renamed) as today, plus a smoke test that installs the pack into a temporary project for each Tier 1 agent's layout and asserts discovery (the skill folders are where that agent looks) and that `scripts/gate.sh` exits 1 then 0 for a two-phase fixture. Actually driving each agent is manual for this project and recorded in the acceptance file; the builder keeps a checklist page in the docs.
- Evals: `bun run evals` keeps working with the re-keyed folders.

## 10. Seams for projects 2 and 3

- `references/stacks/` exists and is empty; `AGENTS.md` in the repo describes the "Stack" section shape in one paragraph so project 2 only has to fill it in.
- The artifact frontmatter and run log are the memory contract's input; project 2 adds the "recall" step to the skills that need it and defines nothing new on disk.
- The design skills' Figma steps are untouched apart from the note; project 3 replaces them with the capability contract.

## 11. Left to the builder

- The exact YAML list of workflows and phases (derived from today's phase-deps data and the numbered artifacts).
- How much of the adapter generation is scripted versus committed by hand, as long as CI checks it.
- The order of the migration commits (the suggested order: rename and move the pack with the validators green; workflows and the conductor; gates and the run log; adapters and install; removals; docs).
- Where `references/` ends up per skill versus per domain, by usage count.
- The wording of the one-time migration note for existing `.metapowers/` folders (a move command and a sentence).
- The final-release strategy for the `create-metapowers` npm package.

## 12. Acceptance

- `npx skills add bromso/singularskills` into an empty project installs 284 skills into the right folder for each detected Tier 1 agent; Claude Code and Codex marketplace installs work.
- In each Tier 1 agent, `/workflow design date-picker` (or the agent's way of invoking the `workflow` skill) runs phase 1, asks at least one question before writing, writes `01-empathize.md` with the frontmatter and the two closing sections, appends run-log lines, and stops with a playback and a question. Answering "continue" runs phase 2; invoking phase 3's skill directly with phase 2 missing is refused by the gate; `--skip-checks` is logged.
- `bun run check:pack`, `bun run lint:skills`, `bun run test` and the docs build pass; the docs site deploys at the new base path with every skill page present and the counts correct.
- No file in the repo references `metapowers` except the migration note and the changelog history.
- No MCP server, no `.mcp.json`, no network call in any skill or script.
