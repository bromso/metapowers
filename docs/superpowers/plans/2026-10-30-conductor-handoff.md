# Conductor Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every phase member skill opens its Prerequisites with a generated handoff to the `workflow` conductor, so "start the design thinking process for date-picker" reaches the conductor even when the agent first picks `design-empathize`; the conductor can run from its own text when the eval sandbox blocks file reads.

**Architecture:** `pack-tools fix-skill-text` (packages/pack-tools/src/skill-text.ts) already owns the three workflow-derived blocks of every SKILL.md; it gains a fourth, the handoff paragraph, and a fifth that only the conductor gets, a generated table of every workflow's phases. The validator mirrors the handoff text as a constant and a rule, like the Arguments paragraph. `design-empathize` is rewritten by hand to ask first; docs and the run-log reference get a sentence each. The `workflow` eval case is the acceptance test.

**Tech Stack:** Bun 1.3 + Turborepo; TypeScript; Vitest 3; `yaml`; Biome (tabs, width 100). Skills are Markdown with YAML frontmatter.

**Spec:** `docs/superpowers/specs/2026-10-30-conductor-handoff-design.md` (reads §6.2 to §6.5 of `docs/superpowers/specs/2026-10-26-singularskills-foundation-design.md`).

## Global Constraints

- The handoff paragraph is the first paragraph of `## Prerequisites`; the gate step or `started` line follows it. Nothing else in the generated blocks moves. (spec §7)
- Descriptions stay as they are after PR #50; the handoff is the fix, not the descriptions. (spec §7)
- `bun run lint:skills`, `bun run check:pack`, the docs `check` (`cd apps/docs && bun run check`), `bun run evals --dry` and `SKIP_NETWORK_TESTS=1 bun run test` stay green at every commit; `fix-skill-text --check` is clean after regeneration. (spec §7)
- Conventional commits; the attribution trailer the environment supplies. (spec §7)
- No per-methodology entry skills; no change to what members write, to gate scripts or to the run-log shape. (spec §3)
- `scripts/run-evals.sh` is not changed. (spec §6)
- The eval prompt and graders in `evals/workflow/` do not change. (spec §6)
- Eval tuning budget: at most three paid runs of the single `workflow` case, adjusting only the conductor's Process text and `design-empathize`; after the third run the result is recorded and does not block. (spec §10.3)

## Review Focus

1. A member running inside a cross-domain run (`launch-product` logs `"workflow":"launch-product"`) must not hand off to `workflow design`: the paragraph's open-run check must name only `"project":"<project>"`, never the member's own workflow. Pinned in Task 1 (`design-empathize` exact text).
2. A run that ended (`run-started` followed by `run-finished`) must not count as open: the paragraph must say "no later `run-finished` line". Pinned in Task 1 (exact text).
3. A skill whose `## Prerequisites` says only `None.`, or has no such section, must get the paragraph without leaving a stray `None.`. Pinned in Task 1.
4. A hand-edited or legacy handoff paragraph (the 2026-10-30 spike text, "Unless the user invoked this skill by name, check…") must be regenerated, and `--check` must report it. Pinned in Task 1.
5. Regenerating the conductor's workflows block must not touch the `## Run-log lines you write` section after it or the `## Files` prose before it. Pinned in Task 3.

---

### Task 1: The handoff paragraph in pack-tools

**Files:**
- Modify: `packages/pack-tools/src/skill-text.ts`
- Modify: `packages/pack-tools/src/skill-text.test.ts`
- Modify: `packages/pack-tools/src/gates.test.ts:207-215` (the pin "a skill ships a gate script exactly when its Prerequisites open with the gate step")
- Regenerate: `skills/*/SKILL.md` (218 members)

**Interfaces:**
- Consumes: `Member`, `memberships()`, `headingIndex()`, `sectionEnd()`, `fixStartStep()` in `skill-text.ts`; `Workflow.title`, `Workflow.name`, `Phase.phase`, `Phase.title` from `workflows.ts`.
- Produces: `export const HANDOFF_MARKER = "**Part of a workflow.**"`; `export function handoffParagraph(member: Member): string`; `export function fixHandoff(content: string, member: Member | undefined): string`. `fixSkillText` applies `fixHandoff` after `fixStartStep` so the handoff sits before the gate or start step.

