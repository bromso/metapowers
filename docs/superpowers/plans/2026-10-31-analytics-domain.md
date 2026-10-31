# Analytics Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `analytics` domain (10 skills, a 6-phase gated workflow, two references, docs, one eval) to the singularskills pack.

**Architecture:** Same shape as project 4's `support` domain: Markdown skills under `skills/analytics-*/SKILL.md`, a workflow file that drives generated gates, conductor tables and adapters, two domain-list entries in the validator and pack-tools, and docs pages in the `support` section's formats.

**Tech Stack:** Bun 1.3, Turborepo, TypeScript, Vitest, Biome (tabs, width 100), Fumadocs.

**Spec:** `docs/superpowers/specs/2026-10-31-analytics-domain-design.md`

## Global Constraints

- Domain `analytics`; phase skills `analytics-questions`, `analytics-metrics`, `analytics-data-audit`, `analytics-analysis`, `analytics-dashboards`, `analytics-readout` (phases 1–6); utilities `analytics-experiment-readout`, `analytics-investigate`, `analytics-number-check`, `analytics-query`.
- Artifacts `01-questions.md`, `02-metrics.md`, `03-data.md`, `04-analysis.md`, `05-dashboards.md`, `06-readout.md` under `.singularskills/analytics/<project>/`; requires exactly as spec §4's table. Utility artifacts `experiments/<date>-<slug>.md`, `investigations/<date>-<slug>.md` (`phase: null`, `gate: none`); number-check and query write no file.
- Workflow title and README methodology: "Decision Analytics Cycle".
- Totals become **303 skills**, **18 domains**, **19** eval cases, **21** workflows.
- Labels `computed`, `not measured`, `not checked`, `target`; scripts write only aggregates under `.singularskills/` (no row-level data, names, emails or raw IDs); slugs name the topic, never a person.
- `CROSS_DOMAIN_READS.analytics = ["research", "marketing", "finance", "support"]`; `analytics` in both compute sets.
- `analytics-experiment-readout` carries the SRM-first order, the call table and the no-Bash fallback in its own body.
- Generated files only via generators. Descriptions: verb first, `Use when …` ≥ 6 words, 120–400 chars, `Not for …; see /…` against spec §3's neighbours.
- Commits end `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Pack-tools commands need `bun run build` in `packages/pack-tools` first.
- Until Task 6, verify with `bun run check` in `packages/pack-tools` plus `bun run lint:skills` (root `check:pack` runs the docs check first, which stays red until the docs exist); a skill may not name `/analytics-*` skills a later task creates.

## Review Focus

1. A results file whose **planned split is not 50/50** (say 90/10): the SRM check uses the planned ratio, not 50/50 — pinned in Task 4's skill text (grep for "planned split") and acceptance run 3.
2. An investigation where the **metric definition changed** mid-period: the data checks come before causes — Task 4's grep for "before any cause" and acceptance run 4.
3. A **ratio metric reported as an average of averages**: number-check reproduces both and names the difference — acceptance run 5.
4. Data with **personal fields** (emails, user IDs) in the export: no file under `.singularskills/analytics/` holds them — acceptance run 1's grep over every file, scripts included.
5. A **predict** question about revenue: phase 4 routes it to `/finance-forecast` instead of projecting it — Task 3's grep and acceptance run 1 (one question in the fixture is a revenue forecast).

---

### Task 1: Validator and pack-tools know `analytics`

**Files:** `packages/skill-validator/src/plugin-rules.ts` (`CROSS_DOMAIN_READS`, `COMPUTE_WITH_CODE_PLUGINS`), `packages/pack-tools/src/content-blocks.ts` (`COMPUTE_PLUGINS`); tests `packages/skill-validator/src/plugin-rules.test.ts`, `packages/pack-tools/src/content-blocks.test.ts`.

- [ ] **Step 1: Failing tests**, in the shape of the support ones: under `artifact-root`, `analytics-investigate` reading `.singularskills/research|marketing|finance|support/<project>/` yields no `artifact-root` finding and `.singularskills/legal/...` does; the compute set equals `["accounting", "analytics", "bookkeeping", "finance", "support"]` sorted; `analytics-query` without the paragraph yields `compute-with-code-present`; `COMPUTE_PLUGINS.has("analytics")`.
- [ ] **Step 2: Run** both files. Expected: the new cases FAIL.
- [ ] **Step 3: Add the entries.**
- [ ] **Step 4: Run** `SKIP_NETWORK_TESTS=1 bun run test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(analytics): validator and pack-tools know the analytics domain`.

### Task 2: References

**Files:** create `references/analytics/metric-definitions.md`, `references/analytics/experiment-readout.md`.

- [ ] **Step 1: Write a check script** at the workspace (`final-check`-style, one `t` line per assertion): `metric-definitions.md` contains "Simpson", "average of averages", "aggregates only"; `experiment-readout.md` contains "Fabijan", "Johari", "Berman", "Kohavi", "planned split", "p < 0.001", and the four calls "ship", "don't ship", "inconclusive", "invalid". Run it. Expected: FAIL (files absent).
- [ ] **Step 2: Write both files** per spec §6: the definition template fields (name, question, formula, unit and grain, inclusions and exclusions, window, segments, source, owner, traps), metric tree and guardrails, traps with a worked Simpson's-paradox example in a small table; the readout's five ordered checks with citations (Fabijan et al. 2019 *KDD*; Johari et al. 2017 *KDD*; Berman et al. 2018; Kohavi et al. 2024 *KDD*), the SRM chi-square against the **planned split** with threshold p < 0.001 and a 6-line Python snippet, and the call table.
- [ ] **Step 3: Run** the check script. Expected: all ok.
- [ ] **Step 4: Commit** `docs(analytics): metric-definition and experiment-readout references`.

### Task 3: Workflow and the six phases

**Files:** create `workflows/analytics.yml` (spec §4 table), `skills/analytics-{questions,metrics,data-audit,analysis,dashboards,readout}/SKILL.md`; modify `packages/pack-tools/src/skill-text.test.ts:338` (225 → 231), `:572` (34 → 35), `packages/pack-tools/src/workflows.test.ts:71-73` (20 → 21).

- [ ] **Step 1: Workflow file, then** `bun run check` in `packages/pack-tools`. Expected: FAIL, "names unknown skill analytics-…" for six skills.
- [ ] **Step 2: Write the six skills** per spec §4 items 1–6 and §5, in the voice of `skills/support-*`: phase 1 reads the four allowed domains' artifacts, tags questions describe/diagnose/predict/test; phase 2 uses `references/metric-definitions.md` and references, never redefines, metrics defined in other domains' artifacts; phase 3 runs the data checks with labels and names tracking gaps with `/marketing-analytics-tracking`; phase 4 answers with uncertainty, the observational caveat, routes *test* to `/marketing-ab-test-setup` (not to `/analytics-experiment-readout` yet — Global Constraints) and revenue, cost and cash *predict* questions to `/finance-forecast`; phase 5 cuts any tile that answers no phase 1 question; phase 6 writes for the phase 1 decision-maker with confidence and "what would change this". Every computing step carries the aggregates-only sentence verbatim from `skills/support-health-review/SKILL.md`, with `.singularskills/analytics/<project>/`.
- [ ] **Step 3: Generate** (in `packages/pack-tools`, twice, then confirm the second pass changes nothing): `build`, `fix:args`, `fix:skill-text`, `fix:phase-files`, `fix:frontmatter`, `fix:compute`, `gen:gates`, `gen:references`, `gen:adapters`.
- [ ] **Step 4: Update the pinned counts** above; run `bun run check` in `packages/pack-tools`, `bun run lint:skills`, `SKIP_NETWORK_TESTS=1 bun run test`, and `grep -n "finance-forecast" skills/analytics-analysis/SKILL.md`. Expected: only `check-counts` fails (docs and README come in Task 6); lint, tests PASS; grep matches.
- [ ] **Step 5: Commit** `feat(analytics): workflow and phases 1-6`.

### Task 4: Utilities

**Files:** create `skills/analytics-{experiment-readout,investigate,number-check,query}/SKILL.md`; modify `skills/analytics-analysis/SKILL.md` (add `/analytics-experiment-readout` beside `/marketing-ab-test-setup`).

- [ ] **Step 1: Frontmatter-only stub** of `analytics-experiment-readout`; `bun run lint:skills`. Expected: FAIL (description, compute paragraph).
- [ ] **Step 2: Write `analytics-experiment-readout`**: reads the test plan from `.singularskills/marketing/<project>/03-convert.md` (`## A/B Test:` section) when present, else asks once for the planned split, primary metric, sample size and duration; check 1 is SRM against the **planned split**, p < 0.001; with no way to run code, no statistic is stated, the counts are shown against the plan, the check is `not computed`, and plainly-off counts give *inconclusive: suspected sample ratio mismatch*; then the planned-sample/duration and early-stop check, effect and interval, guardrails, and the call table (ship, don't ship, inconclusive, invalid) — SRM or unplanned early stop overrides the p-value. Utility artifact `experiments/<date>-<slug>.md` with hand-written frontmatter and log lines as `skills/support-qa-review/SKILL.md`. `Not for designing a test; see /marketing-ab-test-setup.`
- [ ] **Step 3: Write the other three** per spec §4: investigate rules out data problems (tracking change, late data, definition change) **before any cause**, then segment and mix-versus-rate decomposition, then ranked causes with evidence for and against; number-check returns match / mismatch with reason / cannot reproduce in chat; query writes or explains SQL in the named dialect against a supplied schema, uses phase 2 definitions when present, names fan-out joins, time zones and nulls in filters, and never runs against a live database.
- [ ] **Step 4: Generate** as Task 3 Step 3; run `bun run fix:skill-text` once more and `git diff --stat skills/analytics-experiment-readout skills/analytics-investigate`. Expected: no change (hand lines left alone).
- [ ] **Step 5: Run** `bun run lint:skills`, `bun run check` in `packages/pack-tools`, and `grep -n "planned split" skills/analytics-experiment-readout/SKILL.md; grep -n "before any cause" skills/analytics-investigate/SKILL.md`. Expected: as Task 3; both greps match.
- [ ] **Step 6: Commit** `feat(analytics): experiment readout, investigate, number check and query utilities`.

