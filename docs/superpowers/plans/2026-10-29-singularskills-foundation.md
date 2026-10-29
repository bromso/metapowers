# Singularskills Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the metapowers plugin suite into singularskills: a flat, spec-conformant skill pack with workflow files, a conductor skill, portable gates, a run log, and thin per-agent adapters, installed through the universal `skills` installer.

**Architecture:** The 283 skills move from `plugins/<domain>/skills/<skill>/` to `skills/<domain>-<skill>/` by a one-shot, tested migration command in the renamed `pack-tools` package, which also rewrites paths, names and the Arguments paragraph. Workflows become `workflows/*.yml` (the single source for gates, the conductor and the validators); gate scripts and adapters are generated from them with `--check` parity in CI. The docs app regenerates from the flat pack; the installer and the Figma server packages are deleted.

**Tech Stack:** Bun 1.3.12, Turborepo, TypeScript, Vitest 3, Biome (tabs, width 100), `glob`, `gray-matter`, `yaml` (new, in pack-tools), POSIX sh for gate scripts, Next 16 + Fumadocs for docs.

**Spec:** `docs/superpowers/specs/2026-10-26-singularskills-foundation-design.md`

## Global Constraints

- Every `SKILL.md` keeps only `name`, `description`, `allowed-tools`, `metadata` at the top level; `metadata` may hold `argument-hint`, `disable-model-invocation`, `workflow`, `phase`, `artifact` (spec §6.1, §9).
- Skill `name` equals its folder name, `<domain>-<skill>`, matching `/^[a-z0-9-]{1,64}$/`. Descriptions keep today's rules (verb-first, "Use when …" ≥ 6 words, 120–400 chars).
- Artifact root is `.singularskills/<workflow>/<project>/`; the run log is `.singularskills/log.jsonl` (spec §6.5). No `skip-log.md`, no `METAPOWERS_SKIP_CHECKS`.
- A phase is complete when the run log holds `phase-approved` for it; gates check artifacts only (spec §6.2, §6.4).
- No MCP server, no `.mcp.json`, no network call in any skill or script (spec §3).
- The `skills/` folder is the only copy of skill text. Adapters and per-skill reference copies are generated and checked, never hand-edited (spec §7, anti-goals).
- Tier 1 agents: Claude Code, Codex, OpenCode, Cursor, GitHub Copilot, Gemini CLI, Kimi Code CLI (spec §7).
- History is exempt from the "no `metapowers`" rule: `CHANGELOG.md` files, `docs/plans/**`, `docs/superpowers/**` (spec §10a).
- The pack is 283 skills: 282 carried over plus `workflow`; `metapowers/workflow` is deleted (spec §6.3).
- Commits: conventional (`feat(pack):`, `chore(rename):`, `docs:`), trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Prerequisite performed by the owner before Task 1: the GitHub repository is renamed to `bromso/singularskills` (spec §10a).

## Review Focus

