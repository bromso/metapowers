# Stack profiles and the memory seam: design

Project 2 of the singularskills programme. Follows the foundation
(`2026-10-26-singularskills-foundation-design.md`, §10 seams) and the conductor
handoff (`2026-10-30-conductor-handoff-design.md`). The owner opted out of the
brainstorm questions; every decision below is the controller's call unless marked
*(owner)*, made from the foundation brainstorm (files are the contract; recall is
scoped to the project's own repo; cross-project knowledge is the memory project's
job) and from a survey of the three repositories involved.

## 1. Intent

Two things the foundation left as seams:

- **Stack.** The pack is stack-agnostic by construction: a survey of all 283 skills
  finds no hard-coded package manager or test runner, only `singular-detect`, which
  sniffs a project's stack from its config files. That is safe but blunt: a skill
  that builds, tests, lints or reviews code in a project started from the owner's
  Bun/React/TypeScript boilerplate or Rust/GPUI boilerplate has to guess the
  command, the layout and the house rules every time, and guesses wrong ("Always
  Bun, never npm" is a rule the Bun boilerplate states in its own conventions
  skill; the Rust one has dependency rules per crate). A project should say its
  stack once and have every relevant skill honour it.
- **Memory.** The owner's persistent-memory project, `singularrag` (Rust; an MCP
  server and CLI that indexes a repository into `.singularrag/index.db` and answers
  `repo_map`, `find_symbol`, `entities`, `trace_path`, `changed` queries), is meant
  to connect to this pack the way episodic-memory connects to superpowers. Today
  neither side knows the other. The artifact trail `.singularskills/<folder>/
  <project>/NN-*.md` plus `.singularskills/log.jsonl` is already the record a
  person can audit; this project makes it the record a memory system can index and
  a skill can recall from, without binding the pack to one memory tool.

## 2. Goals

- A project declares its stack once, in a `Stack` section of its `AGENTS.md`, and
  can point at a named profile; the skills that build, test, lint, review, debug,
  ship or prototype code read it before acting and never guess a package manager.
- Two profiles ship, matching the owner's boilerplates: `bun-react-ts` and
  `rust-gpui`. Profiles are plain Markdown references a person can read and copy.
- `singular-init` writes the `Stack` section for a project (from `singular-detect`,
  naming a profile when one matches) so nobody writes it by hand.
- The artifact trail is a documented, stable contract (paths, frontmatter keys,
  section names, run-log events) with a "what a memory system should index" note,
  and the first phase of every workflow recalls what the repository already holds
  about the project before it asks or writes.
- Recall works with no memory tool at all (reading the trail directly), and better
  with one (any tool whose description says it searches the repository or past
  work), through a capability contract like project 3's Figma one.

## 3. Non-goals and anti-goals

- No changes to `singularrag` in this project. Section 7 lists what the pack asks
  of it; those are owner tasks in that repository.
- No new runtime, index, daemon or file format. The trail is Markdown and JSONL as
  the foundation defined; the stack declaration is a fenced YAML block in a
  Markdown file people already have.
- Anti-goal: a skill that refuses to work without a Stack section or a memory
  tool. Both are optional; absence degrades to detection and direct reading.
- Anti-goal: profiles that drift from the boilerplates. Each profile names the
  boilerplate commit it was written against and the owner refreshes it from the
  boilerplate, not the other way round.
- Not in scope: cross-project memory (that is `singularrag`'s workspace feature),
  Windsurf/Cursor-specific rules files, or a profile per framework in the world.

## 4. The Stack declaration

The `Stack` section of a project's `AGENTS.md` (or `CLAUDE.md` when that is the
file the project keeps; the Bun boilerplate has a 1,245-line `CLAUDE.md` and no
`AGENTS.md`) is one fenced `yaml` block under a `## Stack` heading. Keys, all
optional except `stack`:

```yaml
stack: TypeScript 5.9, Next.js 16, React 19, Bun 1.4   # free text: language, framework, runtime
profile: bun-react-ts          # a file in the pack's references/stacks/, when one matches
install: bun install
build: bun run build
test: bun run test:services    # the command that proves the code works
lint: bun run check            # the command that must pass before a commit
format: bun run format:fix
typecheck: bun run typecheck
run: bun dev
layout: apps/* and packages/*; tests colocated as *.test.ts; e2e in apps/e2e/tests; docs in docs/guides
rules: Always Bun, never npm/pnpm/yarn. Frontend layers tokens → components → blocks → views → pages.
```