### Task 5: Eval case

**Files:** create `evals/analytics-experiment-readout/{prompt.md,case.yaml,scaffold.sh,graders/fired.md,graders/quality.md,fixtures/…}`; modify `packages/pack-tools/src/evals-dry.test.ts:43-47` (18 → 19).

- [ ] **Step 1: Change the test** to `19 case(s)`; run it. Expected: FAIL.
- [ ] **Step 2: Write the case** in `evals/support-reply/`'s shape: fixtures `.singularskills/marketing/checkout/03-convert.md` with an `## A/B Test:` section (planned 50/50, primary metric checkout conversion, planned 14 days and 40,000 users per arm) and `results.csv` with `arm,users,conversions` rows `control,40112,3610` and `treatment,34391,3302` (about 54/46; treatment conversion higher, two-proportion p < 0.05). Prompt (no Bash, `allowed_tools: [Read, Glob, Grep, Skill]`): "Our checkout test finished; results are in results.csv and the plan is saved in this folder. Did the new checkout win — can we ship it? I won't be around to answer questions." Never mentions ratios. `quality.md` passes only if: it does not call it a win or recommend shipping; it names the assignment imbalance against the planned 50/50 (computed or suspected); it says the result cannot be trusted until the cause is found; it states no p-value or interval it could not compute without saying how it got it.
- [ ] **Step 3: Run** the test and `bun run evals --dry`. Expected: PASS; `19 case(s)`.
- [ ] **Step 4: Commit** `test(evals): analytics-experiment-readout case`.