1. A skill run outside any workflow in an agent that does not execute scripts: the gate must still be enforced by the Prerequisites prose (the "read … if it does not exist, stop" sentence survives the rewrite). Pinned in Task 3's `migrate` tests.
2. A shared artifact whose first writer is not the first member listed (marketing's `01-reach.md` written by copywriting before seo-audit): the frontmatter block must be written once, by whoever creates the file, and never duplicated. Pinned in Task 3's Output-instruction test (the instruction every shared-artifact member carries says so).
3. `--skip-checks` in Claude Code with no prior run-log line (an old project, a hand-made folder): the hook must refuse, not crash, and the message must name the missing artifact. Pinned in Task 7's hook tests.
4. A project folder name containing a dot or a dash (`date-picker`, `v2.0`): gate scripts and the hook's path regex must match it. Pinned in Task 5 and Task 7 tests.
5. The universal installer copies skill folders only: any reference a skill links to must live inside that skill's folder after `gen-references`. Pinned in Task 4's test that every `references/` link in every skill resolves inside the skill.

---

## File structure

**Created**

- `workflows/<name>.yml` (19 files): 14 domain workflows + `build-feature`, `compliance-audit`, `launch-product`, `new-team`, `rebrand`.
- `references/<domain>/<file>.md`: canonical copies of today's `plugins/<domain>/shared/*` that two or more skills use (orphans deleted).
- `skills/<domain>-<skill>/` (283): `SKILL.md`, generated `references/` copies, generated `scripts/gate.sh` for phase members with `requires`.
- `skills/workflow/SKILL.md`: the conductor.
- `packages/pack-tools/src/workflows.ts`, `migrate.ts`, `gates.ts`, `references.ts`, `adapters.ts`, `rename-check.ts` (+ tests); `packages/pack-tools/hooks/gate-hook.sh`.
- `adapters/claude/{commands/*.md,hooks.json}`, `adapters/gemini/commands/*.toml`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `plugin.json` (Copilot CLI).
- `scripts/smoke-install.sh`, `scripts/check-rename.sh`.
- `apps/docs/content/docs/overview/workflows.mdx`, `apps/docs/content/docs/overview/agent-checklist.mdx`.
- `docs/superpowers/plans/2026-10-29-singularskills-foundation-acceptance.md`.

**Modified**: `packages/plugin-tools/*` → `packages/pack-tools/*`; `packages/skill-validator/src/{cli,plugin-rules,rules}.ts`; `apps/docs/{scripts,lib,app,components,content,next.config.mjs}`; root `package.json`, `turbo.json`, `README.md`, `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `.changeset/config.json`, `.claude-plugin/*`, `.github/workflows/*`, `scripts/run-evals.sh`, `evals/`.

**Deleted**: `plugins/` (after migration), `packages/create-metapowers`, `packages/figma-mcp`, `.cursorrules`, `plugins/design/.mcp.json`, `apps/docs/content/docs/development/mcp-server/`.

---

### Task 1: Rename plugin-tools to pack-tools and point discovery at a flat pack

**Files:**
- Move: `packages/plugin-tools/` → `packages/pack-tools/` (git mv; package name `@singularskills/pack-tools`)
- Modify: `packages/pack-tools/src/skills.ts`, `packages/pack-tools/src/cli.ts`, `packages/pack-tools/package.json`, `turbo.json`, root `package.json`
- Test: `packages/pack-tools/src/skills.test.ts`

**Interfaces:**
- Produces: `listSkills(packRoot: string): SkillFile[]` where `SkillFile = { name: string; domain: string; path: string; content: string }`, globbing `*/SKILL.md` under `packRoot` (`domain` = text before the first `-`, or `"singular"` for `workflow`); `assertPackRoot(packRoot: string): void`; `writeIfChanged(path, content): boolean` unchanged.
- Root scripts: `check:pack` replaces `check:plugins`; `turbo.json` `lint:skills.inputs` becomes `["../../skills/**", "../../workflows/**", "src/**"]`.

- [ ] **Step 1: Move the package and rename it**

```bash
git mv packages/plugin-tools packages/pack-tools
```
Edit `packages/pack-tools/package.json`: `"name": "@singularskills/pack-tools"`, devDependency `@singularskills/skill-validator` (rename that package's `name` in `packages/skill-validator/package.json` in the same commit). Add dependency `"yaml": "^2.8.0"`.

- [ ] **Step 2: Write the failing tests for flat discovery**

In `skills.test.ts`, replace the plugin-layout fixtures with a temp pack:
```ts
test("listSkills reads <domain>-<skill>/SKILL.md and splits the domain", () => {
	// fixture: skills/design-empathize/SKILL.md, skills/workflow/SKILL.md
	const found = listSkills(packRoot);
	expect(found.map((s) => s.name)).toEqual(["design-empathize", "workflow"]);
	expect(found[0].domain).toBe("design");
	expect(found[1].domain).toBe("singular");
});
test("assertPackRoot throws on a folder with no SKILL.md", () => { … });
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `cd packages/pack-tools && bunx vitest run src/skills.test.ts`
Expected: FAIL (old signature `listSkills(pluginsRoot)` returns `{plugin, skill}`).

- [ ] **Step 4: Implement `listSkills`, `assertPackRoot`; rename usages in `cli.ts`**

`cli.ts` usage text becomes `pack-tools <command> <packRoot|repoRoot> [--check]`. Leave the other modules compiling (they still read `plugin`/`skill` fields; Task 3 rewrites them). Where they destructure `plugin`, map `domain` → `plugin` and `name` → `skill` for now via a small `legacy(skill: SkillFile)` helper so Task 1 stays mechanical.

- [ ] **Step 5: Run the package tests and build**

Run: `cd packages/pack-tools && bun run build && bunx vitest run`
Expected: `skills.test.ts` PASS; other suites still PASS (their fixtures are rewritten in Task 3; until then keep their temp fixtures in the old layout by giving them a `plugins/`-style root and calling `legacy`).

- [ ] **Step 6: Rewire root scripts**

Root `package.json`: `"check:pack": "turbo run check"`, drop `check:plugins`. `turbo.json` `lint:skills.inputs` as above. `CLAUDE.md`: replace `check:plugins` with `check:pack` (the full CLAUDE.md rewrite is Task 10).

- [ ] **Step 7: Commit**

```bash
git add -A packages/pack-tools packages/skill-validator/package.json package.json turbo.json CLAUDE.md
git commit -m "chore(pack): rename plugin-tools to pack-tools and read a flat skills/ pack"
```

---

### Task 2: Workflow files and their validator

**Files:**
- Create: `workflows/*.yml` (19), `packages/pack-tools/src/workflows.ts`
- Test: `packages/pack-tools/src/workflows.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type Phase = { phase: number; title: string; artifact: string; requires: string[]; skills: string[] };
  export type Workflow = { name: string; title: string; folder: string; phases: Phase[] };
  export function loadWorkflows(dir: string): Workflow[];              // parses every *.yml with `yaml`
  export function checkWorkflows(workflows: Workflow[], skills: SkillFile[]): string[]; // violations, [] when clean
  ```
  Violations (exact strings used by tests): `"<wf>: phase <n> requires <file> which no earlier phase produces"`, `"<wf>: phase <n> names unknown skill <name>"`, `"<skill>: metadata.workflow <wf> has no workflow file"`, `"<skill>: metadata.phase <n> is not a phase of <wf>"`, `"<skill>: listed in <wf> phase <n> but metadata says <other>"`.
- CLI: `pack-tools check-workflows <repoRoot>` (checker; exit 1 on violations).

- [ ] **Step 1: Write the 19 workflow files**

Derive the 14 domain workflows from `plugins/<domain>/hooks/phase-deps.json` (`requires`), `plugins/metapowers/shared/domain-registry.md` (phase files and titles) and each skill's write target (`writeTargets` in `phase-files.ts`): a phase per numbered artifact, `skills:` = every skill whose write target is that artifact, in today's `meta.json` page order for the domain. Exact shape per spec §6.2; compliance phase 1 has `artifact: 01-assess/` (folder). The five cross-domain workflows transcribe `plugins/metapowers/shared/workflows/*.md` step lists: one phase per step, `artifact` = that skill's own artifact, `requires: []` (the member's own gate applies), `folder` = the step skill's domain folder, so cross-domain runs write into the domains' own folders.

- [ ] **Step 2: Write the failing tests**

