# Singularskills foundation — acceptance record

Plan: `docs/superpowers/plans/2026-10-29-singularskills-foundation.md`
Spec: `docs/superpowers/specs/2026-10-26-singularskills-foundation-design.md`
Branch: `singularskills-foundation` (worktree `.claude/worktrees/site-storytelling`), head commit `2e381dc`.
PR: https://github.com/bromso/metapowers/pull/49 (branch pushed as `singularskills-foundation`; the GitHub repository itself is **not yet renamed** — see Owner actions).

This record exists because the controller's task ledger (`.superpowers/sdd/2026-10-29-singularskills-foundation/progress.md`) and the per-task reports live in a workspace folder that is deleted once this project closes. Everything here that matters after that deletion — the acceptance evidence, the rulings, and the deferred items — is carried forward verbatim or by exact reference.

---

## 1. Spec §12 acceptance items

| # | Acceptance item (spec §12) | Status | Evidence |
|---|---|---|---|
| 1 | `npx skills add bromso/singularskills` into an empty project installs 283 skills into the right folder for each detected Tier 1 agent; Claude Code and Codex marketplace installs work. | Partly | Local install verified for all 7 Tier 1 agents: Task 8's `scripts/smoke-install.sh --local` ran `npx -y skills@latest add <repo> --agent <id> -y` for each agent and confirmed 283 `SKILL.md` files land in `.claude/skills/` (Claude Code) or `.agents/skills/` (the other six), plus gate-script executability and gate behavior (exit 1 then 0). **Not exercised**: the remote form (`bromso/singularskills`) — the GitHub repo is not yet renamed, so this path cannot resolve. Claude Code's `/plugin marketplace add` and Codex's `codex plugin marketplace add` were not driven live in either session; `claude plugin validate . --strict` (manifest shape only) passes — see item 6 below. |
| 2 | In each Tier 1 agent, `/workflow design date-picker` runs phase 1, asks a question, writes `01-empathize.md` with frontmatter and the two closing sections, appends run-log lines, and stops with a playback and a question. Approval records and runs phase 2; re-running before approving re-offers phase 1; invoking phase 3 directly with phase 2's artifact missing is refused; `--skip-checks` writes `skipped` and proceeds; the Claude Code hook lets that write through only because of that event. | Partly | The conductor skill (`skills/workflow/SKILL.md`) and its 19 run-log/behavior rules are pinned by 19 unit tests in `packages/pack-tools/src/conductor.test.ts` (phrase-level regex pins on every behavior above) and exercised once via `bun run evals --dry` (case `workflow`, `graders=5`, scaffold present) — **not run for real** (no `claude plugin eval` call was made; `--dry` only lists and validates the case, it does not execute the model). The gate-refusal and `--skip-checks` behavior is covered by `packages/skill-validator` and `packages/pack-tools` automated tests (`gate-hook.test.ts`, `gates.test.ts`) against synthetic fixtures, and the hook's own logic is read-reviewed, not driven inside a live Claude Code session. **Not exercised here**: actually typing `/workflow design date-picker` into any of the 7 agents and watching it ask, write, stop, approve, refuse, and bypass — this is the live Tier 1 checklist, an owner action (section 3 below). |
| 3 | `/workflow marketing launch` runs every member of phase 1 in order by default and accepts a named subset; the shared artifact has one frontmatter block and one headed section per member with its own closing sections. | Not verified | Covered by design and unit tests only: `workflows/marketing.yml` phase 1 has 9 members; the conductor's "run all in listed order by default... accept a named subset" rule is pinned in `conductor.test.ts`; the shared-artifact frontmatter-once / one-section-per-member / `### Decisions` + `### Open questions` shape is pinned in `packages/pack-tools/src/migrate.test.ts` and `phase-files.test.ts`, and the validator's `phase-file-append` rule (`plugin-rules.test.ts`) checks the exact append-template wording in all 143 real multi-writer skills. No live run of `marketing launch` was made in any agent. |
| 4 | The `metapowers:workflow` skill and its templates are gone; `build-feature`, `compliance-audit` and `launch-product` exist as workflow files and run through the conductor. | Verified | `skills/workflow/` is the only workflow skill (Task 3's migration deleted `plugins/metapowers/skills/workflow` and its templates; Task 6 created `skills/workflow/SKILL.md` fresh — ledger confirms no `singular-workflow` and no leftover `metapowers:workflow` skill). `workflows/build-feature.yml` (9 phases), `workflows/compliance-audit.yml` (13 phases) and `workflows/launch-product.yml` (23 phases) exist and are loaded by `check-workflows`, which passed with 0 violations in this session's `bun run check:pack` run (below). The conductor's file-lookup logic treats these identically to domain workflows. Running them through a live agent was not exercised. |
| 5 | `bun run check:pack`, `bun run lint:skills`, `bun run test` and the docs build pass; the docs site deploys at the new base path with every skill page present and the counts correct. | Partly | `bun run check:pack`, `bun run lint:skills` and `SKIP_NETWORK_TESTS=1 bun run test` all passed in this session (exact output in section 4). The docs build (part of `check:pack`'s `@singularskills/docs:build` task) passed and produced 191 static routes. **Deploy at the new base path is not verified**: GitHub Pages has not redeployed under `/singularskills` because the repo rename (a prerequisite per spec §10a) has not happened — this is an owner action, not something checkable from the worktree. |
| 6 | No file in the repo references `metapowers` except the migration note and the changelog history. | Verified | `bash scripts/check-rename.sh` → exit 0, `check-rename: no occurrences outside the allowlist` (this session's run, section 4). The allowlist (`packages/pack-tools/src/rename-check.ts`) covers exactly: `CHANGELOG.md` and package changelogs, `docs/plans/**`, `docs/superpowers/**`, `.git/**`, `node_modules/**`, `apps/docs/out/**`, `apps/docs/.next/**`, `bun.lock`, `.superpowers/**`, the six source files that legitimately name the old brand as a detection string (`migrate.ts`/`.test.ts`, `rename-check.ts`/`.test.ts`, `plugin-rules.ts`/`.test.ts`), and the one `> Migrating from metapowers:` line in `README.md` and `apps/docs/content/docs/overview/installation.mdx`. |
| 7 (implicit, §12 last bullet) | No MCP server, no `.mcp.json`, no network call in any skill or script. | Verified | Task 9 deleted `plugins/design/.mcp.json` and `packages/figma-mcp`. A repo-wide grep for `.mcp.json` and `mcp__`/`figma_access_token` config in skill bodies was performed by Task 9/11 (design skills keep only a one-line Figma note, per spec §8's ruling). `scripts/smoke-install.sh` and the gate hook make no network calls; the only network call anywhere in the pack's own scripts is the installer's own `npx skills add`, which is outside the pack. |

---

## 2. Tier 1 agent checklist (spec §9 / the five checks in `apps/docs/content/docs/overview/agent-checklist.mdx`)

The five checks: **1** install/discovery, **2** first phase (conductor asks then stops), **3** approval recorded, **4** gate refusal on direct phase-3 invocation, **5** `--skip-checks` logged and let through (Claude Code hook).

| Agent | 1 Install | 2 First phase | 3 Approval | 4 Gate | 5 Bypass | What was actually exercised |
|---|---|---|---|---|---|---|
| Claude Code | automated | not verified | not verified | automated (fixture) | not verified | Task 8's local smoke install (283 skills landed in `.claude/skills/`) and two-phase gate fixture (exit 1 → exit 0). Gate-hook logic (events, `skipped` match) covered by `gate-hook.test.ts` against synthetic fixtures, not a live session. Live checklist: not verified in this project; owner checklist. |
| Codex | automated | not verified | not verified | automated (fixture) | not verified | Same local smoke install + gate fixture as Claude Code. No live session. Live checklist: not verified in this project; owner checklist. |
| OpenCode | automated | not verified | not verified | automated (fixture) | not verified | Same. Live checklist: not verified in this project; owner checklist. |
| Cursor | automated | not verified | not verified | automated (fixture) | not verified | Same. Live checklist: not verified in this project; owner checklist. |
| GitHub Copilot (VS Code and CLI) | automated | not verified | not verified | automated (fixture) | not verified | Same. Live checklist: not verified in this project; owner checklist. |
| Gemini CLI | automated | not verified | not verified | automated (fixture) | not verified | Same. Live checklist: not verified in this project; owner checklist. |
| Kimi Code CLI | automated | not verified | not verified | automated (fixture) | not verified | Same. Live checklist: not verified in this project; owner checklist. |

Notes:
- "automated" means: Task 8's `scripts/smoke-install.sh --local` (re-runnable; see Task 8's report for the exact smoke lines — all seven printed `<agent>: 283 skills, gate ok`) and the `packages/pack-tools/src/smoke-install.test.ts` vitest wrapper around it (skipped under `SKIP_NETWORK_TESTS=1`, which is how CI and this session's `bun run test` ran it — see section 4). This is script-driven discovery and a synthetic gate fixture, not an agent actually reading and running the conductor skill.
- The single eval case for the conductor (`evals/workflow/`, 5 graders, with scaffold) exists and was listed by `bun run evals --dry` (exit 0) in this session, but **`bun run evals` (the real, credit-spending run) was not executed** — neither in this project nor, per Task 10's report, could its CLI flags even be confirmed (`claude plugin eval --help` was blocked in that implementer's sandbox).
- Open question carried from the ledger (Task 7): whether Claude Code accepts a plugin that ships a skill and a command wrapper with the same name (283 such pairs, e.g. skill `design-empathize` + command `/design-empathize`) without duplicate-entry errors. `claude plugin validate . --strict` passes (manifest shape only — it does not install or list skills+commands together), so this remains unresolved until a real `/plugin install` is driven.

---

## 3. Verification numbers per task

(Figures below are taken from each task's report's own Status/verification sections, not re-run in this session unless marked "re-run here".)

| Task | Key numbers |
|---|---|
| 1 — rename plugin-tools → pack-tools | pack-tools: 10 files / 164 tests pass. Root `bun run test`: 9/9 tasks. |
| 2 — workflow files + validator | 19 workflow files, 218 phase-member listings across domain workflows. pack-tools: 11 files / 178 passed, 1 skipped. |
| 3 — migration command | 282 skills moved, 72 deleted (16 plugin.json, 43 hooks files, `.mcp.json`, `design/README.md`, the old `workflow` SKILL.md, 5 orphan shared files, 5 cross-domain templates). 27 canonical reference files across 13 domains; 16 single-reader files moved in-skill. pack-tools: 10 files / 105 passed, 5 skipped (Task 4 TODOs). |
| 4 — validator for the flat pack | skill-validator: 5 files / 77 tests (74 then +3 in fix round). Real-pack validator run: 282 skills + 40 reference docs, 0 errors. pack-tools: 10 files / 112 passed (then 113 after fix round 1). |
| 5 — gate scripts + reference copies | 182 gate scripts generated (mode 0755, all pass `sh -n`); 155 reference copies made, 0 deleted. pack-tools: 12 files / 128 tests. |
| 6 — conductor, run log, status, report | Conductor pinned by `conductor.test.ts`: 14 tests, then 19 after fix round 1. pack-tools: 13 files / 142 passed, then 147 after fix round 1. `check-counts` down to 2 known lines (domains.ts "overview"/"metapowers" — Task 11's job); the 283-vs-282 gap closed once `skills/workflow` existed. |
| 7 — Claude adapter (manifest, wrappers, hook) | 283 Claude command wrappers (4 with `disable-model-invocation`), 283 Gemini wrappers, `gates.json` covering 15 gated domain folders. pack-tools: 15 files / 154 tests. `claude plugin validate . --strict` on the marketplace manifest: passed. |
| 8 — other adapters + install smoke test | Smoke lines for all 7 Tier 1 agents: `<agent>: 283 skills, gate ok` (claude-code, codex, opencode, cursor, github-copilot, gemini-cli, kimi-code-cli). 1 smoke test, skipped under `SKIP_NETWORK_TESTS=1`. |
| 9 — removals | 63 files changed, 28 insertions / 3736 deletions. `bun run test`: 5/5 tasks (skill-validator 77, pack-tools 155, docs 93 = 325 tests). `bun run check` (Biome): 174 files clean. |
| 10 — rename everything else | `check-rename` (final state): 0 hits outside `apps/docs/` after round 1, then 0 hits anywhere after round 2's path-name fix. `bun run evals --dry`: 17 cases, exit 0 (verbatim list reproduced in section 4). pack-tools: 16 files / 169–174 tests across fix rounds. |
| 11 — docs app on the flat pack | `apps/docs bun run test`: 14 files / 102 passed. `apps/docs bun run build`: 191/191 static routes (190 docs/site pages + `og-image.png` + `apple-touch-icon.png`, after replacing the deleted `opengraph-image.png` route). `packages/pack-tools bun run check`: exit 0 end to end including `check-rename` and `check-counts`. |
| 12 — CI and deploy | `turbo.json` gains `globalPassThroughEnv: ["SKIP_NETWORK_TESTS"]`. `SKIP_NETWORK_TESTS=1 bun run test`: 5/5 tasks, pack-tools 177 passed + 1 skipped. `.github/workflows/validate-skills.yml` gains `check-rename.sh` and `smoke-install.sh --local` (15 min timeout, pinned `SKILLS_CLI=skills@1.7.4`) steps. |

### Totals (current pack, confirmed by this session's own commands — section 4)
- 283 skill folders (282 domain skills + the `workflow` conductor); 16 domains.
- 19 workflow files (14 domain + `build-feature`, `compliance-audit`, `launch-product`, `new-team`, `rebrand`).
- 182 generated gate scripts; 155 generated reference copies; 40 reference docs total.
- 17 eval cases (`bun run evals --dry`, exit 0, this session).
- 191 static docs/site pages exported by `apps/docs`.
- 0 `metapowers` references outside the allowlist (`check-rename.sh`, this session).

---

## 4. This session's own command runs (exact result lines)

Run from the worktree root (`/Users/jonasbroms/Sites/metapowers/.claude/worktrees/site-storytelling`) at commit `2e381dc`, clean working tree, 2026-10-29.

**`bun run lint:skills`** → exit 0
```
Tasks:    4 successful, 4 total
Cached:    4 cached, 4 total
```

**`bun run check:pack`** → exit 0
```
@singularskills/docs:check: unmatched: branding/audit.mdx — What It Does
@singularskills/docs:check: unmatched: development/build.mdx — What It Does
@singularskills/docs:check: unmatched: development/debug.mdx — What It Does
@singularskills/docs:check: unmatched: development/ship.mdx — What It Does

 Tasks:    4 successful, 4 total
Cached:    2 cached, 4 total
```
(The `unmatched: ... What It Does` lines are the codemod's pre-existing informational notices, carried since Task 9/11 — not failures; the full `pack-tools:check` chain — `check-workflows`, `gen-gates/references/adapters --check`, `check-rename`, every `fix-* --check`, `check-counts` — ran to completion with exit 0.)

**`bun run evals --dry`** → exit 0
```
accessibility-scope                      graders=3   -
accounting-analyze                       graders=3   scaffold
bookkeeping-record                       graders=3   scaffold
branding-discover                        graders=3   -
coaching-code                            graders=3   scaffold
compliance-regulatory-landscape          graders=5   -
design-empathize                         graders=3   scaffold
development-plan                         graders=3   -
finance-assess                           graders=3   -
leadership-assess                        graders=3   -
legal-legal-audit                        graders=3   -
marketing-customer-research              graders=3   -
project-management-project-charter       graders=5   -
research-discover                        graders=5   -
security-security-policy                 graders=5   -
singular-status                          graders=2   scaffold
workflow                                 graders=5   scaffold
17 case(s)
```

**`SKIP_NETWORK_TESTS=1 bun run test`** → exit 0
```
@singularskills/skill-validator:test:  Test Files  5 passed (5)
@singularskills/skill-validator:test:       Tests  77 passed (77)
@singularskills/docs:test:  Test Files  14 passed (14)
@singularskills/docs:test:       Tests  102 passed (102)
@singularskills/pack-tools:test:  ↓ src/smoke-install.test.ts (1 test | 1 skipped)
@singularskills/pack-tools:test:  Test Files  16 passed | 1 skipped (17)
@singularskills/pack-tools:test:       Tests  177 passed | 1 skipped (178)

 Tasks:    5 successful, 5 total
```

**`bash scripts/check-rename.sh`** → exit 0
```
check-rename: no occurrences outside the allowlist
```

**`claude plugin validate . --strict`** → exit 0
```
Validating marketplace manifest: /Users/jonasbroms/Sites/metapowers/.claude/worktrees/site-storytelling/.claude-plugin/marketplace.json

✔ Validation passed
```

**Not run here** (per instruction — cite the task reports instead): `scripts/smoke-install.sh` without `--local`/skip (minutes, network) — see Task 8's report (all 7 agents: `<agent>: 283 skills, gate ok`) and Task 12's report (`SKIP_NETWORK_TESTS=1 bun run test` from CI's own run, same shape as above).

---

## 5. Controller rulings (verbatim, in ledger order)

- Ruling: T1's `legacy()` shim is temporary; T3 deletes it and rewrites every module to `SkillFile{name,domain}` — the plan implies it, saying so avoids a lingering shim — cost if wrong: a small cleanup diff.
- Ruling: skill-validator must not depend on pack-tools (it would create a workspace cycle with the existing devDependency). The validator gets its own tiny workflow loader (`src/workflows.ts`, same `Workflow` type, `yaml` dependency) and a cross-package equality test for the type shape, like the existing text-constant tests — cost if wrong: a duplicated ~40-line loader.
- Ruling: T9 also runs `apps/docs` `gen:data` and `codemod` after deleting the MCP pages so the docs `check` stays green at T9's commit; T11 re-runs them — cost if wrong: one regenerated JSON file committed twice.
- Ruling: T10's `check-rename` is added to the package `check` chain only in T11 (after docs content is rewritten); T10 runs it ad hoc and fixes everything outside `apps/docs/content` — cost if wrong: one task where the rename check is not yet in CI.
- Ruling: the owner's GitHub rename is not yet confirmed; Tasks 1–7 proceed (no dependency); the controller reminds the owner before Task 8 — cost if wrong: Task 8's remote-install check and Task 12's deploy wait.
- Ruling: the implementer for T3 runs the migration against the real repo as the plan says (Step 5); the move is reversible via git and inside the worktree, so it is not a stop condition.
- Ruling: cross-domain workflow phases carry an optional per-phase `folder`; skill `metadata.workflow/phase/artifact` comes only from the 14 domain workflows (a skill belongs to one domain) — cost if wrong: cross-domain membership is invisible in skill metadata, which the conductor does not need.
- Ruling: `artifact` is optional on a phase; a phase with no artifact (accessibility-checklist, development-ship, singular-report, whose real output lives outside `<folder>/<project>/`) is approval-only: no gate script, complete on `phase-approved`. `artifact: ""` is not allowed — cost if wrong: the conductor cannot verify those steps by file, only by approval, which is the spec's rule anyway.
- Ruling: workflow titles are the registry's methodology names; members of a shared phase are alphabetical — cost if wrong: cosmetic.
- Ruling: `check-workflows` joins the `check` chain in Task 5 as planned — none.
- Ruling: inside a shared artifact, a member's closing sections are `### Decisions` and `### Open questions` (one level under its `## <Skill title>` section) so "replace only that section" stays unambiguous; file-level artifacts keep `## Decisions` / `## Open questions` — cost if wrong: a heading level in the shared-artifact instruction text.
- Ruling: the two `singular-*` skills that linked the deleted `references/domain-registry.md` drop that link now (their read of `workflows/` comes in Task 6) so Tasks 4–5 stay green — cost if wrong: none, Task 6 rewrites both skills.
- Ruling: the Arguments paragraph's `"workflow"` is the artifact folder (the domain) for every skill, utilities included, since the log line locates the artifact; `"phase":<phase>` is filled by the skill with its phase number or `null` for a utility. Task 4's validator constant substitutes the folder the same way — cost if wrong: a few log lines with a folder name where a workflow name was expected.
- Ruling: in ungated shared phases the per-section italic line reads `gate: none` and the "worst value" clause does not apply; deferred to the final fix wave as a wording fix in `outputBlock` plus a re-run over the 24 skills — cost if wrong: contradictory instruction text in 24 skills until then.
- Ruling: member skills must also append `started` and `finished` run-log lines (spec §6.5); Task 3's Output instruction omitted them (plan defect). Fix in the final fix wave together with the `gate: none` wording, as a re-runnable pack-tools `fix-output-block` command applied to all 218 members — cost if wrong: until then the log holds only the conductor's and `skipped` lines, which the acceptance checklist would surface.
- Ruling: a `skipped` log line must also match the artifact folder: the hook compares the line's `"workflow"` (which the Arguments paragraph fills with the artifact folder) to `<folder>` as well as `project` and `artifact`, closing the cross-folder leak (design and research both have `02-define.md`). Deferred to the final fix wave with a test — cost if wrong: until then a skip in one domain lets the same-named artifact in another domain through for the same project.
- Ruling: the two Task 10 commits carry an `Opus 5.5` co-author trailer (the model that ran); accepted as truthful attribution, no history rewrite — cost if wrong: an inconsistent trailer on two commits.
- Ruling: source files that legitimately name the legacy brand as detection rules (`migrate.ts`, `rename-check.ts`, the validator's legacy-root/legacy-ref rules) are allowlisted by path in `checkRename`, and the `["meta","powers"].join("")` obfuscation is removed — cost if wrong: a real leftover in those three files would go unflagged, which the allowlist test documents.
- Ruling: the OG image becomes a build-time `app/opengraph-image.tsx` rendered with `next/og` (no new dependency) reproducing the current design with the new name and URL; the static PNG is deleted; `icon.svg`/`apple-icon` become an "S" mark the same way — cost if wrong: if static export cannot render it, the implementer falls back to a regenerated static PNG and says so.
- Ruling: `workflows/branding.yml` phase 5 (guidelines) must require `04-visual.md`, as its skill's Prerequisites say; the old phase-deps generator dropped it. Fix in the final fix wave: edit the workflow file, run gen-gates/gen-adapters, add the gate step to `skills/branding-guidelines/SKILL.md` — cost if wrong: one ungated phase until then.

Note on the OG-image ruling: the implementer found that `opengraph-image.tsx`/`apple-icon.tsx` emit extension-less files and URLs without the base path under static export, and used static route handlers (`app/og-image.png/route.tsx`, `app/apple-touch-icon.png/route.tsx`) instead — the same outcome (new name, new URL, same design, "S" mark), a different mechanism than the ruling's literal convention. Reported and accepted in Task 11's fix-round report.

---

## 6. Deferred items (`minor (deferred)`, verbatim, grouped by task)

**Task 1:**
- stale "plugin-tools" names in phase-files.ts comment, skill-validator plugin-rules.ts message strings (user-facing), CLAUDE.md:9, README.md:104 — Task 10's rename check will catch them.

**Task 2:**
- checker misses the metadata→membership direction; no YAML shape validation on load (bare TypeError, file unnamed); duplicate/empty/out-of-order phases unflagged; requires matching ignores per-phase folder; CRLF frontmatter and missing-phase message edges.

**Task 3:**
- cross-domain detection by inference (untested); shared-file reader detection only via backticked links; untested branches in addGateStep/addOutputBlock/dropSkipLogSentences; domain knowledge duplicated in four places; single-writer skills carry "(or your section of a shared artifact)" wording (plan-mandated); metadataEntries flattens nested maps; migrate.ts 461 lines.

**Task 4:**
- `.metapowers/` not flagged in descriptions/reference docs; `metadata:` with null value accepted; ownFolder ignores phase.folder; singular exemption keyed on dashless names; FLAT_REF misses refs after `**`/quotes/brackets and false-flags root paths; cross-workflow single-skill writers not multi-writer; malformed workflow file throws.

**Task 5:**
- gates.ts substitutes values without escaping (`$&`, `'`); gate.sh allows path traversal in the project name; copies survive deletion of their canonical file; link paths not contained (`..`); no test for a spaced project name or a canonical-directory link.

**Task 6:**
- run-finished without run-started on a completed workflow; no run-finished on gate refusal; member-location sentence only under the one-member bullet (+ how a bypass is passed); approval-only playback wording; weak single-word test regexes; inherited Arguments paragraph in singular-report.
- no explicit "when" bullet for a single-member phase that is not started (covered by the step-3 header).

**Task 7:**
- folder-form and malformed-log cases lack automated hook tests; frontmatter() requires LF; SCALAR_ARRAY/json() imitate Biome formatting; report said 15 folders (14); on jq < 1.6 the hook exits 2 instead of failing open; relative file_path never gated (undocumented).

**Task 8:**
- `set -u` without `-e` (deliberate, undocumented); no explicit trailing `exit 0`; gate stderr suppressed on the pre-artifact call.

**Task 9:**
- CHANGELOG entry placed at the bottom of Unreleased instead of the top; installation.mdx's FIGMA_ACCESS_TOKEN sentence contradicts /docs/design (Task 11 rewrites the installation page).

**Task 10:**
- check-rename.sh only builds when dist is missing; run-evals.sh hard-codes evals/ in the self-name check and `/workflow` substring false positive; docs describe check:pack as pack-tools only; node_modules allowed at any depth; feature_request.yml domain dropdown stale; singular-detect refers to `.singularskills/plugins/`; README cross-domain block omits /singular-init.
- check-rename.sh comment says `path:line` only.

**Task 11:**
- eval claim overstated on the Workflows page; gen-site-data duplicates the hyphenated-domain list; listWorkflows swallows a missing folder/keys; evalSuites counts domains (16) not suites (17); dead Requires.tsx and NpmIcon; counts/rename-check tests not seen failing.

(Tasks 12 and 13 have no `minor (deferred)` ledger lines as of this record.)

---

## 7. Owner actions

- **GitHub rename.** `bromso/metapowers` → `bromso/singularskills` has not happened (spec §10a calls for it to happen *first*; it was deferred by ruling so Tasks 1–7 could proceed). Until it happens: the remote install path (`npx skills add bromso/singularskills`), the Claude Code and Codex marketplace commands, and the GitHub Pages deploy at the new base path all remain unverified in the live/remote sense — only their local/manifest forms were checked (section 1, items 1 and 5).
- **`npm deprecate create-metapowers`.** The package was removed from the repo (Task 9) but not deprecated on the npm registry — that requires npm publish credentials, which is explicitly an owner action.
- **Delete the retired packages' npm listing pages**, if wanted (`create-metapowers`, `@metapowers/figma-mcp`) — optional, owner's call.
- **The npm token/org used for those packages is no longer needed** for anything in this pack; the owner can revoke or repurpose it once the deprecation above is done.
- **The live Tier 1 agent checklist** (section 2 above) — actually typing `/workflow design date-picker` into each of the seven Tier 1 agents and recording a real pass, including the approval/bypass/gate-refusal behavior that only an automated fixture stood in for here.
- **Running `bun run evals` for real** (not `--dry`) — this spends Claude credits and was not done in this project; Task 10's report also flags that the runner's `claude plugin eval` CLI flags (e.g. whether a `--filter`-style subset flag exists) were never confirmed against the installed CLI's help text.

---

## 8. Known follow-ups scheduled for the final fix wave

From the controller's rulings (section 5), explicitly deferred rather than fixed in this project:

1. **Member `started`/`finished` run-log lines.** Spec §6.5 requires every member skill to append its own `started` and `finished` run-log lines; Task 3's Output instruction omitted them (a plan defect, not an implementer error). Planned fix: a re-runnable pack-tools `fix-output-block` command applied across all 218 phase members. Until then, the run log holds only the conductor's own lines and `skipped` events — which the live Tier 1 checklist (item 2 of the agent checklist) would surface as a gap if driven today.
2. **`gate: none` wording in ungated shared phases.** The per-section italic line in a shared artifact should read `gate: none` with the "worst value" clause not applying, but this wording fix was not applied. Planned fix: a wording change in `outputBlock` plus a re-run over the 24 affected skills.
3. **`workflows/branding.yml` phase 5 (guidelines) is missing `requires: ["04-visual.md"]`,** even though `skills/branding-guidelines/SKILL.md`'s own Prerequisites name it — the old phase-deps generator dropped it. Planned fix: edit the workflow file, re-run `gen-gates`/`gen-adapters`, and add the gate step to the skill. Until then, that one phase is ungated.
4. **The gate hook's `skipped` match should also check the artifact folder.** Today the hook compares a `skipped` log line's `project` and `artifact` but not reliably the folder, which could let a skip in one domain pass for a same-named artifact in a different domain (design and research both have `02-define.md`). Planned fix: compare the line's `"workflow"` field (filled with the artifact folder by the Arguments paragraph) against `<folder>` too, with a covering test.

---

## Migration note (carried forward, unchanged from README.md)

> Migrating from metapowers: move your project's `.metapowers/<plugin>/` folders to `.singularskills/<domain>/` (same contents; `.metapowers/metapowers/` becomes `.singularskills/singular/`). Nothing else in an existing project needs to change.
