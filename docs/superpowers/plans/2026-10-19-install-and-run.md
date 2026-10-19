# Install-and-Run Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Metapowers plugin install cleanly from the marketplace and run its skills end to end: valid manifests, resolvable templates, working MCP, correct install docs, non-destructive phase files, clean `--skip-checks`, real phase-gate hooks, and CI that catches regressions.

**Architecture:** Mechanical fixes to 283 SKILL.md files are done by idempotent scripts in a new private workspace package, `packages/plugin-tools`, which also owns the canonical `phase-gate.sh`, the `phase-deps.json` generator, hook syncing and the skill-count checker. The existing `packages/skill-validator` gains plugin-level rules (rules that need to see sibling skills and `shared/`) so none of the fixed defects can come back. CI runs `claude plugin validate . --strict`, the validator and the plugin-tools `--check` commands.

**Tech Stack:** Bun 1.3.12, Turborepo, TypeScript (ESM, `tsconfig.base.json`), Vitest 3, Biome, gray-matter + glob (already deps of skill-validator), bash + jq for hooks, changesets for npm publishing.

**Spec:** `docs/superpowers/specs/2026-10-19-install-and-run-design.md`

## Global Constraints

- Component paths in `plugin.json` must start with `./` and contain no `..`; defaults are discovered when the keys are omitted (spec §1).
- Skills, hooks and MCP configs reference plugin files only via `${CLAUDE_PLUGIN_ROOT}` (spec §2, Constraints).
- `PreToolUse` hooks block only with exit code 2; exit 0 for anything the gate does not own, including a missing `jq` (spec §8).
- All artifacts live under `.metapowers/<plugin-name>/<project>/`; `metapowers` plugin may also use `.metapowers/reports/`, `.metapowers/config.md`, `.metapowers/detect.md`, `.metapowers/plugins/` (spec §7).
- Standard Arguments paragraph wording is fixed by spec §6 and enforced verbatim (modulo `<domain>`).
- Append wording is fixed by spec §5.
- Every script that edits skills must be idempotent: running it twice produces no diff.
- Phase-gate requirements come from the skills' own Prerequisites, never from a hard-coded "N requires N-1" (spec §8).
- Skill truth: 283 skills; marketing 37, compliance 51, metapowers 8 (spec §10).
- Versions: every plugin and the marketplace go from `0.1.0` to `0.2.0`; figma-mcp publishes as `@metapowers/figma-mcp` (owner must create the npm org first; spec Decisions §1).
- Conventional commits with the project's scopes (`feat(<domain>)`, `fix(ci)`, `docs:`, `chore:`), ending with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Biome passes (`bun run check`) before every commit.

## Review Focus

1. Hook stdin `file_path` is absolute (Claude Code sends absolute paths) — the gate must match `.metapowers/...` anywhere in the path, not only at the start. Pinned in Task 9.
2. Hook stdin is empty or not JSON (hook fired for a tool without `tool_input`) — the gate must exit 0, never 2. Pinned in Task 9.
3. `Edit`/`MultiEdit` payloads carry `file_path` like `Write`; a user editing an existing phase file must be gated the same way and must not be blocked when the file they edit already exists. Pinned in Task 9.
4. CLI `${CLAUDE_PLUGIN_ROOT}` rewrite with a target path containing `$` or `&` must not be mangled by regex replacement semantics. Pinned in Task 10.
5. A skill directory without `SKILL.md` (stray README, `.DS_Store`) must not count as a skill. Pinned in Task 11.

---

### Task 1: Plugin manifests pass `claude plugin validate --strict`

**Files:**
- Modify: `plugins/*/.claude-plugin/plugin.json` (16 files)
- Modify: `.github/workflows/validate-skills.yml`

**Interfaces:**
- Produces: manifests with no component-path keys; CI job `lint-skills` runs `claude plugin validate . --strict`.

- [ ] **Step 1: Record the failing baseline**

Run: `claude plugin validate . --strict; echo "exit=$?"`
Expected: `✘ Validation failed`, `exit=1`, errors mentioning `Path contains ".."`.

- [ ] **Step 2: Rewrite all 16 manifests**

For each `plugins/<name>/.claude-plugin/plugin.json`: remove the keys `skills`, `commands`, `agents`, `hooks`, `mcpServers`; add as the first key `"$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json"`. Keep every other key and value unchanged. Do it with a small `bun -e` / `node -e` script over the glob so formatting stays Biome-compatible (tabs), then `bun run format`.

- [ ] **Step 3: Verify**

Run: `claude plugin validate . --strict; echo "exit=$?"`
Expected: no `error` lines, `exit=0`. If warnings remain about `${CLAUDE_PLUGIN_ROOT}` quoting in `plugins/design/hooks/hooks.json`, leave them; Task 9 replaces that file.

Run: `for f in plugins/*/.claude-plugin/plugin.json; do jq -e 'has("skills") or has("commands") or has("agents") or has("hooks") or has("mcpServers")' $f >/dev/null && echo "STILL HAS KEYS: $f"; done`
Expected: no output.

- [ ] **Step 4: Add the validate step to CI**

In `.github/workflows/validate-skills.yml`, after "Validate all skills", add:

```yaml
      - name: Install Claude Code CLI
        run: npm install -g @anthropic-ai/claude-code
      - name: Validate plugin manifests
        run: claude plugin validate . --strict
```

Also add `.claude-plugin/**` and `.github/workflows/validate-skills.yml` to both `paths:` lists so manifest changes trigger it.

- [ ] **Step 5: Commit**

```bash
git add plugins/*/.claude-plugin/plugin.json .github/workflows/validate-skills.yml
git commit -m "fix(plugins): remove ../ component paths so manifests pass claude plugin validate"
```

---

### Task 2: Plugin-level validation infrastructure + `shared-ref-resolvable`

**Files:**
- Create: `packages/skill-validator/src/plugin-rules.ts`
- Create: `packages/skill-validator/src/plugin-rules.test.ts`
- Modify: `packages/skill-validator/src/cli.ts` (`runValidator`)
- Modify: `packages/skill-validator/src/index.ts` (export)

**Interfaces:**
- Produces:
  ```ts
  export interface PluginContext {
    pluginName: string;          // directory name under plugins/
    pluginDir: string;           // absolute
    sharedFiles: string[];       // paths relative to pluginDir, e.g. "shared/plan-template.md"
    skillNames: string[];        // directory names under skills/
    allPluginNames: string[];    // every plugin in the repo
    allSkillNames: Record<string, string[]>; // plugin -> skill dirs
  }
  export function buildPluginContext(pluginDir: string, pluginsRoot: string): PluginContext;
  export function validatePluginSkill(parsed: ParsedSkill, ctx: PluginContext): ValidationIssue[];
  ```
  `runValidator(rootDir)` now merges `validatePluginSkill` issues into each file's `ValidationResult` (errors → `pass=false`).
- Consumes: `ParsedSkill`, `ValidationIssue` from existing modules.

Rules implemented in this task (others are added in Tasks 5–7, same file):

- `shared-ref-resolvable` (error): every backticked reference matching `` `plugins/<p>/shared/<path>` ``, `` `shared/<path>` ``, or `` `${CLAUDE_PLUGIN_ROOT}/shared/<path>` `` must (a) use the `${CLAUDE_PLUGIN_ROOT}` form and (b) resolve to a file in `ctx.sharedFiles` (or a directory prefix of one, so `shared/workflows/` is valid). Strip a trailing `#fragment` before resolving. Message names the reference and the fix.

- [ ] **Step 1: Write failing tests**

