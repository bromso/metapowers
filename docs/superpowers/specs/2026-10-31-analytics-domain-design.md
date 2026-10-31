# Data and analytics: design

Project 5 of the singularskills programme, and the second new domain after
`support` (`2026-10-31-support-domain-design.md`, project 4). It is #1 of the
domain shortlist saved on 2026-10-31. The owner asked for it on 2026-10-31 ("do
1 and 2") without brainstorm questions, as with project 4; every decision below
is the controller's call unless marked *(owner)*, made from the `support`
domain's pattern, the "Adding a domain" steps in `CLAUDE.md`, the existing
marketing skills it must not duplicate, and the experimentation research cited
in §6.

## 1. Intent

Teams make decisions from numbers they cannot reproduce: a dashboard nobody can
explain, a "conversion rate" with three definitions, an A/B test called a win
after someone peeked at it on day three. The pack already helps set up tracking
(`/marketing-analytics-tracking`), design an experiment (`/marketing-ab-test-setup`)
and report pipeline (`/marketing-revops`). It does not help anyone go from a
decision to a trustworthy answer.

The `analytics` domain does that, decision first: name the decisions and the
questions behind them, define the metrics that answer them, check that the data
can produce those metrics, answer the questions with the data the user supplies,
specify the dashboards that keep answering them, and write the readout a
decision-maker acts on. Each step is a file with its reasons and open questions,
in the gated pattern of every other domain. Four utilities handle the everyday
moments: read out a finished experiment, explain why a metric moved, check a
number someone reported, and write or explain a query.

Who runs it: a product manager, founder, analyst or engineer who owns a
question and has exports (CSV, JSON), a schema, or query results to give the
agent. They may have no warehouse access in the agent session.

## 2. Goals

- An `analytics` domain of **ten skills**: six phase skills in a gated workflow
  and four utilities (§4).
- `workflows/analytics.yml`, gates generated like every other domain.
- Two shared references in `references/analytics/` (§6).
- Docs, sidebar, `lib/domains.ts`, homepage bento, counts: 293 → **303 skills**,
  17 → **18 domains**, eval cases 18 → **19**.
- One eval case that tells the skill apart from plain Claude (§9).

## 3. Non-goals and anti-goals

**Non-goals**

- No warehouse, BI or analytics-tool binding (BigQuery, Snowflake, Looker,
  Metabase, PostHog, Amplitude). Skills read files and query results the user
  supplies and make no network calls. A capability contract for data servers,
  like project 3's Figma one, is a later project; skills name *inputs*, never a
  vendor's tool, so this one does not preclude it.
- No event instrumentation or tracking-plan skill: that is
  `/marketing-analytics-tracking`. The Data phase names tracking gaps and points
  there.
- No experiment design: that is `/marketing-ab-test-setup`. The readout utility
  analyses a finished test.
- No change to any cross-domain workflow.
- No new disclaimer group; no charting library or rendered dashboards (dashboards
  are specifications, optionally with the queries behind each tile).

**Anti-goals** (a failure even if every check is green)

- A number stated as measured that was not computed, with a script, from data
  the user supplied.
- A causal claim from observational data stated without its caveat, or an
  experiment called a win while its sample ratio is off, or after an unplanned
  early stop, without saying so.
- Personal data copied into `.singularskills/`: artifacts and scripts hold only
  aggregates.
- A skill that duplicates `/marketing-analytics-tracking`,
  `/marketing-ab-test-setup`, `/marketing-revops`, `/finance-forecast` or
  `/support-health-review`.

## 4. The skills

Domain name `analytics` (one word). Artifacts in `.singularskills/analytics/<project>/`.
Methodology name: **Decision Analytics Cycle**.

### Workflow `analytics` — "Decision Analytics Cycle"

| Phase | Title | Skill | Artifact | Requires |
| --- | --- | --- | --- | --- |
| 1 | Questions | `analytics-questions` | `01-questions.md` | — |
| 2 | Metrics | `analytics-metrics` | `02-metrics.md` | `01-questions.md` |
| 3 | Data | `analytics-data-audit` | `03-data.md` | `02-metrics.md` |
| 4 | Analysis | `analytics-analysis` | `04-analysis.md` | `01-questions.md`, `03-data.md` |
| 5 | Dashboards | `analytics-dashboards` | `05-dashboards.md` | `02-metrics.md`, `03-data.md` |
| 6 | Readout | `analytics-readout` | `06-readout.md` | `04-analysis.md` |

1. **Questions** (`analytics-questions`). The decisions the team must make in
   the next quarter, who makes each, by when, and the questions whose answers
   would change them; each question ranked by decision value and marked as
   *describe* (what happened), *diagnose* (why), *predict* or *test* (needs an
   experiment). Reads research, marketing, finance and support artifacts when
   present. Sections: Decisions, Questions, Priorities, Out of scope.
2. **Metrics** (`analytics-metrics`). A metric tree: one primary metric per
   decision area, its input metrics, and guardrails (what must not get worse).
   Each metric defined in the template of `references/analytics/metric-definitions.md`:
   name, question it answers, formula, unit and grain, inclusion and exclusion
   rules, time window, segmentation, source, owner, and known traps. Every
   metric that already has a definition elsewhere in the project (a support
   metric, a finance KPI) is referenced, not redefined.
3. **Data** (`analytics-data-audit`). For each metric, where its inputs live
   (tables, columns, files, events), freshness, and checks run on a sample the
   user supplies: row counts, nulls, duplicates, date ranges, values outside
   the definition, and a reconciliation of one metric against any number the
   user already reports. Each check `computed` or `not checked`. Gaps in event
   tracking are listed with `/marketing-analytics-tracking` as the next step.
4. **Analysis** (`analytics-analysis`). Answers the top questions from phase 1
   with the data supplied, computed with code: method chosen per question type,
   the result with its uncertainty (interval or range, sample size), the
   segments that change the picture, and what the data cannot say. Describe and
   diagnose answers carry the caveat that observational differences are not
   causes; *test* questions are routed to `/marketing-ab-test-setup` and
   `/analytics-experiment-readout`.
5. **Dashboards** (`analytics-dashboards`). One dashboard spec per audience:
   the question each tile answers, the metric (by its phase 2 name), chart type,
   comparison (target, previous period), filters, refresh, an alert threshold
   where one makes sense, and optionally the query behind the tile. Fewer tiles
   win: a tile that answers no phase 1 question is cut.
6. **Readout** (`analytics-readout`). The decision memo: the answer per
   question in one line, the recommendation, confidence (high, medium, low,
   with why), what would change the recommendation, and what to watch next.
   Written for the decision-maker named in phase 1.

### Utilities (no phase, run alone)

- **`analytics-experiment-readout`**. Read out a finished A/B test from its
  results (a file or pasted table): first a sample ratio mismatch check
  (chi-square against the planned split), then the primary metric's effect
  with a confidence interval, guardrails, and whether the planned sample size
  and duration were reached; then the call (ship, don't ship, inconclusive,
  invalid). An SRM or an unplanned early stop makes the call *invalid* or
  *inconclusive* regardless of the p-value. Reads the test plan from
  `.singularskills/marketing/<project>/` when present. Writes
  `.singularskills/analytics/<project>/experiments/<date>-<slug>.md`. Not for
  designing a test; see `/marketing-ab-test-setup`.
- **`analytics-investigate`**. Explain why a metric moved: rule out data
  problems first (tracking changes, late data, definition changes), then
  decompose the change by segment and into mix versus rate, then list
  candidate causes with the evidence for and against each, ranked. Writes
  `.singularskills/analytics/<project>/investigations/<date>-<slug>.md`.
- **`analytics-number-check`**. Check one reported number: find or ask for
  its definition, reproduce it from the data with code, and report match,
  mismatch (with the reason) or cannot reproduce. Returns in chat; writes no
  file.
- **`analytics-query`**. Write or explain a SQL query against a schema the
  user gives (DDL, a column list, or a sample), in the dialect they name,
  using phase 2's definitions when present; explain each clause and the traps
  (fan-out joins, time zones, nulls in filters). Returns in chat; never runs a
  query against a live database.

Descriptions follow the pack rule and carry `Not for …; see /…` against the
neighbours in §3.

## 5. How the skills are written

As in `support` (§5 of its spec), nothing new:

- Frontmatter and sections as every domain; phase members' handoff, recall,
  gate and log paragraphs generated by `pack-tools fix-skill-text`; the two
  utilities that write files hand-write their frontmatter and log lines as
  `support-qa-review` does.
- **Compute with code.** `analytics` joins `COMPUTE_PLUGINS` and its validator
  mirror.
- **Measured or not.** Every number is `computed`, `not measured` (or `not
  checked` for a data check) or `target`.
- **Aggregates only.** Scripts read the user's files where they keep them and
  write only aggregates under `.singularskills/`; no row-level data, names,
  emails or raw IDs go into any file there — the rule support's final review
  added, from the start.
- **Cross-domain reads.** `analytics` joins `CROSS_DOMAIN_READS` with
  `["research", "marketing", "finance", "support"]`.

## 6. References (`references/analytics/`)

- **`metric-definitions.md`**. The definition template (§4 phase 2), how to
  build a metric tree, guardrail metrics, and the common traps: ratio metrics
  whose denominator changes, averages of averages, Simpson's paradox (an
  aggregate trend that reverses inside every segment), survivorship, time
  zones and late-arriving data. Includes the labels and the aggregates-only
  rule.
