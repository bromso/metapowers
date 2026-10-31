# Customer support and success: design

Project 4 of the singularskills programme, and the first new domain since the
foundation (`2026-10-26-singularskills-foundation-design.md`). It is #3 of the
domain shortlist saved on 2026-10-31. The owner opted out of the brainstorm
questions on 2026-10-31 and asked that the domain be "inspired by how we've
created the other skills"; every decision below is the controller's call unless
marked *(owner)*, made from the existing domains (branding and bookkeeping as the
closest in size and shape), the "Adding a domain" steps in `CLAUDE.md`, and the
service research cited in §6. A builder check on 2026-10-31 raised three
questions; their answers are marked *(builder-check answer, controller's call)*.

## 1. Intent

The pack covers building, marketing, selling-adjacent and governing a product,
but not the people who answer customers once it ships. A support lead at a small
or mid-size company sets up the same things every time: what customers contact
them about, how tickets are tagged, what the help centre should hold, saved
replies, who gets a ticket when the first person cannot solve it, what response
times are promised, and whether the numbers say accounts are drifting away. They
do it from scratch, in a helpdesk's admin screens, with nothing written down
about why.

The `support` domain gives that lead a gated workflow that writes each of those
decisions to a file, in order, with the reasons and the open questions, the same
way `branding` turns a brand into five files. Three everyday skills (answer one
ticket, review one conversation, write a customer update during an outage) run
alone at any time and read whatever the workflow has written.

Who runs it: a support lead, a founder doing support, or a customer success
manager. They have ticket exports or can paste conversations; they may have no
helpdesk admin access in the agent session.

## 2. Goals

- A `support` domain of **ten skills**: seven phase skills in a gated workflow
  and three utilities (§4).
- `workflows/support.yml`, with gates generated like every other domain.
- Two shared references in `references/support/` (§6).
- Docs: a `support` section with one page per skill plus the overview,
  artifacts, storage and examples pages every phase domain has; the sidebar,
  `lib/domains.ts` and the homepage bento updated (§8).
- Counts updated everywhere the pack states them: 283 → **293 skills**,
  16 → **17 domains**.
- One eval case for a utility skill (§9).

## 3. Non-goals and anti-goals

**Non-goals**

- No helpdesk server binding. The skills read ticket exports (CSV, JSON) and
  pasted conversations the user names. A capability contract for helpdesk MCP
  servers (Zendesk, Intercom, Help Scout, Front) like project 3's Figma one is a
  later project; this one must not preclude it (skills name *inputs*, never a
  vendor's tool).
- No `stack-aware` or `figma-aware` skills.
- No change to any cross-domain workflow (`launch-product.yml` and others). A
  "support readiness" step in `launch-product` is a good follow-up, not this
  project.
- No new disclaimer group.
- No sales, onboarding-conversion or pricing work: those stay in marketing.

**Anti-goals** (a failure even if every check is green)

- A metric, volume, response time or churn rate stated as measured when it was
  not computed from data the user supplied.
- A reply or macro that promises something (a refund, a date, a fix) the
  user's stated policy does not allow, or that leaks internal notes.
- An artifact that copies a customer's personal data (names, emails, phone
  numbers, order or account numbers) beyond what the decision needs.
- A skill that duplicates an existing one: churn interventions belong to
  `/marketing-churn-prevention`, security incident wording to
  `/security-incident-communication`, buyer research to
  `/marketing-customer-research`.

## 4. The skills

Domain name `support` (one word, so no `HYPHENATED_DOMAINS` change). Folder and
artifact paths `.singularskills/support/<project>/`. Methodology name for the
README and docs: **Support Operations Cycle**.

### Workflow `support` — "Support Operations Cycle"

| Phase | Title | Skill | Artifact | Requires |
| --- | --- | --- | --- | --- |
| 1 | Map | `support-journey-map` | `01-map.md` | — |
| 2 | Taxonomy | `support-taxonomy` | `02-taxonomy.md` | `01-map.md` |
| 3 | Knowledge | `support-knowledge-base` | `03-knowledge.md` | `02-taxonomy.md` |
| 4 | Responses | `support-macros` | `04-macros.md` | `02-taxonomy.md`, `03-knowledge.md` |
| 5 | Escalation | `support-escalation` | `05-escalation.md` | `02-taxonomy.md` |
| 6 | Service levels | `support-service-levels` | `06-service-levels.md` | `02-taxonomy.md`, `05-escalation.md` |
| 7 | Health | `support-health-review` | `07-health.md` | `02-taxonomy.md`, `06-service-levels.md` |

One skill per phase, as in `branding`. What each phase decides and writes:

1. **Map** (`support-journey-map`). Channels (email, chat, phone, in-app,
   community, social), the moments in the customer's life where they contact
   support (before buying, onboarding, first use, billing, renewal, cancelling),
   contact reasons per moment, and current volumes if an export is given. Reads
   `.singularskills/research/<project>/` and
   `.singularskills/marketing/<project>/` artifacts when present. Sections:
   Channels, Journey moments, Contact reasons, Current volumes (computed or
   `not measured`), Pain points, Key takeaways.
2. **Taxonomy** (`support-taxonomy`). A two-level ticket category tree (at most
   ~12 top-level categories, each with a definition and an example), tags
   orthogonal to categories (product area, plan, channel), and **priority**
   definitions (P1 to P4) written as tests a new agent can apply ("the customer
   cannot use the product at all and has no workaround"). If an export is given,
   classify a sample of at least 50 tickets (or all, if fewer) against the draft
   tree and report what did not fit; revise until under 10% are "Other".
3. **Knowledge** (`support-knowledge-base`). The help centre's structure
   (sections from the taxonomy), an article backlog ranked by the contact
   volume each would deflect, an article template, and the rule for when a
   ticket becomes an article. Writes outlines, not finished articles; the first
   three highest-ranked articles are drafted in full as examples.
4. **Responses** (`support-macros`). Saved replies for the top contact reasons:
   each with its trigger (category and condition), the reply in the brand's
   voice (from `.singularskills/branding/<project>/03-verbal.md` when present,
   else a voice the user confirms), the placeholders it needs, the knowledge-base
   article it links, and what the agent must check before sending. Applies the
   recovery rules of `references/service-recovery.md` to every macro for a
   failure. **The artifact also holds the support policy**, in a `## Policies`
   section: what an agent may offer without approval (refunds up to an amount,
   credits, extensions), what needs approval and from whom, and what is never
   promised (ship dates, fixes, legal positions). Policies come from the user;
   none is invented, and an unanswered one is listed under Open questions as
   "no policy: agents promise nothing here". Every macro's pre-send check
   names the policy line it relies on. *(builder-check answer, controller's
   call: policy sits with the replies that apply it, and every utility that
   replies reads it from here.)*
5. **Escalation** (`support-escalation`). Tiers (who handles what), the
   escalation triggers per priority and category, handoffs to engineering
   (what a bug report must contain), to billing, to account management and to
   security (a suspected security incident goes to `/security-incident-response`),
   and how the customer is kept informed while a ticket is with another team.
6. **Service levels** (`support-service-levels`). First-response and resolution
   targets per priority and channel, business hours and time zones, what pauses
   the clock, the staffing those targets imply given volume (an Erlang-free,
   arrival-rate-times-handle-time estimate, computed with code, and stated as
   an estimate), and what is promised externally versus targeted internally.
7. **Health** (`support-health-review`). From an export: the metrics of
   `references/support-metrics.md` (each `computed` or `not measured`), SLA
   attainment against phase 6, the categories driving volume, and **churn
   signals**: accounts with repeated contacts, unresolved P1/P2s, negative
   satisfaction, or cancellation-reason contacts in the period. Lists at-risk
   accounts by redacted identifier with the evidence. The identifier is
   `acct-` plus the first 8 hex digits of the SHA-256 of the export's account
   (or customer) ID column, computed with code: stable across runs, so the
   Trend section can say which accounts are at risk in both periods, and the
   user maps it back by running the same script (written into the artifact)
   over their own export. No key file is written. *(builder-check answer,
   controller's call: no personal data enters `.singularskills/`, which
   `references/memory/trail.md` says holds no secrets.)* When at-risk accounts are
   found, the summary names `/marketing-churn-prevention` as the next step for
   interventions; this skill does not design them. Re-running it on a later
   export overwrites `07-health.md` after reading the previous one, and adds a
   **Trend** section comparing the two periods.

### Utilities (no phase, run alone)

- **`support-reply`**. Draft a reply to one ticket or conversation the user
  pastes or names. Uses, when present: the taxonomy (to classify it), a matching
  macro, a knowledge-base article, the escalation rules (to say whether it
  should be escalated instead), the `## Policies` section of `04-macros.md`,
  and the brand voice. With no policy on file for what the ticket asks, it
  asks the user for that policy once; with no answer, the draft promises
  nothing and says above the reply which policy is missing. Returns the reply in chat
  with the category, priority and any escalation call above it; writes no
  artifact. Never sends anything.
- **`support-qa-review`**. Score one conversation against a QA rubric
  (accuracy, resolution, tone, effort asked of the customer, policy, and the
  three recovery dimensions when it handles a failure), each 1–4 with the
  quoted evidence, and the two changes that would most improve it. Writes
  `.singularskills/support/<project>/qa/<date>-<slug>.md`, a utility artifact
  (`phase: null`, `gate: none`, per `references/memory/trail.md`).
- **`support-incident-update`**. Draft customer-facing updates for a
  non-security outage or degradation: the first notice, updates at a stated
  cadence, the resolution notice and a short follow-up, for a status page,
  email and in-app banner, each saying what is known, what is not, and when the
  next update comes. Writes
  `.singularskills/support/<project>/incidents/<date>-<slug>.md`, a utility
  artifact. Not for security incidents; see `/security-incident-communication`.

Every description follows the pack rule (verb first, `Use when …` of at least
six words, 120–400 characters) and carries a `Not for …; see /…` clause wherever
§3's neighbours overlap. Final wording is the builder's.

## 5. How the skills are written

Like the existing domains, nothing new:

- Frontmatter: `name`, `description`, `metadata` (`argument-hint`, and for phase
  skills `workflow: support`, `phase`, `artifact`). Phase skills take
  `"[project] [--skip-checks]"`; utilities take a hint naming their input
  (`"<ticket or file> [project]"`).
- Sections `## Prerequisites`, `## Process`, `## Output`, written in the voice
  and density of `branding-*` and `bookkeeping-*`. The handoff, recall, gate and
  run-log paragraphs, the frontmatter block and the Decisions/Open questions
  ending are **generated** by `pack-tools fix-skill-text` (and the related
  fixers); write the skill body and run the fixers rather than hand-writing
  them. That covers **phase members only**: `support-qa-review` and
  `support-incident-update` write utility artifacts, so their frontmatter
  (`phase: null`, `gate: none`) and their started/finished run-log lines are
  written by hand, phrased as `design-design-review` phrases its own so the
  fixer leaves them alone.
- **Compute with code.** `support` joins `COMPUTE_PLUGINS` (pack-tools
  `content-blocks.ts` and its validator mirror), so every support skill carries
  the compute paragraph. Phases 1, 2, 6 and 7 compute; the others carry it
  harmlessly, as bookkeeping's non-numeric skills do.
- **Measured or not.** Every number a skill reports is labelled `computed`
  (from data the user supplied, with the script shown) or `not measured`; a
  target the user chose is labelled `target`. No skill invents a baseline.
- **Personal data.** Every skill that reads tickets says: quote only what the
  decision needs, and replace names, emails, phone numbers and account or order
  numbers with placeholders (`<customer>`, `<email>`, `<account-1>`). At-risk
  accounts in phase 7 are listed by a redacted identifier the user can map back.
- **Inputs.** A skill that wants ticket data asks for an export file path or a
  paste once, with any other question; with none, it proceeds from what the
  user describes and says which sections are `not measured`.

## 6. References (`references/support/`)

- **`support-metrics.md`**. Definitions and formulas for: contact volume and
  contact rate (contacts per active customer), first-response time and
  resolution time (median and 90th percentile, business hours), first-contact
  resolution, reopen rate, backlog age, SLA attainment, CSAT (reported as
  top-2-box share and as mean), CES and NPS. One section on how to read them:
  no single feedback metric reliably predicts retention; top-2-box satisfaction
  predicted retention best across 93 firms, and combining metrics predicted
  better than any one (de Haan et al., 2015, *IJRM*); recommendation-intention
  metrics had little or no predictive value for business performance (Morgan &
  Rego, 2006, *Marketing Science*), and NPS failed to replicate its claimed
  superiority (Keiningham et al., 2007, *Journal of Marketing*). So the pack
  reports CSAT top-2-box first and never NPS alone. An inputs table: which
  export columns each metric needs, and what to write when one is missing.
- **`service-recovery.md`**. How to answer a failure: the three justice
  dimensions (distributive: the outcome or compensation; procedural: speed,
  ease and clarity of the process; interactional: honesty, apology, respect),
  with the finding that cumulative satisfaction, which drives loyalty, depends
  slightly more on interactional than on distributive justice (Gelbrich & Roschk,
  2011, *Journal of Service Research*); that the "recovery paradox" lifts
  satisfaction but not repurchase or word of mouth, so never plan on it
  (de Matos et al., 2007, *JSR*); that stating the wait and the process
  strengthens positive emotion (Valentini et al., 2020, *Marketing Letters*);
  and that an apology or explanation that fails is worse than none (double
  deviation). Ends in a checklist every failure macro and QA review applies.

Citations are given in the files as author, year and journal, as above. Both
files are linked as `references/<file>.md` from the skills that use them and
copied by `gen:references`. A third file is the builder's call if a skill's text
gets long (e.g. a QA rubric).

## 7. Pack wiring

The `CLAUDE.md` "Adding a domain" steps, in order. Also, found during the
design and not in those steps:

- **The conductor.** `skills/workflow/SKILL.md` lists every workflow's phases
  and carries `references/workflows/*.yml`; both are generated, so the new
  workflow must appear in them through the generators, and `conductor.test.ts`
  must stay green.
- **Domain lists in prose.** `AGENTS.md` names every domain; add `support`.
  Search the repository for "16 domains" and "283" and update each that states
  the pack's totals (README, CLAUDE.md, AGENTS.md, `.claude-plugin/*.json`,
  docs pages, `lib/site.test.ts`); `check:pack`'s count check catches some, not
  all.
- **Cross-domain reads.** The validator's `artifact-root` rule
  (`packages/skill-validator/src/plugin-rules.ts`) rejects a skill path into
  another domain's folder unless the domain is in `CROSS_DOMAIN_READS`. Add
  `support: ["research", "marketing", "branding"]` there, with a test.
  *(builder-check answer, controller's call: the precedent is coaching and
  branding; dropping the reads would cut the integration §4 relies on.)*
- **Generated files** are never hand-edited.

## 8. Docs

- `apps/docs/content/docs/support/`: `index.mdx` (overview, phase table,
  utilities table, artifact flow, cross-domain integration, `<DomainGrid>`), one
  page per skill in the phase and utility page formats `branding` uses
  (`kind: phase` or the utility kind), and `artifacts.mdx`, `storage.mdx`,
  `examples.mdx`. `meta.json` with `---Phases---`, `---Memory---`,
  `---Examples---`, `---Utilities---`, icon `LifeBuoy`.
- Root `meta.json`: insert `support` after `marketing` (beside the other
  customer-facing domains).
- `lib/domains.ts`: slug `support`, name `Support`, methodology `Support
  Operations Cycle`, an existing palette colour (builder's call; `sky` is
  free of near neighbours in the bento), `LifeBuoy`, a `line-md` animated icon
  that `lib/icons.ts` can render (builder's call), a blurb in the house style.
- **Homepage bento.** The bento is built for 16 domains in 30 cells at six
  columns (2 wide, 3 half, 10 small, 1 meta) and `lib/site.test.ts` pins that.
  Adding a small tile makes 31 and a ragged last row. *Controller's call:*
  `support` is a **small** tile, `security` goes from half to small, and the
  totals become 2 wide, 2 half, 12 small, 1 meta = 30 cells. Bento orders
  become 1..17 with `support` placed so no row breaks (builder's call), and the
  tests change to match.
- Then `bun run gen:data` and `bun run codemod` in `apps/docs`.

## 9. Checks and acceptance

- Every check in `CLAUDE.md` green: `lint:skills`, `check:pack`,
  `SKIP_NETWORK_TESTS=1 bun run test`, `bun run check`, `cd apps/docs && bun
  run check`, `bash scripts/check-rename.sh`, `bun run evals --dry`.
- **One eval case**, `evals/support-reply/`, in the shape of
  `evals/branding-discover/` (a realistic pasted ticket that never names the
  skill, graders checking classification, no invented policy, redaction).
  `evals --dry` goes from 17 to 18 cases. The paid run is the owner's.
- **Acceptance runs**, free of network, in a scratch project, recorded in
  `docs/superpowers/plans/<plan>-acceptance.md` like project 3's:
  1. `/support-journey-map acme` then `/support-taxonomy acme` with a
     synthetic 60-ticket CSV (made up, no real data): artifacts written, gate
     passes, run log has started/finished lines, volumes `computed` with a
     script shown, no personal data from the CSV in either artifact.
  2. `/support-service-levels acme` before phase 5 exists: the gate stops it.
  3. `/support-reply` on a pasted ticket asking for a refund outside policy:
     the draft does not promise the refund. Run once with a `04-macros.md`
     whose Policies section caps refunds, once with no policy on file.

## 10. Left to the builder

Skill wording, section names inside artifacts beyond those listed, the docs
page prose, the animated icon, the bento order, the eval's graders, and the
synthetic CSV's contents. Where a choice here turns out to fight a pack check,
follow the check and record a ruling.
