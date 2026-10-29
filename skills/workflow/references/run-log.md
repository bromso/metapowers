# The run log and the artifact format

What the skills write under `.singularskills/` in a project, for the conductor (`workflow`), `singular-status`, `singular-report` and any person reading the folder. `.singularskills/` is meant to be committed with the project.

## The run log

`.singularskills/log.jsonl` is append-only: one JSON object per line, never edited or deleted. Every line has the same eight keys:

```json
{"ts":"2026-10-26T09:12:00Z","skill":"design-empathize","workflow":"design","phase":1,"project":"date-picker","event":"started","artifact":"01-empathize.md","note":""}
```

| Key | Value |
| --- | --- |
| `ts` | ISO 8601 timestamp of the event. |
| `skill` | The skill that wrote the line; `workflow` for the conductor's own lines. |
| `workflow` | On the conductor's lines, the workflow name (the `name` in `workflows/<name>.yml`). On a member skill's lines, the skill's artifact folder (its domain, which is also its domain workflow's name), even when a cross-domain run invoked it. |
| `phase` | The phase number from the workflow file, as a JSON number; `null` on run-level events. |
| `project` | The project name, as used in the artifact path. |
| `event` | One of the events below. |
| `artifact` | The artifact file or folder the event concerns (e.g. `01-empathize.md`, `01-assess/`); `null` when there is none. |
| `note` | Free text: a reason, the user's words, or `""`. |

### Events

| Event | Written by | When |
| --- | --- | --- |
| `started` | the member skill itself (the first paragraph of its Prerequisites) | It begins work on its artifact, once its gate has passed or been bypassed. |
| `finished` | the member skill itself (its Output section) | It has written its artifact or its section. |
| `refused` | the member skill itself (the gate step in its Prerequisites) | Its gate refused and the user did not bypass it; written instead of `started`/`finished`, then the skill stops. `note` holds what the gate printed. |
| `skipped` | the member skill itself (its Arguments paragraph) | The user bypassed its gate with `--skip-checks`; written before the artifact. `note` holds the reason or `none given`. |
| `run-started` | `workflow` | The conductor starts running phases; `phase` is `null`, `note` names the first unapproved phase. |
| `phase-approved` | `workflow` | The user approved a phase at the boundary; `phase` and `artifact` name it. |
| `run-finished` | `workflow` | The run ended; `phase` is `null`, `note` is `complete`, `stopped before approving phase <n>` or `refused at phase <n>: <what the gate printed>`. |

The conductor never writes `started`, `finished`, `refused` or `skipped`; the member skills do, whether the conductor invoked them or the user did. A member's lines carry its artifact folder as `workflow`, so in a cross-domain run the conductor reports the `refused` and `skipped` lines whose `project` matches and whose `workflow` is either the run's name or any member's folder.

### Phase state

For one `{workflow, project, phase}`:

- **approved** — the log holds a `phase-approved` line for it. Only this makes a phase complete.
- **written** — no `phase-approved` line exists, but every member of the phase has written. "Written" is decided per member, not by the file existing, because a cross-domain run can point at a file another run wrote:
  - a single-writer artifact is written by the member when it exists and its frontmatter `skill` is that member;
  - a shared artifact is written by a member when it has that member's own `## <Skill title>` section, opening with the member's italic line;
  - a folder artifact is written by a member when it holds a file whose frontmatter `skill` is that member.
- **written-unlogged** — written before the run log existed: the artifact exists but has no frontmatter (a folder artifact: holds files, none with frontmatter), or a shared artifact has a member's section without its italic opener. It counts as written by that member; the conductor does not re-run the member, reports the phase as written-unlogged and offers it for approval.
- **partly written** — some members have written, not all.
- **missing** — none has.

A phase with no `artifact` in its workflow file (approval-only, such as a cross-domain report phase) is either approved or missing; nothing later requires it. `singular-status` may collapse written, written-unlogged and partly written into "written".

Gates (`scripts/gate.sh` in a member skill) check only that the `requires` artifacts exist; approval is the conductor's concern.

## Artifacts

Artifacts are Markdown files at `.singularskills/<folder>/<project>/NN-<phase>.md`, where `<folder>` is the phase's own `folder` in a cross-domain workflow, else the workflow's `folder`.

### Frontmatter

```yaml
---
skill: design-empathize
workflow: design
phase: 1
project: date-picker
started: 2026-10-26T09:12:00Z
finished: 2026-10-26T09:20:31Z
agent: claude-code          # the agent the skill ran in, when the skill can tell; else "unknown"
gate: passed | skipped | none
---
```

### Closing sections (single writer)

An artifact written by one skill ends with:

```markdown
## Decisions
- <what was chosen> — <why> — <what was rejected>

## Open questions
- <what the next phase or a reviewer must settle>
```

### Shared artifacts (several member skills)

When several skills share a phase's artifact:

- The frontmatter appears once, written by whichever member creates the file: `skill` is the phase's title, `started` the first write, `finished` updated by each member, and `gate` the worst value among the sections (`skipped` over `passed`). In a phase with no gate, the frontmatter and every italic line say `gate: none`.
- Each member writes only its own `## <Skill title>` section, replacing that section on a re-run and leaving the others alone.
- Each section opens with one italic line and closes with its own decisions and open questions:

```markdown
## Empathize

*design-empathize · 2026-10-26T09:20Z · gate: passed*

…

### Decisions
- <what was chosen> — <why> — <what was rejected>

### Open questions
- <what the next phase or a reviewer must settle>
```