`stack`, `layout` and `rules` are free text (one line each; `rules` may use `;` to
separate). The command keys are exact shell commands. A key the project leaves out
falls back to the profile's value; a key present in both is the project's. This
replaces the four-key shape the foundation sketched in `AGENTS.md` (`stack`,
`test`, `lint`, `layout`), which stays valid as a subset.

## 5. Profiles

`references/stacks/<id>.md`, one per stack, plain Markdown with this shape:

```markdown
# <Title>                         (e.g. Bun, React and TypeScript)

Written against <repo> at <commit> on <date>.   (the boilerplate it mirrors)

## Declare it
A fenced yaml block: the complete Stack section for a project on this profile,
ready to paste into AGENTS.md.

## Commands
One line per command with when to run it (install, build, test, lint, format,
typecheck, run, plus stack-specific ones such as `bun run validate` or `just ci`).

## Layout
Where source, tests, docs, assets and config live; test file naming; where a new
component, route, crate or binary goes.

## Rules
The house rules a reviewer enforces, as short imperatives: package manager, layer
or dependency rules, formatting and commit conventions, what a PR must pass.

## For skills
Three short lists: what a build/test/lint skill runs; what a review skill checks
(the rules above); what a prototype or component skill generates (file paths,
naming, which UI library and tokens).
```

Two profiles ship:

- `bun-react-ts`: from `~/Sites/boilerplate-bun` (Bun 1.4 workspaces, TypeScript
  5.9, Next.js 16 App Router, React 19, Tailwind 4, shadcn/ui, Biome 2.6,
  `bun run validate` as the full gate, tests colocated `*.test.ts`, Playwright e2e
  under `apps/e2e/tests`, the five-layer frontend rule, "always Bun").
- `rust-gpui`: from `~/Sites/boilerplate-rust` (Rust 1.97 toolchain pinned,
  edition 2024 workspace, `just build/test/lint/ci`, `cargo nextest`, `cargo xtask
  lint-all`, Axum 0.8, Turso, GPUI 0.2 desktop app, `crates/*` and `apps/*`,
  integration tests under `tests/`, `insta` snapshots, the per-crate dependency
  rules from the README).

The builder writes both from the repositories on disk (read-only), quoting the
commands and rules the repos state rather than inventing them, and records the
commit hash each was written against. Both repositories sit on feature branches
(`boilerplate-bun` on `chore/phase-14b-vendored-bugs`, `boilerplate-rust` on
`account`); the profiles are written against each repository's `main` (`git show
main:<file>`), since only merged work is the boilerplate, and name that commit.
*(Builder-check answer, controller's call.)*

`references/stacks/README.md` lists the profiles, the declaration shape, and how
to add a profile (copy the shape, write it against a real repo, add it to the
list). The profiles are canonical references: `gen-references` copies them into
every consuming skill's `references/stacks/` as it does for domain references, so
installed skills are self-contained.

## 6. Stack-aware skills

A skill is stack-aware when its frontmatter has `metadata.stack-aware: true`.
The validator's `METADATA_KEYS` accepts the key. The initial set (14 skills; the
builder confirms each one actually builds, tests, lints, reviews, debugs, ships or
generates code, and drops any that only writes prose):

`development-plan`, `development-build`, `development-test`, `development-review`,
`development-debug`, `development-ship`, `coaching-code`,
`security-secure-coding`, `security-dependency-scan`, `security-security-testing`,
`accessibility-checklist`, `accessibility-remediate`, `design-prototype`,
`design-export-tokens`.

Each stack-aware skill carries one generated paragraph, the **stack step**, owned
by `fix-skill-text` like the handoff and the gate step and pinned by the validator
(rule `stack-step`): it sits in `## Prerequisites` directly after the handoff
paragraph (or first, for a skill with no handoff), before the gate or `started`
step. Its text, verbatim for every stack-aware skill:

> **Stack.** Before you build, test, lint, run or generate code, read the `Stack`
> section of the project's `AGENTS.md`, or of `CLAUDE.md` when the project keeps
> its agent instructions there. Use its commands exactly as written, its `layout`
> for where files go and its `rules` as requirements. If it names a `profile`,
> also read the file `<profile>.md` in the `stacks` folder of this skill's
> bundled references for the full commands, layout and rules; the project's own
> keys win where both speak.
> If there is no `Stack` section, run the `singular-detect` skill, state what you
> inferred in one line, and offer to write the section with `singular-init`.
> Never assume a package manager, test runner or formatter the project did not
> declare.

Every stack-aware skill links `references/stacks/bun-react-ts.md` and
`references/stacks/rust-gpui.md` in a short `## References` line so
`gen-references` bundles them (the link form the generator already recognises).

## 7. The memory seam

