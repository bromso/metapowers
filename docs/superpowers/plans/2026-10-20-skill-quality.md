# Skill Quality (Project B) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the 283 Metapowers skills route correctly, pass the agentskills.io/Claude Code shape, carry disclaimers and compute-with-code where money or compliance is involved, fix known content errors, and ship a `claude plugin eval` suite that demonstrates each plugin beats the no-plugin baseline.

**Architecture:** Uniform edits (frontmatter fields, disclaimers, compute-with-code) are new idempotent `packages/plugin-tools` commands with `--check`, enforced by new `packages/skill-validator` plugin-level rules. Non-uniform edits (descriptions, formula fixes, cross-references, docs) are hand-written by implementers reading each skill, in plugin batches, with the validator as the gate. Evals use Claude Code's native `claude plugin eval` layout per plugin, driven by one `scripts/run-evals.sh`; the dead scoring-harness is removed.

**Tech Stack:** Bun 1.3.12, Turborepo, TypeScript ESM, Vitest 3, Biome, bash; `claude` CLI 2.1.283 (`plugin eval`, `plugin validate`).

**Spec:** `docs/superpowers/specs/2026-10-20-skill-quality-design.md`

## Global Constraints

- Nothing from project A changes: `${CLAUDE_PLUGIN_ROOT}` paths, the standard Arguments paragraph, append semantics, phase gates, artifact paths; `bun run check:plugins`, `bun run lint:skills`, `claude plugin validate . --strict`, `bun run check`, `bun run test` all green at every task's end (except `lint:skills` may be red between Task 1 and Task 6 while descriptions are rewritten — see Task 1).
- Description shape (spec §1): `<Verb-first sentence>. Use when <≥6 words>.` optionally `Not for <x>; see /<plugin>:<skill>.` 120–400 chars. Blocklisted trigger clauses: `needed`, `appropriate`, `required`, `necessary`, `asked`.
- Frontmatter key order: `name`, `description`, `argument-hint`, `disable-model-invocation`. `name` = directory name. `argument-hint` values exactly as spec §2. `disable-model-invocation: true` only on `metapowers/{find-skill,create-skill,improve-skill,init}`.
- Disclaimer and compute-with-code wording verbatim from spec §5, inserted via the instruction sentence `End the artifact with this paragraph, verbatim:` (disclaimer) and as a paragraph after the Arguments paragraph (compute-with-code).
- Eval layout: `plugins/<p>/evals/<skill>/prompt.md` + `graders/*.md` (+ `fixtures/`, `scaffold.sh` where needed); prompts never name the skill or plugin; money cases add `Bash`; run script flags: `--trust-plugin --scaffold --allow-tools Write Edit Bash --no-publish --threshold 0.7 --max-cost-usd ${EVALS_MAX_COST_USD:-10}`.
- Owner decision: agents run the evals, ≤ $10 per plugin, ≤ 2 tuning rounds per case, weak cases written up.
- Versions: marketplace + plugins 0.2.0 → 0.3.0; `create-metapowers` patch changeset; no other npm changes.
- Conventional commits; implementer commits carry the trailer of the authoring model.

## Review Focus