```ts
test("loadWorkflows parses design.yml with five phases in order", () => {
	const wf = loadWorkflows("workflows").find((w) => w.name === "design");
	expect(wf?.phases.map((p) => p.artifact)).toEqual(["01-empathize.md", "02-define.md", "03-ideate.md", "04-prototype.md", "05-test.md"]);
	expect(wf?.phases[3].requires).toEqual(["02-define.md", "03-ideate.md"]);
});
test("checkWorkflows flags a requires that nothing produces", …"design: phase 2 requires 09-x.md which no earlier phase produces");
test("checkWorkflows flags a member whose metadata names another workflow", …);
test("every workflow file in the repo is clean against the pack", () => expect(checkWorkflows(loadWorkflows("workflows"), listSkills("skills"))).toEqual([]));  // skipped until Task 3 lands: `test.skip` with a TODO naming Task 3
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `bunx vitest run src/workflows.test.ts` — Expected: FAIL, module missing.

- [ ] **Step 4: Implement `workflows.ts` and wire `check-workflows` into `cli.ts`'s `checkers` map**

- [ ] **Step 5: Run the tests**

Run: `bunx vitest run src/workflows.test.ts` — Expected: PASS (the repo-wide test skipped).

- [ ] **Step 6: Commit**

```bash
git add workflows packages/pack-tools/src/workflows.ts packages/pack-tools/src/workflows.test.ts packages/pack-tools/src/cli.ts
git commit -m "feat(pack): workflow files and their validator"
```

---

### Task 3: The migration command: move 283 skills into the flat pack

**Files:**
- Create: `packages/pack-tools/src/migrate.ts`
- Modify: `packages/pack-tools/src/{args,content-blocks,counts,frontmatter,phase-files,shared-refs}.ts` and their tests (new layout, new paths), `packages/pack-tools/src/cli.ts`
- Delete after running: `packages/pack-tools/src/hooks.ts`, `hooks.test.ts`, `phase-deps.ts`, `phase-deps.test.ts`, `packages/pack-tools/hooks/{hooks.json,design-extra.json,phase-gate.sh}` (replaced in Task 7)
- Test: `packages/pack-tools/src/migrate.test.ts`

**Interfaces:**
- Produces: `migrate(repoRoot: string, workflows: Workflow[]): MigrationReport` where `MigrationReport = { moved: number; deleted: string[]; rewrites: Record<string, number> }`; pure helpers exported for tests: `flatName(domain, skill): string` (`metapowers` → `singular`), `rewriteBody(content: string, ctx: { domain: string; name: string; workflow?: Workflow; phase?: Phase }): string`, `newFrontmatter(parsed, ctx): string`.
- `ARGS_PARAGRAPH(workflow: string, slugRule)` in `args.ts` becomes the new standard paragraph (exact text, also the validator's `STANDARD_ARGS_PARAGRAPH` in Task 4):

  > **Arguments.** `$ARGUMENTS` may contain the project name and optional flags. Take the first token as `<project>` and treat `--skip-checks` as a flag; never include flags in file paths. All paths below use `<project>`. If `--skip-checks` is present, skip the prerequisite check and, **before writing any artifact**, append one line to `.singularskills/log.jsonl`: `{"ts":"<ISO timestamp>","skill":"<skill name>","workflow":"<workflow>","phase":<phase>,"project":"<project>","event":"skipped","artifact":"<artifact file>","note":"<reason or \"none given\">"}`.

  (The basename variant keeps its first sentence as today.)
- `rewriteBody` rules, in order: `.metapowers/<domain>/` → `.singularskills/<domain>/` (folders keep the domain name; `metapowers` → `singular`); `/<domain>:<skill>` → `/<domain>-<skill>` (`/metapowers:x` → `/singular-x`); `` `${CLAUDE_PLUGIN_ROOT}/shared/<file>` `` → `` `references/<file>` ``; the old Arguments paragraph → the new one; any sentence mentioning `skip-log.md` removed; `## Prerequisites` of a phase member with `requires` gains, as its first paragraph: "Run `scripts/gate.sh <project>` from this skill's folder. If it exits non-zero, stop and tell the user what it printed (unless `--skip-checks`, see Arguments)." and keeps the existing "Read … If this file does not exist …" text; the `## Output` section of every phase member ends with the exact text block from spec §6.5 (frontmatter example and the two closing sections, phrased as an instruction: "End the artifact (or your section of a shared artifact) with `## Decisions` and `## Open questions` …"); design skills whose body mentions `mcp__`/Figma tools get the one-line note from spec §8 as their first body paragraph.
- `newFrontmatter`: `name` = flat name; `description` unchanged; `argument-hint` and `disable-model-invocation` move under `metadata`; `metadata.workflow/phase/artifact` from the workflow that lists the skill (none for utilities). Key order: `name, description, metadata`.
- Moves: `plugins/<d>/skills/<s>/` → `skills/<flat>/` (whole folder, so any existing sub-files travel); `plugins/<d>/shared/<f>` → `references/<d>/<f>` when ≥ 2 skills reference it, else into the single consumer's `skills/<flat>/references/<f>`; orphans (`accounting-cycle-guide.md`, `bookkeeping-cycle-guide.md`, `fpa-framework-guide.md`, `legal-lifecycle-guide.md`, `metapowers/shared/workflows/*`, `domain-registry.md`) deleted; `plugins/<d>/evals/<s>/` → `evals/<flat>/`; `plugins/metapowers/skills/workflow` deleted (not moved); everything else under `plugins/` deleted at the end.
- `counts.ts` rule (b) now reads `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json` only; rule (c) reads `apps/docs/lib/domains.ts` and `site-data.json` as today but counts `skills/<domain>-*` per domain (`singular` ↔ docs slug `overview`).
- `content-blocks.ts`, `phase-files.ts` (`WRITE_LINE` now matches `.singularskills/`), `shared-refs.ts` (rewrites to `references/<file>`) keep their behaviour under the new paths; `frontmatter.ts`'s `fixFrontmatter` enforces the new key order and `metadata` placement; `FREE_TEXT_HINTS` keys become flat names; `MODEL_INVOCATION_DISABLED` = `singular-find-skill, singular-create-skill, singular-improve-skill, singular-init`.

- [ ] **Step 1: Write the failing tests for the pure helpers**