### 7.1 The trail contract

`references/memory/trail.md` (canonical; bundled into the skills that recall)
and a docs page `overview/memory.mdx` state the contract a memory system can rely
on. Nothing new is defined; the contract names what exists:

- **Where:** `.singularskills/<folder>/<project>/NN-<phase>.md` (single-writer and
  shared artifacts), `.singularskills/<folder>/<project>/NN-<phase>/` (folder
  artifacts), `.singularskills/log.jsonl`.
- **Artifact frontmatter:** `skill`, `workflow`, `phase`, `project`, `started`,
  `finished`, `agent`, `gate`, exactly as the foundation §6.5 defines.
- **Visible structure:** the `# <title>` heading, per-member `## <Skill title>`
  sections opening with the italic line, and the closing `## Decisions` /
  `## Open questions` (or `###` inside a shared section). These section headings
  are the part a Markdown-section indexer such as `singularrag` sees, since it
  strips frontmatter: a memory system that only indexes sections still gets the
  project, phase and decisions by heading and path.
- **Run log:** the seven events and the line shape, with which lines mark a phase
  complete (`phase-approved`) and which mark a bypass (`skipped`, `refused`).
- **What to index:** every `*.md` under `.singularskills/` and the log; what a
  memory answer should return for a recall query (path, phase, the Decisions
  lines); what never to index (nothing in the trail is secret by design, but
  `.singularskills/` may hold `--skip-checks` bypasses a reviewer wants to see,
  so index the log too).

### 7.2 The recall step

The first phase of every workflow is where a project's history matters most: it
is where the agent would otherwise ask questions the repository can already
answer. Every **first-phase member** (the 33 skills that already carry the
first-phase handoff variant) gets one generated paragraph, the **recall step**,
owned by `fix-skill-text`, placed directly after the handoff paragraph and before
the stack step or the `started` step, pinned by the validator (rule
`recall-step`). Its text, verbatim:

> **Recall.** Before you ask the user anything, look for what this repository
> already holds about `<project>`: if a tool is available whose description says it
> searches this repository or past work (a memory or repo-map server such as
> `repo_map`, `entities` or a search tool), query it for `<project>` and this
> phase's subject and read what it returns; in every case also list
> `.singularskills/*/<project>/` and read the **Decisions** and **Open questions**
> of any artifact there, and the lines of `.singularskills/log.jsonl` whose
> `project` is `<project>`. Open <your artifact | your section> with a
> `<## | ###> Recalled` section of at most ten lines naming what you found and
> where (path or tool), or the single line `Nothing recalled: no earlier
> artifacts, log lines or memory results for <project>.` Ask the user only what
> this did not answer. The trail's shape is described in
> `references/memory/trail.md`, bundled with this skill.

The bracketed pair is the one variation: a single-writer member says "your
artifact" and `## Recalled`; a member of a shared phase (24 of the 33 first-phase
members: the phase-0 members of marketing, legal, security, project-management and
compliance) says "your section" and `### Recalled`, inside its own `## <Skill
title>` section, matching the `###` closing sections the foundation §6.5 gives
shared artifacts. `RECALL_STEP` is therefore a function of `shared`, like the
Output block, in both generators. *(Builder-check answer, controller's call.)*

The conductor's step 2 report gains one line: "what the trail already holds for
this project" (the artifact folders found and the count of log lines), so a
person starting a run sees the history before phase 1 runs.

`## Recalled` becomes part of the artifact shape: the trail contract lists it as
an optional first section of a first-phase artifact, and `singular-report`
includes it when present.

### 7.3 Asks of singularrag (owner tasks, not this project)

Recorded in `references/memory/trail.md` under "For memory systems", so the
other repository can pick them up:

1. Index dot-directories, or at least `.singularskills/`, and do not let
   `.gitignore` rules for build output hide it.
2. Keep frontmatter keys (`skill`, `workflow`, `phase`, `project`, `gate`) as
   section metadata instead of stripping them, so a query can filter by project.
3. Ingest `log.jsonl` as events (one row per line) so "what was skipped" and
   "what was approved when" are answerable.
4. Expose a recall-shaped answer: for a project name, the artifacts in phase
   order with their Decisions lines.

## 8. Tooling

- `packages/pack-tools/src/skill-text.ts`: `STACK_STEP` and `RECALL_STEP`
  constants, `fixStackStep(content, stackAware: boolean)` and
  `fixRecallStep(content, member, first)`, applied in `fixSkillText` after
  `fixHandoff` and before `fixStartStep`'s placement is re-evaluated (order inside
  Prerequisites: handoff, recall, stack, gate-or-started, then the skill's own
  prose). `fixStartStep` and `fixHandoff` already skip a leading handoff; they
  learn to skip the recall and stack paragraphs the same way. Idempotent;
  `--check` reports drift.