- **`experiment-readout.md`**. The checks and the order they run in:
  1. **Sample ratio mismatch** first: a chi-square test of observed against
     planned assignment; an SRM is a symptom of a data-quality problem and the
     result is not trustworthy until its cause is found (Fabijan et al., 2019,
     *KDD*). The readout flags an SRM at p < 0.001 (a builder's call on the
     exact threshold, stated in the file).
  2. **Peeking**: repeatedly checking a fixed-horizon test and stopping when it
     looks significant inflates false positives; continuous monitoring needs
     always-valid or sequential methods (Johari et al., 2017, *KDD*), and
     experimenters do stop at the first significant look in practice (Berman
     et al., 2018). A readout states whether the planned sample and duration
     were reached.
  3. **Effect and interval** for the primary metric, guardrails next.
  4. **Base rates**: with most experiments failing to move key metrics (success
     rates of about 10–20%), a p < 0.05 "win" is a false positive more often
     than people expect (Kohavi et al., 2024, *KDD*); a surprising result gets
     replication before it gets a launch.
  5. **The call**, from a fixed table: ship, don't ship, inconclusive, invalid.

Both files are linked from the skills that use them and copied by
`gen:references`.

## 7. Pack wiring

The `CLAUDE.md` "Adding a domain" steps, plus what project 4 found:

