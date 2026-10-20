# Project B: Make the Metapowers skills good

**Date:** 2026-10-20
**Status:** Draft (owner opted out of brainstorming questions; decisions below are the author's calls unless marked otherwise)
**Scope:** Tier 3 of the 2026-10-19 audit — routing, spec compliance, evals, and bounded skill-body quality. Follows project A (`2026-10-19-install-and-run-design.md`, merged as marketplace 0.2.0). The docs-site redesign is project C and out of scope.

## Intent

Project A made the plugins install and run. Project B makes them *good* by the standards of the ecosystem they live in — Anthropic's skills repo, the agentskills.io spec, and Claude Code's own plugin tooling:

- **Routing.** Claude chooses a skill from its description. All 283 descriptions say *what* the skill does (median 63 chars, e.g. "Audit API security") and none say *when* to use it. With 16 plugins loaded at once and ten colliding skill names (`review`, `plan`, `report`×3, `risk-assessment`×3…), auto-invocation routes poorly or not at all. The audit's comparison found every comparable project treats the description as a trigger.
- **Spec compliance.** No skill has a `name` field (required by agentskills.io; the README claims cross-assistant compatibility), no `argument-hint` (every slug skill takes a project name), and skills with side effects (downloading third-party skills, writing skill files) can be auto-invoked.
- **Evidence.** There is no way to show a skill beats plain Claude or to catch a regression when the model changes: one fixture, string-match grading, a broken harness CLI. Claude Code ships `claude plugin eval` with a with/without baseline and six grader types.
- **Content hazards.** 123 finance/accounting/bookkeeping/compliance/security skills produce tax, audit and regulatory conclusions with no disclaimer (all 35 legal skills have one). The 33 money skills do all arithmetic in-model. `finance/ratios` has formula errors. Six skills ask for a "score" with no formula. The meta-skills install custom skills to a directory Claude Code never reads, and `find-skill` installs downloaded SKILL.md files with no review step.

Success: a user who has installed several plugins can describe a task in their own words and Claude picks the right skill; the skills pass the agentskills.io shape; each plugin has at least one eval that demonstrates the skill beats the no-plugin baseline; money and compliance skills carry a disclaimer and compute with code; the known content errors are fixed.

## Goals

1. Every skill's description states what it does **and** when to use it, under a validator-enforced shape.
2. Every skill has `name` (= directory), and project-slug skills have `argument-hint`.
3. Side-effectful meta-skills cannot be auto-invoked, and `find-skill` reviews before installing.
4. Each plugin ships a `claude plugin eval` suite with at least one case; `bun run evals` runs them; the dead scoring-harness is removed.
5. Disclaimers on all finance, accounting, bookkeeping, compliance and security skills; "compute with code" on all money skills; `finance/ratios` corrected; the six undefined scores defined.
6. Overlapping skills cross-reference each other; the five undocumented design skills get doc pages.
7. The Figma token moves from a raw env var to plugin `userConfig` (keychain-backed).
8. Marketplace and plugins bump to 0.3.0.

## Non-goals

- Merging or deleting overlapping skills (compliance/gdpr vs legal/gdpr-compliance, etc.). Cross-references only.
- Adding `scripts/` with deterministic calculators to money skills. The "compute with code" instruction tells the model to write the script; shipping calculators is a later project.
- `allowed-tools`, `context: fork`, `model`/`effort`, `paths` frontmatter. Optional per skill; none is needed to make the skills good.
- Rewriting Process steps or Output shapes beyond the specific fixes listed. Output templates for all 283 skills is a separate project.
- Multi-harness parity (Codex/Cursor/OpenCode) beyond keeping what project A produced.
- Docs-site visual work (project C).
- Running evals in CI on every PR. Evals cost tokens and need the operator's Claude credentials; they run on demand.

## Anti-goals

- Descriptions that become keyword soup. A description is one or two sentences a person would write, not a list of synonyms.
- A validator rule for "Use when" that passes on the literal string while the sentence says nothing (e.g. "Use when needed").
- Evals that only check the skill was invoked. Each case must grade the *output* so the with/without delta means something.
- Disclaimers so long they bury the artifact. One short paragraph, same wording per domain group.
- Changing any artifact path, phase file name, or hook behaviour from project A.

## Constraints

- Everything project A established: `${CLAUDE_PLUGIN_ROOT}` paths, the standard Arguments paragraph, append semantics, phase gates, `bun run check:plugins` and `bun run lint:skills` green, `claude plugin validate . --strict` green.
- Claude Code frontmatter: `name` (lowercase, hyphens, ≤64, should equal the directory), `description` (combined with `when_to_use` ≤1536 chars), `argument-hint`, `disable-model-invocation`. agentskills.io: `name` required and must match the directory; description ≤1024, "what it does and when to use it".
- Skill text edits across many files are scripted and idempotent where the change is uniform (frontmatter fields, disclaimer, compute-with-code paragraph), hand-written where it is not (descriptions, formula fixes, cross-references), and validator-enforced either way.
- `claude plugin eval` layout (verified against the local CLI 2.1.283): `<plugin>/evals/<case>/prompt.md` (frontmatter `max_turns`, `allowed_tools`) + `<plugin>/evals/<case>/graders/*.md` (frontmatter `type`, `weight`; types include `llm`, `regex`, `tool_used`, `file_exists`, `baseline`); results in `evals/results/`; `--ablation with-without` default; `--trust-plugin` for non-interactive runs; `--threshold`.
- Conventional commits; Biome; Vitest; changesets for npm packages.

## Design

### 1. Descriptions

**Shape.** `<Verb-first sentence saying what it does>. Use when <the user's situation, in their words>.` Optionally a third clause `Not for <adjacent thing>; see /<plugin>:<skill>.` when a sibling skill is the usual confusion. 120–400 characters. The first sentence keeps the verb-first rule the validator already enforces.

Examples of the target:

- `security/api-security`: "Audit the security of a project's APIs — authentication, authorization, rate limiting, input validation, CORS and transport. Use when the user asks to review API security, harden endpoints, or check an API before launch. Not for infrastructure or container hardening; see /security:iac-security."
- `accounting/journal`: "Record double-entry journal entries from an analyzed transaction register, numbered and balanced. Use when the user has a transaction list for a period and asks to journalize, post entries, or book transactions."
- `leadership/retro` vs `project-management/retrospective`: each names the other in its "Not for" clause (team-development retro vs sprint ceremony).

**Who writes them.** A person (or an implementer agent reading each SKILL.md in full), plugin by plugin — not a template. The ten colliding names and the overlapping pairs listed in §6 get explicit disambiguation clauses.

**Validator.**
- `description-max-length` rises from 200 to 400.
- New `description-has-trigger` (error): the description contains the phrase `Use when` followed by at least 6 words before the next period, and the "Use when" clause is not one of a small blocklist (`needed`, `appropriate`, `required`, `necessary`, `asked`).
- `description-starts-with-verb` stays; add any verbs the rewrites need.
- Both counted: after this project `bun run lint:skills` is green and `grep -L "Use when" plugins/*/skills/*/SKILL.md` is empty.

**Triggering check.** Each plugin's eval (§4) includes a case whose prompt is phrased in user language *without* naming the skill; the `tool_used: Skill` grader marks whether the plugin fired. That is the measurement; the descriptions are tuned until the 16 cases fire.

### 2. Frontmatter fields

Scripted (`plugin-tools` command `fix-frontmatter <pluginsRoot> [--check]`), idempotent, key order `name`, `description`, `argument-hint`, `disable-model-invocation`:

- `name: <directory name>` on all 283.
- `argument-hint: "[project] [--skip-checks]"` on every skill that carries the standard Arguments paragraph (first-token rule); `argument-hint: "<file-or-topic> [--skip-checks]"` on coaching (basename rule). Free-text skills get a hand-written hint (`find-skill: "<topic>"`, `create-skill: "<topic>"`, `improve-skill: "<skill-name>"`, `workflow: "<workflow-name> <project>"`, `development/debug: "<symptom or error>"`, `development/ship: "[project]"`, `accessibility/checklist: "<component or page>"`, `branding/audit: "<brand or URL>"`). Builder: confirm each against the skill's intro sentence.
- `disable-model-invocation: true` on `metapowers/find-skill`, `metapowers/create-skill`, `metapowers/improve-skill`, `metapowers/init` — they download or write files outside `.metapowers/` artifacts. No others.

**Validator** (new rules, errors): `name-matches-dir`; `argument-hint-present` for skills with the Arguments paragraph; `frontmatter-key-order` (warning).

### 3. Meta-skills

- `create-skill`, `improve-skill`: write/edit skills at `.claude/skills/<name>/SKILL.md` (project-scoped skills Claude Code loads) instead of `.metapowers/plugins/custom/skills/`. Mention that `/<name>` becomes available in the next session.
- `find-skill`: after downloading a candidate SKILL.md, add a mandatory review step before writing it: show the user the frontmatter and the first 40 lines, scan for tool calls that fetch URLs, run shell, or write outside the project, and ask for explicit confirmation ("Install this skill? (yes/no)"); never install without it. Install target `.claude/skills/<name>/SKILL.md`.
- Docs pages for these three skills updated to match.

### 4. Evals

**Layout.** Every plugin gets `evals/` with one case per plugin to start (metapowers gets `status`), named after the skill: `evals/<skill>/prompt.md` + `evals/<skill>/graders/`. The first case targets the plugin's phase-0/1 skill so it has no prerequisites:

| Plugin | Case skill | Artifact graded |
|---|---|---|
| accessibility | scope | `.metapowers/accessibility/<p>/01-scope.md` |
| accounting | analyze | `01-analyze.md` |
| bookkeeping | record | `01-record.md` |
| branding | discover | `01-discover.md` |
| coaching | code | `.metapowers/coaching/<p>/code-review.md` |
| compliance | regulatory-landscape | `00-scope.md` |
| design | empathize | `01-empathize.md` |
| development | plan | `01-plan.md` |
| finance | assess | `01-assess.md` |
| leadership | assess | `01-assess.md` |
| legal | legal-audit | `00-assess.md` |
| marketing | customer-research | `00-strategy.md` |
| metapowers | status | (stdout summary) |
| project-management | project-charter | `00-initiate.md` |
| research | discover | `01-discover.md` |
| security | security-policy | `00-govern.md` |

**Case shape.** `prompt.md` frontmatter: `max_turns: 25`, `allowed_tools: [Read, Write, Edit, Glob, Grep, Skill]` — plus `Bash` for the accounting, bookkeeping and finance cases, because "Compute with code" (§5) tells those skills to run a script — and `runs: 2`. Body: a realistic user request in plain words that does **not** name the skill (e.g. "We're launching a public REST API for our invoicing product next month. Put together the governing security policy for the `invoicing-api` program and save it so the rest of the security work can build on it."). Cases whose skill needs input (accounting `analyze`: a transaction CSV; bookkeeping `record`: bank lines; coaching `code`: a source file; metapowers `status`: a seeded `.metapowers/` tree with two domains at different phases) use a `scaffold_script` that copies files from `evals/<skill>/fixtures/` into the run's working directory. We author those scripts, so the run script passes `--scaffold`. Write, Edit and Bash are gated tools: the run script passes `--allow-tools Write Edit Bash`.

**Routing measurement limit (author's call).** `claude plugin eval ./plugins/<p>` loads one plugin, and `tool_used: Skill` records that *a* skill fired, so the suite proves each plugin fires on a plain-words prompt — not that the right plugin wins when several are installed. Cross-plugin collisions are covered by the owner's live check in Acceptance, not by the suite. A multi-plugin harness is a possible later project.

**Graders** (three per case):
1. `tool_used: Skill` — with-only indicator that the plugin fired (routing measurement for §1).
2. `file_exists` — the artifact path above, with `<p>` being the project name the prompt gives.
3. `llm`, weight 1 — a rubric specific to the skill's `## Output` section: the artifact has the named sections, is grounded in the prompt's facts, and (for money/compliance skills) carries the disclaimer; judge model default (haiku).

**Running.** Root script `"evals": "bash scripts/run-evals.sh"` (new `scripts/` dir at the repo root for operator scripts) that loops `claude plugin eval ./plugins/<p> --trust-plugin --scaffold --allow-tools Write Edit Bash --no-publish --threshold 0.7 --max-cost-usd <budget> --json evals-results/<p>.json` over plugins (or one plugin via argument), then prints a table of with/without scores. A `--dry` flag lists cases without running; `EVALS_MAX_COST_USD` (default 10 per plugin) sets the ceiling. Document in CONTRIBUTING and CLAUDE.md. Not run in CI (see Non-goals); `evals-results/` and `plugins/*/evals/results/` are git-ignored.

**Baseline and who runs it.** Every case must show a positive with-minus-without delta on the `llm` grader in the first real run; a case that doesn't is either a weak prompt or a weak skill. Whether the builder runs the suite (spending the owner's Claude credentials, within the per-plugin ceiling, with at most two tuning rounds per case before writing the case up as weak) or only hands over a ready suite for the owner to run is the owner's decision — see "Decisions".

**Remove `packages/scoring-harness`** and `fixtures/`, the `score` turbo task and root script, CI filters that name it, and CONTRIBUTING/README mentions. Its one fixture becomes the design `empathize` eval case's fixture if useful.

### 5. Skill-body fixes

**Disclaimer** (scripted, `fix-disclaimer`, idempotent, one wording per group, validator rule `disclaimer-present` for these five plugins). The disclaimer must appear **in the artifact Claude writes**, not only in the SKILL.md: the script inserts, as the last paragraph of `## Output`, the instruction sentence `End the artifact with this paragraph, verbatim:` followed by the blockquote below; the validator checks for the instruction sentence *and* the exact blockquote text; the §4 `llm` rubric for these plugins checks the artifact ends with it.

- finance / accounting / bookkeeping: "> **Not financial or tax advice.** This artifact is generated analysis for review by a qualified accountant or financial professional before any filing, reporting or decision relies on it."
- compliance: "> **Not legal or audit advice.** This artifact supports preparation for compliance work; certification, attestation and regulatory conclusions require a qualified auditor or counsel."
- security: "> **Not a penetration test or audit.** This artifact is generated analysis; validate findings against the live system and have material controls reviewed by a qualified security professional."

**Compute with code** (scripted, `fix-compute`, finance + accounting + bookkeeping, 33 skills): a paragraph inserted after the Arguments paragraph: "**Compute with code.** Perform every calculation (totals, balances, ratios, variances, projections) with a script — Bash, Python or a spreadsheet formula written to a file — and include the computation alongside the result. Never do arithmetic mentally." Validator rule `compute-with-code-present` for the three plugins.

**Hand fixes:**
- `finance/ratios`: define DIO (Days Inventory Outstanding = Inventory / COGS × 365), use EBIT for interest coverage (keep EBITDA coverage as a separately named ratio if wanted), and make the template reference resolve (it already does after project A).
- The six skills that ask for an undefined "score" (audit found `compliance/iso27017` and five more — builder greps for `score` in `## Output`/write blocks and lists them): give each either a formula (e.g. "percentage of applicable controls rated Implemented") or replace "score" with the qualitative rating the skill actually produces.
- Legal single-writer skills that still instruct YAML frontmatter inside the artifact (`clause-library`, `decision-memo`, `legal-research`, and any other): remove the frontmatter instruction; artifacts are plain Markdown with an H1.
- `coaching/a11y`: fix the stale "If the accessibility plugin's shared resources exist" sentence (the file is local now).

### 6. Cross-references and docs

**See-also lines** (hand-written, one sentence under the intro paragraph, both directions): compliance/gdpr ↔ legal/gdpr-compliance; compliance/ccpa ↔ legal/ccpa-compliance; compliance/soc2 ↔ legal/soc2-prep; legal/risk-assessment ↔ security/risk-assessment ↔ project-management/risk-assessment; leadership/retro ↔ project-management/retrospective; coaching/code ↔ development/review; accessibility (plugin) ↔ coaching/a11y ↔ design/a11y-audit ↔ compliance/ada-wcag ↔ legal/accessibility-compliance (each names the accessibility plugin's `scope` as the full audit path). Wording: "See also `/x:y` for <the other angle>." The §1 "Not for" clause and this line say the same thing in two places on purpose: one steers routing, the other steers the user.

**Docs.** `apps/docs/content/docs/design/` gains pages for `a11y-audit`, `design-review`, `export-tokens`, `system-overview` (and `define.mdx` is retitled to define-component if its filename matters for links — builder decides), added to `meta.json` under a `---Utilities---` separator. Each page follows the existing per-skill page shape. The meta-skill pages (§3) and a new `overview/evals.mdx` ("How skills are tested") round it out.

### 7. Figma token via userConfig

`plugins/design/.claude-plugin/plugin.json` gains:

```json
"userConfig": {
  "figma_access_token": {
    "type": "string",
    "title": "Figma access token",
    "description": "Personal access token with file read/write scopes",
    "sensitive": true
  }
}
```

and `plugins/design/.mcp.json` uses `"FIGMA_ACCESS_TOKEN": "${user_config.figma_access_token}"`. The field is optional (`"required": false` or omitted), so users who never touch Figma are not forced to supply it at install. The raw `FIGMA_ACCESS_TOKEN` env var is no longer read by the plugin (an `.mcp.json` value cannot fall back); the CHANGELOG, the design plugin README and the design installation docs carry a migration line ("set when the plugin is enabled, or later from the plugin's configuration in the `/plugin` menu"). Builder verifies the exact placeholder syntax against `claude plugin validate --strict` and the plugins-reference docs (`${user_config.KEY}`), and what the server receives when the optional value is unset (the figma-mcp entrypoint already exits with a clear message when the token is empty).

### 8. Versions and changelog

Marketplace and all plugins 0.2.0 → 0.3.0; CHANGELOG "Marketplace 0.3.0" subsection, one bullet per §1–§7. `create-metapowers` gets a `patch` changeset so Codex/OpenCode/Cursor users receive the rewritten skills in the next npm release, and its bundling (`scripts/bundle-templates.sh`) and `copyDomains` exclude every plugin's `evals/` directory (prompts, fixtures and results are not user-facing). No other npm package changes.

## Decisions

Settled by the author after the builder check (owner opted out of questions): disclaimer goes into the artifact via an explicit instruction (§5); money-skill eval cases allow Bash and the run script grants Write/Edit/Bash (§4); routing is measured per plugin, cross-plugin collisions by the owner's live check (§4); input-needing cases use author-written scaffold scripts (§4); the Figma token field is optional with a migration note (§7); evals are excluded from the CLI bundle and `create-metapowers` gets a patch changeset (§8).

Owner's decision (2026-10-20): **the implementing agents run and tune the evals**, with `--max-cost-usd 10` per plugin, at most two tuning rounds per case, and any case still without a positive delta written up in the acceptance doc as weak (prompt or skill) rather than retried further.

## What's left to the builder

- Exact grader frontmatter for `tool_used` and `file_exists` (confirm with `claude plugin eval --help` and the plugin-evals docs); the per-case `llm` rubrics.
- Which verbs to add to the validator list for the new descriptions.
- Realistic fixtures for cases whose skill needs input (accounting `analyze` needs a transaction list; bookkeeping `record` needs receipts/bank lines; coaching `code` needs a source file).
- The exact set of "undefined score" skills.
- Order of commits. Suggested: (1) frontmatter fields + validator rules (scripted, red→green), (2) descriptions plugin by plugin in 4–6 batches with the validator rule enabled after the last batch, (3) disclaimers + compute-with-code + rules, (4) hand fixes (ratios, scores, legal frontmatter, coaching), (5) meta-skills + docs, (6) cross-references, (7) design docs pages, (8) userConfig, (9) evals + run script + scoring-harness removal + first real run recorded, (10) versions + changelog.

## Acceptance

- [ ] `bun run lint:skills` green with the new rules; `grep -L "^name: " plugins/*/skills/*/SKILL.md` and `grep -L "Use when" …` both empty.
- [ ] `claude plugin validate . --strict` green; `bun run check:plugins` green; all tests green.
- [ ] `bun run evals` completes for all 16 plugins with `--threshold 0.7`; the recorded first run shows a positive with-minus-without `llm` delta per case and the `Skill` tool fired in every "with" arm. Recorded in `docs/superpowers/plans/2026-10-20-skill-quality-acceptance.md`.
- [ ] A fresh Claude Code session with `security@metapowers` and `legal@metapowers` installed: "review our API's auth and rate limiting before launch" invokes `security:api-security`, not a legal skill; "is our privacy policy GDPR-compliant" invokes `legal:gdpr-compliance` or `compliance:gdpr` and names the other in its reply (live run by the owner).
- [ ] `/metapowers:find-skill` shows the review prompt before writing anything; installs land in `.claude/skills/`.
- [ ] Every finance/accounting/bookkeeping/compliance/security skill ends its Output with the group disclaimer; every money skill carries "Compute with code".
- [ ] `packages/scoring-harness` and `fixtures/` are gone; CI green.