`plugin-rules.test.ts` (build `ctx` with `sharedFiles: ["shared/plan-template.md", "shared/workflows/launch-product.md"]`, `pluginName: "development"`):

```ts
it("flags repo-relative shared refs", () => {
  const issues = run("Read `plugins/development/shared/plan-template.md`.");
  expect(issues.map(i => i.rule)).toEqual(["shared-ref-resolvable"]);
  expect(issues[0].message).toContain("${CLAUDE_PLUGIN_ROOT}/shared/plan-template.md");
});
it("flags bare shared/ refs", () => {
  expect(rules(run("See `shared/plan-template.md`."))).toEqual(["shared-ref-resolvable"]);
});
it("accepts CLAUDE_PLUGIN_ROOT refs to existing files and directories", () => {
  expect(run("Read `${CLAUDE_PLUGIN_ROOT}/shared/plan-template.md` and `${CLAUDE_PLUGIN_ROOT}/shared/workflows/`.")).toEqual([]);
});
it("flags CLAUDE_PLUGIN_ROOT refs to missing files", () => {
  expect(rules(run("Read `${CLAUDE_PLUGIN_ROOT}/shared/nope.md`."))).toEqual(["shared-ref-resolvable"]);
});
it("ignores #fragments when resolving", () => {
  expect(run("Read `${CLAUDE_PLUGIN_ROOT}/shared/plan-template.md#risks`.")).toEqual([]);
});
```

`run(body)` = `validatePluginSkill(parseSkill("---\ndescription: Plan x\n---\n" + body, "x/SKILL.md"), ctx)`; `rules(issues)` maps to `rule`.

- [ ] **Step 2: Run to verify failure**

Run: `cd packages/skill-validator && bunx vitest run src/plugin-rules.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `plugin-rules.ts`, `buildPluginContext`, and wire `runValidator`**

`buildPluginContext` reads `shared/**` with `globSync` (relative paths) and `skills/*/SKILL.md` parents. `runValidator` groups discovered skill files by plugin dir (`path.resolve(file, "../../..")`), builds one context per plugin, and appends plugin issues to each result.

- [ ] **Step 4: Run tests, then run the validator against the repo**

Run: `bunx vitest run` (in package) → PASS.
Run: `bun turbo build --filter=@metapowers/skill-validator && bun run lint:skills | grep -c "shared-ref-resolvable"`
Expected: a count ≥ 170 (the validator is now red on the repo; Task 3 makes it green).

- [ ] **Step 5: Commit**

```bash
git add packages/skill-validator
git commit -m "feat(validator): add plugin-level rules and shared-ref-resolvable"
```

---

### Task 3: `plugin-tools` package + rewrite shared references

**Files:**
- Create: `packages/plugin-tools/package.json` (`@metapowers/plugin-tools`, private, `"type": "module"`, scripts: `build: tsc`, `test: vitest run`, `fix:shared-refs: node dist/cli.js fix-shared-refs ../../plugins`; deps `glob`, devDeps `vitest`, `@types/node`)
- Create: `packages/plugin-tools/tsconfig.json` (extends `../../tsconfig.base.json`, exclude tests)
- Create: `packages/plugin-tools/src/skills.ts`, `src/shared-refs.ts`, `src/shared-refs.test.ts`, `src/cli.ts`
- Modify: `plugins/*/skills/*/SKILL.md` (≈122 files, by script)
- Create: `plugins/coaching/shared/wcag-21-aa-criteria.md` (copied from accessibility)
- Modify: `turbo.json` — add task `"check": { "dependsOn": ["build"], "cache": false }`

**Interfaces:**
- Produces:
  ```ts
  // skills.ts
  export interface SkillFile { plugin: string; skill: string; path: string; content: string }
  export function listSkills(pluginsRoot: string): SkillFile[];
  export function listPlugins(pluginsRoot: string): string[];
  export function writeIfChanged(path: string, content: string): boolean;
  // shared-refs.ts
  export function rewriteSharedRefs(content: string, plugin: string): string;
  ```
  `cli.ts` dispatches sub-commands by `process.argv[2]`; every sub-command takes `pluginsRoot` as `argv[3]` and supports `--check` where stated (exit 1 when a change would be made).

- [ ] **Step 1: Write failing tests**

```ts
it("rewrites repo-relative refs to CLAUDE_PLUGIN_ROOT", () => {
  expect(rewriteSharedRefs("Read `plugins/legal/shared/contract-template.md`", "legal"))
    .toBe("Read `${CLAUDE_PLUGIN_ROOT}/shared/contract-template.md`");
});
it("rewrites bare shared/ refs", () => {
  expect(rewriteSharedRefs("the template at `shared/chart-of-accounts-template.md`", "bookkeeping"))
    .toBe("the template at `${CLAUDE_PLUGIN_ROOT}/shared/chart-of-accounts-template.md`");
});
it("rewrites finance's bare financial-model-template.md", () => {
  expect(rewriteSharedRefs("Reference `financial-model-template.md` for", "finance"))
    .toBe("Reference `${CLAUDE_PLUGIN_ROOT}/shared/financial-model-template.md` for");
});
it("rewrites cross-plugin refs to the local copy", () => {
  expect(rewriteSharedRefs("`plugins/accessibility/shared/wcag-21-aa-criteria.md`", "coaching"))
    .toBe("`${CLAUDE_PLUGIN_ROOT}/shared/wcag-21-aa-criteria.md`");
});
it("is idempotent", () => {
  const once = rewriteSharedRefs("`plugins/legal/shared/x.md`", "legal");
  expect(rewriteSharedRefs(once, "legal")).toBe(once);
});
```

- [ ] **Step 2: Run to verify failure** — `cd packages/plugin-tools && bunx vitest run` → FAIL (no module).

- [ ] **Step 3: Implement**

`rewriteSharedRefs`: three regexes over backticked spans: `` `plugins/[a-z-]+/shared/(…)` `` → `` `${CLAUDE_PLUGIN_ROOT}/shared/$1` `` (drop the plugin segment regardless of which plugin — cross-plugin becomes local); `` `shared/(…)` `` → same; `` `financial-model-template.md` `` → `` `${CLAUDE_PLUGIN_ROOT}/shared/financial-model-template.md` `` only when `plugin === "finance"`. `cli.ts fix-shared-refs <pluginsRoot> [--check]` applies to every `SkillFile` and prints changed paths.

- [ ] **Step 4: Copy the cross-plugin file, run the fixer, verify**

Run: `cp plugins/accessibility/shared/wcag-21-aa-criteria.md plugins/coaching/shared/`
Run: `bun turbo build --filter=@metapowers/plugin-tools && bun run --filter @metapowers/plugin-tools fix:shared-refs`
Run: `grep -rl "plugins/[a-z-]*/shared/" plugins/*/skills | wc -l` → `0`
Run: `bun run lint:skills | grep -c "shared-ref-resolvable"` → `0`, and the command exits 0.
Run the fixer a second time → prints no changed paths, `git status --porcelain plugins | wc -l` unchanged.

- [ ] **Step 5: Commit**

```bash
git add packages/plugin-tools turbo.json plugins
git commit -m "fix(plugins): reference shared files via \${CLAUDE_PLUGIN_ROOT} so templates load when installed"
```

---

### Task 4: MCP configs — delete phantoms, publish figma-mcp, launch via npx

**Files:**
- Delete: `plugins/{compliance,legal,marketing,project-management,security}/.mcp.json`
- Modify: `plugins/design/.mcp.json`
- Modify: `packages/figma-mcp/package.json`
- Create: `.changeset/figma-mcp-public.md`
- Create: `plugins/design/README.md`

