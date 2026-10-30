# Conductor handoff: design

Project 1a of the singularskills programme. Follows the foundation design
(`2026-10-26-singularskills-foundation-design.md`, §6.2 to §6.5) and comes before
project 2 (stack profiles and the memory seam).

## 1. Intent

The foundation's promise is a trail a person can trust: every workflow phase is
written only after the agent has asked what it cannot infer, and is complete only
when a person approves it in the run log. The conductor skill (`workflow`) is what
makes that promise real: it logs `run-started`, runs each phase's members, stops at
every boundary and records the approval.

The first real eval run (2026-10-29) showed the promise breaking at the first
step. For "Start the design thinking process for date-picker", the model invoked
`design-empathize` directly in five runs out of five, before and after two rewrites
of the conductor's description. The member wrote a research brief built on
assumptions, asked nothing, and the log held no `run-started` and no approval. The
artifact looked finished; the trail could not say who approved it, because nobody
had.

Descriptions cannot fix this: model routing picks the concrete skill whose
description matches the request's nouns ("design a new component"), and a
283-skill listing gives it plenty of near matches. The fix has to work *after* the
wrong skill has been picked.

A hand-written spike (2026-10-30) confirmed the approach: one paragraph at the top
of `design-empathize`'s Prerequisites made the model, having picked that skill,
hand off to the conductor, which logged `run-started`, wrote nothing and ended its
turn on a question. Three of the five eval graders passed, up from one, including
"conductor fired" and "run logged".

## 2. Goals

- A request to start, run, continue or resume a workflow reaches the conductor
  even when the agent first picks a member skill.
- The handoff lives in the skill text, so every agent gets it, with no Claude-only
  hook or system-prompt trick.
- It is generated from the workflow files and checked for drift, like the gate step.
- Running a single skill by name still works, and the conductor can still run
  members without them bouncing back to it.
- The `workflow` eval case passes all five graders.

## 3. Non-goals and anti-goals

- No per-methodology entry skills (`/design-thinking date-picker`). The handoff
  alone closes the trust gap; entry skills would add nineteen listings for a typing
  convenience and can be generated later if people ask for them.
- No change to what members write, to the gate scripts, or to the run-log shape.
- Anti-goal: a member that refuses to run at all outside a workflow. A person who
  asks for one skill by name gets that skill.
- Anti-goal: a handoff loop, where the conductor runs a member and the member hands
  back to the conductor.

## 4. The handoff paragraph

Every skill that belongs to a phase of a domain workflow (`metadata.workflow` set;
218 skills) gets one paragraph as the **first paragraph of `## Prerequisites`**,
before the gate step or the `started` line. Utilities (`singular-*`, `workflow`)
get nothing.

The text, with the member's own values filled in:

> **Part of a workflow.** This skill is phase `<n>` (`<Phase title>`) of the
> `<Workflow title>` workflow (`<workflow name>`); cross-domain workflows run it too.
> Unless the user named this skill, check `.singularskills/log.jsonl` for an open
> run for this project: a `run-started` line with `"project":"<project>"` and no
> later `run-finished` line for the same `workflow` and `project`. If there is no
> open run, or the user asked to start, run, continue or resume a process or
> workflow rather than this one step, do not continue here: invoke the `workflow`
> skill with the workflow the user asked for, or `<workflow name>` when they named
> none, followed by `<project>`. It runs this phase in order, asks before it writes
> and records the run. Continue here when the user named this skill, or when an open
> run exists (the conductor is running you).

Placeholders and their sources: `<n>` is the phase number, `<Phase title>` the
phase's `title`, `<Workflow title>` the workflow's `title` ("Design Thinking"),
`<workflow name>` the workflow's `name` ("design"). All come from the member's
domain workflow, `workflows/<domain>.yml`, through the `memberships()` map that
`fix-skill-text` already builds; cross-domain membership is not enumerated (a skill
can belong to several, and the open-run check does not need the list). The
paragraph's first sentence is the marker the fixer and the validator key on; the
rest is regenerated verbatim.

