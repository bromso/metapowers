# Stack Profiles and Memory Seam Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A project declares its stack once in a `Stack` section that 14 code-touching skills honour (two shipped profiles for the owner's Bun/React/TS and Rust/GPUI boilerplates), and every workflow's first phase recalls what the repository's artifact trail already holds before it asks or writes, with the trail documented as the contract a memory system indexes.

**Architecture:** Two more generated Prerequisites paragraphs owned by `pack-tools fix-skill-text` and mirrored by the validator (the stack step for `metadata.stack-aware` skills, the recall step for first-phase members), placed after the handoff and before the gate/started step. Profiles and the trail contract are canonical references under two new shared prefixes (`references/stacks/`, `references/memory/`) that `gen-references` bundles into consuming skills. `singular-init` writes the Stack section from the project's own files.

**Tech Stack:** Bun 1.3 + Turborepo; TypeScript; Vitest 3; `yaml`; Biome (tabs, width 100). Skills are Markdown with YAML frontmatter.

**Spec:** `docs/superpowers/specs/2026-10-30-stack-and-memory-design.md` (reads §6.5/§10 of `2026-10-26-singularskills-foundation-design.md` and `2026-10-30-conductor-handoff-design.md`).

## Global Constraints

- The only new frontmatter key is `metadata.stack-aware` (spec §9).
- The Stack section is read, never required; recall is attempted, never required (spec §9).
- Generated text is owned by `fix-skill-text`, mirrored by the validator, checked by `check:pack`; a skill's own prose is not rewritten except where a task says so (spec §9).
- Order inside `## Prerequisites`: handoff, recall, stack, gate-or-started step, then the skill's own prose (spec §8).
- Profiles quote the boilerplates' `main`; the builder does not run them (spec §5, §9).
- No change to `singularrag`; no eval case added (spec §3, §8).
- `bun run lint:skills`, `bun run check:pack`, `cd apps/docs && bun run check`, `bun run evals --dry`, `SKIP_NETWORK_TESTS=1 bun run test` and `bun run check` (Biome) stay green at every commit; `fix-skill-text --check` and `gen-references --check` clean after regeneration.
- Conventional commits with the environment's attribution trailer.

## Review Focus

1. A stack-aware skill in a project with a Stack section but no `profile` must use the section's commands and not look for a profile file: pinned by the stack step's exact text (Task 3) ("If it names a `profile`…").
2. A project whose `AGENTS.md` has no `## Stack` heading but whose `CLAUDE.md` has one must be read from `CLAUDE.md`: pinned by the exact text (Task 3) and the `singular-init` rule (Task 5).
3. A shared first-phase member must write `### Recalled` inside its own section, never a top-level `## Recalled` that collides with another member's: pinned by the shared-variant exact text (Task 4).
4. A skill that is both a first-phase member and stack-aware (none today; `development-plan` is phase 1 of development and stack-aware) must carry handoff, recall, stack, started in that order and stay idempotent: pinned in Task 4 with `development-plan`.
5. A link `references/stacks/<id>.md` from a `development` skill must resolve to `references/stacks/<id>.md`, not `references/development/stacks/<id>.md`: pinned in Task 1 in both packages.

---

### Task 1: Shared reference prefixes `stacks/` and `memory/`

**Files:**
- Modify: `packages/pack-tools/src/references.ts:34-37` (`canonical`)
- Modify: `packages/pack-tools/src/references.test.ts`
- Modify: `packages/skill-validator/src/plugin-rules.ts` (`referenceExists`, near line 326, and the `REFERENCE` handling around it)
- Modify: `packages/skill-validator/src/plugin-rules.test.ts`
- Create: `references/stacks/README.md` (rewrite of the placeholder), `references/memory/README.md`

**Interfaces:**
- Consumes: `canonical(domain, rel)`; the validator's `referenceExists(file, ctx)` and `PackContext.referenceFiles`.
- Produces: `export const SHARED_PREFIXES = ["stacks/", "memory/"]` in both packages (pack-tools `references.ts`, validator `plugin-rules.ts`); `canonical("development", "stacks/bun-react-ts.md") === "references/stacks/bun-react-ts.md"`; the validator accepts `references/stacks/x.md` when `references/stacks/x.md` is in `ctx.referenceFiles` or bundled in the skill.