- [ ] **Step 1: Confirm the five plugins use no MCP tools**

Run: `grep -l "mcp__\|figma_\|metapowers-figma" plugins/{compliance,legal,marketing,project-management,security}/skills/*/SKILL.md | wc -l`
Expected: `0`. If not zero, stop and report which skills; do not delete that plugin's config.

- [ ] **Step 2: Delete the five `.mcp.json` files**

- [ ] **Step 3: Make figma-mcp publishable**

In `packages/figma-mcp/package.json`: remove `"private": true`; add `"files": ["dist", "README.md"]`, `"publishConfig": { "access": "public" }`, `"repository": { "type": "git", "url": "https://github.com/bromso/metapowers.git", "directory": "packages/figma-mcp" }`, `"license": "MIT"`. Confirm `src/index.ts` starts with `#!/usr/bin/env node` (it does) so the `bin` works after `tsc`.

Changeset `.changeset/figma-mcp-public.md`:
```md
---
"@metapowers/figma-mcp": minor
---
Publish the Figma MCP server so the design plugin can launch it with npx from an installed plugin.
```

- [ ] **Step 4: Rewrite `plugins/design/.mcp.json`**

```json
{
	"mcpServers": {
		"metapowers-figma": {
			"command": "npx",
			"args": ["-y", "@metapowers/figma-mcp@0.2.0"],
			"env": { "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}" }
		}
	}
}
```

- [ ] **Step 5: Document the publish prerequisite**

`plugins/design/README.md`: three short sections — what the plugin does, "Figma MCP requires `FIGMA_ACCESS_TOKEN` and is launched with `npx -y @metapowers/figma-mcp`", and "Until `@metapowers/figma-mcp` is on npm the 9 Figma-dependent skills (define-component, empathize, design-review, a11y-audit, ideate, prototype, export-tokens, system-overview, test) cannot write to Figma."

- [ ] **Step 6: Verify**

Run: `claude plugin validate . --strict; echo exit=$?` → `exit=0`.
Run: `bun turbo build --filter=@metapowers/figma-mcp && head -1 packages/figma-mcp/dist/index.js` → `#!/usr/bin/env node`.
Run: `cd packages/figma-mcp && npm pack --dry-run 2>&1 | grep -c "dist/index.js"` → `1`.

- [ ] **Step 7: Commit**

```bash
git add -A plugins/*/.mcp.json plugins/design packages/figma-mcp/package.json .changeset
git commit -m "fix(design): launch figma-mcp via npx and drop five phantom MCP configs"
```

---

### Task 5: Standard Arguments paragraph, `--skip-checks` cleanup, PM artifact root

**Files:**
- Create: `packages/plugin-tools/src/args.ts`, `src/args.test.ts`
- Modify: `packages/plugin-tools/src/cli.ts` (`fix-args` sub-command)
- Modify: `packages/skill-validator/src/plugin-rules.ts` + test (rules `no-args-in-path`, `artifact-root`, `skip-checks-standard`)
- Modify: `plugins/*/skills/*/SKILL.md` (by script; ≈280 files)

**Interfaces:**
- Produces:
  ```ts
  export const ARGS_PARAGRAPH = (domain: string, slugRule: "first-token" | "basename") => string; // exact spec §6 text; basename variant replaces "Take the first token as `<project>`" with "Derive `<project>` from the argument by taking its basename without extension"
  export function standardizeArgs(content: string, plugin: string): string;
  export const BASENAME_PLUGINS = new Set(["coaching"]);
  ```

Behaviour of `standardizeArgs` (spec §6):
1. Replace `.project/` with `.metapowers/project-management/` everywhere (plugin `project-management` only).
2. Delete the three legacy skip-checks sentences wherever they occur as a whole line: `If \`--skip-checks\` is present in $ARGUMENTS, skip this check and log to \`…skip-log.md\`.`, `If \`--skip-checks\` is present in $ARGUMENTS, skip this check.`, and any line starting `If the user passes \`--skip-checks\``. Keep the `> Phase …` quoted message lines.
3. Insert `ARGS_PARAGRAPH(plugin, rule)` as a paragraph directly before the first `## ` heading, preceded by a blank line — only if the skill mentions `$ARGUMENTS` anywhere and the paragraph is not already present.
4. Replace every `$ARGUMENTS` **after** the inserted paragraph with `<project>`. Occurrences before it (the H1 and intro sentence) stay.
5. Skills that never mention `$ARGUMENTS` are returned unchanged.

- [ ] **Step 1: Write failing tests** (fixtures as template strings in the test file, modelled on `security/api-security` and `project-management/retrospective`):

```ts
it("inserts the standard paragraph before the first H2 and keeps $ARGUMENTS in the intro", ...)
  // expect(out).toContain('Audit API security for "$ARGUMENTS"'); expect(out.indexOf(ARGS_PARAGRAPH("security","first-token"))).toBeLessThan(out.indexOf("## Prerequisites"));
it("replaces $ARGUMENTS inside paths with <project>", ...)
  // expect(out).toContain(".metapowers/security/<project>/00-govern.md"); expect(out).not.toMatch(/\.metapowers\/[a-z-]+\/\$ARGUMENTS/);
it("removes legacy skip-checks sentences but keeps the quoted phase message", ...)
  // expect(out).not.toContain("is present in $ARGUMENTS"); expect(out).toContain("or use `--skip-checks` to bypass.");
it("moves project-management artifacts to .metapowers/project-management", ...)
  // expect(out).toContain(".metapowers/project-management/<project>/00-initiate.md"); expect(out).not.toContain(".project/");
it("uses the basename rule for coaching", ...)
  // expect(standardizeArgs(coachingFixture, "coaching")).toContain("basename without extension");
it("leaves skills without $ARGUMENTS unchanged and is idempotent", ...)
```

- [ ] **Step 2: Run to verify failure** → FAIL.

- [ ] **Step 3: Implement `args.ts` and the `fix-args` CLI sub-command**

- [ ] **Step 4: Add the three validator rules with tests**

