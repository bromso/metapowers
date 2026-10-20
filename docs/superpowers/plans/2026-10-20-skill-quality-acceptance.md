# Skill quality: acceptance results

Date: 2026-10-20 · Branch: `skill-quality` · Claude Code CLI `2.1.283`

These are the results for the checklist in [`docs/superpowers/specs/2026-10-20-skill-quality-design.md`](../specs/2026-10-20-skill-quality-design.md) (`## Acceptance`), and the record of the first real eval run and its tuning.

**Status of this document: round 1 has been re-run, and round 2 (the last) is committed with its re-run pending.** The owner runs the evals. The "Final table" section is filled in after the round-2 re-run.

Legend: ✅ passed with recorded evidence · ⚠️ weak, written up · ⏳ pending (a live run by the owner or a re-run) · ⛔ blocked

## How the first run was made

- **Command:** `EVALS_ALLOW_BASH=0 bun run evals`, run by the owner. It covered all 16 plugins, with `-j 2`, `--threshold 0.7` and `--max-cost-usd 10` per plugin.
- **Why no Bash:** the eval sandbox would not grant Bash on this machine. Its exact message was:

  > the Docker (~/.docker, DOCKER_CONFIG) credential store on this machine holds a symbolic link inside it, so the Bash sandbox cannot reliably exclude it — a Bash-granting evaluation cannot run here

  `~/.docker/bin` and `~/.docker/cli-plugins` hold 37 Docker Desktop symlinks, and the CLI checks `~/.docker` itself. So the runs got `Write Edit` only. The money skills (accounting, bookkeeping, finance) could write their computation script but not run it.
- **Setup:** no web access in either arm. Each case had 2 runs per arm.
- **Grading:** the `fired` grader (`tool_used: Skill`) only shows whether the skill fired. It is excluded from the score.
- **Exit status:** the script exited 1 because two cases scored below `--threshold 0.7`: metapowers/status at 0 and security/security-policy at 0.5. No run errored, and no plugin was `partial`.

## First-pass table

```
plugin              case                  with  without  delta  fired
accessibility       scope                 1     0        1      2/2
accounting          analyze               1     0        1      2/2
bookkeeping         record                0.75  0        0.75   2/2
branding            discover              1     0        1      2/2
coaching            code                  1     0        1      2/2
compliance          regulatory-landscape  0.75  0        0.75   2/2
design              empathize             1     0        1      2/2
development         plan                  1     0        1      2/2
finance             assess                1     0        1      2/2
leadership          assess                1     0        1      2/2
legal               legal-audit           1     0        1      2/2
marketing           customer-research     1     0        1      2/2
metapowers          status                0     0        0      2/2
project-management  project-charter       0.75  0        0.75   2/2
research            discover              0.75  0        0.75   2/2
security            security-policy       0.5   0        0.5    2/2
```

**Fired:** every skill fired in every with-plugin run (32/32). That meets spec §1's routing measurement for all 16 plugins.

## Cost

| Plugin | costUsd | Duration | partial |
|---|---:|---:|---|
| accessibility | 1.00 | 162 s | false |
| accounting | 1.72 | 238 s | false |
| bookkeeping | 1.15 | 157 s | false |
| branding | 1.30 | 242 s | false |
| coaching | 1.07 | 152 s | false |
| compliance | 2.42 | 403 s | false |
| design | 1.22 | 207 s | false |
| development | 1.03 | 192 s | false |
| finance | 1.80 | 358 s | false |
| leadership | 0.86 | 136 s | false |
| legal | 1.53 | 233 s | false |
| marketing | 1.59 | 286 s | false |
| metapowers | 0.38 | 46 s | false |
| project-management | 1.57 | 269 s | false |
| research | 1.61 | 276 s | false |
| security | 2.06 | 332 s | false |
| **Total, first pass** | **22.28** | | |

Earlier attempts in which the sandbox refused Bash cost $0.00. Every run errored before an agent started.