- [ ] **Step 1: Write the failing tests.** In `references.test.ts`:

```ts
test("a stacks/ or memory/ link resolves to the shared folder, not the domain's", () => {
	expect(canonical("development", "stacks/bun-react-ts.md")).toBe("references/stacks/bun-react-ts.md");
	expect(canonical("design", "memory/trail.md")).toBe("references/memory/trail.md");
	expect(canonical("design", "wcag-criteria.md")).toBe("references/design/wcag-criteria.md");
});
test("gen-references copies a shared profile into a consuming skill", () => {
	// temp pack: references/stacks/p.md, skills/development-test/SKILL.md linking `references/stacks/p.md`
	// run genReferences(root, { check: false }); expect skills/development-test/references/stacks/p.md to exist with the same content
});
```

In `plugin-rules.test.ts`, under `describe("reference-resolvable")`: a `development-plan` body linking `` `references/stacks/bun-react-ts.md` `` passes when `ctx.referenceFiles` contains `references/stacks/bun-react-ts.md`, and fails with `reference-resolvable` when it does not.

- [ ] **Step 2: Run them to verify they fail.** `cd packages/pack-tools && bunx vitest run src/references.test.ts -t "shared"` → FAIL (`canonical` is not exported / wrong path). `cd packages/skill-validator && bunx vitest run src/plugin-rules.test.ts -t "stacks"` → FAIL.

- [ ] **Step 3: Implement.** Export `canonical` and `SHARED_PREFIXES` from `references.ts`; `canonical` returns `references/<rel>` when `rel` starts with a shared prefix. In the validator, mirror: the resolvable check tries `references/<rel>` for shared prefixes before `references/<domain>/<rel>` (keep the error message's "neither … nor …" listing the path it tried). The `singular` domain's `metapowers` legacy branch stays.

- [ ] **Step 4: Run both test files** → PASS.

- [ ] **Step 5: Write the two README files.** `references/stacks/README.md`: what a profile is, the list (to be filled by Task 2), the declaration shape (spec §4 block verbatim), "how to add a profile". `references/memory/README.md`: one paragraph pointing at `trail.md` (Task 4).

- [ ] **Step 6: Checks and commit.** `bun run check:pack && bun run lint:skills` → exit 0.

```bash
git add packages/pack-tools/src/references.ts packages/pack-tools/src/references.test.ts packages/skill-validator/src/plugin-rules.ts packages/skill-validator/src/plugin-rules.test.ts references/stacks/README.md references/memory/README.md
git commit -m "feat(pack-tools): shared reference prefixes stacks/ and memory/"
```

---

### Task 2: The two stack profiles

**Files:**
- Create: `references/stacks/bun-react-ts.md`, `references/stacks/rust-gpui.md`
- Modify: `references/stacks/README.md` (the list)

**Interfaces:**
- Consumes: the boilerplates at `/Users/jonasbroms/Sites/boilerplate-bun` and `/Users/jonasbroms/Sites/boilerplate-rust`, read at `main`.
- Produces: two files in the spec §5 shape, each starting with `Written against <owner/repo> at <sha> (main) on 2026-10-30.`

- [ ] **Step 1: Read each repository at `main` without running it.** This worktree's shell refuses git commands aimed at other repositories, so read `main` through GitHub when the repos are hosted there (`gh api repos/bromso/boilerplate-bun/contents/package.json?ref=main --jq .content | base64 -d`, same for `CLAUDE.md`, `.claude/skills/repo-conventions/SKILL.md`, `.github/workflows/ci.yml`, `biome.json`; for the Rust repo `Cargo.toml`, `rust-toolchain.toml`, `justfile`, `README.md`, `.github/workflows/ci.yml`, `xtask/src/main.rs`) and take the `main` sha from `gh api repos/<owner>/<repo>/branches/main --jq .commit.sha`. If a repo is not on GitHub, read the checked-out working tree with plain `cat` and record its HEAD sha from `.git/HEAD` with the note "feature branch; refresh from main".

- [ ] **Step 2: Write `bun-react-ts.md`** in the §5 shape. Commands: `bun install`, `bun run build`, `bun run test:services`, `bun run check` (lint), `bun run format:fix`, `bun run typecheck`, `bun dev`, `bun run validate` (full gate), `bun --filter @repo/e2e e2e`. Layout: `apps/*`, `packages/*`, tests colocated `*.test.ts`, e2e `apps/e2e/tests/*.spec.ts`, docs `docs/guides`. Rules: always Bun; tokens → components → blocks → views → pages; Biome; Conventional Commits via commitizen; what `bun run validate` must pass. "For skills" lists per §5. The "Declare it" block is the paste-ready Stack section with `profile: bun-react-ts`.

- [ ] **Step 3: Write `rust-gpui.md`** likewise: `rustup toolchain install` + the `cargo install --locked cargo-nextest cargo-hakari cargo-deny cargo-machete taplo-cli` line, `just build`, `just test` (`cargo nextest run --workspace`), `just lint` (`cargo xtask lint-all`), `just deny`, `just ci`, `cargo run -p platform`, `just run-desktop`. Layout: `crates/*`, `apps/*`, `xtask/`, `workspace-hack/`, tests under `tests/*.rs`, `insta` snapshots. Rules: the README's dependency rules verbatim (domain and api-types wasm-clean, db depends only on domain, each crate's README states its forbidden deps), edition 2024, toolchain pinned.