- `no-args-in-path` (error): regex `` /`[^`]*\.metapowers\/[^`]*\$ARGUMENTS[^`]*`/ `` matches → error.
- `artifact-root` (error): every backticked path starting with `.metapowers/` or `.project/` must start with `.metapowers/<ctx.pluginName>/`, except for plugin `metapowers`, which may use `.metapowers/` + any of `reports/`, `config.md`, `detect.md`, `plugins/`, or a bare `.metapowers/` listing; and except reads of other domains inside `plugins/metapowers` (that plugin reads everything). Implement as: non-`metapowers` plugins must only reference their own root; `metapowers` is exempt.
- `skip-checks-standard` (error): if body contains `--skip-checks`, body must contain `ARGS_PARAGRAPH(ctx.pluginName, rule)` for either rule (import the constant from plugin-tools? No — duplicate the string in `plugin-rules.ts` as `STANDARD_ARGS_PARAGRAPH` with `<domain>` placeholder and a note that it must match plugin-tools; add a test in plugin-tools that imports the validator's constant and asserts equality: `expect(ARGS_PARAGRAPH("security","first-token")).toBe(STANDARD_ARGS_PARAGRAPH.replace("<domain>","security"))`. Add `@metapowers/skill-validator` as a devDependency of plugin-tools via `"workspace:*"`).

Tests: one positive and one negative per rule, plus `metapowers` exemption for `artifact-root`.

- [ ] **Step 5: Run the fixer, verify repo-wide**

Run: `bun turbo build --filter=@metapowers/plugin-tools && node packages/plugin-tools/dist/cli.js fix-args plugins`
Run: `grep -rl "\.project/" plugins/project-management/skills | wc -l` → `0`
Run: `grep -rc "is present in \$ARGUMENTS" plugins/*/skills/*/SKILL.md | grep -v ":0" | wc -l` → `0`
Run: `grep -l "skip-checks" plugins/*/skills/*/SKILL.md | wc -l` → `176` (all now via the standard paragraph)
Run: `bun turbo build --filter=@metapowers/skill-validator && bun run lint:skills; echo exit=$?` → `exit=0`
Run fixer again → no changes.

- [ ] **Step 6: Commit**

```bash
git add packages/plugin-tools packages/skill-validator plugins
git commit -m "fix(plugins): standardize \$ARGUMENTS handling, keep --skip-checks out of paths, move PM artifacts under .metapowers"
```

---

### Task 6: Domain registry and broken skill references

**Files:**
- Modify: `plugins/metapowers/shared/domain-registry.md`
- Modify: `plugins/design/skills/ideate/SKILL.md`, `plugins/metapowers/shared/workflows/launch-product.md`, `plugins/metapowers/shared/workflows/rebrand.md`
- Modify: `apps/docs/content/docs/design/{index,define,examples}.mdx`, `apps/docs/content/docs/overview/{guides,companion-tools}.mdx`, `apps/docs/content/docs/overview/reference/index.mdx`, `AGENTS.md`
- Modify: `packages/skill-validator/src/plugin-rules.ts` + test (rule `skill-ref-exists`)
- Modify: `packages/skill-validator/src/cli.ts` (`discoverSkills` also returns `plugins/*/shared/**/*.md` for this rule only)

- [ ] **Step 1: Validator rule `skill-ref-exists`** (error): for every `/<p>:<s>` where `<p>` ∈ `ctx.allPluginNames`, require `<s>` ∈ `ctx.allSkillNames[p]`. Tokens whose `<p>` is not a plugin (`/docs:`, `/clients:`) are ignored. Tests: `/design:define` flagged with message suggesting the closest match (`define-component`, by prefix), `/design:define-component` accepted, `/docs:foo` ignored. Apply the rule to `shared/**/*.md` too: add `discoverSharedDocs(rootDir)` and run only `skill-ref-exists` on them (results listed like skills).

- [ ] **Step 2: Run** → `bun run lint:skills | grep skill-ref-exists` lists `design/ideate`, `workflows/launch-product.md`, `workflows/rebrand.md`.

- [ ] **Step 3: Fix references**

- `/design:define` → `/design:define-component` in: `plugins/design/skills/ideate/SKILL.md`, `plugins/metapowers/shared/workflows/launch-product.md`, `AGENTS.md`, `apps/docs/content/docs/design/index.mdx`, `design/define.mdx`, `design/examples.mdx`, `overview/guides.mdx`, `overview/reference/index.mdx` (both lines).
- `/marketing:strategy` → `/marketing:launch-strategy` in `workflows/launch-product.md`, `workflows/rebrand.md`, `overview/guides.mdx:98`.
- `apps/docs/content/docs/overview/companion-tools.mdx`: line 46 `/legal:draft` → `/legal:saas-agreement` and `/project-management:sprint` → `/project-management:sprint-planning`; line 107 `/marketing:strategy` → `/marketing:launch-strategy`, `/legal:assess` → `/legal:legal-audit`; line 175 `/marketing:reach` → `/marketing:seo-audit`, `/marketing:engage` → `/marketing:email-sequence`. All six targets exist under `plugins/<p>/skills/<s>` (verified while planning).

- [ ] **Step 4: Registry**

Add rows to the table in `plugins/metapowers/shared/domain-registry.md` for Security (`.metapowers/security/<program>/`, `00-govern` through `05-recover`, NIST CSF), Compliance (`.metapowers/compliance/<program>/`, `00-scope`, `01-assess/<regulation>.md`, `02-remediate` through `04-monitor`, GRC Lifecycle), Bookkeeping (`01-record` through `04-report`, Bookkeeping Cycle), Accounting (`01-analyze` through `08-close`, Accounting Cycle), Finance (`01-assess` through `06-review`, FP&A). Fix the Project Management row's path if it says anything other than `.metapowers/project-management/<project>/`. Add a note under "Phase Completion Detection": "Compliance phase 1 is complete when any file exists under `01-assess/`."

- [ ] **Step 5: Verify** — `bun run lint:skills; echo exit=$?` → `exit=0`; `grep -rn "/design:define\b" plugins apps/docs/content AGENTS.md | grep -v define-component | wc -l` → `0`.

- [ ] **Step 6: Commit**

```bash
git add packages/skill-validator plugins apps/docs/content AGENTS.md
git commit -m "fix: repair broken /plugin:skill references and complete the domain registry"
```

---

### Task 7: Phase files are appended, not overwritten

**Files:**
- Create: `packages/plugin-tools/src/phase-files.ts`, `src/phase-files.test.ts`
- Modify: `packages/plugin-tools/src/cli.ts` (`fix-phase-files` sub-command, `--check`)
- Modify: `packages/skill-validator/src/plugin-rules.ts` + test (rule `phase-file-append`)
- Modify: `plugins/*/skills/*/SKILL.md` (≈72 files, by script)

**Interfaces:**
- Produces:
  ```ts
  export interface WriteTarget { skill: string; file: string /* e.g. "02-protect.md" or "01-assess/gdpr.md" */; line: number }
  export function writeTargets(content: string): WriteTarget[];       // lines matching /\*\*Write the [a-z ]+\*\* (to|— (write|save) to|— append to|by appending to) `\.metapowers\/[^`]+`/ plus bare "Write to `…`"
  export function multiWriterFiles(skills: SkillFile[]): Map<string /*plugin*/, Map<string /*file*/, string[] /*skills*/>>; // only files under .metapowers/<plugin>/<project>/ with ≥2 distinct writer skills; "01-assess/<x>.md" entries are keyed per distinct x
  export function skillTitle(content: string): string;                // first "# " heading
  export function applyAppendWording(content: string, file: string, title: string, phaseLabel: string): string;
  export const APPEND_TEMPLATE = (path: string, title: string, phaseLabel: string) =>
    `**Write the artifact** — append to \`${path}\` under a \`## ${title}\` section. Create the file with a \`# ${phaseLabel} — <project>\` heading if it does not exist; if a \`## ${title}\` section already exists, replace only that section.`;
  ```
  `phaseLabel` = the phase file's stem with the number stripped and title-cased (`02-protect.md` → `Protect`).

`applyAppendWording` replaces the whole "**Write the artifact** to `…` with heading:/with sections:" lead-in line (keeping the following indented bullet list) with `APPEND_TEMPLATE(...)` + the original trailing text after the path (e.g. ` with sections:`), and in `## Output` replaces `written to \`<path>\`` with `appended to \`<path>\``. Skills already using "append to" are left unchanged except for normalising to the template when the section-name clause is missing.

- [ ] **Step 1: Write failing tests** using the `api-security` text (writes `02-protect.md`, title `API Security`) and a `page-cro` style fixture already using append:

