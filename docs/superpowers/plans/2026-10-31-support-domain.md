# Support Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `support` domain (10 skills, a 7-phase gated workflow, two references, docs, one eval) to the singularskills pack.

**Architecture:** Skills are Markdown under `skills/support-*/SKILL.md`; the workflow file drives generated gates, the conductor tables and adapters; the validator and pack-tools mirror two domain lists that gain `support`. Docs follow the `branding` section's pages. No new runtime code beyond two set/record entries.

**Tech Stack:** Bun 1.3, Turborepo, TypeScript, Vitest, Biome (tabs, width 100), Fumadocs.

**Spec:** `docs/superpowers/specs/2026-10-31-support-domain-design.md`

## Global Constraints

- Domain `support`; skills `support-journey-map`, `support-taxonomy`, `support-knowledge-base`, `support-macros`, `support-escalation`, `support-service-levels`, `support-health-review` (phases 1–7) and `support-reply`, `support-qa-review`, `support-incident-update` (utilities).
- Artifacts `01-map.md`, `02-taxonomy.md`, `03-knowledge.md`, `04-macros.md`, `05-escalation.md`, `06-service-levels.md`, `07-health.md` under `.singularskills/support/<project>/`; requires exactly as spec §4's table.
- Workflow title "Support Operations Cycle"; README methodology "Support Operations Cycle".
- Totals become **293 skills** and **17 domains**; eval cases 17 → **18**.
- Every number is labelled `computed`, `not measured` or `target`; personal data replaced by `<customer>`, `<email>`, `<account-1>`-style placeholders; at-risk accounts as `acct-` + first 8 hex of SHA-256 of the account ID column.
- `04-macros.md` carries a `## Policies` section; nothing is promised without a policy line.
- Generated files (`skills/*/scripts/gate.sh`, `skills/*/references/` copies, `adapters/`, the conductor's workflow tables and `references/workflows/`) only via generators.
- Descriptions: verb first, `Use when …` ≥ 6 words, 120–400 chars, `Not for …; see /…` where §3's neighbours overlap.
- Conventional commits ending `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Pack-tools commands need `bun run build` in `packages/pack-tools` first.

## Review Focus

1. An export with **no account or customer ID column**: phase 7 must say at-risk accounts cannot be listed stably and must not hash names or emails instead — pinned in Task 4's skill text and acceptance run 4.
2. **Personal data inside free-text ticket bodies** (an email in the message): quotes in any artifact are redacted — acceptance run 1.
3. `support-reply` with **no `.singularskills/support/` folder at all**: it still drafts, promises nothing, names the missing policy — acceptance run 3b.
4. **Re-running phase 7** over an existing `07-health.md`: Trend section names `acct-` ids present in both periods — acceptance run 4.
5. A ticket that **looks like a security incident** (account takeover) given to `support-reply`: it routes to `/security-incident-response` rather than drafting reassurance — Task 5's grep check and acceptance run 3c.

---

### Task 1: Validator and pack-tools know `support`

**Files:**
- Modify: `packages/skill-validator/src/plugin-rules.ts:501-504` (`CROSS_DOMAIN_READS`), `:740` (`COMPUTE_WITH_CODE_PLUGINS`)
- Modify: `packages/pack-tools/src/content-blocks.ts` (`COMPUTE_PLUGINS`)
- Test: `packages/skill-validator/src/plugin-rules.test.ts`, `packages/pack-tools/src/content-blocks.test.ts`

**Interfaces:**
- Produces: `CROSS_DOMAIN_READS.support = ["research", "marketing", "branding"]`; `"support"` in both compute sets.

- [ ] **Step 1: Write failing tests.** In `plugin-rules.test.ts`: under `artifact-root`, a `support-journey-map` skill whose body names `` `.singularskills/research/<project>/` `` yields no `artifact-root` finding, and one naming `` `.singularskills/legal/<project>/` `` still does; under `compute-with-code-present`, a `support-health-review` body without the compute paragraph yields `["compute-with-code-present"]` (copy the `accounting-close` case at line 886). In `content-blocks.test.ts`: `COMPUTE_PLUGINS.has("support")` is true and the existing equality test against the validator set still runs.
- [ ] **Step 2: Run** `cd packages/skill-validator && bunx vitest run src/plugin-rules.test.ts` and the pack-tools file. Expected: the new cases FAIL.
- [ ] **Step 3: Add the entries** in the three places above.
- [ ] **Step 4: Run** both test files, then `SKIP_NETWORK_TESTS=1 bun run test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(support): validator and pack-tools know the support domain`.

### Task 2: References

**Files:**
- Create: `references/support/support-metrics.md`, `references/support/service-recovery.md`

**Interfaces:**
- Produces: linked from skills as `references/support-metrics.md` and `references/service-recovery.md`.

- [ ] **Step 1: Write `support-metrics.md`** with sections: Definitions (contact volume, contact rate, first-response time, resolution time — median and p90 in business hours, first-contact resolution, reopen rate, backlog age, SLA attainment, CSAT top-2-box share and mean, CES, NPS, each with formula); Reading them (spec §6's three findings with author, year, journal; "report CSAT top-2-box first, never NPS alone"); Labels (`computed`, `not measured`, `target`); Account identifiers (the `acct-` SHA-256 rule with a 5-line Python snippet, and "no ID column: write `not measured: no account ID in the export`; never hash names or emails"); Inputs (table: metric → export columns needed → what to write when missing).
- [ ] **Step 2: Write `service-recovery.md`** with: the three justice dimensions; spec §6's findings (Gelbrich & Roschk 2011; de Matos et al. 2007; Valentini et al. 2020; double deviation); a "Failure reply checklist" of 6–8 items (acknowledge, apologise once and specifically, explain what happened, say what you will do and by when, offer only what the Policies section allows, state the next update, never blame the customer, no promise without a policy line).
- [ ] **Step 3: Verify** `grep -c "computed\|not measured" references/support/support-metrics.md` ≥ 2 and `grep -n "Policies" references/support/service-recovery.md` matches. Expected: both.
- [ ] **Step 4: Commit** `docs(support): metrics and service-recovery references`.

### Task 3: Workflow and phases 1–4

**Files:**
- Create: `workflows/support.yml` (phases 1–4 only, from spec §4's table), `skills/support-{journey-map,taxonomy,knowledge-base,macros}/SKILL.md`
- Generated: gates, reference copies, adapters, conductor tables

**Interfaces:**
- Consumes: Task 1's sets, Task 2's references.
- Produces: `workflows/support.yml` with `name: support`, `title: Support Operations Cycle`, `folder: support`.

- [ ] **Step 1: Write the workflow file** with phases 1–4 (shape of `workflows/branding.yml`).
- [ ] **Step 2: Run** `bun run check:pack`. Expected: FAIL naming the missing `support-*` skills.
- [ ] **Step 3: Write the four skills** per spec §4 items 1–4 and §5: frontmatter (`argument-hint: "[project] [--skip-checks]"`, `workflow: support`, `phase`, `artifact`), `# Title`, one-line intro, `## Prerequisites` (phase 1: `None — this is the first phase.`; others name required artifacts), `## Process` numbered steps in the `branding-*` voice ending in "Write the artifact … with sections:", `## Output` (artifact path + "Present a summary … highlighting:" bullets). Each that reads tickets carries the input-ask and redaction rule; macros carries the `## Policies` section rule and links `references/service-recovery.md`; phases 1 and 2 link `references/support-metrics.md` and compute with code (taxonomy: classify ≥ 50 tickets or all, revise until < 10% "Other").
- [ ] **Step 4: Generate.** In `packages/pack-tools`: `bun run build`, `bun run fix:skill-text`, `bun run fix:args`, `bun run fix:phase-files`, `bun run fix:frontmatter`, `bun run fix:compute`, `bun run gen:gates`, `bun run gen:references`, `bun run gen:adapters`.
- [ ] **Step 5: Run** `bun run lint:skills && bun run check:pack`. Expected: PASS except the README/count check, which Task 7 fixes; record a ruling if so and confirm every other check passes.
- [ ] **Step 6: Commit** `feat(support): workflow and phases 1-4`.

### Task 4: Phases 5–7

**Files:**
- Modify: `workflows/support.yml` (add phases 5–7)
- Create: `skills/support-{escalation,service-levels,health-review}/SKILL.md`

- [ ] **Step 1: Add phases 5–7** to the workflow; run `bun run check:pack`. Expected: FAIL on the missing skills.
- [ ] **Step 2: Write the three skills** per spec §4 items 5–7. Escalation names `/security-incident-response` for suspected security incidents. Service levels: staffing as arrival rate × handle time, computed, labelled an estimate; external promise vs internal target. Health review: metrics from `references/support-metrics.md`, SLA attainment vs `06-service-levels.md`, churn signals, `acct-` identifiers with the no-ID-column rule verbatim from Task 2, the re-run Trend rule, and the summary line naming `/marketing-churn-prevention` when at-risk accounts exist.
- [ ] **Step 3: Generate** as Task 3 Step 4.
- [ ] **Step 4: Run** `bun run lint:skills && bun run check:pack` and `grep -n "never hash names or emails" skills/support-health-review/SKILL.md`. Expected: as Task 3 Step 5; grep matches.
- [ ] **Step 5: Commit** `feat(support): phases 5-7`.

### Task 5: Utilities

**Files:**
- Create: `skills/support-{reply,qa-review,incident-update}/SKILL.md`

- [ ] **Step 1: Write a frontmatter-only `skills/support-reply/SKILL.md`** (name and a 60-character description) and run `bun run lint:skills`. Expected: FAIL on description length and missing sections — proves the validator sees the new skill.
- [ ] **Step 2: Write `support-reply`** per spec §4: reads taxonomy, macros (`## Policies`), knowledge base, escalation, brand voice when present; asks for a missing policy once; with none, promises nothing and names the missing policy above the draft; a ticket suggesting account takeover, data exposure or a breach gets no reassuring draft — it says "possible security incident" and names `/security-incident-response`; returns in chat; writes no artifact; never sends.
- [ ] **Step 3: Write `support-qa-review` and `support-incident-update`** per spec §4, utility artifacts at `qa/<date>-<slug>.md` and `incidents/<date>-<slug>.md` with hand-written frontmatter (`phase: null`, `gate: none`) and started/finished log lines phrased like `skills/design-design-review/SKILL.md` so `fix-skill-text` leaves them; incident-update `Not for security incidents; see /security-incident-communication.`
- [ ] **Step 4: Generate** as Task 3 Step 4; then `bun run fix:skill-text` again and `git diff --stat skills/support-qa-review skills/support-incident-update`. Expected: no change on the second run (fixer left hand lines alone).
- [ ] **Step 5: Run** `bun run lint:skills && bun run check:pack`; `grep -n "security-incident-response" skills/support-reply/SKILL.md`. Expected: as before; grep matches.
- [ ] **Step 6: Commit** `feat(support): reply, QA review and incident update utilities`.

### Task 6: Eval case

**Files:**
- Create: `evals/support-reply/prompt.md`, `evals/support-reply/graders/{fired,quality}.md`
- Modify: `packages/pack-tools/src/evals-dry.test.ts:43-47` (17 → 18)

- [ ] **Step 1: Change the test** to expect `18 case(s)`; run `cd packages/pack-tools && bunx vitest run src/evals-dry.test.ts`. Expected: FAIL (17).
- [ ] **Step 2: Write the case** in `evals/branding-discover/`'s shape: a pasted ticket from a customer (placeholder email in the body) asking for a refund 40 days into a 30-day refund window, with the policy stated in the prompt, never naming the skill. `fired.md` matches `support-reply`; `quality.md` (type llm, focus on the final response) passes only if: it classifies the ticket, does not promise the refund, offers only what the stated policy allows, does not repeat the customer's email, and is in a reply-ready form.
- [ ] **Step 3: Run** the test and `bun run evals --dry`. Expected: PASS; `18 case(s)`.
- [ ] **Step 4: Commit** `test(evals): support-reply case`.

### Task 7: Docs, counts and prose

**Files:**
- Create: `apps/docs/content/docs/support/{index,journey-map,taxonomy,knowledge-base,macros,escalation,service-levels,health-review,reply,qa-review,incident-update,artifacts,storage,examples}.mdx`, `apps/docs/content/docs/support/meta.json`
- Modify: `apps/docs/content/docs/meta.json` (`support` after `marketing`), `apps/docs/lib/domains.ts`, `apps/docs/lib/site.ts:25` (comment), `apps/docs/lib/site.test.ts`, `apps/docs/components/home/ChromaBento.tsx` (any 16/30 literal), `apps/docs/content/docs/overview/{comparisons,what-is-singularskills}.mdx`, `README.md` (row: `[Support](…/docs/support) | Support Operations Cycle | 10 | Support journey, taxonomy, macros, escalation, SLAs and account health`), `AGENTS.md` (domain list), `CLAUDE.md`, `.claude-plugin/{plugin,marketplace}.json`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `plugin.json`, `packages/pack-tools/src/smoke-install.test.ts:32`
- Regenerated: `apps/docs/lib/site-data.json` and codemod output

- [ ] **Step 1: Update tests first.** `site.test.ts`: orders 1..17; sizes 2 wide (design, development), 2 half (research, marketing), 12 small, 1 meta; 30 cells; totals "293 skills across 17 domains". `smoke-install.test.ts`: `codex: 293 skills`. Run `cd apps/docs && bunx vitest run lib/site.test.ts`. Expected: FAIL.
- [ ] **Step 2: Docs pages** in the `branding` formats (`kind: phase` with Purpose/Usage/Prerequisites/What It Does/Output/Next Phase; `kind: utility` like `audit.mdx`; overview pages like `artifacts.mdx`, `storage.mdx`, `examples.mdx`); `meta.json` with icon `LifeBuoy` and separators `---Phases---`, `---Memory---`, `---Examples---`, `---Utilities---`.
- [ ] **Step 3: `domains.ts`**: add `LifeBuoy` import and the entry (slug `support`, name `Support`, methodology `Support Operations Cycle`, colour `sky`, a `line-md` icon present in `lib/icons.ts`'s set, blurb in house style, `bento: { size: "small", order }` such that rows of six stay full); set `security` to `small`; renumber orders 1..17.
- [ ] **Step 4: Counts and prose**: replace every pack total 283/16 with 293/17 in the files listed (not CHANGELOG history, not the `2.1.283` CLI version); add `support` to AGENTS.md's domain sentence.
- [ ] **Step 5: Regenerate** in `apps/docs`: `bun run gen:data`, `bun run codemod`.
- [ ] **Step 6: Run** `cd apps/docs && bun run check && bunx vitest run`; root `bun run lint:skills && bun run check:pack && SKIP_NETWORK_TESTS=1 bun run test && bun run check && bash scripts/check-rename.sh`. Expected: all PASS.
- [ ] **Step 7: Commit** `docs(support): support section, sidebar, bento and pack totals`.

### Task 8: Acceptance runs

**Files:**
- Create: `docs/superpowers/plans/2026-10-31-support-domain-acceptance.md`
- Scratch: a project in the session scratchpad with a synthetic 60-ticket CSV (columns `id,created,first_response,resolved,channel,subject,body,account_id,csat`, invented data, at least 5 bodies containing a fake email or phone) and a second-period CSV sharing ≥ 2 account IDs; a third CSV without `account_id`.

- [ ] **Step 1: Run** with the pack loaded as a plugin and no MCP servers (`claude -p --plugin-dir <worktree> --strict-mcp-config --mcp-config '{"mcpServers":{}}'`), each in the scratch project:
  1. `/support-journey-map acme` then `/support-taxonomy acme` with the CSV → artifacts exist, gate passes, log has started/finished, volumes `computed` with a script, `grep -E "@|\+?[0-9]{3}[ -][0-9]{3}"` over both artifacts finds no CSV contact data.
  2. `/support-service-levels acme` before `05-escalation.md` exists → gate stops it.
  3. `/support-reply` on an out-of-window refund ticket: (a) with a `04-macros.md` whose Policies cap refunds at 30 days, (b) in an empty project, (c) on an account-takeover ticket → (a)(b) no refund promised, (b) names the missing policy, (c) names `/security-incident-response`.
  4. `/support-health-review acme` (after creating phases 5–6 artifacts with `--skip-checks` runs) on period 1, then period 2 → Trend names shared `acct-` ids; on the no-ID CSV → `not measured: no account ID`, no hashed names.
- [ ] **Step 2: Record** each run's command, the evidence lines and pass/fail in the acceptance file; a failure is fixed in the owning skill (RED = the failing run, GREEN = the rerun) and noted.
- [ ] **Step 3: Commit** `docs(support): acceptance record`.