The exact paragraph `handoffParagraph` returns, for `design-empathize` (phase 1 "Empathize" of `design`, title "Design Thinking"):

```
**Part of a workflow.** This skill is phase 1 (Empathize) of the Design Thinking workflow (`design`); cross-domain workflows run it too. Unless the user named this skill, check `.singularskills/log.jsonl` for an open run for this project: a `run-started` line with `"project":"<project>"` and no later `run-finished` line for the same `workflow` and `project`. If there is no open run, or the user asked to start, run, continue or resume a process or workflow rather than this one step, do not continue here: invoke the `workflow` skill with the workflow the user asked for, or `design` when they named none, followed by `<project>`. It runs this phase in order, asks before it writes and records the run. Continue here when the user named this skill, or when an open run exists (the conductor is running you).
```

Only the four values change per member: the phase number, the phase title, the workflow title and the workflow name (twice).

- [ ] **Step 1: Write the failing tests** in `skill-text.test.ts`, a new `describe("fix-skill-text: the handoff paragraph")`:

```ts
it("renders design-empathize's paragraph exactly", () => {
	expect(handoffParagraph(member("design", 1, "design-empathize"))).toBe(DESIGN_EMPATHIZE_HANDOFF); // the text above
});
it("names the project only, never the member's workflow, in the open-run check", () => {
	const text = handoffParagraph(member("design", 1, "design-empathize"));
	expect(text).toContain('a `run-started` line with `"project":"<project>"` and no later `run-finished` line');
	expect(text).not.toContain('"workflow":"design"');
});
it("puts the paragraph first in Prerequisites, before the gate step", () => {
	const out = fixHandoff(gatedFixture, member("design", 2, "design-define-component"));
	const prerequisites = /^## Prerequisites\n\n(.*)\n\n(.*)$/m.exec(out);
	expect(prerequisites?.[1]).toMatch(/^\*\*Part of a workflow\.\*\* This skill is phase 2 \(Define\)/);
	expect(prerequisites?.[2]).toMatch(/^Run this skill's gate before writing/);
});
it("replaces a 'None.' section and creates a missing section", () => {
	expect(fixHandoff(noneFixture, m)).not.toContain("None.");
	expect(fixHandoff(noSectionFixture, m)).toMatch(/^## Prerequisites\n\n\*\*Part of a workflow\.\*\*/m);
});
it("regenerates the spike wording and is idempotent", () => {
	const spike = "**Part of a workflow.** This skill is phase 1 (Empathize) of the Design Thinking workflow. Unless the user invoked this skill by name, check …";
	const once = fixHandoff(withParagraph(spike), m);
	expect(once).not.toContain("Unless the user invoked this skill by name");
	expect(fixHandoff(once, m)).toBe(once);
});
it("removes the paragraph from a skill with no membership", () => {
	expect(fixHandoff(withParagraph(DESIGN_EMPATHIZE_HANDOFF), undefined)).not.toContain(HANDOFF_MARKER);
});
```