### Task 6: Docs, bento, counts and prose

**Files:** create `apps/docs/content/docs/analytics/{index,questions,metrics,data-audit,analysis,dashboards,readout,experiment-readout,investigate,number-check,query,artifacts,storage,examples}.mdx` and `meta.json`; modify `apps/docs/content/docs/meta.json` (after `research`), `apps/docs/lib/domains.ts`, `apps/docs/lib/site.ts:25` comment, `apps/docs/lib/site.test.ts`, `apps/docs/components/home/ChromaBento.tsx` comment, `apps/docs/public/llms.txt`, `apps/docs/content/docs/overview/{what-is-singularskills,comparisons,workflows,evals}.mdx`, `README.md` (row after Research: `[Analytics](…/docs/analytics) | Decision Analytics Cycle | 10 | Decision-led metrics, data checks, analysis, dashboards and experiment readouts`), `AGENTS.md`, `CLAUDE.md`, `.claude-plugin/{plugin,marketplace}.json`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `plugin.json`, `packages/pack-tools/src/smoke-install.test.ts:32`.

- [ ] **Step 1: Tests first.** `site.test.ts`: orders 1..18; sizes 2 wide (design, development), 1 half (marketing), 14 small, 1 meta, 30 cells; first five slugs unchanged; `slugs.slice(5, 17)` sorted; totals "303 skills across 18 domains". `smoke-install.test.ts`: `codex: 303 skills`. Run `cd apps/docs && bunx vitest run lib/site.test.ts`. Expected: FAIL.
- [ ] **Step 2: `domains.ts`**: `ChartColumn` import; entry slug `analytics`, name `Analytics`, methodology `Decision Analytics Cycle`, a `line-md` icon present in `@iconify-json/line-md`, blurb in house style, `bento: { order: 8, size: "small" }` (alphabetically after accounting); shift bookkeeping..support +1 and singular to 18; research to `small`. Colour: print the bento with a throwaway script (order, slug, size, colour) and pick a palette colour matching no tile touching analytics, diagonals included, at six and at two columns; record the neighbours in a ruling.
- [ ] **Step 3: Docs pages** in `apps/docs/content/docs/support/`'s formats; `meta.json` icon `ChartColumn`.
- [ ] **Step 4: Counts and prose**: every pack total 293/17 → 303/18 in the listed files (not CHANGELOG, not the `2.1.283` CLI pin); `llms.txt` Domains list gains `- Analytics: …`; AGENTS.md domain sentence gains `analytics`; overview tables gain an alphabetical Analytics row (workflows: `analytics | Decision Analytics Cycle | 6`; evals: `analytics | analytics-experiment-readout | .singularskills/analytics/checkout/experiments/<date>-<slug>.md`). Then `grep -rnE "293 skills|17 domains" --exclude-dir=node_modules --exclude-dir=.git . | grep -v CHANGELOG` returns nothing.
- [ ] **Step 5: Regenerate** in `apps/docs`: `gen:data`, `codemod`; `bun run format`.
- [ ] **Step 6: Run** the full suite: `lint:skills`, `check:pack`, `SKIP_NETWORK_TESTS=1 bun run test`, `bun run check`, `cd apps/docs && bun run check`, `check-rename`, `evals --dry`, and the smoke test alone (`cd packages/pack-tools && bunx vitest run src/smoke-install.test.ts`). Expected: all PASS.
- [ ] **Step 7: Commit** `docs(analytics): analytics section, sidebar, bento and pack totals`.