```ts
test("flatName maps metapowers to singular", () => expect(flatName("metapowers", "status")).toBe("singular-status"));
test("rewriteBody rewrites artifact paths, skill refs and shared refs", () => {
	const out = rewriteBody("Read `.metapowers/design/<project>/01-empathize.md`; see /design:ideate and `${CLAUDE_PLUGIN_ROOT}/shared/wcag-criteria.md`", ctxDesignDefine);
	expect(out).toContain("`.singularskills/design/<project>/01-empathize.md`");
	expect(out).toContain("/design-ideate");
	expect(out).toContain("`references/wcag-criteria.md`");
});
test("rewriteBody replaces the Arguments paragraph and drops skip-log sentences", …expect(out).not.toMatch(/skip-log\.md/); expect(out).toContain('"event":"skipped"'));
test("rewriteBody adds the gate step to a phase member's Prerequisites and keeps the stop sentence", …expect(out).toMatch(/Run `scripts\/gate\.sh <project>`/); expect(out).toMatch(/If this file does not exist, tell the user/));
test("rewriteBody appends the Decisions and Open questions instruction to a phase member's Output", …);
test("a shared-artifact member's Output instruction says the frontmatter is written once, by whoever creates the file, and each section opens with the italic skill line", …expect(out).toMatch(/frontmatter .* once/i); expect(out).toContain("*<skill name> · <ISO timestamp> · gate: <passed|skipped>*"));
test("newFrontmatter moves argument-hint under metadata and adds workflow membership", () => {
	expect(newFrontmatter(parsed("name: empathize\ndescription: …\nargument-hint: \"[project]\""), ctxDesignEmpathize))
		.toBe('---\nname: design-empathize\ndescription: …\nmetadata:\n  argument-hint: "[project]"\n  workflow: design\n  phase: 1\n  artifact: 01-empathize.md\n---');
});
test("a utility skill gets no workflow metadata", …);
test("migrate on a two-domain fixture moves folders, splits shared files by usage and deletes plugins/", () => {
	// fixture: plugins/design/{skills/empathize,skills/ideate,shared/{wcag-criteria.md (used by both), lonely.md (used by one), orphan.md}}, plugins/metapowers/skills/{workflow,status}
	const report = migrate(tmp, loadWorkflows(fixtureWorkflows));
	expect(existsSync(join(tmp, "skills/design-empathize/SKILL.md"))).toBe(true);
	expect(existsSync(join(tmp, "references/design/wcag-criteria.md"))).toBe(true);
	expect(existsSync(join(tmp, "skills/design-ideate/references/lonely.md"))).toBe(true);
	expect(existsSync(join(tmp, "skills/singular-workflow"))).toBe(false);
	expect(existsSync(join(tmp, "plugins"))).toBe(false);
	expect(report.deleted).toContain("plugins/design/shared/orphan.md");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `bunx vitest run src/migrate.test.ts` — Expected: FAIL, module missing.

- [ ] **Step 3: Implement `migrate.ts` and update the sibling modules and their tests to the new layout**

Add `migrate` to `cli.ts` as a one-shot command (`pack-tools migrate <repoRoot>`), refusing to run when `skills/` already exists.

- [ ] **Step 4: Run the package tests**

Run: `bun run build && bunx vitest run` — Expected: all PASS.

- [ ] **Step 5: Run the migration on the repository**

Run: `node packages/pack-tools/dist/cli.js migrate .`
Expected: prints `moved 282, deleted N`, `skills/` has 282 folders, `plugins/` is gone, `git status` shows renames. Then un-skip Task 2's repo-wide test and run it: `bunx vitest run src/workflows.test.ts` — Expected: PASS (fix any workflow file that disagrees with the moved skills' metadata; the workflow file is the source of truth, the skill follows).

- [ ] **Step 6: Commit the move as its own commit, then the tooling**

```bash
git add -A skills references evals plugins
git commit -m "chore(pack): move 282 skills into the flat skills/ pack"
git add -A packages/pack-tools
git commit -m "feat(pack): migration command and layout-aware rules"
```

---

### Task 4: skill-validator for the flat pack

**Files:**
- Modify: `packages/skill-validator/src/{cli,plugin-rules,rules,parse-skill}.ts`, `packages/skill-validator/package.json` (`lint:skills` → `node dist/cli.js ../../skills`)
- Test: `packages/skill-validator/src/{rules,plugin-rules,cli}.test.ts`

**Interfaces:**
- `discoverSkills(rootDir)` globs `*/SKILL.md`; `discoverSharedDocs(rootDir)` globs `**/references/**/*.md` and `../references/**/*.md`.
- `buildPackContext(packRoot): PackContext = { skillNames: string[]; workflows: Workflow[]; multiWriterFiles: Map<string, string[]> }` (replaces `PluginContext`; reads `workflows/` through `@singularskills/pack-tools`' `loadWorkflows`).
- New rule `frontmatter-shape` (error): top-level keys ⊆ `{name, description, allowed-tools, metadata}`; `metadata` keys ⊆ `{argument-hint, disable-model-invocation, workflow, phase, artifact}`; `argument-hint-present` reads `metadata.argument-hint`.
- `artifact-root` allows `.singularskills/<own workflow folder>/` for phase members, any `.singularskills/` read for `singular-*` and the `CROSS_DOMAIN_READS` map (unchanged pairs, flat names); `.metapowers/` anywhere is an error (`"legacy artifact root"`).
- `skill-ref-exists` matches `` `/<name>` `` where `<name>` is a flat name; `/<domain>:<skill>` is an error (`"legacy skill reference"`).
- `reference-resolvable`: every `` `references/<path>` `` in a body exists at `skills/<name>/references/<path>` (after Task 5's generator runs) — the rule checks the file, not the canonical copy.
- `skip-checks-standard` matches the new `STANDARD_ARGS_PARAGRAPH` (exact text from Task 3); the cross-package equality test stays.
- `phase-file-append` uses `multiWriterFiles` computed from workflow phases with ≥ 2 skills.

- [ ] **Step 1: Write the failing tests** (one per rule above, each with a passing and a failing SKILL.md string; plus `cli.test.ts`: the real pack passes, `test.skip` until Task 5 generates references).

- [ ] **Step 2: Run tests to verify they fail** — `cd packages/skill-validator && bunx vitest run` — Expected: FAIL on the new rules.

- [ ] **Step 3: Implement** — pack-tools becomes a dependency of skill-validator for `loadWorkflows` (or copy the YAML loader; the plan's call: import it, the duplication rule applies only to text constants).

- [ ] **Step 4: Run tests** — Expected: PASS.

- [ ] **Step 5: Commit** — `git commit -m "feat(validator): flat pack rules — frontmatter shape, workflow membership, references"`

---

### Task 5: Generated gate scripts and reference copies

**Files:**
- Create: `packages/pack-tools/src/gates.ts`, `packages/pack-tools/src/references.ts`, `packages/pack-tools/templates/gate.sh`
- Test: `packages/pack-tools/src/gates.test.ts`, `references.test.ts`

**Interfaces:**
- `genGates(repoRoot, workflows, { check }): string[]` writes `skills/<member>/scripts/gate.sh` (mode 0755) for every member of a phase with non-empty `requires`, from `templates/gate.sh` with `REQUIRED='<space-separated artifacts>'` and `FOLDER='<workflow folder>'` substituted; removes stale gate scripts from skills no longer gated. `--check` returns the paths that would change.
- `templates/gate.sh` (POSIX sh): usage `gate.sh <project> [root]`; `root` defaults to `.`; checks `${root}/.singularskills/${FOLDER}/${project}/<artifact>` for each required artifact: a file must exist and be non-empty, an artifact ending in `/` must be a directory with at least one file; prints `gate: <project> needs <a>, <b> first` to stderr and exits 1 when any is missing; exits 0 otherwise. No `jq`, no bash-isms.
- `genReferences(repoRoot, { check }): string[]`: for every skill, every `` `references/<path>` `` link in its body must resolve to `references/<domain>/<path>` (canonical) or already exist only inside the skill (single-consumer file); canonical ones are copied into `skills/<name>/references/<path>`; copies that differ from canonical are overwritten; copies with no link are deleted. Links of the form `` `references/workflows/<name>.yml` `` resolve to `workflows/<name>.yml` and are copied the same way (the `workflow` skill, Task 6, links every workflow file). `--check` lists differences.
- CLI: `gen-gates`, `gen-references` (generators). `packages/pack-tools/package.json` `check` becomes: `check-workflows ../.. && gen-gates ../.. --check && gen-references ../.. --check && fix-args ../../skills --check && fix-phase-files ../../skills --check && fix-frontmatter ../../skills --check && fix-disclaimer ../../skills --check && fix-compute ../../skills --check && check-counts ../..`.

- [ ] **Step 1: Write the failing tests**

```ts
test("gate.sh exits 1 and names the missing artifact, then 0 once it exists", () => {
	// run the generated script with sh in a temp project "date-picker.v2"
	expect(run("sh", [gate, "date-picker.v2", tmp]).status).toBe(1); expect(stderr).toContain("needs 01-empathize.md first");
	writeFileSync(`${tmp}/.singularskills/design/date-picker.v2/01-empathize.md`, "x");
	expect(run(...).status).toBe(0);
});
test("a folder artifact counts as present only with a file inside", …);
test("genGates writes scripts for gated members only and removes stale ones", …);
test("genReferences copies canonical files into consumers and reports drift with --check", …);
test("every references/ link in every skill resolves inside that skill", () => { for each skill in listSkills("skills") … expect(existsSync(join(skill.dir, link))).toBe(true) });
```

- [ ] **Step 2: Run to verify failure** — Expected: FAIL.

- [ ] **Step 3: Implement, run both generators on the repo, un-skip the validator's `cli.test.ts` repo test**

Run: `node packages/pack-tools/dist/cli.js gen-gates . && node packages/pack-tools/dist/cli.js gen-references .`

- [ ] **Step 4: Run** `bun run lint:skills` and `cd packages/pack-tools && bun run check` — Expected: both exit 0 (fix skills whose rewritten text the rules reject; the rules are the authority).

- [ ] **Step 5: Commit** — two commits: the generators, then the generated files (`chore(pack): generate gate scripts and reference copies`).

---

### Task 6: The conductor skill, run log, status and report

**Files:**
- Create: `skills/workflow/SKILL.md`, `skills/workflow/references/run-log.md`, `evals/workflow/{case.yaml,prompt.md,scaffold.sh,graders/*.md}`
- Modify: `skills/singular-status/SKILL.md`, `skills/singular-report/SKILL.md`
- Test: `packages/pack-tools/src/conductor.test.ts`

**Interfaces:**
- `skills/workflow/SKILL.md` frontmatter: `name: workflow`, description "Run a workflow phase by phase for a project, asking before each phase writes and pausing for approval at every boundary. Use when the user wants to start, continue or resume a structured workflow such as design, research, development or launch-product. Not for a single skill; invoke that skill by name.", `metadata.argument-hint: "<workflow> <project>"`.
- Process: spec §6.3 steps 1–5 verbatim in the skill's own words, including: reading `workflows/<name>.yml` relative to the pack (the skill text says "the `workflows/` folder next to the `skills/` folder of this pack; if it is not there, the `workflows/<name>.yml` file bundled in this skill's `references/`"). The skill body links `` `references/workflows/<name>.yml` `` for every workflow, so Task 5's `genReferences` copies them into `skills/workflow/references/workflows/`.
- Run-log lines the conductor writes (exact JSON shape from spec §6.5): `run-started`, `phase-approved`, `run-finished`. Completion test: a phase is complete only with a `phase-approved` line for `{workflow, project, phase}`.
- `singular-status`: scans `.singularskills/*/*/` and `log.jsonl`; a phase shows "approved" (log), "written" (artifact present, no approval) or "missing". `singular-report`: reads artifact frontmatter and the **Decisions** sections; writes `.singularskills/reports/<project>-report.md`.
- `conductor.test.ts` is a text test: the SKILL.md contains the five mandatory behaviours as sentences (stop after each phase, approval recorded as `phase-approved`, resume at first unapproved phase, subset of members by name, never writes an artifact itself) — pinned by `expect(body).toMatch(/…/)` for each, so a later edit cannot silently drop one.

- [ ] **Step 1: Write the failing text tests and the eval case** (`prompt.md`: "Start the design workflow for date-picker"; graders: `fired.md` (the workflow skill was used), `asks.md` (at least one question before writing), `stops.md` (the turn ends with an approval question), `log.md` (`run-started` line exists)).
- [ ] **Step 2: Run** `bunx vitest run src/conductor.test.ts` — Expected: FAIL (file missing).
- [ ] **Step 3: Write the three skills.**
- [ ] **Step 4: Run** the text tests, `bun run lint:skills`, `bun run evals --dry` — Expected: PASS, PASS, 17 cases listed, exit 0.
- [ ] **Step 5: Commit** — `feat(pack): workflow conductor, run log, status and report`

---

### Task 7: Claude adapter: manifest, command wrappers, gate hook

**Files:**
- Create: `packages/pack-tools/src/adapters.ts` (+ test), `packages/pack-tools/hooks/gate-hook.sh`, `adapters/claude/hooks.json`, `adapters/claude/commands/*.md` (generated), `.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json`
- Test: `packages/pack-tools/src/adapters.test.ts`, `packages/pack-tools/src/gate-hook.test.ts`

**Interfaces:**
- `.claude-plugin/plugin.json`: `{ name: "singularskills", version: "1.0.0", description: "Structured, repeatable workflows for digital production domains: 283 skills across 16 domains, run as gated workflows", skills: "./skills", commands: "./adapters/claude/commands", hooks: "./adapters/claude/hooks.json", … }`. `marketplace.json`: one plugin entry `singularskills`, `pluginRoot: "."`.
- `genAdapters(repoRoot, { check })`: writes `adapters/claude/commands/<name>.md` for every skill: frontmatter `description` (copied), `argument-hint` (from `metadata.argument-hint`), `disable-model-invocation` (from metadata), body: `Use the \`<name>\` skill with these arguments: $ARGUMENTS`; writes `adapters/gemini/commands/<name>.toml` (`description`, `prompt = "Use the <name> skill with these arguments: {{args}}"`), `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json` (name, version, description, `skills: "./skills"`), root `plugin.json` for Copilot CLI (same fields). `--check` lists drift. CLI: `gen-adapters`, added to the package `check` chain.
- `gate-hook.sh` (bash, `PreToolUse` for `Write|Edit|MultiEdit`): reads the tool JSON; ignores paths without `/.singularskills/`; matches `.singularskills/<folder>/<project>/<NN>-…` (project may contain dots and dashes); finds the workflow file for `<folder>` under `${CLAUDE_PLUGIN_ROOT}/workflows/`, reads that phase's `requires` (via a tiny `yaml`-free parse: the generator also emits `adapters/claude/gates.json` `{ "<folder>": { "<NN>": [artifacts] } }` and the hook reads that with `jq`, as today); exits 0 when all present; otherwise, if `.singularskills/log.jsonl` contains a line with `"event":"skipped"` and `"artifact":"<target basename>"` and `"project":"<project>"`, exits 0; else prints `singularskills gate: <folder>/<project> phase <NN> needs <a>, <b> first. Re-run with --skip-checks.` and exits 2. No environment-variable bypass. Missing `jq` → exit 0 (as today).
- `adapters/claude/hooks.json`: the single `PreToolUse` entry pointing at `"${CLAUDE_PLUGIN_ROOT}"/adapters/claude/gate-hook.sh` (the generator copies `packages/pack-tools/hooks/gate-hook.sh` there).

- [ ] **Step 1: Write the failing tests**

```ts
test("gate-hook exits 2 and names the missing artifact for phase 2 with no 01", …);
test("gate-hook exits 0 when log.jsonl has a skipped event for that artifact and project", …);
test("gate-hook ignores a skipped event for another project", …);
test("gate-hook exits 0 for a project folder named v2.0-beta once the artifact exists", …);
test("genAdapters writes a command wrapper per skill carrying metadata.argument-hint", …);
test("genAdapters --check reports a hand-edited wrapper", …);
```

- [ ] **Step 2: Run to verify failure.** — Expected: FAIL.
- [ ] **Step 3: Implement; run `gen-adapters .`; run `claude plugin validate . --strict`** — Expected: valid.
- [ ] **Step 4: Run tests and `bun run check:pack`** — Expected: PASS.
- [ ] **Step 5: Commit** — `feat(adapters): Claude plugin manifest, command wrappers and run-log-aware gate hook`

---

### Task 8: Other adapters and the install smoke test

**Files:**
- Create: `scripts/smoke-install.sh`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `plugin.json`, `adapters/gemini/commands/*.toml` (all generated by Task 7's generator; this task verifies them)
- Modify: `README.md` (install section only; the rest in Task 10)
- Test: `packages/pack-tools/src/smoke-install.test.ts` (runs the script)

**Interfaces:**
- `scripts/smoke-install.sh [--agent <id>]`: creates a temp project, runs `npx -y skills@latest add <repoRoot or bromso/singularskills> --agent <id> -y` for each of `claude-code codex opencode cursor github-copilot gemini-cli kimi-code-cli`, asserts the expected folder (`.claude/skills/` or `.agents/skills/`) holds 283 `SKILL.md` and that `design-define-component/scripts/gate.sh` is present and executable; then runs the gate fixture (exit 1, then 0). With `--local` it installs from the local path (CI); without, from GitHub.

- [ ] **Step 1: Write the failing test** that runs `scripts/smoke-install.sh --local --agent codex` and expects exit 0 and the line `codex: 283 skills, gate ok`.
- [ ] **Step 2: Run** — Expected: FAIL (script missing).
- [ ] **Step 3: Write the script; update README's Install section** with the three commands from spec §7 (universal, Claude marketplace, Codex marketplace) and the Tier 1 / Tier 2 lists.
- [ ] **Step 4: Run the smoke test for all seven agents locally** — Expected: seven `ok` lines.
- [ ] **Step 5: Commit** — `feat(adapters): Codex, Copilot and Gemini adapters; install smoke test`

---

### Task 9: Removals: installer, Figma server, MCP docs, per-domain manifests

**Files:**
- Delete: `packages/create-metapowers/`, `packages/figma-mcp/`, `apps/docs/content/docs/development/mcp-server/`, `.cursorrules`
- Modify: `.github/workflows/{ci,release,validate-skills}.yml` (filters and paths), `.changeset/config.json` (`repo: "bromso/singularskills"`), `apps/docs/content/docs/development/meta.json` (drop `mcp-server`), `apps/docs/lib/domains.ts`/`site-data.json` (via `gen:data` in Task 11), `skills/design-*/SKILL.md` already carry the note from Task 3
- Test: `apps/docs/lib/site.test.ts` (no `mcp-server` route), `packages/pack-tools/src/rename-check.test.ts` (Task 10 adds the rule; here just the deletions)

- [ ] **Step 1: Delete the packages and pages; update CI filters** — `release.yml` builds and publishes nothing but still opens version PRs (`turbo build --filter=@singularskills/skill-validator`; `release` script becomes `changeset publish`); `ci.yml` test job filter → `{@singularskills/skill-validator,@singularskills/pack-tools}`; `validate-skills.yml` paths → `skills/**`, `workflows/**`, `references/**`, `adapters/**`, `packages/**`, `.claude-plugin/**`, `README.md`, `CLAUDE.md`, `AGENTS.md`, `apps/docs/{app,content,scripts,lib}/**`.
- [ ] **Step 2: Run** `bun install && bun run build && bun run test` — Expected: PASS with the two packages gone.
- [ ] **Step 3: Final `create-metapowers` release note**: add to `packages/` nothing; instead append to root `CHANGELOG.md`: "create-metapowers is retired; use `npx skills add bromso/singularskills`." (The npm deprecation command `npm deprecate create-metapowers "…"` is an owner action, listed in the acceptance file.)
- [ ] **Step 4: Commit** — `chore: remove create-metapowers, figma-mcp and the MCP docs`

---

### Task 10: Rename everything else and enforce it

**Files:**
- Create: `packages/pack-tools/src/rename-check.ts`, `scripts/check-rename.sh`
- Modify: root `package.json` (`name: "singularskills"`), `README.md`, `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `.github/ISSUE_TEMPLATE/*`, `evals/*/prompt.md` and fixtures (`.metapowers/` → `.singularskills/`), `scripts/run-evals.sh` (flat `evals/<skill>/`, dry rule: prompt must not name its own skill or `/<skill>`)
- Test: `packages/pack-tools/src/rename-check.test.ts`, `packages/pack-tools/src/evals-dry.test.ts`

**Interfaces:**
- `checkRename(repoRoot): string[]` returns `path:line` for every occurrence of `metapowers` (case-insensitive) outside the allowlist `CHANGELOG.md`, `packages/*/CHANGELOG.md`, `docs/plans/**`, `docs/superpowers/**`, `.git/**`, `node_modules/**`, `apps/docs/out/**`, `apps/docs/.next/**`, `bun.lock`, and the single migration note in `README.md` (the line matching `^> Migrating from metapowers:`). CLI `check-rename <repoRoot>` (checker), added to the package `check` chain. `scripts/check-rename.sh` wraps it for CI.
- `AGENTS.md` (root): rewritten for the repo itself (how to run checks, the pack layout) plus the one-paragraph "Stack" section shape from spec §10 (a fenced example with `stack:`, `test:`, `lint:`, `layout:`), ending with "Project 2 fills `references/stacks/`."; `references/stacks/README.md` is created with that same sentence so the folder exists in git; `CLAUDE.md` points at `AGENTS.md` and keeps the commands table with the new names. `README.md`: the migration note `> Migrating from metapowers: move `.metapowers/` to `.singularskills/` and replace `/domain:skill` with `/domain-skill`.`
- `run-evals.sh`: `$EVALS_DIR` (default `$REPO_ROOT/evals`), cases are `evals/<skill>/`, `claude plugin eval` is run once for the whole plugin root `.` with `--filter` per case name if supported, else per case directory; `--dry` prints `<skill>  graders=N  [scaffold|-]`.

- [ ] **Step 1: Write the failing tests** (`checkRename` on a fixture with an allowed and a forbidden occurrence; `evals-dry` expects `17` cases and exit 0, and exit 1 when a prompt names its skill).
- [ ] **Step 2: Run** — Expected: FAIL.
- [ ] **Step 3: Implement; rewrite the root files; run `check-rename .` and fix every hit it lists** (bulk: `.metapowers/` paths in `evals/`, names in prose).
- [ ] **Step 4: Run** `bun run check:pack && bun run lint:skills && bun run evals --dry && bun run test` — Expected: all PASS, `check-rename` prints nothing.
- [ ] **Step 5: Commit** — `chore(rename): metapowers to singularskills everywhere outside history`

---

### Task 11: Docs app on the flat pack

**Files:**
- Modify: `apps/docs/scripts/gen-site-data.ts`, `apps/docs/scripts/codemod-skill-pages.ts`, `apps/docs/lib/{domains,site,agents,trace,layout.shared}.ts(x)`, `apps/docs/public/*` (robots, OG metadata and any file naming the old site), `apps/docs/app/layout.tsx`, `apps/docs/app/(home)/page.tsx`, `apps/docs/components/home/{SiteFooter,SiteNav,ClosingCta,HowItWorks,NumbersStrip,SkillShowcase,DomainTile}.tsx`, `apps/docs/components/search.tsx`, `apps/docs/next.config.mjs`, `apps/docs/package.json` (`@singularskills/docs`), `apps/docs/content/docs/**/*.mdx`, `apps/docs/content/docs/overview/installation.mdx`
- Create: `apps/docs/content/docs/overview/workflows.mdx`, `apps/docs/content/docs/overview/agent-checklist.mdx`
- Test: `apps/docs/lib/site.test.ts`, `apps/docs/lib/agents.test.ts`, `apps/docs/scripts/*.test.ts`, `apps/docs/lib/trace.test.ts`

**Interfaces:**
- `gen-site-data.ts` reads `skills/*/SKILL.md` (domain from the name; `singular` ↔ docs slug `overview`) and `workflows/*.yml`; emits `site-data.json` as today plus `workflows: [{ name, title, phases: number }]` and `totals.agents: 7`.
- `codemod-skill-pages.ts`: `command:` frontmatter values become flat (`/design-empathize`); the `## MCP Tools Used` → `<Requires mcp>` transform is removed and existing `<Requires mcp={…} />` blocks are replaced by a `<Callout>` with the design note from spec §8; artifact paths in prose `.metapowers/` → `.singularskills/`; `/domain:skill` → `/domain-skill`. Idempotent; `--check` as today.
- `lib/agents.ts`: seven agents; `install.command` per agent: Claude Code `/plugin marketplace add bromso/singularskills` + note "then `/plugin install singularskills@singularskills`"; Codex `codex plugin marketplace add bromso/singularskills`; the other five `npx skills add bromso/singularskills --agent <id>`; marks: existing three plus Simple Icons for GitHub Copilot (`githubcopilot`), Gemini (`googlegemini`), Kimi (text wordmark like Codex if no mark). `hrefs` to the installation page anchors.
- `lib/domains.ts`: `metapowers` entry becomes `singular` (name "Singular", `docsPath: /docs/overview`); `lib/site.ts` special-cases `singular` where it did `metapowers`.
- `trace.ts`: label `Running /design-empathize date-picker`, path `.singularskills/design/date-picker/01-empathize.md`, settled label unchanged; `TRACE_STEPS[0]` becomes `Loaded skill: design-empathize`.
- `next.config.mjs` basePath `/singularskills` (and the two mirrored spots); `layout.tsx` `siteUrl`; footer/nav links to `github.com/bromso/singularskills`; `SkillShowcase` and `HowItWorks` copy with flat names.
- `installation.mdx`: rewritten for spec §7 (universal installer first, then the two marketplaces, Tier 1/Tier 2 lists, the `.singularskills/` folder and the run log in one paragraph, migration note). `workflows.mdx`: the conductor, phases and members, approval, gates, `--skip-checks`, the artifact frontmatter and the two closing sections, the run-log shape, with the design run of Task 6's eval as the example. `agent-checklist.mdx`: per Tier 1 agent, the five checks from spec §9 as a table with a "last verified" column (filled in the acceptance file).
- `counts.ts` rule (a) prose: `"283 skills"`, `"16 domains"`, `"7 agents"` where the site says so.

- [ ] **Step 1: Write the failing tests** (`gen-site-data` on a fixture pack emits workflows and `agents: 7`; codemod turns `/design:empathize` into `/design-empathize` and replaces a `<Requires mcp>` with the callout; `agents.test.ts` has seven agents each with a command containing `singularskills`; `trace.test.ts` label; `site.test.ts` `singular` last and `/docs/overview` mapping).
- [ ] **Step 2: Run** `cd apps/docs && bun run test` — Expected: FAIL.
- [ ] **Step 3: Implement; run `bun run gen:data` and `bun run codemod`; write the two new pages; update `meta.json` files.**
- [ ] **Step 4: Run** `bun run check && bun run test && bun run build` in `apps/docs`, then `bun run check:pack` at the root — Expected: PASS; 192 − 4 + 2 = 190 pages exported.
- [ ] **Step 5: Commit** — `feat(docs): docs site on the flat pack — install, workflows, agents`

---

### Task 12: CI and deploy

**Files:**
- Modify: `.github/workflows/{ci,deploy-docs,validate-skills,release}.yml`

- [ ] **Step 1: `deploy-docs.yml`**: filter `@singularskills/docs`, sitemap prefix `https://bromso.github.io/singularskills`. **`validate-skills.yml`**: steps `bun run lint:skills`, `claude plugin validate . --strict`, `bun run check:pack`, `bun run evals --dry`, `bash scripts/check-rename.sh`, `bash scripts/smoke-install.sh --local` (all seven agents). **`ci.yml`**: filters from Task 9.
- [ ] **Step 2: Push the branch and open the PR; run `gh pr checks --watch`** — Expected: lint, test, build, lint-skills green; deploy skipped on the PR.
- [ ] **Step 3: Commit** — `ci: validate the flat pack, the rename and the install smoke test`

---

### Task 13: Acceptance record and migration note

**Files:**
- Create: `docs/superpowers/plans/2026-10-29-singularskills-foundation-acceptance.md`
- Modify: `apps/docs/content/docs/overview/agent-checklist.mdx` ("last verified" column), `README.md` (migration note already present from Task 10)

- [ ] **Step 1: Run the manual Tier 1 checklist** from spec §12 in each of the seven agents (discovery, `/workflow design date-picker` asks then stops, approval recorded, direct phase-3 invocation refused, `--skip-checks` logged and let through in Claude Code) and record the result per agent, with the agent version, in the acceptance file; mark unverifiable rows honestly.
- [ ] **Step 2: Record** `bun run check:pack`, `lint:skills`, `test`, `evals --dry`, `check-rename`, `smoke-install` outputs and the docs page count; note the owner actions left: `npm deprecate create-metapowers`, delete the retired packages' npm pages if wanted, Pages base path confirmed live.
- [ ] **Step 3: Commit** — `docs: singularskills foundation acceptance record`