`member(workflowName, phase, name)` builds a `Member` from the repo's `workflows/` (load them once with `loadWorkflows` in the test file, as the gate tests do).

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd packages/pack-tools && bunx vitest run src/skill-text.test.ts -t "handoff"`
Expected: FAIL, `handoffParagraph is not a function` (or not exported).

- [ ] **Step 3: Implement** in `skill-text.ts`:
  - `HANDOFF_MARKER`, `handoffParagraph(member)` (template of the text above).
  - `fixHandoff(content, member)`: find `## Prerequisites`; a paragraph starting with `HANDOFF_MARKER` anywhere in the section is replaced in place (one line); otherwise insert the paragraph as the section's first paragraph (after the heading and one blank line, before whatever is there); a section whose only non-blank content was `None.` loses the `None.`; no section: create `## Prerequisites` before the first `## ` heading, as `fixStartStep` does. With `member === undefined`, remove any marker paragraph (and collapse doubled blank lines), leaving `None.` if the section empties.
  - In `fixSkillText`, after `fixStartStep` and before `fixOutputBlock`: `out = fixHandoff(out, members.get(skill.name))`. Members of a phase with no artifact (approval-only) still get the handoff; only `memberships()` decides membership.
  - Update the doc comment at the top of the file: four blocks.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd packages/pack-tools && bunx vitest run src/skill-text.test.ts`
Expected: PASS (all describes).

- [ ] **Step 5: Update the gates pin** in `gates.test.ts:207`: the test reads the *second* paragraph of Prerequisites for members (the first is the handoff) and asserts it starts with `GATE_STEP` exactly when the skill ships `scripts/gate.sh`; rename the test "…exactly when the paragraph after the handoff is the gate step".

- [ ] **Step 6: Regenerate the pack and check drift**

Run: `cd packages/pack-tools && bun run build && node dist/cli.js fix-skill-text ../../skills && node dist/cli.js fix-skill-text ../../skills --check; echo "exit $?"`
Expected: first command lists 218 changed skills; `--check` prints nothing and exits 0. `grep -L "Part of a workflow" skills/*/SKILL.md | wc -l` prints `65` (283 − 218). `grep -l "Part of a workflow" skills/workflow/SKILL.md skills/singular-*/SKILL.md` prints nothing.

- [ ] **Step 7: Run the package checks and the validator**

Run: `cd packages/pack-tools && bun run check && cd ../.. && bun run lint:skills && SKIP_NETWORK_TESTS=1 bun run test`
Expected: all exit 0. (The validator has no handoff rule yet; it must not reject the paragraph. If `reference-resolvable` or `skill-ref-exists` flags the backticked `workflow` word, note it: Task 2 adds the rule, and the paragraph names the skill in backticks without a slash on purpose.)

- [ ] **Step 8: Commit**

```bash
git add packages/pack-tools/src/skill-text.ts packages/pack-tools/src/skill-text.test.ts packages/pack-tools/src/gates.test.ts skills
git commit -m "feat(pack-tools): every phase member opens Prerequisites with a handoff to the conductor"
```

---

### Task 2: The validator mirrors the handoff

**Files:**
- Modify: `packages/skill-validator/src/plugin-rules.ts` (constants near `STANDARD_ARGS_PARAGRAPH` at line 158; a new check in `validatePackSkill` at line 495)
- Modify: `packages/skill-validator/src/plugin-rules.test.ts`
- Modify: `packages/skill-validator/src/index.ts` (export the new constant and function)
- Modify: `packages/pack-tools/src/skill-text.test.ts` (one cross-package equality test)

**Interfaces:**
- Consumes: `PackContext.workflows` (validator's own `Workflow` type: `name`, `title`, `folder`, `phases[]` with `phase`, `title`, `skills`); `metadataOf(parsed)` for `metadata.workflow` and `metadata.phase`; Task 1's `handoffParagraph`.
- Produces: `export const HANDOFF_PARAGRAPH: string` with placeholders `<phase>`, `<phase title>`, `<workflow title>`, `<workflow name>` (the last appears twice); `export type HandoffFields = { phase: number; phaseTitle: string; workflowTitle: string; workflowName: string }`; `export function handoffParagraph(fields: HandoffFields): string`; rule id `workflow-handoff`.

- [ ] **Step 1: Write the failing tests** in `plugin-rules.test.ts`:

```ts
describe("workflow-handoff", () => {
	it("accepts a member whose Prerequisites open with its own handoff paragraph", () => {
		expect(issues(memberSkillWith(handoffParagraph(designEmpathizeFields)))).toEqual([]);
	});
	it("rejects a member without the paragraph", () => {
		expect(ruleIds(issues(memberSkillWith("None.")))).toContain("workflow-handoff");
	});
	it("rejects a member whose paragraph carries another phase's values", () => {
		expect(ruleIds(issues(memberSkillWith(handoffParagraph({ ...designEmpathizeFields, phase: 2 }))))).toContain("workflow-handoff");
	});
	it("rejects a member whose paragraph is not the first paragraph of Prerequisites", () => { /* gate step first, handoff second */ });
	it("rejects a utility that contains the marker", () => {
		expect(ruleIds(issues(utilitySkillWith(handoffParagraph(designEmpathizeFields))))).toContain("workflow-handoff");
	});
});
```

`issues()` calls `validatePackSkill(parseSkill(...), ctx)` with a `PackContext` built from a temp dir holding `workflows/design.yml` copied from the repo (the file's existing tests show how `buildPackContext` is driven).

In `packages/pack-tools/src/skill-text.test.ts`, next to the existing `STANDARD_ARGS_PARAGRAPH` equality test:

```ts
it("matches the validator's handoffParagraph for every member", () => {
	for (const m of memberships(workflows).values()) {
		expect(handoffParagraph(m)).toBe(validatorHandoff({ phase: m.phase.phase, phaseTitle: m.phase.title, workflowTitle: m.workflow.title, workflowName: m.workflow.name }));
	}
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd packages/skill-validator && bunx vitest run src/plugin-rules.test.ts -t "workflow-handoff"` and `cd packages/pack-tools && bunx vitest run src/skill-text.test.ts -t "validator's handoffParagraph"`
Expected: FAIL, `handoffParagraph` not exported from `@singularskills/skill-validator`.

- [ ] **Step 3: Implement** in `plugin-rules.ts`: the constant (same text as Task 1 with the four placeholders), `handoffParagraph(fields)` (string replacement; `<workflow name>` replaced globally), and `checkWorkflowHandoff(parsed, ctx)`:
  - `metadata.workflow` set: find `ctx.workflows` entry with that `name` and its phase with `phase === metadata.phase`; if either is missing, return no issue (the `frontmatter-shape` and `check-workflows` rules own that). Take the first non-blank line after `## Prerequisites` (outside fences); if it is not exactly `handoffParagraph(fields)`, one error: rule `workflow-handoff`, message `` Prerequisites must open with the handoff paragraph for phase <phase> of `<workflow name>`; run `pack-tools fix-skill-text`. ``
  - `metadata.workflow` unset: if the body contains `**Part of a workflow.**`, one error, message `` A skill outside a workflow must not carry the handoff paragraph; run `pack-tools fix-skill-text`. ``
  - Add `...checkWorkflowHandoff(parsed, ctx)` to `validatePackSkill`. Export the constant, the type and the function from `index.ts`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd packages/skill-validator && bunx vitest run && cd ../pack-tools && bun run build && bunx vitest run src/skill-text.test.ts`
Expected: PASS.

- [ ] **Step 5: Run the validator over the pack**

Run: `bun run lint:skills`
Expected: exit 0, 283 skills PASS (the 218 regenerated in Task 1 carry the exact text; the 65 others carry no marker).

- [ ] **Step 6: Commit**

```bash
git add packages/skill-validator/src/plugin-rules.ts packages/skill-validator/src/plugin-rules.test.ts packages/skill-validator/src/index.ts packages/pack-tools/src/skill-text.test.ts
git commit -m "feat(skill-validator): workflow-handoff rule mirrors the generated handoff paragraph"
```

---

### Task 3: The conductor carries its workflows and explains the handoff

**Files:**
- Modify: `packages/pack-tools/src/skill-text.ts`
- Modify: `packages/pack-tools/src/skill-text.test.ts`
- Modify: `packages/pack-tools/src/conductor.test.ts` (phrase-level pins)
- Modify: `skills/workflow/SKILL.md` (the `## Files` table at lines 29-51, step 1's "no file" rule at line 66, step 3's "Running a member" at line 90)
- Modify: `skills/workflow/references/run-log.md` (the events table at lines 26-31)

**Interfaces:**
- Consumes: `Workflow[]` (all 19, cross-domain included), `headingIndex()`/`sectionEnd()`.
- Produces: `export const WORKFLOWS_BLOCK_START = "<!-- workflows:start -->"` and `WORKFLOWS_BLOCK_END = "<!-- workflows:end -->"`; `export function workflowsBlock(workflows: Workflow[]): string[]`; `export function fixWorkflowsBlock(content: string, workflows: Workflow[]): string`, applied by `fixSkillText` to the skill named `workflow` only.

The block replaces the current "The bundled workflow files:" table. Its shape, for each workflow sorted by `name` (the order `loadWorkflows` returns):

```
<!-- workflows:start -->
The workflows, from `workflows/*.yml` (regenerated by `pack-tools fix-skill-text`; the bundled copy of each file is `references/workflows/<name>.yml`):

### design — Design Thinking (folder `design`)

| Phase | Title | Artifact | Folder | Requires | Skills |
| --- | --- | --- | --- | --- | --- |
| 1 | Empathize | `01-empathize.md` | | | `design-empathize` |
| 2 | Define | `02-define.md` | | `01-empathize.md` | `design-define-component` |
…
<!-- workflows:end -->
```

`Folder` holds the phase's own `folder` (cross-domain phases) or is empty; `Artifact` is empty for an approval-only phase; `Requires` lists files comma-separated; `Skills` lists members comma-separated in file order, each in backticks.

- [ ] **Step 1: Write the failing tests** in `skill-text.test.ts`, `describe("fix-skill-text: the conductor's workflows block")`:

```ts
it("renders the design workflow's rows", () => {
	const block = workflowsBlock(workflows).join("\n");
	expect(block).toContain("### design — Design Thinking (folder `design`)");
	expect(block).toContain("| 2 | Define | `02-define.md` | | `01-empathize.md` | `design-define-component` |");
});
it("renders a cross-domain phase's folder and an approval-only phase's empty artifact", () => {
	const block = workflowsBlock(workflows).join("\n");
	expect(block).toMatch(/\| 1 \| [^|]+ \| `01-discover.md` \| research \| \| `research-discover` \|/); // launch-product phase 1
	expect(block).toMatch(/\| \d+ \| [^|]+ \| \| [^|]* \| [^|]* \| `development-ship` \|/);
});
it("replaces the block between the markers and leaves the rest untouched", () => {
	const before = "## Files\n\nprose\n\n<!-- workflows:start -->\nold\n<!-- workflows:end -->\n\n## Run-log lines you write\n\nkeep\n";
	const out = fixWorkflowsBlock(before, workflows);
	expect(out.startsWith("## Files\n\nprose\n\n<!-- workflows:start -->\n")).toBe(true);
	expect(out.endsWith("<!-- workflows:end -->\n\n## Run-log lines you write\n\nkeep\n")).toBe(true);
	expect(fixWorkflowsBlock(out, workflows)).toBe(out);
});
it("is applied to the workflow skill only", () => {
	const fix = fixSkillText(workflows);
	expect(fix({ name: "workflow", domain: "singular", path: "", content: before })).toContain("### design — Design Thinking");
	expect(fix({ name: "design-empathize", domain: "design", path: "", content: before })).toContain("<!-- workflows:start -->\nold\n<!-- workflows:end -->");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd packages/pack-tools && bunx vitest run src/skill-text.test.ts -t "workflows block"`
Expected: FAIL, `workflowsBlock is not a function`.

- [ ] **Step 3: Implement** `workflowsBlock` and `fixWorkflowsBlock` in `skill-text.ts` (replace the lines between the two markers inclusive of the inner content; throw `unterminated workflows block` if the start marker has no end; do nothing when there is no start marker), and the `name === "workflow"` branch in `fixSkillText`.

- [ ] **Step 4: Edit `skills/workflow/SKILL.md` by hand**, once, so the fixer has markers to own:
  - Replace "The bundled workflow files:" and its table (lines 29-51) with the two marker lines and nothing between them; then run the fixer (Step 6) to fill it.
  - Step 1, the sentence "A workflow name with no file in either place: say so, list the available workflows and stop." becomes: "A workflow named in the workflows block under **Files** is valid. Read its file when you can, since the file is the source; if you cannot read it, say so in one line and use the block, which holds every phase's number, title, artifact, folder, requires and skills. Stop only for a name that is in neither the block nor the user's words: say so, list the workflows and stop."
  - Step 3, "Running a member": append the sentence "The member's Prerequisites open with a handoff to this skill; it does not apply while you are running the member, because this run's `run-started` line is an open run for the project, whatever workflow it names."
  - `references/run-log.md`, after the events table: one line, "A member invoked outside an open run (no `run-started` for the project without a later `run-finished`) hands off to the `workflow` skill instead of logging `started`, unless the user named the member; see the first paragraph of any member's Prerequisites."

- [ ] **Step 5: Pin the prose** in `conductor.test.ts` with phrase-level regexes, as the existing pins do: `/use the block, which holds every phase's number/`, `/Stop only for a name that is in neither the block nor the user's words/`, `/an open run for the project, whatever workflow it names/`, and in run-log.md `/hands off to the `workflow` skill instead of logging `started`/`.

- [ ] **Step 6: Regenerate and verify**

Run: `cd packages/pack-tools && bun run build && node dist/cli.js fix-skill-text ../../skills && node dist/cli.js fix-skill-text ../../skills --check; echo "exit $?"; grep -c "^### " ../../skills/workflow/SKILL.md`
Expected: `--check` exits 0; the grep prints at least `19`. Then `bunx vitest run` in pack-tools: PASS. Then `cd ../.. && bun run lint:skills && bun run check:pack`: exit 0.

- [ ] **Step 7: Regenerate the docs data**, since the conductor page derives from `SKILL.md`:

Run: `cd apps/docs && bun run gen:data && bun run codemod && bun run check`
Expected: exit 0; `git status` shows `apps/docs/lib/site-data.json` changed only if the site data carries skill body text (commit whatever changed).

- [ ] **Step 8: Commit**

```bash
git add packages/pack-tools/src/skill-text.ts packages/pack-tools/src/skill-text.test.ts packages/pack-tools/src/conductor.test.ts skills/workflow apps/docs/lib
git commit -m "feat(workflow): the conductor carries every workflow's phases and explains the member handoff"
```

---

### Task 4: `design-empathize` asks first; docs

**Files:**
- Modify: `skills/design-empathize/SKILL.md:25-50` (the `## Process` list)
- Modify: `apps/docs/content/docs/overview/workflows.mdx` (a paragraph under `## The conductor`, line 57)
- Modify: `README.md:108-109` and `AGENTS.md` (the "Checks" section, line 35, and the skill/workflow relationship section, line 26)
- Regenerate: `adapters/` if `gen-adapters --check` reports the Gemini/Claude wrapper for `design-empathize` changed (it carries the description only, so it should not)

**Interfaces:**
- Consumes: nothing from earlier tasks beyond the regenerated Prerequisites (which this task must not edit by hand; `fix-skill-text --check` guards it).
- Produces: nothing other tasks consume.

- [ ] **Step 1: Rewrite the `## Process` of `design-empathize`** to this order (keep the existing Figma call names and the WCAG reference, keep steps short):
  1. **Ask before anything else.** One question at a time, in plain language, about the component's users, the contexts it appears in, and known constraints (platforms, locales, an existing picker being replaced). End the turn after the first question and wait for the answer; ask the next only if the answer leaves a gap that the brief needs. Never ask about tooling.
  2. **Read the design system via the Figma MCP tools** (existing calls). If no Figma server is available, write one line in the brief under a "Not checked" heading and continue; do not ask the user about it.
  3. **Inspect existing components** (existing calls, same fallback).
  4. **Review accessibility requirements**: read `references/wcag-criteria.md`; if the file cannot be read, note it under "Not checked" and apply WCAG 2.2 AA from your own knowledge.
  5. **Synthesize** and 6. **Write the artifact** (existing text).

- [ ] **Step 2: Verify the generated blocks survived the edit**

Run: `cd packages/pack-tools && node dist/cli.js fix-skill-text ../../skills --check; echo "exit $?"; cd ../.. && bun run lint:skills`
Expected: both exit 0 (the handoff, the `started` paragraph and the Output block are untouched).

- [ ] **Step 3: Docs.** In `workflows.mdx` under `## The conductor`, add a paragraph "Starting from a member skill": ask for the process in your own words ("start the design thinking process for date-picker") or run `/workflow design date-picker`; if the agent picks a member skill first, the member's Prerequisites hand off to the conductor; a member invoked by name (`/design-empathize date-picker`) runs on its own. In `README.md:108` and the matching sentence in `AGENTS.md` §"How a skill, a workflow file and a gate relate", add: "A member skill hands off to the conductor when you ask for the whole process rather than one step." In `AGENTS.md` §"Checks", after the `bun run evals` sentence, add: "Inside `claude plugin eval` runs the sandbox denies reads of the plugin's own files (skills cannot open their `references/`; the conductor uses its built-in workflows block instead). Reported upstream; see the acceptance record for the issue link."

- [ ] **Step 4: Run every check**

Run: `bun run lint:skills && bun run check:pack && bash scripts/check-rename.sh && (cd apps/docs && bun run gen:data && bun run codemod && bun run check) && bun run evals --dry && SKIP_NETWORK_TESTS=1 bun run test`
Expected: all exit 0.

- [ ] **Step 5: Commit**

```bash
git add skills/design-empathize/SKILL.md apps/docs/content/docs/overview/workflows.mdx apps/docs/lib README.md AGENTS.md adapters
git commit -m "feat(design): empathize asks about users first; docs explain the member handoff"
```

---

### Task 5: Acceptance run and record

**Files:**
- Create: `docs/superpowers/plans/2026-10-30-conductor-handoff-acceptance.md`

**Interfaces:**
- Consumes: everything above; `scripts/run-evals.sh` as it is.
- Produces: the acceptance record.

- [ ] **Step 1: Run the acceptance eval twice** (one `bun run evals workflow` call runs the case twice per arm; `--ablation` stays at the runner's default):

Run: `EVALS_ALLOW_BASH=0 bun run evals workflow`
Expected: the table row `workflow` shows `fired 2/2`; open `evals-results/singularskills.json` and record, for each `with` run, which of `fired`, `log`, `no-phase-2`, `asks`, `stops` passed (`jq '.cases[0].arms.with[] | [.graders[] | {name, passed}]' evals-results/singularskills.json`).

- [ ] **Step 2: Tuning loop, bounded by spec §10.3.** If `fired` or `log` failed in any run, or `asks` and `stops` both failed in both runs: read the trace (`.tracePath` in the JSON; re-run with the runner's `--keep-temp` is not available, so read the HTML report's transcript in `evals-results/report.html`), adjust only `skills/workflow/SKILL.md`'s Process text or `skills/design-empathize/SKILL.md`'s Process (never descriptions, prompt, graders or generated blocks; re-run `fix-skill-text --check` and `lint:skills` after each edit), commit, and run Step 1 again. Stop after the third paid run whatever the result.

- [ ] **Step 3: Manual checks** in a temp project (`mkdir -p /tmp/handoff-check && cd /tmp/handoff-check`), with the pack loaded from this worktree (`claude --plugin-dir <worktree>` or an installed copy): (a) `/design-empathize date-picker` runs the member and does not invoke `workflow` (it asks its first question); (b) "start the design thinking process for date-picker" reaches the conductor (a `run-started` line appears in `.singularskills/log.jsonl` and the reply ends on a question before any artifact exists). Record both transcripts' first tool calls.

- [ ] **Step 4: Write the acceptance record**: one row per spec §10 item with the command run, the verbatim output that proves it, and for item 3 the per-run grader table and how many paid runs were used; the upstream issue link (the owner files it; write "pending" with the issue body path if not yet filed); the exact `grep -L` count from Task 1 Step 6.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-10-30-conductor-handoff-acceptance.md skills
git commit -m "docs: conductor handoff acceptance record"
```