- `packages/skill-validator/src/plugin-rules.ts`: `STACK_STEP` and `RECALL_STEP`
  mirrored; rules `stack-step` (a skill with `metadata.stack-aware: true` must
  carry it in the right place; one without must not) and `recall-step` (every
  first-phase member carries it; nobody else does). `METADATA_KEYS` gains
  `stack-aware`. Cross-package equality tests for both constants.
- `gen-references`: profiles and the trail contract are canonical references
  under `references/stacks/` and `references/memory/`. Today the generator
  resolves a skill's `references/<rel>` link to `references/<domain>/<rel>`
  (`canonical()` in `packages/pack-tools/src/references.ts`), with
  `references/workflows/<name>.yml` as the one shared exception. `stacks/` and
  `memory/` become two more shared prefixes: a link `references/stacks/<id>.md`
  or `references/memory/<file>.md` resolves to that same path under the pack's
  `references/`, whatever the skill's domain. The validator's
  `reference-resolvable` rule mirrors the same two prefixes (it already mirrors
  the `workflows/` one). Tests for both.
- `singular-init`: gains a step, after its existing questions, that writes the
  `Stack` section into `AGENTS.md` (creating the file with the pack's standard
  intro if absent) or into `CLAUDE.md` when only that exists, and offers "update
  the Stack section only" when `.singularskills/` already exists. It takes the
  values from the project's own files, never from a profile: `stack` from
  `package.json`/`Cargo.toml`/`rust-toolchain.toml`, the command keys from
  `package.json` scripts, a `justfile` or `Makefile`, `layout` from the folders it
  sees; a key it cannot read is left out, so the profile supplies it. It names
  `profile: bun-react-ts` when `package.json` declares Bun as the package manager
  and depends on `next` and `react`, `profile: rust-gpui` when a Cargo workspace
  depends on `gpui`, else no `profile`. Idempotent: it replaces an existing
  `## Stack` section. `singular-detect` gains a one-line "matches profile: <id>"
  output using the same two rules. The skill keeps
  `disable-model-invocation: true`. *(Builder-check answers, controller's calls.)*
- Docs: `overview/stack.mdx` (the declaration, the profiles, how a skill uses
  them, the two paste-ready blocks), `overview/memory.mdx` (the trail contract and
  recall), the Workflows page's artifact shape gains `## Recalled`, README and
  AGENTS.md gain a sentence each and AGENTS.md's Stack section is updated to the
  full key set.
- Evals: no new case. `singular-init` is not model-invocable
  (`disable-model-invocation: true`) and asks its questions by design, so an eval
  cannot reach it; the stack step and the init step are checked by the manual
  tests in §10, and the eval budget stays with the owner.
  *(Builder-check answer, controller's call.)*

## 9. Constraints

- Spec-conformant frontmatter: the only new key is `metadata.stack-aware`.
- The Stack section is read, never required; recall is attempted, never required.
- Generated text is owned by `fix-skill-text`, mirrored by the validator, checked
  by `check:pack`; the skill's own prose is not rewritten.
- Profiles quote the boilerplates; the builder does not run them.
- All checks green at every commit: `lint:skills`, `check:pack`, docs `check`,
  `evals --dry`, tests, Biome.

## 10. Acceptance

1. `fix-skill-text --check` clean; 14 skills carry the stack step and 33 the
   recall step (counts in the record); no other skill carries either.
2. `lint:skills` passes with `stack-step` and `recall-step`.
3. Both profiles exist, each naming its boilerplate commit; `gen-references
   --check` clean, and every stack-aware skill's folder holds both profile copies.
4. Manual, in a copy of each boilerplate with the pasted Stack section:
   `/development-test <project>` runs the declared test command and nothing else
   (no `npm`, no bare `cargo test`); `/development-review` cites a rule from the
   profile. Transcript excerpts in the record.
5. Manual, in a project with two approved design phases: `/design-empathize
   other-project` writes a `## Recalled` section naming the existing artifacts;
   with `singularrag`'s MCP server connected, the Recalled section names the tool
   it queried. If `singularrag` cannot see `.singularskills/` (§7.3 item 1), the
   record says so.
6. Manual, in a copy of each boilerplate without a Stack section: `/singular-init`
   writes a `## Stack` section naming the right profile and only the keys it read
   from the project's files; running it again replaces the section without
   duplicating it. Transcript excerpts and the written sections in the record.