```ts
it("finds write targets including directory-style compliance paths", ...)
  // writeTargets(gdprFixture)[0].file === "01-assess/gdpr.md"
it("groups multi-writer files per plugin and ignores single-writer files", ...)
  // two fixtures writing 02-protect.md + one writing 03-detect.md → map.get("security").get("02-protect.md") has length 2; has("03-detect.md") false
it("rewrites the write line to the append template and the Output wording", ...)
  // expect(out).toContain(APPEND_TEMPLATE(".metapowers/security/<project>/02-protect.md","API Security","Protect") + " with heading:")
  // expect(out).toContain("appended to `.metapowers/security/<project>/02-protect.md`")
it("is idempotent and leaves already-appending skills intact", ...)
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement** `phase-files.ts` and `cli.ts fix-phase-files <pluginsRoot> [--check]`: compute multi-writer files, apply to each writer skill.

- [ ] **Step 4: Validator rule `phase-file-append`** (error): using `writeTargets` logic duplicated in `plugin-rules.ts` (keep it small: same regex), compute multi-writer files per plugin inside `buildPluginContext` (`ctx.multiWriterFiles: Set<string>`), and for each skill whose write target is in that set require the line to contain `— append to` and `section`. Test: two-skill context where both write `02-x.md` and one still says "to" → error on that one only.

- [ ] **Step 5: Run the fixer, verify**

Run: `node packages/plugin-tools/dist/cli.js fix-phase-files plugins`
Run: `bun run lint:skills; echo exit=$?` → `exit=0`
Run: `grep -l "02-protect.md" plugins/security/skills/*/SKILL.md | xargs grep -L "append to" | wc -l` → `0`
Run: `node packages/plugin-tools/dist/cli.js fix-phase-files plugins --check; echo exit=$?` → `exit=0`

- [ ] **Step 6: Commit**

```bash
git add packages/plugin-tools packages/skill-validator plugins
git commit -m "fix(plugins): append to shared phase files instead of overwriting earlier skills' output"
```

---

### Task 8: `phase-deps.json` generator

**Files:**
- Create: `packages/plugin-tools/src/phase-deps.ts`, `src/phase-deps.test.ts`
- Modify: `packages/plugin-tools/src/cli.ts` (`gen-phase-deps <pluginsRoot> [--check]`)
- Create: `plugins/<p>/hooks/phase-deps.json` for the 14 plugins with numbered phases (all except `coaching`, `metapowers`)

**Interfaces:**
- Produces:
  ```ts
  export interface PhaseDeps { domain: string; artifacts: string; requires: Record<string, string[]> }
  export function prerequisiteFiles(content: string): string[];   // files read in "## Prerequisites": every `.metapowers/<d>/<project>/<file>` in that section; "01-assess/" (dir) → "01-assess/*.md"; "None" → []
  export function generatePhaseDeps(plugin: string, skills: SkillFile[]): PhaseDeps | null; // null when no skill writes an NN- artifact
  ```
  Semantics (spec §8): for each phase number `NN` with ≥1 writer skill, `requires[NN]` = **intersection** of `prerequisiteFiles` across all writers of that phase (so no skill's own documented workflow is ever blocked), minus any file of phase `NN` itself; omit the key when the intersection is empty. `artifacts` = `\.metapowers/<domain>/([^/]+)/(\d\d)-[^/]+\.md$`, extended with `|\.metapowers/<domain>/([^/]+)/(\d\d)-[^/]+/[^/]+\.md$` when any writer targets a directory-style phase. JSON is written with tabs and a trailing newline (Biome style), keys sorted.

- [ ] **Step 1: Write failing tests**

```ts
it("hub shape: every phase requires only the phase-0 file", () => {
  // security-like fixtures: writers of 01,02,03 each read 00-govern.md
  expect(deps.requires).toEqual({ "01": ["00-govern.md"], "02": ["00-govern.md"], "03": ["00-govern.md"] });
});
it("chain shape: each phase requires the previous file(s)", () => {
  // accounting-like: 02 reads 01-analyze.md; 08 reads 07-statements.md and 06-adjusted-balance.md
  expect(deps.requires["08"]).toEqual(["06-adjusted-balance.md", "07-statements.md"]);
});
it("intersects prerequisites across writers of the same phase", () => {
  // writer A of 02 reads 00 and 01; writer B of 02 reads only 00 → requires["02"] === ["00-x.md"]
});
it("compliance: directory phase extends the artifacts regex and phase 2 requires only 00-scope.md", () => {
  expect(deps.artifacts).toContain("/[^/]+\\.md$");
  expect(deps.requires["02"]).toEqual(["00-scope.md"]);
});
it("returns null for plugins without numbered phases", () => { expect(generatePhaseDeps("coaching", coachingFixtures)).toBeNull(); });
it("ignores 'None — utility skill' prerequisites", () => { expect(prerequisiteFiles(ratiosFixture)).toEqual([]); });
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement**, including `--check` (regenerate in memory, compare with file on disk, exit 1 and print plugin names on mismatch or missing file).

- [ ] **Step 4: Generate and inspect**

Run: `node packages/plugin-tools/dist/cli.js gen-phase-deps plugins && ls plugins/*/hooks/phase-deps.json | wc -l` → `14`
Run: `jq .requires plugins/security/hooks/phase-deps.json` → every key maps to `["00-govern.md"]`.
Run: `jq .requires plugins/accounting/hooks/phase-deps.json` → `"02": ["01-analyze.md"]` … `"08": ["06-adjusted-balance.md","07-statements.md"]`.
Run: `jq -r .artifacts plugins/compliance/hooks/phase-deps.json` → contains both alternatives.
Run: `node packages/plugin-tools/dist/cli.js gen-phase-deps plugins --check; echo exit=$?` → `exit=0`.

- [ ] **Step 5: Commit**

```bash
git add packages/plugin-tools plugins/*/hooks/phase-deps.json
git commit -m "feat(plugins): generate phase-deps.json from each skill's Prerequisites"
```

---

### Task 9: `phase-gate.sh`, hook sync, design Figma gate, orphan cleanup

**Files:**
- Create: `packages/plugin-tools/hooks/phase-gate.sh` (canonical)
- Create: `packages/plugin-tools/hooks/hooks.json` (canonical, Write/Edit/MultiEdit matcher)
- Create: `packages/plugin-tools/src/hooks.ts`, `src/hooks.test.ts` (sync + shell tests via `child_process.spawnSync`)
- Modify: `packages/plugin-tools/src/cli.ts` (`sync-hooks <pluginsRoot> [--check]`)
- Create/Modify: `plugins/<p>/hooks/phase-gate.sh`, `plugins/<p>/hooks/hooks.json` for the 14 phased plugins
- Modify: `plugins/design/hooks/hooks.json` (adds Figma matcher), rewrite `plugins/design/hooks/check-define-exists.sh`
- Delete: `plugins/{compliance,legal,marketing,project-management,research,security}/hooks/check-*-exists.sh`
- Modify: `plugins/{coaching,metapowers}/hooks/hooks.json` → delete the files (no phases)

**Interfaces:**
- `phase-gate.sh` contract (spec §8): reads JSON on stdin; `tool_input.file_path`; `phase-deps.json` next to the script. Exit 0 unless the path matches `artifacts` **as a substring match on the full path** (absolute paths). Captures `project` and `NN`. Exit 0 if `requires[NN]` absent, or `METAPOWERS_SKIP_CHECKS=1`, or `<projectDir>/skip-log.md` contains the basename of the target, or every glob in `requires[NN]` matches ≥1 file in `<projectDir>`. Else stderr one line: `Metapowers phase gate: <domain>/<project> phase NN needs <missing globs joined ", "> first. Re-run with --skip-checks, or set METAPOWERS_SKIP_CHECKS=1.` and exit 2. Exit 0 when `jq` is not on PATH or stdin is empty/not JSON.
- `hooks.json` (canonical):
  ```json
  { "hooks": { "PreToolUse": [ { "matcher": "Write|Edit|MultiEdit", "hooks": [ { "type": "command", "command": "\"${CLAUDE_PLUGIN_ROOT}\"/hooks/phase-gate.sh" } ] } ] } }
  ```
  Builder: confirm `claude plugin validate . --strict` accepts this quoting; if it wants a different form, use that form in the canonical file.
- `hooks.ts`: `syncHooks(pluginsRoot, canonicalDir, {check}): string[]` copies `phase-gate.sh` (chmod 755) and `hooks.json` into every plugin that has `hooks/phase-deps.json`; for `design`, merges the canonical entry with the Figma entry (kept in `packages/plugin-tools/hooks/design-extra.json`). Removes `hooks/hooks.json` from plugins without `phase-deps.json`.

- [ ] **Step 1: Write failing shell-behaviour tests** in `hooks.test.ts`. Helper `gate(stdin: string, cwd: string, env?)` spawns `bash <canonical>/phase-gate.sh` with a fixture `phase-deps.json` copied beside it in a temp dir; returns `{status, stderr}`. Fixtures: hub deps (`requires: {"01":["00-govern.md"],"02":["00-govern.md"]}`), chain deps (`"02":["01-analyze.md"],"03":["02-journal.md"]`), compliance deps.

```ts
it("ignores paths outside .metapowers", () => expect(gate(json("/tmp/x/README.md"), tmp).status).toBe(0));
it("allows a phase with no requires entry", ...);          // 00-govern.md
it("blocks with exit 2 and a message naming the missing file", () => { const r = gate(json(`${tmp}/.metapowers/security/acme/02-protect.md`), tmp); expect(r.status).toBe(2); expect(r.stderr).toContain("00-govern.md"); });
it("allows once the required file exists", ...);
it("hub: phase 3 allowed with only 00 present", ...);
it("chain: phase 3 blocked with only 01 present", ...);
it("compliance: 01-assess/x.md satisfies phase 2", ...);
it("skip-log naming the target allows that write but not another phase file", ...);
it("METAPOWERS_SKIP_CHECKS=1 allows", ...);
it("absolute file_path under cwd is matched", ...);        // Review Focus 1 (all tests above already use absolute paths; this one uses a project name with a hyphen)
it("empty or non-JSON stdin exits 0", () => { expect(gate("", tmp).status).toBe(0); expect(gate("not json", tmp).status).toBe(0); });
it("Edit on an existing phase file is gated identically", ...); // Review Focus 3: tool_name Edit, file exists, requires missing → 2
it("missing jq exits 0", ...);                              // PATH without jq
```

- [ ] **Step 2: Run** → FAIL (script missing).

- [ ] **Step 3: Write `phase-gate.sh`** (bash, `set -u` only — not `-e`, so a failed glob doesn't abort), implement `hooks.ts` + `sync-hooks`, write `design-extra.json`:

```json
{ "matcher": "mcp__metapowers-figma__figma_(create|modify|delete|duplicate|reorder|set|add|apply|arrange|group|execute).*", "hooks": [ { "type": "command", "command": "\"${CLAUDE_PLUGIN_ROOT}\"/hooks/check-define-exists.sh" } ] }
```

Rewrite `plugins/design/hooks/check-define-exists.sh`: exit 0 if `METAPOWERS_SKIP_CHECKS=1`; exit 0 if any `.metapowers/design/*/02-define.md` exists; exit 0 if any `.metapowers/design/*/skip-log.md` mentions `figma`; otherwise stderr `Metapowers design gate: no .metapowers/design/<component>/02-define.md found. Run /design:define-component <component> first, or set METAPOWERS_SKIP_CHECKS=1.` and **exit 2**. Add two tests for it (blocked / allowed).

- [ ] **Step 4: Sync, delete orphans, verify**

Run: `node packages/plugin-tools/dist/cli.js sync-hooks plugins`
Run: `git rm plugins/{compliance,legal,marketing,project-management,research,security}/hooks/check-*-exists.sh`
Run: `ls plugins/*/hooks/phase-gate.sh | wc -l` → `14`; `ls plugins/*/hooks/hooks.json | wc -l` → `14`; `test -f plugins/coaching/hooks/hooks.json || echo gone` → `gone`.
Run: `md5 -q plugins/*/hooks/phase-gate.sh | sort -u | wc -l` → `1`.
Run: `jq '.hooks.PreToolUse | length' plugins/design/hooks/hooks.json` → `2`.
Run: `claude plugin validate . --strict; echo exit=$?` → `exit=0`.
Run: `bunx vitest run` in plugin-tools → PASS.
Run: `node packages/plugin-tools/dist/cli.js sync-hooks plugins --check; echo exit=$?` → `exit=0`.

- [ ] **Step 5: Manual end-to-end check** (record the output in the commit body): in a temp dir, `mkdir -p .metapowers/accounting/acme`, then `echo '{"tool_name":"Write","tool_input":{"file_path":"'$PWD'/.metapowers/accounting/acme/02-journal.md"}}' | bash <repo>/plugins/accounting/hooks/phase-gate.sh; echo exit=$?` → message + `exit=2`; `touch .metapowers/accounting/acme/01-analyze.md` and repeat → `exit=0`.

- [ ] **Step 6: Commit**

```bash
git add -A packages/plugin-tools plugins/*/hooks
git commit -m "feat(plugins): table-driven phase-gate hook replaces non-functional check scripts"
```

---

### Task 10: `create-metapowers` hands Claude Code to the marketplace

**Files:**
- Modify: `packages/create-metapowers/src/index.ts`
- Create: `packages/create-metapowers/src/lib.ts`, `src/lib.test.ts`, `vitest.config.ts`
- Modify: `packages/create-metapowers/scripts/bundle-templates.sh` (also copy `.claude-plugin/marketplace.json` to `templates/marketplace.json`)
- Modify: `packages/create-metapowers/README.md`, `AGENTS.md`, `.cursorrules`
- Create: `.changeset/create-metapowers-marketplace.md` (minor)

**Interfaces:**
- Produces (`lib.ts`):
  ```ts
  export interface Domain { name: string; description: string; skills: number }
  export function loadDomains(templatesDir: string): Domain[];          // from templates/marketplace.json plugins[] + count of templates/plugins/<name>/skills/*/SKILL.md
  export function rewritePluginRoot(content: string, absPluginDir: string): string; // replaces every literal "${CLAUDE_PLUGIN_ROOT}" with absPluginDir using split/join (no regex)
  export function copyDomains(templatesDir: string, targetPluginsDir: string, domains: string[], opts: { overwrite: boolean }): string[]; // rmSync target domain dir first when overwrite; after copy, rewrites CLAUDE_PLUGIN_ROOT in every *.md and *.json and *.sh under the copied dir; returns copied domain names
  export function claudeCodeInstructions(domains: string[]): string;   // "/plugin marketplace add bromso/metapowers" + one "/plugin install <d>@metapowers" per domain
  export function packageVersion(): string;                             // from package.json next to dist
  export type Tool = "claude" | "codex" | "opencode" | "cursor";
  ```

- [ ] **Step 1: Write failing tests** (temp dirs with a fake `templates/` tree):

```ts
it("loadDomains reads all plugins from marketplace.json and counts SKILL.md dirs", () => { expect(loadDomains(tmpl).map(d => d.name)).toContain("finance"); expect(find("marketing").skills).toBe(2 /* fixture */); });
it("rewritePluginRoot handles targets containing $ and &", () => { expect(rewritePluginRoot("x `${CLAUDE_PLUGIN_ROOT}/shared/a.md`", "/p/$1 & co")).toBe("x `/p/$1 & co/shared/a.md`"); });
it("copyDomains rewrites CLAUDE_PLUGIN_ROOT in copied skills", ...);
it("copyDomains with overwrite removes stale files from a previous install", ...); // pre-create target/design/skills/old/SKILL.md → gone after copy
it("claudeCodeInstructions lists marketplace add then one install per domain", () => { expect(claudeCodeInstructions(["design","legal"])).toBe("/plugin marketplace add bromso/metapowers\n/plugin install design@metapowers\n/plugin install legal@metapowers"); });
```

- [ ] **Step 2: Run** → `cd packages/create-metapowers && bunx vitest run` → FAIL.

- [ ] **Step 3: Implement `lib.ts`; rewrite `index.ts` flow**

Flow: parse `--all`, `--tool <claude|codex|opencode|cursor>` (prompt if absent: "Which tool? 1. Claude Code 2. Codex CLI 3. OpenCode 4. Cursor"). If `claude`: print `claudeCodeInstructions(selected)`; if `claude` is on PATH (`spawnSync("claude", ["--version"])` succeeds) ask "Run these now? (y/N)" and on `y` run `claude plugin marketplace add bromso/metapowers` then `claude plugin install <d>@metapowers` for each; write nothing to `.metapowers/plugins/`. Otherwise: existing copy flow using `copyDomains` into `.metapowers/plugins/` (Codex/OpenCode) or `.cursor/skills/metapowers/` (Cursor), copy AGENTS.md or `.cursorrules`, write `config.json` with `version: packageVersion()`. Remove the hard-coded `DOMAINS`; use `loadDomains`. Replace the "Claude Code: Skills are in .metapowers/plugins/" summary line with "Claude Code: use the /plugin commands above".

- [ ] **Step 4: Update bundling and harness templates**

`bundle-templates.sh`: add `cp "$REPO_ROOT/.claude-plugin/marketplace.json" "$TEMPLATES_DIR/marketplace.json"`; keep `.claude-plugin` removal. `AGENTS.md` and `.cursorrules`: list all 16 domains (one line each, copy descriptions from `marketplace.json`), state skills live in `.metapowers/plugins/<domain>/skills/<skill>/SKILL.md` (Codex/OpenCode) or `.cursor/skills/metapowers/<domain>/skills/<skill>/SKILL.md` (Cursor), and note that `${CLAUDE_PLUGIN_ROOT}` has been rewritten to that directory at install. `packages/create-metapowers/README.md`: Compatibility row for Claude Code → "Hands off to `/plugin marketplace add bromso/metapowers`"; domain table generated text replaced with "All 16 domains; see the docs site for counts" (counts live in Task 11's check for the root README only).

Changeset: `"create-metapowers": minor` — "Claude Code installs via the plugin marketplace; file copy kept for Codex, OpenCode and Cursor with corrected paths and all 16 domains."

- [ ] **Step 5: Verify**

Run: `cd packages/create-metapowers && bun run build && bunx vitest run` → PASS, templates contain `marketplace.json`.
Run: `node dist/index.js --tool codex --all /tmp/mp-test && ls /tmp/mp-test/.metapowers/plugins | wc -l` → `16`; `grep -rl 'CLAUDE_PLUGIN_ROOT' /tmp/mp-test/.metapowers/plugins | wc -l` → `0`; `jq -r .version /tmp/mp-test/.metapowers/config.json` → matches `package.json`.
Run: `node dist/index.js --tool claude --all /tmp/mp-test2 < /dev/null` → prints the `/plugin` lines, creates no `.metapowers/plugins`.

- [ ] **Step 6: Commit**

```bash
git add packages/create-metapowers AGENTS.md .cursorrules .changeset
git commit -m "feat(cli): hand Claude Code installs to the plugin marketplace; fix other-harness copies"
```

---

### Task 11: Skill counts checker and stale numbers

**Files:**
- Create: `packages/plugin-tools/src/counts.ts`, `src/counts.test.ts`
- Modify: `packages/plugin-tools/src/cli.ts` (`check-counts <repoRoot>`)
- Modify: `README.md`, `CLAUDE.md`, `apps/docs/app/layout.tsx`, `apps/docs/content/docs/overview/what-is-metapowers.mdx`, `.claude-plugin/marketplace.json`, `plugins/{marketing,compliance}/.claude-plugin/plugin.json`, `packages/create-metapowers/README.md`, `apps/docs/app/(home)/page.tsx` (stats + domains array)

**Interfaces:**
```ts
export function countSkills(pluginsRoot: string): Record<string, number>; // only dirs containing SKILL.md
export function totalSkills(counts: Record<string, number>): number;
export interface CountViolation { file: string; found: string; expected: string }
export function checkCounts(repoRoot: string): CountViolation[];
```
`checkCounts` rules: (a) any `"<n> skills"` or `"<n>+ skills"` in `README.md`, `CLAUDE.md`, `apps/docs/app/layout.tsx`, `apps/docs/app/(home)/page.tsx`, `packages/create-metapowers/README.md`, `apps/docs/content/docs/overview/*.mdx` must equal the real total (or, for a plugin row that names a domain on the same line, that domain's count); (b) each `marketplace.json`/`plugin.json` description containing `"with <n> skills"` must match that plugin's count; (c) `apps/docs/app/(home)/page.tsx` `domains` array length must equal number of plugins and each `skills:` value must match.

- [ ] **Step 1: Tests**: temp plugins tree with `a/skills/{x,y}/SKILL.md` and `a/skills/README.md` → `countSkills` gives `{a: 2}` (Review Focus 5); `checkCounts` on a fixture README saying "3 skills" returns one violation with `expected: "2"`.

- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.**

- [ ] **Step 4: Run the checker, fix every violation by hand**

Run: `node packages/plugin-tools/dist/cli.js check-counts .`
Fix: README (`275+` ×3 → `283`), CLAUDE.md (`288` ×2 → `283`), `layout.tsx` (`275+` ×5 → `283`), `what-is-metapowers.mdx` (marketing 33 → 37; check all rows), `marketplace.json` + `plugin.json` (marketing 33 → 37, compliance 48 → 51), `create-metapowers/README.md` (table + total), `(home)/page.tsx` (stats `239+` → `283`, `12 Domains` → `16`, add cards for bookkeeping, accounting, finance, security if missing — copy icon/colour pattern from neighbouring cards). README domain table: Metapowers 7 → 8.
Re-run → no output, `exit=0`.

- [ ] **Step 5: Commit**

```bash
git add packages/plugin-tools README.md CLAUDE.md apps/docs .claude-plugin plugins/*/.claude-plugin packages/create-metapowers/README.md
git commit -m "fix: make every published skill count match disk and add check-counts"
```

---

### Task 12: Install docs and README claims

**Files:**
- Modify: `README.md` (Quick Start, How It Works "Quality gates", Compatibility table), `apps/docs/content/docs/overview/installation.mdx`, `CLAUDE.md` (Commands)

- [ ] **Step 1: README**

- Quick Start / Compatibility: replace `claude install bromso/metapowers` with
  ```
  /plugin marketplace add bromso/metapowers
  /plugin install design@metapowers      # or any domain
  ```
  and from a shell: `claude plugin marketplace add bromso/metapowers && claude plugin install design@metapowers`.
- "Quality gates — checks that enforce phase ordering" → "Quality gates — a `PreToolUse` hook blocks writing a phase artifact until the phases its skills declare as prerequisites exist; bypass per run with `--skip-checks` or globally with `METAPOWERS_SKIP_CHECKS=1`."
- Other-harness rows: Codex/OpenCode → `npx create-metapowers --tool codex`; Cursor → `npx create-metapowers --tool cursor`.

- [ ] **Step 2: `installation.mdx`**: Claude Code section uses the two `/plugin` commands, "Updating" uses `/plugin marketplace update metapowers` then `/plugin update <domain>@metapowers`; verify example stays `/design:empathize test-component`. Codex/OpenCode/Cursor sections: replace the `git clone` + `cp -r` recipes with `npx create-metapowers --tool <tool>` and one sentence on where files land.

- [ ] **Step 3: CLAUDE.md Commands**: add `claude plugin validate . --strict   # Validate plugin manifests` and `bun run check:plugins               # phase-deps, hooks, counts (plugin-tools)` (root script added in Task 13).