## Per-case verdicts (first pass)

**Notation.** Per-run results are written `run 1 | run 2`, with each grader as P/F. Judge votes are shown as `[…]`, one letter per haiku judge out of three.

**What the explanations contain.** In CLI 2.1.283 the `llm` grader's `explanation` holds only the votes, e.g. "judge votes: FAIL PASS FAIL". For files over a few thousand characters it adds the CLI's own note: "llm judges are noisy on long inputs, prefer a regex grader for large artifacts". The judges' per-criterion reasons are not saved anywhere: not in the JSON, `report.html` or `aggregate-result.json`. So for each failing run I checked the artifact (the grader's `evidence`) against the rubric myself, and the verdicts below cite that check.

**The without arm scored 0 in every case.** Without the plugin, Claude never saves to the methodology's `.metapowers/<domain>/<project>/…` path. So `artifact` fails, and the `quality` grader throws ("path … does not exist"). The delta therefore measures "the plugin produces the defined, gradeable artifact" more than "the content is better than plain Claude". See Concerns.

| Case | with-arm runs | Verdict |
|---|---|---|
| accessibility/scope | artifact P, quality P [PPP] \| artifact P, quality P [PPP] | ✅ |
| accounting/analyze | P [PPP] \| P [PPP] | ✅. Passed even without Bash: the rubric's computation criterion accepted a written script plus shown workings |
| branding/discover | P [PPP] \| P [PPP] | ✅ |
| coaching/code | P [PPP] \| P [PPP] | ✅ |
| design/empathize | P [PPP] \| P [PPP] | ✅ |
| development/plan | P [PPP] \| P [PPP] | ✅ |
| finance/assess | P [PPP] \| P [PPP] | ✅ |
| leadership/assess | P [PPP] \| P [PPP] | ✅ |
| legal/legal-audit | P [PPP] \| P [PPF] | ✅ |
| marketing/customer-research | P [PPP] \| P [PPP] | ✅ |
| bookkeeping/record | artifact P, quality P [FPP] \| artifact P, quality **F [FFF]** | ⚠️ environment-limited (no Bash), not tuned |
| compliance/regulatory-landscape | artifact P, quality **F [FPF]** \| artifact P, quality P [PPF] | ⚠️ prompt-weak (rubric hard to judge on a long file), tuned in round 1 |
| project-management/project-charter | artifact P, quality **F [PFF]** \| artifact P, quality P [FPP] | ⚠️ prompt-weak (same), tuned in round 1 |
| research/discover | artifact P, quality P [PPF] \| artifact P, quality **F [FFF]** | ⚠️ prompt-weak (same), tuned in round 1 |
| security/security-policy | artifact P, quality **F [PFF]** \| artifact P, quality **F [FFF]** | ⚠️ prompt-weak (same), tuned in round 1 |
| metapowers/status | quality **F [FFF]** \| quality **F [PFF]** (no artifact grader) | ⚠️ prompt-weak (rubric can't be checked from the reply), tuned in round 1 |

### Why the six cases are weak

#### bookkeeping/record (with 0.75)

- **Which grader failed:** `quality` in run 2, 3/3 FAIL ("judge votes: FAIL FAIL FAIL"). Run 1 passed narrowly ("judge votes: FAIL PASS PASS — note: long file (8417 chars) …").
- **What the artifacts contain:** both runs did everything else the rubric asks:
  - Period, Transaction Log with all 10 lines, Missing Documents with the 3 reference-less lines, and Flags covering the £6,950 equipment payment and the £450 unidentified payment;
  - totals of money in 10,378.15, money out 15,621.95 and net −5,243.80;
  - the verbatim disclaimer at the end.
- **The one weak spot:** criterion 6, "shows how they were computed (a script, command or formula)". Both runs wrote a Python script next to the artifact and said so. Run 2's artifact reads: "It could not be executed in this session because no shell was available." It then gives the figures with hand-written workings. That gap is caused by `EVALS_ALLOW_BASH=0`, not by the skill.
- **Decision:** following the controller's ruling, money cases that fail on "computation shown" are written up as environment-limited and not tuned. The case should be re-run with Bash on a machine whose `~/.docker` holds no symlinks.

#### compliance/regulatory-landscape (with 0.75)

- **Which grader failed:** `quality` in run 1, "judge votes: FAIL PASS FAIL — note: long file (31597 chars); llm judges are noisy on long inputs, prefer a regex grader for large artifacts".
- **What the artifacts contain:** both artifacts have all five required headings (Jurisdiction Map … Cross-Border Considerations). Each has a regulation inventory table with a Type/Status column (M / M-flow / C / W, and Mandatory / Contractual / Customer-driven). Each covers GDPR Art. 9 health data, HIPAA/CCPA/CPRA for the California clinics, PCI DSS and ISO 27001, and ends with the verbatim disclaimer.
- **Probable trip-up:** run 1 never uses the phrase "special category". It writes "Art. 9 health data", which is the same thing in law but may have tripped criterion 2.
- **Verdict:** a six-criterion all-must-pass rubric over a 31k-char file is noisy for haiku. The skill output is sound.

#### project-management/project-charter (with 0.75)

- **Which grader failed:** `quality` in run 1, "judge votes: PASS FAIL FAIL — note: long file (23475 chars) …".
- **What the artifacts contain:** both have Vision, Objectives, Scope (in/out/deferred), Constraints & Assumptions, Milestones and Initial Risks.
- **Verdict:** I found no criterion that run 1 clearly misses. This is noise on a long file.

#### research/discover (with 0.75)

- **Which grader failed:** `quality` in run 2, "judge votes: FAIL FAIL FAIL — note: long file (19865 chars) …".
- **What run 2 contains:** all six required headings, and a stakeholder table that includes engineers, managers, support, sales and customers. It opens with a prominent "⚠️ Read this first" block, which says "No live web access was available when this was written", tags every figure [High]/[Med]/[Low], and says "Treat every figure as 'check before quoting'".
- **Verdict:** the judges most likely failed criterion 2 ("Sources name specific trials … with a takeaway each") because the sources are presented as unverified recall. That is a property of the no-web eval environment, which the rubric didn't account for.

#### security/security-policy (with 0.5)

- **Which grader failed:** `quality` in both runs, "judge votes: PASS FAIL FAIL — note: long file (36090 chars) …" and "judge votes: FAIL FAIL FAIL — note: long file (37935 chars) …".
- **What both artifacts contain:**
  - all five parts, under Policy Inventory, Individual Policies, Framework Alignment (NIST CSF 2.0), Review Schedule and Exception Process;
  - six policies, each with an owner and a dated review in the inventory table, e.g. "POL-04 | Access Control Policy | Security Lead | CTO | Semi-annual … | 2027-04-20";
  - about 80 uses of must/shall;
  - bank details handled explicitly ("Bank account numbers **must** be masked in UIs …");
  - a policy→CSF function mapping table;
  - the verbatim disclaimer as the last paragraph.
- **Verdict:** both runs meet the rubric by my reading. The judge fails 36–38k-char files.

#### metapowers/status (with 0, without 0, delta 0)

- **What failed:** the only scored grader, `quality`, has `focus: last_message`. It failed both with-arm runs ("judge votes: FAIL FAIL FAIL", "judge votes: PASS FAIL FAIL").
- **What the replies contain:** both replies give a table, "| design | btn | 2/5 phases (Empathize, Define) | unknown |" and "| security | acme | 1/6 phases (Govern) | unknown |". Both give next steps ("Next is phase 3, Ideate") and invent no projects.
- **Why the rubric couldn't be checked:**
  - The judge sees only the reply, so it can't tell what was seeded. Criterion 4 ("does not invent projects or domains that are not in the seeded folder") is therefore unjudgeable.
  - Both replies also list the 13 untouched domains by name ("Domains with nothing started: research, development, marketing, …"), which a judge without the seed list can read as invention.
  - Both replies say "Last updated: unknown", because the run's tools can't read file dates.
- **Without-arm:** the reply was a good prose summary with no table. It correctly failed criterion 3.

## Tuning

### Round 1 (committed; re-run pending)

| Case | Classification | Edit | Commit |
|---|---|---|---|
| metapowers/status | prompt-weak: rubric can't be checked from the reply | `graders/quality.md` now names the three seeded files and the design (5) and security (6) phase counts. It says that naming domains with no saved work is not invention and that "last updated: unknown" is acceptable. Criterion 4 now reads "does not claim any project exists other than `btn` and `acme`". | `fix(metapowers): tune eval case status rubric to name the seeded files` |
| security/security-policy | prompt-weak: long-file judge noise | New `graders/structure.md`, a `regex` grader with `target: {source: file}` and flags `im`. It requires the five headings and that the file ends with the disclaimer. `quality.md` drops those two criteria, keeps four substantive ones, and says "judge the content, not the exact wording". | `fix(security): tune eval case with a regex structure grader` |
| compliance/regulatory-landscape | same | Same pattern: five headings plus disclaimer move to regex. `quality.md` also accepts "Art. 9" as special-category wording, CMIA for California, and any equivalent mandatory/customer-driven labels. | `fix(compliance): …` |
| project-management/project-charter | same | Same pattern: six headings move to regex. "SMART" becomes "measurable". | `fix(project-management): …` |
| research/discover | same | Same pattern: six headings move to regex. `quality.md` accepts sources from model knowledge that are flagged for verification, since runs have no web access. | `fix(research): …` |
| bookkeeping/record | environment-limited | None, per the ruling. | n/a |

**How the regex graders were checked:** each `structure.md` pattern was parsed from its YAML front matter (Bun.YAML) and tested with `new RegExp(pattern, flags)`. It matches both first-pass artifacts for its case. It does not match a file with one required heading renamed, or with the disclaimer removed or not last.

**Effect on scores:** the four structure-graded cases (security, compliance, project-management, research) now have three scored graders (artifact, structure, quality) instead of two. A with-run where only `quality` fails therefore scores 0.67 rather than 0.5. metapowers/status still has `quality` as its only scored grader.

**Unconfirmed format:** the `regex` grader shape (`pattern`, `flags`, `match: contains`, `target`) follows the plugin-evals reference. Its first real use is the round-1 re-run.

**Re-run command (owner):**

```bash
EVALS_ALLOW_BASH=0 bun run evals metapowers security compliance project-management research
```

That is the second of at most three runs for each of these plugins. Bookkeeping is not re-run.

### Round-1 re-run results

The owner ran `EVALS_ALLOW_BASH=0 bun run evals metapowers security compliance project-management research`. Total cost was $7.81, and no plugin was `partial`.

| Case | with | delta | with-arm runs (run 1 \| run 2) | Cost |
|---|---:|---:|---|---:|
| metapowers/status | 1 | 1 | quality P [PPP] \| quality P [PPP] | 0.37 |
| security/security-policy | 0.67 | 0.67 | artifact P, structure P, quality **F [FFF]** \| artifact P, structure P, quality **F [FFF]** | 1.98 |
| compliance/regulatory-landscape | 0.67 | 0.67 | artifact P, structure P, quality **F [FFF]** \| artifact P, structure P, quality **F [FFF]** | 2.53 |
| project-management/project-charter | 0.83 | 0.83 | artifact P, structure P, quality P [PFP] \| artifact P, structure P, quality **F [FFF]** | 1.48 |
| research/discover | 0.83 | 0.83 | artifact P, structure P, quality **F [FFF]** \| artifact P, structure P, quality P [PPP] | 1.45 |

**What the regex graders did:** they worked as intended on their first real run. `structure` reported "matched ^(?=…" in every with-run and failed in every without-run.

**metapowers/status:** fixed. The judge passed both replies unanimously once the rubric named the seeded files.

**Where the four remaining failures come from.** In every one, the failing grader is `quality`. I compared each artifact (`evidence`) with the round-1 rubric:

- **security:** both artifacts (36k and 34k characters) have a seven-policy inventory with an owner, approver and next-review date for each policy. The policies are full of must/shall, cover bank details explicitly, and include a policy × CSF-function matrix (GV/ID/PR/DE/RS/RC). Every criterion is met. **Judge noise.**
- **compliance:** both artifacts (29k characters) have an inventory table with a "Mandatory vs. customer-driven" or "Type" column. Both cover GDPR Art. 9, HIPAA/CCPA/CMIA, PCI DSS and ISO 27001. Every criterion is met. **Judge noise.**
- **project-management:** a **real rubric error**. Criterion 4 required every milestone to fall between 1 Nov 2026 and 30 Apr 2027. Both artifacts rightly add "M0 Charter agreed, 30 Oct 2026" and a post-close benefits review ("M10 Benefits review, 30 Jun 2027" in run 2; "31 May 2027" in run 1). A strict judge fails that. Go-live in both runs is on or before 31 Mar 2027.
- **research:** run 1 (17.9k characters) names the UK 2022 pilot, Iceland, Utah's 4×10 schedule and a compressed-workweek meta-analysis, each with a takeaway. Its stakeholder table lists engineers, managers, customers and others, and its open questions are tied to "200+ people with several teams that depend on each other". **Judge noise.**

### Round 2 (last round; committed, re-run pending)

| Case | Edit | Commit |
|---|---|---|
| security/security-policy | New `graders/facts.md` (regex): NIST plus all six CSF functions, bank details, must/shall, Google Workspace, AWS. `quality.md` is cut to two judgement criteria: the inventory covers the six areas with owner and review date, and the policies are specific to this company rather than boilerplate. The judge is told to fail a criterion "only if its content is missing or wrong, not for wording, ordering or extra material". | `7cb67ab fix(security): …` |
| compliance/regulatory-landscape | New `facts.md` (regex): GDPR, Art. 9 or special category, CCPA/CPRA/CMIA/HIPAA, PCI, 27001, mandatory, and customer-driven/contractual/voluntary. `quality.md` is cut to two criteria: the inventory table states mandatory vs customer-driven, and it reasons about ClinicNote's actual situation. | `46a64ff fix(compliance): …` |
| project-management/project-charter | Criterion 4 now covers *delivery* milestones, with go-live before 30 April 2027, and accepts a pre-start sign-off or a post-close benefits review. New `facts.md` (regex): 180k, squad, 30 April 2027, 60%, invoice, address, 2FA, mobile, chat bot. | `0cddbf6 fix(project-management): …` |
| research/discover | New `facts.md` (regex): Iceland, 4 Day Week Global or the UK pilot; 100-80-100; compressed; manager; customer; 200. `quality.md` is cut to three criteria: sources with a takeaway each, needs or risks per stakeholder group, and open questions specific to the company. | `17824bd fix(research): …` |

**How the facts patterns were checked.** I parsed each `facts.md` pattern with Bun.YAML and ran it as a JS RegExp. Each matches all four artifacts for its case (first pass and round 1), and none matches an empty file. Each also fails when a key fact is removed, with one exception: in compliance, stripping "PCI" still matched, because the artifact also cross-references `/compliance:pci-dss`.

**Effect on scores.** These four cases now have four scored graders: artifact, structure, facts and quality. A with-run in which only `quality` fails scores 0.75.

**Owner's command (the third and last run for these plugins):**

```bash
EVALS_ALLOW_BASH=0 bun run evals security compliance project-management research
```

## Final table

⏳ Pending the round-2 re-run.

## Acceptance checklist

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | `bun run lint:skills` green with the new rules; `grep -L "^name: "` and `grep -L "Use when"` over `plugins/*/skills/*/SKILL.md` both empty | ✅ | `bun run lint:skills` exit 0. Both greps return 0 files (2026-10-20, after the round-1 commits). |
| 2 | `claude plugin validate . --strict` green; `bun run check:plugins` green; all tests green | ✅ | `✔ Validation passed`; `check:plugins` exit 0; `bun run --filter @metapowers/plugin-tools test` 161/161; `bun run check` clean. |
| 3 | `bun run evals` completes for all 16 plugins with `--threshold 0.7`; every case shows a positive `llm` delta and the Skill tool fired in every with-arm | ⚠️ / ⏳ | **Done:** all 16 plugins completed, with no errors and no `partial`. Fired 32/32. Delta > 0 for 15/16 cases. **Not met:** metapowers/status had delta 0, now tuned with the re-run pending. **Caveats:** the run had no Bash (environment), and the without arm scores 0 by construction (see Concerns). |
| 4 | Two-plugin live routing check | ⏳ owner | Steps below. |
| 5 | `/metapowers:find-skill` shows the review prompt before writing; installs land in `.claude/skills/` | ⏳ owner | Not part of Task 14. Needs a live session. |
| 6 | Group disclaimer ends every finance/accounting/bookkeeping/compliance/security Output, and every money skill has "Compute with code" | ✅ | Enforced by the `disclaimer-present` and `compute-with-code-present` rules in `bun run lint:skills` (green). The disclaimer was verbatim at the end of every with-arm artifact checked above (bookkeeping, compliance, security). |
| 7 | `packages/scoring-harness` and `fixtures/` gone; CI green | ✅ local / ⏳ CI | Both directories are absent. CI runs once the branch is pushed. |

### Owner's live routing check (item 4)

1. Make sure no metapowers plugins are installed in the test session. Then, from a scratch directory (not this repo), add this checkout as a marketplace and install the two plugins:

   ```bash
   claude plugin marketplace add /Users/jonasbroms/Sites/metapowers/.claude/worktrees/skill-quality
   claude plugin install security@metapowers
   claude plugin install legal@metapowers
   ```

2. Start a fresh session (`claude`) in the scratch directory and send:

   > review our API's auth and rate limiting before launch

   **Expect:** the transcript shows the Skill tool invoking `security:api-security`, and no `legal:*` skill.
3. In a new session, send:

   > is our privacy policy GDPR-compliant

   **Expect:** the Skill tool invokes `legal:gdpr-compliance`, or `compliance:gdpr` if the compliance plugin is also installed. The reply names the other skill as the adjacent option, through its "Not for … see /…" clause.
4. Record the skill each prompt invoked here (pass/fail). Then clean up with `claude plugin uninstall security@metapowers`, `claude plugin uninstall legal@metapowers` and `claude plugin marketplace remove metapowers`.

## Concerns

1. **The without arm is structurally zero.** Every without run failed because the methodology's artifact path didn't exist. The quality grader threw rather than judging content. So a positive delta proves the plugin produces the defined artifact, not that its content beats plain Claude. A later suite could judge the without arm's content with a `files` or `last_message` focus.
2. **No judge reasons are saved.** CLI 2.1.283 keeps only the votes, so the failure analysis above comes from my own check of each artifact against the rubric, not from the judges' words.
3. **No-Bash run.** All three money cases (accounting, bookkeeping, finance) ran without Bash, so "Compute with code" was only half exercised: scripts were written but not run. On a machine without Docker Desktop symlinks, `bun run evals accounting bookkeeping finance` (Bash allowed by default) would test it properly.
4. **2 runs per arm is a small sample.** A single 1-of-3 vote flip moves a case by 0.25.
