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
| `workflow` | The workflow name (the `name` in `workflows/<name>.yml`). |
| `phase` | The phase number from the workflow file, as a JSON number; `null` on run-level events. |
| `project` | The project name, as used in the artifact path. |
| `event` | One of the events below. |
| `artifact` | The artifact file or folder the event concerns (e.g. `01-empathize.md`, `01-assess/`); `null` when there is none. |
| `note` | Free text: a reason, the user's words, or `""`. |

### Events

| Event | Written by | When |
| --- | --- | --- |
| `started` | a phase skill | It begins work on its artifact. |
| `finished` | a phase skill | It has written its artifact or its section. |
| `refused` | a phase skill | Its gate refused: a required artifact is missing. `note` names what is missing. |
| `skipped` | a phase skill | The user bypassed its gate with `--skip-checks`; written before the artifact. `note` holds the reason or `none given`. |
| `run-started` | `workflow` | The conductor starts running phases; `phase` is `null`, `note` names the first unapproved phase. |
| `phase-approved` | `workflow` | The user approved a phase at the boundary; `phase` and `artifact` name it. |
| `run-finished` | `workflow` | The run ended; `phase` is `null`, `note` is `complete` or `stopped before approving phase <n>`. |

### Phase state

For one `{workflow, project, phase}`:

- **approved** — the log holds a `phase-approved` line for it. Only this makes a phase complete.
- **written** — its artifact exists and is non-empty (a folder artifact: has at least one file), but no `phase-approved` line exists.
- **missing** — neither.

A phase with no `artifact` in its workflow file (approval-only, such as a cross-domain report phase) is either approved or missing; nothing later requires it.

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

- The frontmatter appears once, written by whichever member creates the file: `skill` is the phase's title, `started` the first write, `finished` updated by each member, and `gate` the worst value among the sections (`skipped` over `passed` over `none`).
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