- [ ] **Step 4: Verify.** `bun run lint:skills` → exit 0 (reference files are validated as prose; the validator must not reject the fenced yaml). `grep -c "^## " references/stacks/*.md` → each ≥ 5.

- [ ] **Step 5: Commit.**

```bash
git add references/stacks
git commit -m "docs(stacks): bun-react-ts and rust-gpui profiles written against the boilerplates' main"
```

---

### Task 3: The stack step

**Files:**
- Modify: `packages/pack-tools/src/skill-text.ts`, `packages/pack-tools/src/skill-text.test.ts`
- Modify: `packages/skill-validator/src/plugin-rules.ts` (`METADATA_KEYS`, constant, rule `stack-step`), `packages/skill-validator/src/plugin-rules.test.ts`, `packages/skill-validator/src/index.ts`
- Modify: the 14 skills' frontmatter (`  stack-aware: true` under `metadata`) and a `## References` line in each linking both profiles
- Regenerate: the 14 skills (stack step), their `references/stacks/` copies (`gen-references`)

**Interfaces:**
- Consumes: `fixHandoff`, `fixStartStep`, `HANDOFF_MARKER`; `SkillFile.content` frontmatter via `gray-matter` as the other fixers read it (see `fixArgs`/`logFields` for the pattern).
- Produces: `export const STACK_MARKER = "**Stack.**"`, `export const STACK_STEP: string` (one paragraph, no variants), `export function fixStackStep(content: string, stackAware: boolean): string`; `stackAware(content): boolean` reads `metadata.stack-aware === true`. In `fixSkillText`: order of application `fixArgs → fixHandoff → fixRecallStep (Task 4) → fixStackStep → fixStartStep → workflows block → fixOutputBlock`, and `fixStartStep` skips every leading generated paragraph (handoff, recall, stack) when placing the gate/started step. Validator: `STACK_STEP` identical; rule `stack-step`.

The exact text of `STACK_STEP`:

```
**Stack.** Before you build, test, lint, run or generate code, read the `Stack` section of the project's `AGENTS.md`, or of `CLAUDE.md` when the project keeps its agent instructions there. Use its commands exactly as written, its `layout` for where files go and its `rules` as requirements. If it names a `profile`, also read `references/stacks/<profile>.md`, bundled with this skill, for the full commands, layout and rules; the project's own keys win where both speak. If there is no `Stack` section, run the `singular-detect` skill, state what you inferred in one line, and offer to write the section with `singular-init`. Never assume a package manager, test runner or formatter the project did not declare.
```