Why these conditions (the builder check's questions 1 and 3 shaped them):

- **Open run, any workflow.** The conductor appends `run-started` before it runs
  any member (its step 3). A cross-domain run such as `launch-product` logs
  `"workflow":"launch-product"`, so the check must not look for the member's own
  workflow name, or the member would hand off to `workflow design` in the middle of
  a launch: a loop, and the wrong workflow. Checking for *any* open run for the
  project covers both, and the paragraph says so. "Open" means no later
  `run-finished`; a run that ended yesterday does not license a member to write
  outside a run today.
- **The workflow the user asked for.** "Start the rebrand for acme" may land on
  `research-discover`, whose domain workflow is `research`. The handoff passes the
  user's own workflow when they named one, and the conductor's step 1 already
  resolves names and titles ("design thinking" is `design`, "the rebrand" is
  `rebrand`). The member's own name is only the default.
- **"asked to start, run, continue or resume a process or workflow"**: catches the
  eval's request and its everyday variants; the agent reads intent, the text names
  the common verbs.
- **"unless the user named this skill"**: a person typing `/design-empathize
  date-picker` is left alone, with no log check at all.

The paragraph applies to every phase member, not only first phases. A person
saying "continue the design process" may land on `design-define-component`; the
same conditions route that to the conductor.

## 5. Tooling

### 5.1 pack-tools

- `src/skill-text.ts` gains `HANDOFF_MARKER = "**Part of a workflow.**"` and
  `handoffParagraph(member: Member): string`. `fixSkillText` inserts or replaces it
  as the first paragraph of `## Prerequisites` for every member, before the
  paragraph that `fixStartStep` owns, and removes any such paragraph from a
  non-member. The replace rule mirrors the gate step's: a paragraph starting with
  the marker is the handoff and is rewritten in place; `--check` reports skills
  whose paragraph differs.
- `gates.test.ts`'s pin "a skill that ships a gate opens Prerequisites with the gate
  step" becomes "opens Prerequisites with the handoff, then the gate step".
- `skill-text.test.ts` pins: the exact paragraph for a single-writer first phase
  (`design-empathize`), a shared phase 0 member (`marketing-copywriting`) and a
  gated later phase (`design-define-component`); idempotency; a utility gets none;
  the conductor skill gets none.

### 5.2 skill-validator

- `src/plugin-rules.ts` gains the mirrored `HANDOFF_PARAGRAPH` constant (with
  `<n>`, `<Phase title>`, `<Workflow title>`, `<workflow name>` placeholders) and a
  rule `workflow-handoff`: a skill with `metadata.workflow` must have, as the first
  paragraph of `## Prerequisites`, the handoff paragraph with its own values; a
  skill without `metadata.workflow` must not contain the marker. The validator's
  own workflow loader supplies titles.
- A cross-package equality test in pack-tools (like the one for
  `STANDARD_ARGS_PARAGRAPH`) asserts the two constants render the same text for the
  same member.

### 5.3 Conductor and docs

- `skills/workflow/SKILL.md`, step 3, "Running a member": add one sentence,
  "The member's Prerequisites open with a handoff to this skill; it does not apply
  while you are running the member, because this run's `run-started` line is an
  open run for the project, whatever workflow it names."
- `skills/workflow/references/run-log.md`: one line under the member events
  explaining that a member invoked outside a run hands off to the conductor rather
  than logging `started`.
- `apps/docs/content/docs/overview/workflows.mdx`: a short "Starting from a member
  skill" paragraph with the `/workflow design date-picker` form.
- `AGENTS.md` and `README.md`: the sentence that explains running a single skill
  gains "a member skill hands off to the conductor when you ask for the whole
  process".

## 6. Eval runner and the sandbox

`scripts/run-evals.sh` stages a mirror root whose `skills/` is a symlink into the
repo. Inside the eval sandbox, reads of plugin files are denied in every variant
tried on 2026-10-30: the linked layout, a path-scoped `Read(<staged root>/**)`
grant in `--allow-tools`, and a staged root with the pack copied in (which also
makes the Skill tool launch skills with no instructions, three runs out of three,
so copying is ruled out). Skills therefore cannot open their own `references/`
files in evals, and the conductor cannot open its bundled workflow files. The
runner stays as it is after PR #50; the sandbox limitation is recorded in
`AGENTS.md` under the evals section and raised upstream as a Claude Code issue
(the controller files it; the builder links it from the acceptance record).

What this project can still do inside that limit:

- **The conductor carries its workflows.** The workflow table in
  `skills/workflow/SKILL.md` becomes a generated block (owned by `fix-skill-text`,
  drift-checked like the other generated text) that holds, for all 19 workflows,
  every phase's number, title, artifact, `folder` (cross-domain phases), `requires`
  and member skills: everything step 1 reads from a workflow file. Step 1's rule
  becomes: a workflow named in the block is valid; read `workflows/<name>.yml` (or
  the bundled copy) when you can, since the file is the source; when you cannot
  read it, say so in one line and use the block. Stop only for a name that is in
  neither the block nor the user's words. The block is about 150 rows; the
  conductor's `SKILL.md` grows by roughly 10 KB, which is acceptable for the one
  skill that must work without file access.
- **`design-empathize` asks first and degrades gracefully.** Its Process opens by
  asking about the component's users, contexts and constraints, one question at a
  time, and ends the turn to wait for the answer, before any Figma step. An absent
  Figma server, or a `references/` file it cannot read, becomes a one-line note in
  the brief and the skill continues from its own knowledge; neither becomes a
  question to the user. This is the one domain skill whose content changes,
  because the acceptance case runs it; its `asks` and `stops` graders want a
  question about the date picker, not about tooling.

The `workflow` eval case is the acceptance test. Its prompt and graders do not
change.

## 7. Constraints

- The handoff paragraph is the first paragraph of `## Prerequisites`; the gate
  step or `started` line follows it. Nothing else in the generated blocks moves.
- Descriptions stay as they are after PR #50; the handoff is the fix, not the
  descriptions.
- `bun run lint:skills`, `check:pack`, the docs `check`, `evals --dry` and the
  test suites stay green at every commit; `fix-skill-text --check` is clean after
  regeneration.
- Conventional commits; attribution trailer per the environment.

## 8. Left to the builder

- Exact placement logic in `fixSkillText` when a skill's `## Prerequisites` section
  is missing (create it after the Arguments paragraph) or begins with the gate step
  (insert before it).
- How the validator obtains the phase title without a pack-tools dependency (its
  own loader already parses the workflow files).
- Wording of the docs paragraphs, within the sentences above.

## 9. Settled by the controller's tests (2026-10-30)

- The sandbox denies plugin-file reads under every staging variant (§6). The
  design does not depend on them.
- The handoff paragraph routes to the conductor after a misroute (the spike, §1).

## 10. Acceptance

1. `fix-skill-text --check` is clean and 218 skills open Prerequisites with the
   handoff paragraph; no utility contains the marker.
2. `lint:skills` passes with the new `workflow-handoff` rule.
3. `EVALS_ALLOW_BASH=0 bun run evals workflow` runs the conductor case twice:
   `fired`, `log` and `no-phase-2` pass in both runs; `asks` and `stops` pass in at
   least one. The results table goes in the acceptance record.
   **Tuning budget (owner's decision, 2026-10-30):** if `asks` or `stops` fail,
   the builder may adjust the conductor's Process text and `design-empathize`
   only, never descriptions, the eval prompt or the graders, across at most three
   paid runs of this single case (about three dollars each). After the third run
   the result is recorded as it stands and does not block the merge; `fired` and
   `log` passing in both runs is the merge condition.
4. A manual check in a fresh project: `/design-empathize date-picker` runs the
   member without handing off, and "start the design thinking process for
   date-picker" reaches the conductor, which asks before writing.