- [ ] **Step 4: Verify** — `grep -rn "claude install\|claude update" README.md apps/docs/content CLAUDE.md | wc -l` → `0`; `node packages/plugin-tools/dist/cli.js check-counts .` still clean.

- [ ] **Step 5: Commit** — `git commit -am "docs: correct install instructions and describe the real phase-gate mechanism"`

---

### Task 13: CI green and guarding

**Files:**
- Modify: `.github/workflows/ci.yml`, `.github/workflows/validate-skills.yml`, `.github/workflows/release.yml`, `.github/workflows/deploy-docs.yml` (checkout bump only)
- Modify: root `package.json` (script `"check:plugins": "turbo run check"`), `packages/plugin-tools/package.json` (script `"check": "node dist/cli.js gen-phase-deps ../../plugins --check && node dist/cli.js sync-hooks ../../plugins --check && node dist/cli.js fix-shared-refs ../../plugins --check && node dist/cli.js fix-args ../../plugins --check && node dist/cli.js fix-phase-files ../../plugins --check && node dist/cli.js check-counts ../.."`)

- [ ] **Step 1: Confirm `fix-args` and `fix-shared-refs` support `--check`** (add if Tasks 3/5 didn't; same pattern as the others, exit 1 when any file would change).

- [ ] **Step 2: Workflows**

- All four: `actions/checkout@v4` → `actions/checkout@v5`.
- `ci.yml` test job: build filter adds `--filter=@metapowers/plugin-tools --filter=create-metapowers`; `bun run test` now includes create-metapowers' real tests (Task 10) — no `--passWithNoTests`.
- `validate-skills.yml`: after the validate step add `- name: Build plugin-tools` (`bun turbo build --filter=@metapowers/plugin-tools`) and `- name: Check generated plugin files and counts` (`bun run check:plugins`). Add `packages/plugin-tools/**`, `README.md`, `CLAUDE.md`, `apps/docs/app/**`, `.claude-plugin/**` to its `paths:` lists.
- `release.yml`: build filter adds `--filter=@metapowers/figma-mcp` (already there) — no change beyond checkout.

- [ ] **Step 3: Verify locally what CI will run**

Run: `bun install && bun run check && bun run build && bun run test && bun run lint:skills && bun run check:plugins && claude plugin validate . --strict; echo exit=$?` → each step exits 0, final `exit=0`.

- [ ] **Step 4: Commit and watch CI**

```bash
git add .github package.json packages/plugin-tools/package.json
git commit -m "ci: run plugin validate, plugin-tools checks, and fix the failing test job"
```
Push the branch (or open the PR per the owner's workflow) and run `gh run list --branch <branch> --limit 4` until all four workflows show `success`. If any fails, fix in place and amend/commit; do not weaken a check.

---

### Task 14: Version bumps and changelog

**Files:**
- Modify: `plugins/*/.claude-plugin/plugin.json` (`version` → `0.2.0`), `.claude-plugin/marketplace.json` (`metadata.version` and every `plugins[].version` → `0.2.0`)
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Bump** with a one-liner over the JSON files (`jq` or `bun -e`), then `bun run format`.

Run: `grep -c '"version": "0.2.0"' .claude-plugin/marketplace.json` → `17`; `grep -L '"version": "0.2.0"' plugins/*/.claude-plugin/plugin.json | wc -l` → `0`.

- [ ] **Step 2: CHANGELOG** — under "Unreleased" add a "Marketplace 0.2.0" subsection with one bullet per Task 1–12 outcome (manifests validate; shared refs via `${CLAUDE_PLUGIN_ROOT}`; figma-mcp via npx and phantom MCP configs removed; append semantics for shared phase files; `--skip-checks` never in paths; PM artifacts under `.metapowers/`; table-driven phase gates; corrected install docs; CLI marketplace hand-off; counts checked in CI).

- [ ] **Step 3: Verify** — `claude plugin validate . --strict && bun run check:plugins; echo exit=$?` → `exit=0`.

- [ ] **Step 4: Commit**

```bash
git add plugins/*/.claude-plugin/plugin.json .claude-plugin/marketplace.json CHANGELOG.md
git commit -m "chore(plugins): release 0.2.0 of all plugins and the marketplace"
```

---

### Task 15: Acceptance walk-through (no code; evidence for the spec's checklist)

- [ ] **Step 1: Local marketplace install**

In a fresh temp project: `claude plugin marketplace add /path/to/repo` then `claude plugin install security@metapowers` and `claude plugin install accounting@metapowers`. Expected: both succeed; `claude plugin list` shows them.

- [ ] **Step 2: Spec acceptance items** — run in that project with Claude Code and record results in `docs/superpowers/plans/2026-10-19-install-and-run-acceptance.md`:
  - `/security:security-policy acme` → `.metapowers/security/acme/00-govern.md` exists.
  - `/security:api-security acme` then `/security:secure-coding acme` → `02-protect.md` contains both `## API Security` and `## Secure Coding` sections; no directory under `.metapowers/security/` contains `--skip-checks`.
  - `/accounting:journal books` with no `01-analyze.md` → the Write is blocked with the gate message; `/accounting:journal books --skip-checks` → `skip-log.md` names `02-journal.md` and the write succeeds; `/accounting:ledger books` is still blocked.
  - Shared template loads: run a skill that reads a template (e.g. `/development:plan x`) and confirm from the transcript that the Read targeted the plugin cache path, not the project.
  - Figma: only after the owner publishes `@metapowers/figma-mcp`; otherwise record "pending npm org".

- [ ] **Step 3: Commit the acceptance notes** — `git commit -m "docs: record install-and-run acceptance results"`.

---

## Self-review notes

- Spec §1–§11 each map to a task: §1→T1, §2→T2–3, §3→T4, §4→T10+T12, §5→T7, §6→T5, §7→T5–6, §8→T8–9, §9→T2/5/6/7 (rules) + T13 (CI), §10→T11, §11→T12+T14. Decisions §1–3 → T4, T10, T9. Acceptance → T15.
- Names used across tasks: `SkillFile`/`listSkills` (T3) consumed by T5, T7, T8; `ARGS_PARAGRAPH` (T5) mirrored as `STANDARD_ARGS_PARAGRAPH` in the validator with an equality test; `writeTargets` regex shared in wording between T7's tool and rule; `phase-deps.json` shape (T8) consumed by `phase-gate.sh` (T9); `--check` contract (exit 1 on would-change) used by every sub-command in T13.
- Review Focus items 1–3 pinned in T9 tests, 4 in T10, 5 in T11.
- Deviation from spec wording: scripts live in `packages/plugin-tools` rather than a root `scripts/` directory so they get Vitest/Turbo for free; the spec left the location to the builder.
