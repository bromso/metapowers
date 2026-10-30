# Conductor handoff: acceptance record

Plan: `2026-10-30-conductor-handoff.md`. Spec: `docs/superpowers/specs/2026-10-30-conductor-handoff-design.md` §10. Branch `conductor-handoff`, verified 2026-10-30 on macOS with Claude Code 2.1.283.

## 1. Every member carries the handoff; no utility does

Command (from `packages/pack-tools`, after `bun run build`):

```
node dist/cli.js fix-skill-text ../../skills --check; echo "check exit: $?"
grep -L 'Part of a workflow' ../../skills/*/SKILL.md | wc -l
grep -l "Part of a workflow" ../../skills/workflow/SKILL.md ../../skills/singular-*/SKILL.md
```

Output:

```
check exit: 0
65
(no output from the third command)
```

218 of 283 skills open `## Prerequisites` with the paragraph; the 65 without it are the conductor, the four `singular-*` utilities and the 60 skills that belong to no workflow phase. The first regeneration listed 218 changed files; the second `--check` was clean.

## 2. The validator's `workflow-handoff` rule

Command: `bun run lint:skills`

Output: exit 0, `PASS` for all 480 files (283 skills and their reference copies). The rule's own tests (`packages/skill-validator/src/plugin-rules.test.ts`, describe `workflow-handoff`, 7 cases) pass, and the cross-package equality test in `packages/pack-tools/src/skill-text.test.ts` compares the two generators for all 218 members.

## 3. The `workflow` eval case

Paid run 1, the documented command, default (haiku) judge:

```
EVALS_ALLOW_BASH=0 bun run evals workflow
```

| run | fired | log | no-phase-2 | asks | stops |
| --- | --- | --- | --- | --- | --- |
| with 1 | pass | pass | pass | fail (haiku 0/3) | fail (haiku 0/3) |
| with 2 | pass | pass | pass | fail (haiku 0/3) | fail (haiku 0/3) |

Table row: `workflow  with 0.5  without 0.38  delta 0.13  fired 2/2`, cost $1.48. Both with-arm replies logged `run-started`, wrote nothing, and ended on "Who will use this date picker, and what are they picking dates for?" (the behaviour `asks` and `stops` describe). The haiku judge is shown the whole trace (about 63 KB, opening with a record that lists 327 slash commands) and failed every with-arm verdict unanimously, while passing `asks` on the 2-turn no-plugin run.

Paid run 2, same case and behaviour, Sonnet judge (`claude plugin eval <staged root> --trust-plugin --scaffold --allow-tools Write Edit --no-publish --ablation none --runs 2 --case workflow --judge-model sonnet`):

| run | fired | log | no-phase-2 | asks | stops |
| --- | --- | --- | --- | --- | --- |
| with 1 | pass | pass | pass | pass (3/3) | pass (3/3) |
| with 2 | pass | pass | pass | fail (2/3 FAIL) | pass (3/3) |

Cost $1.45 plus $0.91 of judging. Spec §10.3 is met: `fired`, `log` and `no-phase-2` passed in both runs; `asks` and `stops` passed in at least one. No skill text was tuned; two of the three budgeted paid runs were used. `scripts/run-evals.sh` now accepts `EVALS_JUDGE_MODEL=sonnet` so the documented command can reproduce run 2.

## 4. Manual checks

In an empty temp directory, with the pack loaded by `claude -p … --plugin-dir <this worktree> --allowedTools Read,Write,Edit,Glob,Grep,Skill --max-turns 12`:

- (a) `/design-empathize date-picker`: first tool calls `Bash` (appends the `started` line), `Glob .singularskills/**`, no `Skill` call; `.singularskills/log.jsonl` holds one `started` line for `design-empathize`; no artifact written; the reply ends on "Who will use this date picker, and what are they picking a date for?". The member ran on its own and did not hand off.
- (b) "start the design thinking process for date-picker": first tool call `Skill {"skill":"singularskills:workflow","args":"design thinking process for date-picker"}`; `.singularskills/log.jsonl` holds `run-started` (`"workflow":"design"`), then `started` and `finished` for `design-empathize`; the reply ends on the phase-1 approval question. The conductor was reached and recorded the run. It did write `01-empathize.md` without a user answer: the trace shows it globbed `~/.claude` and read `design-empathize` from the installed marketplace clone (`~/.claude/plugins/marketplaces/singularskills`, the text before this branch) instead of the worktree's. Spec §10.4 asks that the reply end on a question before any artifact exists; with the branch merged and the marketplace copy refreshed, the text it reads is the new one, and the eval runs above (which load only this branch) show the question-first behaviour.

## Upstream issue

The eval sandbox's denial of plugin-file reads (spec §6) was not filed by the controller: the GitHub write was blocked by the session's permission policy. The issue body is ready at the scratchpad path given to the owner in chat (`issue-body.md`); link: pending.
