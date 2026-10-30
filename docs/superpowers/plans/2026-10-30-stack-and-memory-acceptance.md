# Stack profiles and the memory seam: acceptance record

Plan: `2026-10-30-stack-and-memory.md`. Spec: `docs/superpowers/specs/2026-10-30-stack-and-memory-design.md` §10. Branch `stack-and-memory`, verified 2026-10-30 on macOS with Claude Code 2.1.283, the pack loaded from this worktree with `--plugin-dir`.

## 1. Counts and drift

```
grep -l '^\*\*Stack\.\*\*' skills/*/SKILL.md | wc -l      → 14
grep -l '^  stack-aware: true' skills/*/SKILL.md | wc -l  → 14
grep -l '^\*\*Recall\.\*\*' skills/*/SKILL.md | wc -l     → 33   (shared variant: 24)
node dist/cli.js fix-skill-text ../../skills --check      → exit 0
node dist/cli.js gen-references ../.. --check             → exit 0
```

No other skill carries either marker (the validator's `stack-step` and `recall-step` rules forbid it; `lint:skills` passes).

## 2. Validator

`bun run lint:skills` → exit 0, 545 PASS lines (283 skills plus their bundled references). Rules `stack-step` and `recall-step` have 5 and 4 cases each in `packages/skill-validator/src/plugin-rules.test.ts`; the cross-package equality tests in `packages/pack-tools/src/skill-text.test.ts` compare `STACK_STEP` and both `recallStep` variants (over all 33 first-phase members of the real pack).

## 3. Profiles

```
references/stacks/bun-react-ts.md: Written against `bromso/boilerplate-bun` at `32bc3561e15171a2c224eb312eb51a2c5fe90da1` (main) on 2026-10-30.
references/stacks/rust-gpui.md:    Written against `bromso/boilerplate-rust` at `232dc095188c8d4dbe8db291106132ce2f2d9b54` (main) on 2026-10-30.
ls skills/development-test/references/stacks → bun-react-ts.md rust-gpui.md
ls skills/*/references/memory/trail.md | wc -l → 33
```

Both were read at `main` through the GitHub API (this worktree's shell refuses git aimed at other repositories).

## 4. Manual stack checks

Copies of both boilerplates' working trees (no `.git`, `node_modules` or `target`), any existing Stack section removed, `claude -p … --plugin-dir <worktree> --allowedTools Read,Write,Edit,Glob,Grep,Skill,Bash --max-turns 14`.

**`/singular-init` (Bun copy, which keeps a `CLAUDE.md` and no `AGENTS.md`)**: wrote one `## Stack` section into `CLAUDE.md` (AGENTS.md 0, CLAUDE.md 1), `profile: bun-react-ts`, every key one line, values from the project's files:

```yaml
profile: bun-react-ts
install: bun install
build: bun run build
test: bun run test:services
lint: bun run lint
format: bun run format
typecheck: bun run typecheck
run: bun run dev
layout: apps/* (www, app, auth, …), packages/* (ui, tokens, …); unit tests next to the code as *.test.ts … (bun test), browser journeys in apps/e2e/tests/*.spec.ts (Playwright)
rules: Biome owns style …; one-way layering tokens -> components -> blocks -> views -> pages; … the full local gate is bun run validate …
```

**`/singular-init` (Rust copy, no agent file)**: created `AGENTS.md` with one `## Stack` section, `profile: rust-gpui`, `build: just build`, `test: just test`, `lint: just lint`, `run: just run-platform`, one-line `layout` and `rules` quoting the README's dependency rules; `install`, `format` and `typecheck` left out for the profile to supply. A second run ("update only the Stack section") kept one section in both copies.

The first run of this check, before a one-line tightening of the skill ("keep the shape flat: every key is one line of plain text"), wrote `stack` and `layout` as nested YAML and added a `tests` key; the skill text was corrected and the check rerun, with the result above.

**`/development-test demo --skip-checks` (asked which command it would run)**: Bun copy chose `bun run test:services`, citing "the Stack section of CLAUDE.md names `test: bun run test:services` … The skill requires using the stack's commands exactly as written, never an assumed runner"; no `npm`, `jest` or bare `bun test`. Rust copy chose `just test`, citing "the rust-gpui profile … says a bare `cargo test` is not the test command for this stack".

**`/development-review demo --skip-checks`**: Bun copy confirmed "Bun is the only package manager present … and Biome is the only lint and format config", and the five-layer rule. Rust copy: "Rule checked: 'api uses auth but never db' … The rule passes", plus "every crate and app has a README stating what it must not depend on". Both wrote `.singularskills/development/demo/04-review.md` and logged `skipped`, `started`, `finished`.

## 5. Manual recall check

Scratch project with `.singularskills/design/date-picker/01-empathize.md` and `02-define.md` (frontmatter, Decisions, Open questions) and a log with `run-started`, two `phase-approved` lines and `run-finished`. `/design-empathize date-picker — I want to redo the brief; recall first, then ask me your first question`:

- Tool calls, in order: `ls` and `find .singularskills` plus the log lines for the project; a search on the one memory-shaped tool present in this session (`episodic-memory` search, which the session's permissions denied); `Read` of both artifacts and of the bundled `references/memory/trail.md`; the `started` log line.
- Reply: a **Recalled** list naming `01-empathize.md` (approved 2026-10-20, its decision and open question), `02-define.md` (approved 2026-10-21, its decision and open question) and "that run stopped before phase 3 … no run is open now", with the note that the memory search "was not permitted in this session, so recall rests on the artifact trail alone"; then the first question about the users. Nothing was written (ask first).

`singularrag`'s MCP server was not configured in this session (`claude mcp list` shows only claude.ai connectors), so the "names the tool it queried" branch was exercised by the episodic-memory tool instead; the §7.3 asks of `singularrag` stand in `references/memory/trail.md` and on the Memory page.

## 6. Init shape

Covered in §4: correct profile, correct file (`CLAUDE.md` where only that exists, `AGENTS.md` otherwise), only keys read from the project's files, one section after a rerun.