1. A description where "Use when" appears mid-sentence without a preceding period ("Audit APIs and use when launching") must still satisfy the rule only if a ≥6-word clause follows — pinned in Task 1's rule tests.
2. A skill directory whose name is not a valid `name` (uppercase, underscore, >64 chars) must fail `name-matches-dir` with a message naming the rule, not be silently written — pinned in Task 1.
3. `fix-disclaimer` must insert exactly once even when `## Output` already ends with a blockquote or the skill has no `## Output` (then report, don't insert) — pinned in Task 7.
4. An eval prompt that accidentally contains `/<plugin>:` or the skill's directory name must be rejected by `run-evals.sh --dry` before any paid run — pinned in Task 13.
5. `fix-frontmatter` on a skill that already has a `name` with a different value must overwrite it and list the file — pinned in Task 1.

---

### Task 1: Frontmatter fields + validator rules

**Files:**
- Create: `packages/plugin-tools/src/frontmatter.ts`, `src/frontmatter.test.ts`
- Modify: `packages/plugin-tools/src/cli.ts` (command `fix-frontmatter`)
- Modify: `packages/skill-validator/src/rules.ts` (max length 400; `description-has-trigger`), `src/plugin-rules.ts` (`name-matches-dir`, `argument-hint-present`, `frontmatter-key-order`), tests
- Modify: `plugins/*/skills/*/SKILL.md` (283, by script)

**Interfaces:**
- Produces:
  ```ts
  export const SLUG_HINT = "[project] [--skip-checks]";
  export const BASENAME_HINT = "<file-or-topic> [--skip-checks]";
  export const FREE_TEXT_HINTS: Record<string, string>; // "metapowers/find-skill" → "<topic>", … per spec §2
  export const MODEL_INVOCATION_DISABLED = new Set(["metapowers/find-skill","metapowers/create-skill","metapowers/improve-skill","metapowers/init"]);
  export function fixFrontmatter(content: string, plugin: string, skill: string): string; // sets name; argument-hint per rule; disable-model-invocation; reorders keys; leaves other keys after the four
  ```
  Detection of the Arguments-paragraph variant reuses `standardArgsParagraph` from `@metapowers/skill-validator` (already a devDependency).
- Validator: `description-max-length` → 400. `description-has-trigger` (error): regex `/\bUse when\b\s+((?:[^.]+?))\./` must match with ≥6 whitespace-separated words in group 1 and the clause's first word not in the blocklist. `name-matches-dir` (error): `frontmatter.name === basename(dirname(filePath))` and `/^[a-z0-9-]{1,64}$/`. `argument-hint-present` (error): skills whose body contains the Arguments paragraph must have a non-empty `argument-hint`. `frontmatter-key-order` (warning): the first keys present are in the order `name, description, argument-hint, disable-model-invocation`.

- [ ] **Step 1: Write failing tests** (`frontmatter.test.ts`; validator tests in `rules.test.ts` / `plugin-rules.test.ts`):

```ts
it("adds name, slug hint and key order to a slug skill", () => { const out = fixFrontmatter(secFixture, "security", "api-security"); expect(out).toMatch(/^---\nname: api-security\ndescription: .*\nargument-hint: "\[project\] \[--skip-checks\]"\n---/); });
it("uses the basename hint for coaching", ...);                 // argument-hint: "<file-or-topic> [--skip-checks]"
it("uses the free-text hint table and disables model invocation for find-skill", ...);
it("overwrites a wrong existing name and is idempotent", () => { /* fixture with name: wrong */ expect(out).toContain("name: api-security"); expect(fixFrontmatter(out,...)).toBe(out); }); // Review Focus 5
// validator
it("description-has-trigger accepts a ≥6-word Use-when clause and rejects 'Use when needed'", ...);
it("description-has-trigger rejects mid-sentence Use when with <6 words", ...);   // Review Focus 1
it("name-matches-dir rejects a mismatched or invalid name", ...);                 // Review Focus 2
it("argument-hint-present fires only for Arguments-paragraph skills", ...);
it("frontmatter-key-order warns on description before name", ...);
```

- [ ] **Step 2: Run** `bun run --filter @metapowers/plugin-tools test` and `bun run --filter @metapowers/skill-validator test` → FAIL.
- [ ] **Step 3: Implement** `frontmatter.ts` (use `gray-matter` to parse/stringify; keep body byte-identical), the CLI command (same `perSkill` pattern as `fix-args`), the five rule changes.
- [ ] **Step 4: Run the fixer**, then verify: `grep -L "^name: " plugins/*/skills/*/SKILL.md | wc -l` → 0; `grep -l "disable-model-invocation: true" plugins/*/skills/*/SKILL.md | wc -l` → 4; `node packages/plugin-tools/dist/cli.js fix-frontmatter plugins --check; echo $?` → 0; `bun run lint:skills | grep -c "description-has-trigger"` → 283 (expected red until Task 6); no other new rule fires. Add `fix-frontmatter ../../plugins --check` to the plugin-tools `check` script.
- [ ] **Step 5: Commit** `feat(plugins): add name, argument-hint and model-invocation frontmatter; validator rules for routing shape`.

---

### Task 2: Descriptions — compliance (51)

**Files:** `plugins/compliance/skills/*/SKILL.md` (description line only), `packages/skill-validator/src/rules.ts` (verb additions if needed).

**Interfaces:** none produced; consumes Task 1's rule.

- [ ] **Step 1:** For each skill, read the full SKILL.md and write the description per spec §1 (what + Use when + optional Not for). Colliding/overlapping names in this plugin get a `Not for` clause: `gdpr`, `ccpa`, `soc2` (→ `/legal:gdpr-compliance`, `/legal:ccpa-compliance`, `/legal:soc2-prep`), `ada-wcag` (→ `/accessibility:scope` for the full audit), `risk`-type skills. Keep the verb-first rule.
- [ ] **Step 2: Verify** `bun run lint:skills 2>/dev/null | grep "plugins/compliance" | grep -c "description-has-trigger"` → 0; `awk -F'description: ' '/^description:/{print length($2)}' plugins/compliance/skills/*/SKILL.md | sort -n | head -1` ≥ 120 and tail ≤ 400.
- [ ] **Step 3: Commit** `feat(compliance): trigger-style skill descriptions`.

### Task 3: Descriptions — legal (35), leadership (12), coaching (5)

Same steps as Task 2. `Not for` pairs: `legal/gdpr-compliance`, `ccpa-compliance`, `soc2-prep` (→ compliance), `legal/risk-assessment` (→ `/security:risk-assessment`, `/project-management:risk-assessment`), `legal/accessibility-compliance` (→ `/accessibility:scope`), `leadership/retro` (→ `/project-management:retrospective`), `coaching/code` (→ `/development:review`), `coaching/a11y` (→ `/accessibility:scope`). Commit per plugin.

### Task 4: Descriptions — marketing (37), research (4), design (9), development (6)

Same steps. `Not for`: `development/review` (→ `/coaching:code`), `design/a11y-audit` (→ `/accessibility:scope`), `development/plan` vs `/project-management:*` (planning a feature vs a project), `research/discover` vs `/marketing:customer-research`. Commit per plugin.

### Task 5: Descriptions — security (39), accessibility (6), branding (6), metapowers (8)

Same steps. `Not for`: `security/risk-assessment` (→ legal, PM), `security/compliance-gap` (→ `/compliance:gap-analysis`), accessibility skills name `/design:a11y-audit` and `/coaching:a11y` as the lighter alternatives. `metapowers/*` descriptions make clear they are cross-domain utilities ("Use when the user asks what is in progress across domains…"). Commit per plugin.

### Task 6: Descriptions — project-management (32), accounting (13), bookkeeping (9), finance (11); enable the gate

Same steps. `Not for`: `project-management/retrospective` (→ `/leadership:retro`), `project-management/risk-assessment` (→ legal, security), `project-management/plan`-like skills vs `/development:plan`; `finance/ratios` vs `/accounting:statements`.

- [ ] **Final verification for Tasks 2–6:** `bun run lint:skills; echo exit=$?` → `exit=0`; `grep -L "Use when" plugins/*/skills/*/SKILL.md | wc -l` → 0; `for s in assess audit build discover plan report review risk-assessment strategy test; do grep -l "^description:" plugins/*/skills/$s/SKILL.md | xargs grep -L "Not for\|see /" ; done | wc -l` → 0 (every colliding-name skill disambiguates). Commit per plugin; last commit `feat(plugins): enable description-has-trigger`.

---

### Task 7: Disclaimers and compute-with-code

**Files:**
- Create: `packages/plugin-tools/src/content-blocks.ts`, `src/content-blocks.test.ts`
- Modify: `packages/plugin-tools/src/cli.ts` (commands `fix-disclaimer`, `fix-compute`), `packages/skill-validator/src/plugin-rules.ts` (+tests), `plugins/{finance,accounting,bookkeeping,compliance,security}/skills/*/SKILL.md`

**Interfaces:**
```ts
export const DISCLAIMER: Record<"money"|"compliance"|"security", string>; // exact blockquotes from spec §5
export const DISCLAIMER_INSTRUCTION = "End the artifact with this paragraph, verbatim:";
export const DISCLAIMER_PLUGINS: Record<string, keyof typeof DISCLAIMER>; // finance/accounting/bookkeeping → money, compliance → compliance, security → security
export const COMPUTE_PARAGRAPH: string; // exact from spec §5
export const COMPUTE_PLUGINS = new Set(["finance","accounting","bookkeeping"]);
export function addDisclaimer(content: string, plugin: string): { content: string; skipped?: "no-output-section" };
export function addCompute(content: string, plugin: string): string; // inserted after the Arguments paragraph; if absent, before the first "## "
```
Validator rules (error, scoped to the plugins above): `disclaimer-present` (instruction sentence + exact blockquote as the last non-blank lines of `## Output`), `compute-with-code-present`. The validator holds its own copies of the strings with an equality test from plugin-tools (same pattern as the Arguments paragraph).

- [ ] **Step 1: Tests:** inserts once at the end of `## Output`; idempotent; skill whose Output already ends with a different blockquote gets the disclaimer after it (Review Focus 3); skill with no `## Output` → `skipped` and unchanged; compute paragraph after Arguments paragraph; equality tests against validator constants; rule positive/negative.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** + CLI commands + rules + add both `--check`s to the `check` script.
- [ ] **Step 4: Run both fixers; verify:** `grep -L "Not financial or tax advice" plugins/{finance,accounting,bookkeeping}/skills/*/SKILL.md | wc -l` → 0 (same for compliance/security strings); `grep -L "Compute with code" plugins/{finance,accounting,bookkeeping}/skills/*/SKILL.md | wc -l` → 0; `lint:skills` exit 0; `--check` exit 0; list any `skipped` files in the report.
- [ ] **Step 5: Commit** `feat(plugins): disclaimers for money, compliance and security skills; compute-with-code for money skills`.

---

### Task 8: Hand fixes — ratios, undefined scores, legal frontmatter, coaching wording

**Files:** `plugins/finance/skills/ratios/SKILL.md`; the "undefined score" skills (builder lists them: grep `score` in the write block / `## Output` of each skill and keep those where no formula or rating scale is given — the audit named `compliance/iso27017` and five others); `plugins/legal/skills/{clause-library,decision-memo,legal-research}/SKILL.md` (+ any other with an indented `---` frontmatter instruction: `grep -ln "^\s\+---\s*$" plugins/*/skills/*/SKILL.md`); `plugins/coaching/skills/a11y/SKILL.md`.

- [ ] **Step 1:** `finance/ratios`: add `DIO = Inventory / COGS × 365` where the Cash Conversion Cycle is defined; interest coverage = `EBIT / Interest Expense` (rename the EBITDA variant "EBITDA coverage" if kept).
- [ ] **Step 2:** each undefined score → a formula sentence or rename to the qualitative rating; record the list in the commit body.
- [ ] **Step 3:** remove artifact-frontmatter instructions from the legal single-writer skills (artifact starts with `# <Title>`).
- [ ] **Step 4:** `coaching/a11y`: replace the "If the accessibility plugin's shared resources exist" sentence with a plain `Read \`${CLAUDE_PLUGIN_ROOT}/shared/wcag-21-aa-criteria.md\`.`
- [ ] **Step 5: Verify** `lint:skills` and `check:plugins` exit 0; `grep -c "^\s\+---\s*$" plugins/legal/skills/*/SKILL.md | grep -v ":0" | wc -l` → 0. **Commit** `fix(plugins): correct ratio formulas, define scores, drop artifact frontmatter, fix coaching wording`.

---

### Task 9: Meta-skills install location and review step

**Files:** `plugins/metapowers/skills/{create-skill,improve-skill,find-skill}/SKILL.md`; docs `apps/docs/content/docs/overview/{create-skill,find-skill,improve-skill}.mdx`.

- [ ] **Step 1:** `create-skill`/`improve-skill`: target `.claude/skills/<name>/SKILL.md`; add "The skill is available as `/<name>` in the next Claude Code session."
- [ ] **Step 2:** `find-skill`: insert, before any write, the review step verbatim: "**Review before installing.** Show the user the candidate's frontmatter and its first 40 lines. Scan the file for instructions that fetch URLs, run shell commands, or write outside the current project, and list any you find. Ask: `Install this skill? (yes/no)` and proceed only on an explicit yes." Install target `.claude/skills/<name>/SKILL.md`.
- [ ] **Step 3:** update the three docs pages accordingly. **Verify** `grep -rn "\.metapowers/plugins/custom" plugins apps/docs/content | wc -l` → 0; `lint:skills` exit 0. **Commit** `fix(metapowers): install custom skills where Claude Code loads them; review downloaded skills first`.

---

### Task 10: Cross-references

**Files:** the skills listed in spec §6 (both directions).

- [ ] **Step 1:** add one line directly under the intro paragraph of each: `See also \`/x:y\` for <the other angle>.` Exact pairs/groups from spec §6; the accessibility group names `/accessibility:scope` as the full audit path.
- [ ] **Step 2: Verify** `lint:skills` exit 0 (the `skill-ref-exists` rule validates every reference); count lines added = number of skills in the groups (compliance 3 + legal 3 + risk 3 + retro 2 + code/review 2 + accessibility 5 = 18). **Commit** `docs(plugins): cross-reference overlapping skills`.

---

### Task 11: Design docs pages + evals overview page

**Files:** Create `apps/docs/content/docs/design/{a11y-audit,design-review,export-tokens,system-overview}.mdx`; modify `apps/docs/content/docs/design/meta.json` (add `---Utilities---` + the four); create `apps/docs/content/docs/overview/evals.mdx` (placeholder sections: What is tested, Running `bun run evals`, Reading the report — filled in Task 13); modify `apps/docs/content/docs/overview/meta.json`.

- [ ] **Step 1:** follow the shape of `apps/docs/content/docs/design/empathize.mdx` (frontmatter `title`, `description`; sections Usage / What it does / Output). Content from each SKILL.md.
- [ ] **Step 2: Verify** `bun run --filter @metapowers/docs build` succeeds; `node packages/plugin-tools/dist/cli.js check-counts .` exit 0. **Commit** `docs(design): document the five utility skills; add evals overview`.

---

### Task 12: Figma token via userConfig

**Files:** `plugins/design/.claude-plugin/plugin.json`, `plugins/design/.mcp.json`, `plugins/design/README.md`, `apps/docs/content/docs/design/index.mdx` (setup paragraph), `CHANGELOG.md` (migration line under the 0.3.0 subsection created in Task 15 — add the subsection header now if absent).

- [ ] **Step 1:** add the `userConfig` block from spec §7 (no `required`), switch `.mcp.json` env to `${user_config.figma_access_token}`.
- [ ] **Step 2: Verify** `claude plugin validate . --strict` exit 0 and `claude plugin validate ./plugins/design --strict` exit 0; `jq -r '.mcpServers["metapowers-figma"].env.FIGMA_ACCESS_TOKEN' plugins/design/.mcp.json` → `${user_config.figma_access_token}`. Docs + README migration line. **Commit** `feat(design): read the Figma token from plugin userConfig`.

---

### Task 13: Eval suites, run script, scoring-harness removal (dry run only)

**Files:**
- Create: `plugins/<p>/evals/<skill>/prompt.md`, `graders/{fired.md,artifact.md,quality.md}` for the 16 cases in spec §4; `fixtures/` + `scaffold.sh` for accounting/analyze, bookkeeping/record, coaching/code, metapowers/status
- Create: `scripts/run-evals.sh`; modify root `package.json` (`"evals": "bash scripts/run-evals.sh"`), `.gitignore` (`evals-results/`, `plugins/*/evals/results/`), `CONTRIBUTING.md`, `CLAUDE.md` (Commands: `bun run evals`), `apps/docs/content/docs/overview/evals.mdx`
- Delete: `packages/scoring-harness/`, `fixtures/`; modify `turbo.json` (`score` task), root `package.json` (`score` script), `.github/workflows/ci.yml` + `release.yml` build filters, `README.md`/`CONTRIBUTING.md` mentions
- Modify: `packages/create-metapowers/scripts/bundle-templates.sh` and `src/lib.ts` `copyDomains` to exclude `evals/`; `src/lib.test.ts` (+1 test)

**Interfaces:**
- Grader files (frontmatter per `claude plugin eval` docs; builder confirms exact keys with `claude plugin eval --help` and https://code.claude.com/docs/en/plugin-evals): `fired.md` → `type: tool_used`, `tool: Skill`; `artifact.md` → `type: file_exists`, `path: .metapowers/<p>/<project>/<file>`; `quality.md` → `type: llm`, `weight: 1`, body = rubric from the skill's `## Output` (+ "ends with the disclaimer" for money/compliance/security).
- `prompt.md` frontmatter: `max_turns: 25`, `runs: 2`, `allowed_tools: [Read, Write, Edit, Glob, Grep, Skill]` (+ `Bash` for accounting/bookkeeping/finance), `scaffold_script: scaffold.sh` where fixtures exist.
- `scripts/run-evals.sh [plugin…] [--dry]`: `--dry` lists every case, validates that no `prompt.md` contains `/<plugin>:` or its skill's directory name as a word (Review Focus 4 — exit 1 with the file name), and exits 0; otherwise runs `claude plugin eval ./plugins/<p> --trust-plugin --scaffold --allow-tools Write Edit Bash --no-publish --threshold 0.7 --max-cost-usd "${EVALS_MAX_COST_USD:-10}" --json evals-results/<p>.json` per plugin and prints a table `plugin | case | with | without | delta | fired` parsed from the JSON with `jq`.

- [ ] **Step 1:** write `run-evals.sh --dry` first and a shell test (`scripts/run-evals.test.sh` run by `bun run test`? No — keep it simple: a Vitest test in `packages/plugin-tools/src/evals-dry.test.ts` that spawns the script with `--dry` against a temp plugins tree containing one good and one skill-naming prompt → exit 1 and the file name).
- [ ] **Step 2:** author the 16 cases; fixtures: accounting `transactions.csv` (12 rows, two months), bookkeeping `bank-lines.csv` (10 rows), coaching `src/sample.ts` (60 lines with 3 obvious issues), metapowers a seeded `.metapowers/` with `design/btn/01-empathize.md` + `02-define.md` and `security/acme/00-govern.md`; each `scaffold.sh` copies its fixtures into `$PWD`.
- [ ] **Step 3:** remove scoring-harness + fixtures + references; CLI excludes `evals/` (test: a copied domain has no `evals/`).
- [ ] **Step 4: Verify** `bun run evals --dry; echo $?` → lists 16 cases, exit 0; `bun run check && bun run build && bun run test && claude plugin validate . --strict` all exit 0; `grep -rn "scoring-harness" --include=*.json --include=*.yml --include=*.md . | grep -v node_modules | grep -v docs/superpowers | wc -l` → 0.
- [ ] **Step 5: Commit** `feat(evals): claude plugin eval suites for all 16 plugins; remove scoring-harness`.

---

### Task 14: Run the evals, tune, record

**Files:** Create `docs/superpowers/plans/2026-10-20-skill-quality-acceptance.md`; modify eval prompts/graders and, if a skill is weak, that SKILL.md (within spec §1/§5 bounds only); `apps/docs/content/docs/overview/evals.mdx` (fill "Reading the report").

- [ ] **Step 1:** `EVALS_MAX_COST_USD=10 bun run evals` (all plugins). Record the table.
- [ ] **Step 2:** for each case with `fired = no` in the with-arm or `delta ≤ 0`: at most two tuning rounds (reword the prompt to be more clearly in-domain, or tighten the rubric to the skill's Output; if the skill's description is the cause, reword it — still within the Task 1 rule), re-run only that plugin.
- [ ] **Step 3:** write the acceptance doc: final table, per-case verdict (✅ positive delta and fired / ⚠️ weak: prompt or skill, and why), total cost from the JSON, the owner's live two-plugin routing check steps (spec Acceptance item 4).
- [ ] **Step 4: Commit** `docs(evals): record first eval run and tuning`.

---

### Task 15: Versions, changeset, changelog

**Files:** `.claude-plugin/marketplace.json`, `plugins/*/.claude-plugin/plugin.json` (0.2.0 → 0.3.0), `.changeset/create-metapowers-skill-quality.md` (`"create-metapowers": patch`), `CHANGELOG.md` ("Marketplace 0.3.0", one bullet per spec §1–§7, plus the Figma migration line from Task 12).

- [ ] **Step 1:** bump with `sed` (one match per file), `bun run format` only if Biome reports changes. **Verify** `grep -c '"version": "0.3.0"' .claude-plugin/marketplace.json` → 17; `grep -L '"version": "0.3.0"' plugins/*/.claude-plugin/plugin.json | wc -l` → 0; `claude plugin validate . --strict && bun run check:plugins && bun run lint:skills` exit 0.
- [ ] **Step 2: Commit** `chore(plugins): release 0.3.0 of all plugins and the marketplace`.

## Self-review notes

- Spec coverage: §1→T1–T6, §2→T1, §3→T9, §4→T13–T14, §5→T7–T8, §6→T10–T11, §7→T12, §8→T15 (+ CLI evals exclusion in T13), Decisions→T13/T14 flags, Acceptance→T14 + owner live check.
- Names consistent: `fixFrontmatter`/`fix-frontmatter`, `addDisclaimer`/`fix-disclaimer`, `addCompute`/`fix-compute`, `run-evals.sh --dry`, grader file names `fired/artifact/quality`.
- Review Focus 1, 2, 5 → T1 tests; 3 → T7; 4 → T13.
- Description batches are the bulk of the work (283 hand-written lines); they are split so each batch is one reviewer's gate and `lint:skills` turns green only when the last batch lands.