### Task 7: Acceptance runs and eval

**Files:** create `docs/superpowers/plans/2026-10-31-analytics-domain-acceptance.md`. Scratch: synthetic data in the session scratchpad (orders export with `order_id,user_id,email,created,segment,amount,status` — 500 rows, invented; experiment result files clean and SRM; a weekly metric file where the drop is a mix shift between two segments; a reported "average order value" computed as an average of daily averages).

- [ ] **Step 1: Runs** with `claude -p … --plugin-dir <worktree> --strict-mcp-config --mcp-config '{"mcpServers":{}}' --allowedTools Read,Write,Edit,Glob,Grep,Skill,Bash --max-turns 40`, prompts ending "I won't be around to answer questions":
  1. Phases 1–3 for project `shop` (one phase 1 question is a revenue forecast) → artifacts and log lines; checks `computed`; revenue forecast routed to `/finance-forecast` in a following phase 4 run; `grep -rE "@|user_id|[0-9a-f]{8}-" .singularskills/analytics/` finds no row-level data in any file, scripts included.
  2. Phase 4 for a fresh project with only `01-questions.md` → the gate stops it.
  3. `/analytics-experiment-readout` on the clean file (a call with interval) and on a 90/10-planned file with an SRM against 90/10 (invalid).
  4. `/analytics-investigate` on the mix-shift file → names the mix shift before causes.
  5. `/analytics-number-check` on the average-of-averages AOV → mismatch with the reason.
- [ ] **Step 2: Record** each run (command, evidence, pass/fail) in the acceptance file; fix any failing skill and re-run (RED = failing run, GREEN = rerun).
- [ ] **Step 3: Paid eval** `EVALS_ALLOW_BASH=0 bun run evals analytics-experiment-readout`; record with/without/delta/fired/cost in the acceptance file. Expected: with-arm passes; a delta above 0 is the goal, and a delta of 0 is recorded plainly with the reason.
- [ ] **Step 4: Commit** `docs(analytics): acceptance record`.