The 14 skills: `development-plan`, `development-build`, `development-test`, `development-review`, `development-debug`, `development-ship`, `coaching-code`, `security-secure-coding`, `security-dependency-scan`, `security-security-testing`, `accessibility-checklist`, `accessibility-remediate`, `design-prototype`, `design-export-tokens`. The `## References` line each gains (after any existing References section's list, else as a new `## References` section before `## Output`): `` - `references/stacks/bun-react-ts.md` and `references/stacks/rust-gpui.md`: the shipped stack profiles ``.

- [ ] **Step 1: Failing tests** in `skill-text.test.ts`, `describe("fix-skill-text: the stack step")`: exact text for a stack-aware utility fixture (`coaching-code`, no handoff: the stack step is the first paragraph); a stack-aware member (`development-test` fixture: handoff first, stack second, started third); a non-stack-aware skill loses a stale stack step; idempotent; `fixSkillText` on a fixture with `stack-aware: true` and a legacy gate step produces the order handoff, stack, gate. In `plugin-rules.test.ts`, `describe("stack-step")`: accepts a stack-aware skill carrying the exact text after its handoff; rejects one without it; rejects a non-stack-aware skill carrying the marker; `frontmatter-shape` accepts `stack-aware: true` and rejects `stack-aware: yes` (must be boolean). Cross-package equality test for `STACK_STEP`.

- [ ] **Step 2: Run to verify failure** (both packages) → FAIL on missing exports.

- [ ] **Step 3: Implement** both packages. The validator rule: find the first paragraphs of `## Prerequisites`; skip a leading handoff paragraph and a leading recall paragraph (Task 4's marker, `**Recall.**`, may precede); the next paragraph must equal `STACK_STEP` when `stack-aware`, and the marker must be absent otherwise. `METADATA_KEYS` gains `stack-aware`; `checkFrontmatterShape` rejects a non-boolean value.

- [ ] **Step 4: Run tests** → PASS.

- [ ] **Step 5: Mark the 14 skills and regenerate.** Edit each frontmatter and References line by hand (14 small edits; `fix-frontmatter --check` must stay clean, so put `stack-aware` after `artifact` or after `argument-hint` for utilities). Then `cd packages/pack-tools && bun run build && node dist/cli.js fix-skill-text ../../skills && node dist/cli.js gen-references ../.. && node dist/cli.js fix-skill-text ../../skills --check && node dist/cli.js gen-references ../.. --check`. Expected: 14 skills changed; both `--check` exit 0; `ls skills/development-test/references/stacks` shows both profiles; `grep -l '^\*\*Stack\.\*\*' skills/*/SKILL.md | wc -l` → 14.

- [ ] **Step 6: Checks and commit.** `bun run lint:skills && bun run check:pack && SKIP_NETWORK_TESTS=1 bun run test && bun run check` → exit 0.

```bash
git add packages skills references/stacks
git commit -m "feat(pack-tools): stack step for stack-aware skills; 14 skills read the project's Stack section"
```

---

### Task 4: The recall step and the trail contract

**Files:**
- Modify: `packages/pack-tools/src/skill-text.ts`, `skill-text.test.ts`; `packages/skill-validator/src/plugin-rules.ts`, `plugin-rules.test.ts`, `index.ts`
- Create: `references/memory/trail.md`
- Modify: `skills/workflow/SKILL.md` (step 2, one line), `skills/singular-report/SKILL.md` (one sentence: include `Recalled` when present), `packages/pack-tools/src/conductor.test.ts` (pin)
- Regenerate: the 33 first-phase members (recall step + bundled `references/memory/trail.md`)

**Interfaces:**
- Consumes: `Member`, `memberships()`, `first = phase === workflow.phases[0]`, `shared = phase.skills.length > 1 && !phase.artifact?.endsWith("/")` (the Output block's rule, `skill-text.ts:260`).
- Produces: `export const RECALL_MARKER = "**Recall.**"`, `export function recallStep(shared: boolean): string`, `export function fixRecallStep(content: string, member: Member | undefined): string` (applies only when `member` is a first-phase member; removes the paragraph otherwise). Validator: `RECALL_STEP_SINGLE`, `RECALL_STEP_SHARED`, `recallStep(shared)`, rule `recall-step`. The paragraph links `references/memory/trail.md`, so `gen-references` bundles the contract into the 33 skills.

The exact text of `recallStep(false)`:

```
**Recall.** Before you ask the user anything, look for what this repository already holds about `<project>`: if a tool is available whose description says it searches this repository or past work (a memory or repo-map server such as `repo_map`, `entities` or a search tool), query it for `<project>` and this phase's subject and read what it returns; in every case also list `.singularskills/*/<project>/` and read the **Decisions** and **Open questions** of any artifact there, and the lines of `.singularskills/log.jsonl` whose `project` is `<project>`. Open your artifact with a `## Recalled` section of at most ten lines naming what you found and where (path or tool), or the single line `Nothing recalled: no earlier artifacts, log lines or memory results for <project>.` Ask the user only what this did not answer. The trail's shape is described in `references/memory/trail.md`, bundled with this skill.
```

`recallStep(true)` differs only in "Open your section with a `### Recalled` section" in place of "Open your artifact with a `## Recalled` section".

- [ ] **Step 1: Failing tests.** `skill-text.test.ts`, `describe("fix-skill-text: the recall step")`: exact single text for `design-empathize`; exact shared text for `marketing-customer-research` (phase 0 of marketing, 5 members); `design-define-component` (phase 2) gets none and loses a stale one; order for `development-plan` (first phase of development and stack-aware): handoff, recall, stack, started; idempotent. `plugin-rules.test.ts`, `describe("recall-step")`: accepts a first-phase single member with the exact text after its handoff; rejects it without; rejects a later-phase member carrying the marker; accepts the shared variant on a shared first-phase member and rejects the single variant there. Cross-package equality for both variants over every first-phase member of the real pack (33). `conductor.test.ts`: `/what the trail already holds for this project/`.

- [ ] **Step 2: Verify failure** → FAIL on missing exports.

- [ ] **Step 3: Implement** both packages; `fixStartStep` and `fixHandoff`/`fixStackStep` treat the recall paragraph as a leading generated paragraph.

- [ ] **Step 4: Write `references/memory/trail.md`** per spec §7.1 (where, frontmatter, visible structure incl. the optional `## Recalled`/`### Recalled`, run log, what to index, and "For memory systems" with the four asks of §7.3). Edit the conductor's step 2 (add the bullet "What the trail already holds for this project: the artifact folders under `.singularskills/*/<project>/` and how many log lines name it.") and `singular-report` (the report quotes a `Recalled` section when an artifact has one).

- [ ] **Step 5: Run tests, regenerate, check.** `bunx vitest run` in both packages → PASS. `node dist/cli.js fix-skill-text ../../skills && node dist/cli.js gen-references ../.. && … --check` → 33 skills changed, both checks clean; `grep -l '^\*\*Recall\.\*\*' skills/*/SKILL.md | wc -l` → 33; `ls skills/design-empathize/references/memory/trail.md` exists.

- [ ] **Step 6: Full checks and commit.**

```bash
git add packages skills references/memory
git commit -m "feat(pack-tools): recall step for first-phase members; the artifact trail contract"
```

---

### Task 5: `singular-init` writes the Stack section; docs

**Files:**
- Modify: `skills/singular-init/SKILL.md` (new Process step 4b and the "update the Stack section only" offer in step 1), `skills/singular-detect/SKILL.md` (one line in step 1's output: `matches profile: <id>` using the two rules)
- Modify: `AGENTS.md` (Stack section: full key set and the profile pointer; one sentence in §"How a skill…" about stack-aware skills), `README.md` (one sentence under the install/try section), `apps/docs/content/docs/overview/workflows.mdx` (artifact shape gains `## Recalled`)
- Create: `apps/docs/content/docs/overview/stack.mdx`, `apps/docs/content/docs/overview/memory.mdx`; add `"stack"` after `"storage"` under `---Memory---` and `"memory"` after `"artifacts"` in `apps/docs/content/docs/overview/meta.json`
- Regenerate: `apps/docs/lib/site-data.json`, `lib/search-commands.json` (`bun run gen:data`), `bun run codemod`

**Interfaces:**
- Consumes: spec §4 (declaration), §5 (profiles), §7 (trail), the two profiles' "Declare it" blocks (quoted on `stack.mdx`).
- Produces: nothing other tasks consume.

- [ ] **Step 1: `singular-init`.** Step 1 gains: "If `.singularskills/` exists, also offer to update only the `Stack` section of `AGENTS.md`." New step 4b, "**Write the Stack section**": read `package.json` (name `stack` from `engines`/`packageManager`/dependencies: TypeScript, Next.js, React, Bun with versions), `Cargo.toml` + `rust-toolchain.toml` (Rust <toolchain>, edition), `package.json` scripts / `justfile` / `Makefile` for `install`, `build`, `test`, `lint`, `format`, `typecheck`, `run` (take a script only when its name matches; leave a key out otherwise); `layout` from the top-level folders present; `profile: bun-react-ts` when `packageManager` starts with `bun@` and both `next` and `react` are dependencies, `profile: rust-gpui` when a Cargo workspace member depends on `gpui`; write the fenced block under `## Stack` in `AGENTS.md` (create the file with the one-paragraph intro "This project uses singularskills; the Stack section below tells its skills how to build, test and lint it."), or in `CLAUDE.md` when only that file exists; replace an existing `## Stack` section in place. `singular-detect` step 1 output gains the `matches profile` line with the same two rules.

- [ ] **Step 2: Docs.** `stack.mdx`: the declaration (spec §4 block), how a stack-aware skill uses it (the step's behaviour in words), the two profiles with their paste-ready blocks, how to add a profile. `memory.mdx`: the trail contract (from `trail.md`), the recall step in words, what `singularrag` needs to see the trail (§7.3). `workflows.mdx` artifact shape: the optional `Recalled` section. `AGENTS.md` Stack section: the full key set, "a `profile` names a file in `references/stacks/`", "skills with `metadata.stack-aware: true` read it". README: "Declare your stack once (`/singular-init` writes it); skills that build, test or review read it."

- [ ] **Step 3: Checks.** `bun run lint:skills && bun run check:pack && (cd apps/docs && bun run gen:data && bun run codemod && bun run check) && bun run evals --dry && SKIP_NETWORK_TESTS=1 bun run test && bun run check` → exit 0. `fix-skill-text --check` clean (the hand edits must not touch generated paragraphs).

- [ ] **Step 4: Commit.**

```bash
git add skills/singular-init skills/singular-detect AGENTS.md README.md apps/docs
git commit -m "feat(singular): init writes the Stack section; docs for stack profiles and the memory seam"
```

---

### Task 6: Acceptance

**Files:**
- Create: `docs/superpowers/plans/2026-10-30-stack-and-memory-acceptance.md`

- [ ] **Step 1: Counts and checks** (spec §10.1 to §10.3): the two `grep -l … | wc -l` counts (14, 33), `fix-skill-text --check`, `gen-references --check`, `lint:skills`, the profile commit lines (`head -3 references/stacks/*.md`), `ls skills/development-test/references/stacks`.

- [ ] **Step 2: Manual stack checks** (§10.4, §10.6). Copy each boilerplate's working tree to a scratch directory without `.git` (`rsync -a --exclude .git --exclude node_modules --exclude target`), run `claude -p` there with `--plugin-dir <this worktree> --allowedTools Read,Write,Edit,Glob,Grep,Skill,Bash --max-turns 12`: (a) `/singular-init` and record the written `## Stack` section; run it again and confirm one section; (b) `/development-test demo` and record the test command it ran or proposed (`bun run test:services` / `just test`, never `npm` or bare `cargo test`); (c) `/development-review demo` and record the profile rule it cites. Paste the relevant lines.

- [ ] **Step 3: Manual recall check** (§10.5). In a scratch project with `.singularskills/design/date-picker/01-empathize.md` and `02-define.md` (frontmatter + Decisions) and a log with two `phase-approved` lines, run `/design-empathize date-picker` by name and record its `## Recalled` section. If `singularrag`'s MCP server is configured in this session (`claude mcp list`), run it again with the server connected and record whether the section names the tool; otherwise record "singularrag not connected" and the §7.3 asks.

- [ ] **Step 4: Write the record** with commands, verbatim outputs and the three transcripts' relevant lines; commit.

```bash
git add docs/superpowers/plans/2026-10-30-stack-and-memory-acceptance.md
git commit -m "docs: stack profiles and memory seam acceptance record"
```