- The conductor tables and `references/workflows/` regenerate through the
  generators; `conductor.test.ts` stays green.
- Pinned counts in tests move: phase members (+6), first phases (+1),
  workflows (20 → 21),
  site totals, smoke-install count, evals-dry count.
- Prose totals in README, CLAUDE.md, AGENTS.md (and its domain list), the
  manifests, `apps/docs/public/llms.txt` (totals and its Domains list), the
  overview pages (`what-is-singularskills`, `comparisons`, `workflows`,
  `evals`).
- **Homepage bento.** Today: 2 wide, 2 half, 12 small, 1 meta = 30 cells.
  Adding a small tile makes 31. *Controller's call:* `analytics` is **small**
  and `research` goes from half to small: 2 wide (12) + 1 half (2) + 14 small
  (14) + 1 meta (2) = 30 cells, full rows at six and at two columns. Research
  keeps its order 3, so the first five tiles stay design, development,
  research, marketing, security. Colour: one not matching any tile touching
  analytics (diagonals included) at six or two columns; builder's call, checked
  the way project 4's follow-up checked support's.

## 8. Docs

As `support`: `apps/docs/content/docs/analytics/` with the overview, one page
per skill, and `artifacts`, `storage`, `examples`; `meta.json` with icon
`ChartColumn` (lucide; builder checks the export name, falling back to
`BarChart3`); root `meta.json` places `analytics` after `research`; a
`line-md` animated icon that renders (builder's call).

## 9. Checks and acceptance

- Every check in `CLAUDE.md` green.
- **Eval case** `evals/analytics-experiment-readout/`, built so a baseline
  without the pack is likely to fail: a scaffolded results file for a finished
  test whose primary metric shows p < 0.05 for the treatment but whose
  assignment is 50/50 planned and visibly off (an SRM), with a prompt that asks
  "did it win, can we ship?" and never mentions sample ratios. Graders: the
  skill fired; the answer does not call it a win; it names the assignment
  imbalance and says the result cannot be trusted until its cause is found.
- **Acceptance runs** in a scratch project with synthetic data, recorded in
  `docs/superpowers/plans/<plan>-acceptance.md`:
  1. Phases 1–3 on a synthetic orders export: artifacts written, gate passes,
     log lines, data checks `computed`, no row-level data or emails in any file
     under `.singularskills/`.
  2. Phase 4 before phase 3 exists: the gate stops it.
  3. `analytics-experiment-readout` on a clean test (calls it) and on an SRM
     test (calls it invalid).
  4. `analytics-investigate` on a drop caused by a mix shift between two
     segments: it finds the mix shift before proposing causes.
  5. `analytics-number-check` on a reported number built with an average of
     averages: it reports the mismatch and the reason.

## 10. Left to the builder

Skill wording, artifact section names beyond those listed, docs prose, the
icons and colour, the SRM threshold's exact value and the readout call table's
wording, eval graders, synthetic data. Where a choice fights a pack check,
follow the check and record a ruling.
