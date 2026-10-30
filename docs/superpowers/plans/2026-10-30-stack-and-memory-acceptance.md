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

**`/singular-init` (Bun copy, which keeps a `CLAUDE.md` and no `AGENTS.md`)**, final run after the review's wording fixes: wrote one `## Stack` section into `CLAUDE.md` (AGENTS.md 0, CLAUDE.md 1), `profile: bun-react-ts`, every key one line, values from the project's files (long values trimmed here with …):

```yaml
stack: "Bun 1.4.2 workspaces monorepo; TypeScript ^5.9.3; Next.js ^16.4.3 (App Router) and React ^19.3.0 for the eight web apps; Bun.serve + oRPC ^1.16 for the api and ai services; Zod ^4.6.7; …"
profile: bun-react-ts
install: bun install
build: bun run build
test: bun test scripts && bun run test:services
lint: bun run check
format: bun run format:fix
typecheck: bun run typecheck && bun run typecheck:ui && bun run typecheck:scripts
run: bun run dev
layout: "apps/* (www, app, auth, account, docs, help, jobs, blog are Next apps; api and ai are Bun services; story is Storybook; e2e and load are test runners), packages/* (ui, tokens, api-contract, …"
rules: "Use Conventional Commits, type(scope) then subject, …; name branches feat/, fix/, docs/ or chore/; follow Biome style, double quotes, no semicolons …"
```

Three earlier runs of this check shaped the skill's text: the first wrote nested YAML and an extra `tests` key (fixed: "keep the shape flat"); the second, after the review, chose `lint: bun run lint` and `format: bun run format`, the check-only scripts (fixed: prefer the combined check for `lint` and a writing variant for `format`); the third wrote `AGENTS.md` next to the existing `CLAUDE.md` (fixed: the file-choice order is now explicit). The run above is the fourth.

**`/singular-init` (Rust copy, no agent file)**: created `AGENTS.md` with one `## Stack` section, `profile: rust-gpui`, `build: just build`, `test: just test`, `lint: just lint`, `run: just run-platform`, one-line `layout` and `rules` quoting the README's dependency rules; `install`, `format` and `typecheck` left out for the profile to supply. A second run ("update only the Stack section") kept one section in both copies.

**`/development-test demo --skip-checks` (asked which command it would run; deviation from spec §10.4, which says the skill runs the declared command: the builder does not run the boilerplates, so the check asked and recorded the answer instead)**: Bun copy chose `bun run test:services`, citing "the Stack section of CLAUDE.md names `test: bun run test:services` … The skill requires using the stack's commands exactly as written, never an assumed runner"; no `npm`, `jest` or bare `bun test`. Rust copy chose `just test`, citing "the rust-gpui profile … says a bare `cargo test` is not the test command for this stack".

**`/development-review demo --skip-checks`**: Bun copy confirmed "Bun is the only package manager present … and Biome is the only lint and format config", and the five-layer rule. Rust copy: "Rule checked: 'api uses auth but never db' … The rule passes", plus "every crate and app has a README stating what it must not depend on". Both wrote `.singularskills/development/demo/04-review.md` and logged `skipped`, `started`, `finished`.

## 5. Manual recall check

Scratch project with `.singularskills/design/date-picker/01-empathize.md` and `02-define.md` (frontmatter, Decisions, Open questions) and a log with `run-started`, two `phase-approved` lines and `run-finished`.

**Final run, neutral prompt `/design-empathize date-picker`** (after the review's wording fixes):

- Tool calls, in order: `ls`/`find` over `.singularskills` and the log lines for the project; `Read` of both artifacts; `Read` of the bundled `references/memory/trail.md` and `wcag-criteria.md`; the `started` log line. No memory tool was queried: the only memory-shaped tool in this session searches past conversations across projects, which the step no longer matches.
- Reply: "Recall is done. Here is what the repository already holds about `date-picker`, so I will not ask about any of it", listing the earlier run (phases 1 and 2 approved, stopped before 3, no open run), the users, the decisions from both artifacts and the two open questions; then one question (locales, and whether an existing picker is replaced). Nothing written.
- Resumed with an answer ("English and Swedish; replaces a calendar-only picker that drew complaints on mobile; no deadline; write the brief now"): the skill wrote `01-empathize.md` opening with the frontmatter, `# Date picker: Empathize`, then a `## Recalled` section of eight lines, each citing `.singularskills/log.jsonl`, `01-empathize.md` or `02-define.md`, ending "No repository-search or memory tool was available; the recall is from the files above only."

An earlier run with a steering prompt ("recall first, then ask") matched the then-wording "or past work" against the past-conversation search tool (denied by the session's permissions); the review flagged both the steering and the cross-project match, and the final run above has neither.

`singularrag`'s MCP server was not configured in this session (`claude mcp list` shows only claude.ai connectors), so the "names the tool it queried" branch is not demonstrated; the §7.3 asks of `singularrag` stand in `references/memory/trail.md` and on the Memory page.

## 6. Init shape

Covered in §4: correct profile, correct file (`CLAUDE.md` where only that exists, `AGENTS.md` otherwise), only keys read from the project's files, one section after a rerun.
